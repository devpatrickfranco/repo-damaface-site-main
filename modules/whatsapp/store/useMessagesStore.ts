import { create } from 'zustand';
import { whatsappApi } from '../api/whatsapp-api';
import { WhatsAppMessage, Conversation, MessagesQueryParams } from '../types';
import { mapError } from '../utils/error-mapper';

const POLLING_INTERVAL_MS = 5000;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extracts the contact phone number from a message (works for both IN and OUT)
 */
function getContactPhone(msg: WhatsAppMessage): string {
  if (msg.direction === 'IN') return msg.contact || msg.from || 'desconhecido';
  return msg.contact || msg.to || 'desconhecido';
}

/**
 * Formats a phone number for display (e.g. 5511999999999 → +55 11 99999-9999)
 */
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 13) {
    // +55 + DD (2) + 9XXXX (5) + XXXX (4)
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return phone;
}

/**
 * Rebuild conversations map from a flat messages array
 */
function buildConversations(messages: WhatsAppMessage[]): Record<string, Conversation> {
  const map: Record<string, Conversation> = {};

  // Sort oldest first so lastMessage is correct
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const msg of sorted) {
    const phone = getContactPhone(msg);

    if (!map[phone]) {
      map[phone] = {
        contact: phone,
        displayName: formatPhone(phone),
        lastMessage: null,
        messages: [],
        unreadCount: 0,
        updatedAt: msg.created_at,
      };
    }

    // Avoid duplicate messages
    const exists = map[phone].messages.some(m => m.id === msg.id);
    if (!exists) {
      map[phone].messages.push(msg);
      map[phone].lastMessage = msg;
      map[phone].updatedAt = msg.created_at;
      if (msg.direction === 'IN') {
        map[phone].unreadCount += 1;
      }
    }
  }

  return map;
}

// ─── Store ──────────────────────────────────────────────────────────────────

interface MessagesState {
  messages: WhatsAppMessage[];
  conversations: Record<string, Conversation>;
  activeContact: string | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  pollingRef: ReturnType<typeof setInterval> | null;
  newPhone: string; // Number typed in "new chat" input
}

interface MessagesActions {
  fetchMessages: (params?: MessagesQueryParams) => Promise<void>;
  pollNewMessages: () => Promise<void>;
  sendMessage: (to: string, content: string) => Promise<void>;
  setActiveContact: (phone: string) => void;
  clearActiveContact: () => void;
  markContactRead: (phone: string) => void;
  startPolling: () => void;
  stopPolling: () => void;
  setNewPhone: (phone: string) => void;
  clearError: () => void;
}

type MessagesStore = MessagesState & MessagesActions;

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────
  messages: [],
  conversations: {},
  activeContact: null,
  loading: false,
  sending: false,
  error: null,
  lastFetchedAt: null,
  pollingRef: null,
  newPhone: '',

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Full initial load of all messages
   */
  fetchMessages: async (params?: MessagesQueryParams) => {
    set({ loading: true, error: null });
    try {
      const messages = await whatsappApi.getMessages(params);
      const conversations = buildConversations(messages);
      set({
        messages,
        conversations,
        loading: false,
        lastFetchedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const mapped = mapError(err);
      set({ loading: false, error: mapped.message });
    }
  },

  /**
   * Poll only new INBOUND messages since the last fetch
   */
  pollNewMessages: async () => {
    const { lastFetchedAt, messages, conversations } = get();
    try {
      const newMsgs = await whatsappApi.getMessages({
        since: lastFetchedAt ?? undefined,
        direction: 'IN',
      });

      if (newMsgs.length === 0) return;

      // Merge without duplicates
      const existingIds = new Set(messages.map(m => m.id));
      const fresh = newMsgs.filter(m => !existingIds.has(m.id));
      if (fresh.length === 0) return;

      const merged = [...messages, ...fresh];
      const updatedConversations = buildConversations(merged);

      set({
        messages: merged,
        conversations: updatedConversations,
        lastFetchedAt: new Date().toISOString(),
      });
    } catch {
      // Silent poll failure — don't show UI error for background polling
    }
  },

  /**
   * Send a text message
   */
  sendMessage: async (to: string, content: string) => {
    if (!to.trim() || !content.trim()) return;

    set({ sending: true, error: null });
    try {
      await whatsappApi.sendMessage({ to: to.replace(/\D/g, ''), type: 'text', content });

      // Optimistically add an outbound message to the conversation
      const optimistic: WhatsAppMessage = {
        id: `optimistic-${Date.now()}`,
        to: to.replace(/\D/g, ''),
        contact: to.replace(/\D/g, ''),
        content,
        type: 'text',
        direction: 'OUT',
        status: 'sent',
        created_at: new Date().toISOString(),
      };

      const { messages } = get();
      const merged = [...messages, optimistic];
      const convs = buildConversations(merged);

      set({
        messages: merged,
        conversations: convs,
        activeContact: to.replace(/\D/g, ''),
        sending: false,
        newPhone: '',
      });
    } catch (err: any) {
      const mapped = mapError(err);
      set({ sending: false, error: mapped.message });
    }
  },

  setActiveContact: (phone: string) => {
    set({ activeContact: phone });
    get().markContactRead(phone);
  },

  clearActiveContact: () => set({ activeContact: null }),

  markContactRead: (phone: string) => {
    const { conversations } = get();
    if (!conversations[phone]) return;
    const updated = {
      ...conversations,
      [phone]: { ...conversations[phone], unreadCount: 0 },
    };
    set({ conversations: updated });
  },

  setNewPhone: (phone: string) => set({ newPhone: phone }),

  clearError: () => set({ error: null }),

  /**
   * Start polling every POLLING_INTERVAL_MS milliseconds
   */
  startPolling: () => {
    const { pollingRef } = get();
    if (pollingRef) return; // already running

    const ref = setInterval(() => {
      get().pollNewMessages();
    }, POLLING_INTERVAL_MS);

    set({ pollingRef: ref });
  },

  /**
   * Stop active polling
   */
  stopPolling: () => {
    const { pollingRef } = get();
    if (pollingRef) {
      clearInterval(pollingRef);
      set({ pollingRef: null });
    }
  },
}));
