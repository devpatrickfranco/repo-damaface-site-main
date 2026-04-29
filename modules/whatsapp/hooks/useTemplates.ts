'use client';

import useSWR, { mutate } from 'swr';
import { useCallback, useState } from 'react';
import { templatesApi } from '../api/templates-api';
import type {
  WhatsAppTemplate,
  CreateTemplatePayload,
  TemplatesQueryParams,
} from '../types/templates';

// ─────────────────────────────────────────────
// useTemplates – list with filters
// ─────────────────────────────────────────────

export function useTemplates(params?: TemplatesQueryParams) {
  const key = ['whatsapp-templates', JSON.stringify(params)];

  const { data, error, isLoading, mutate: revalidate } = useSWR<WhatsAppTemplate[]>(
    key,
    () => templatesApi.getTemplates(params),
    { revalidateOnFocus: false }
  );

  return {
    templates: data ?? [],
    isLoading,
    error,
    revalidate,
  };
}

// ─────────────────────────────────────────────
// useTemplate – single template
// ─────────────────────────────────────────────

export function useTemplate(id: string | null) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<WhatsAppTemplate>(
    id ? ['whatsapp-template', id] : null,
    () => templatesApi.getTemplate(id!),
    { revalidateOnFocus: false }
  );

  return { template: data, isLoading, error, revalidate };
}

// ─────────────────────────────────────────────
// useTemplateHistory – version history
// ─────────────────────────────────────────────

export function useTemplateHistory(id: string | null) {
  const { data, error, isLoading } = useSWR<WhatsAppTemplate[]>(
    id ? ['whatsapp-template-history', id] : null,
    () => templatesApi.getTemplateHistory(id!),
    { revalidateOnFocus: false }
  );

  return { history: data ?? [], isLoading, error };
}

// ─────────────────────────────────────────────
// useCreateTemplate
// ─────────────────────────────────────────────

export function useCreateTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTemplate = useCallback(async (payload: CreateTemplatePayload): Promise<WhatsAppTemplate> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templatesApi.createTemplate(payload);
      // Invalidate list cache
      await mutate((key: any) => Array.isArray(key) && key[0] === 'whatsapp-templates', undefined, { revalidate: true });
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createTemplate, isLoading, error };
}

// ─────────────────────────────────────────────
// useUpdateTemplate (versioning)
// ─────────────────────────────────────────────

export function useUpdateTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTemplate = useCallback(async (id: string, payload: CreateTemplatePayload): Promise<WhatsAppTemplate> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templatesApi.createVersion(id, payload);
      await mutate((key: any) => Array.isArray(key) && key[0] === 'whatsapp-templates', undefined, { revalidate: true });
      await mutate(['whatsapp-template', id]);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateTemplate, isLoading, error };
}

// ─────────────────────────────────────────────
// useDeleteTemplate
// ─────────────────────────────────────────────

export function useDeleteTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await templatesApi.deleteTemplate(id);
      await mutate((key: any) => Array.isArray(key) && key[0] === 'whatsapp-templates', undefined, { revalidate: true });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteTemplate, isLoading, error };
}

// ─────────────────────────────────────────────
// useSyncTemplates
// ─────────────────────────────────────────────

export function useSyncTemplates() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const syncTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templatesApi.syncTemplates();
      await mutate((key: any) => Array.isArray(key) && key[0] === 'whatsapp-templates', undefined, { revalidate: true });
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { syncTemplates, isLoading, error };
}
