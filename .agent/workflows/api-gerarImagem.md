---
description: documentação completa(back-end) do modulo gerar-imagem
---

# 📚 API de Chat com IA - Documentação Frontend

## 🎯 Visão Geral

Esta API permite conversação com um assistente de IA especializado em geração e manipulação de imagens. Possui suporte a **memória de conversação** usando Redis com TTL de 60 minutos e **streaming em tempo real** via Server-Sent Events (SSE).

**Base URL:** `https://api.damaface.com.br/marketing/gerar-imagem/`

---

## 🔌 Endpoints Disponíveis

### 1. Chat (Resposta Única)
### 2. Chat Streaming (SSE)

---

## 1️⃣ POST `/ai/chat/` - Chat com Resposta Única

Envia uma mensagem e recebe a resposta completa de uma vez.

### **Request**

```http
POST /marketing/gerar-imagem/ai/chat/
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Gere uma imagem de um gato laranja",
  "session_key": "chat_1706349600000_abc123"  // OPCIONAL
}
```

### **Response (200 OK)**

```json
{
  "message": "Claro! Vou gerar uma imagem de um gato laranja para você...",
  "tool_calls": null,
  "metadata": null
}
```

### **Campos da Requisição**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `message` | string | ✅ Sim | Mensagem do usuário |
| `session_key` | string | ❌ Não | Chave de sessão para memória (60min TTL) |
| `context` | object | ❌ Não | Contexto adicional (raramente usado) |

### **Campos da Resposta**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `message` | string | Resposta do assistente de IA |
| `tool_calls` | array/null | Ferramentas utilizadas pelo agente |
| `metadata` | object/null | Metadados adicionais da resposta |

### **Erros Possíveis**

| Status | Descrição |
|--------|-----------|
| `400` | Dados inválidos (message ausente) |
| `500` | Erro interno do servidor |

---

## 2️⃣ POST `/ai/chat/stream/` - Chat com Streaming (SSE)

Envia uma mensagem e recebe a resposta em tempo real, palavra por palavra.

### **Request**

```http
POST /marketing/gerar-imagem/ai/chat/stream/
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Escreva um poema sobre IA",
  "session_key": "chat_1706349600000_abc123"
}
```

### **Response (200 OK)**

**Content-Type:** `text/event-stream`

```
event: start
data: {"status":"started"}

event: message
data: {"chunk":"A"}

event: message
data: {"chunk":" inteligência"}

event: message
data: {"chunk":" artificial..."}

event: end
data: {"status":"completed"}
```

### **Tipos de Eventos SSE**

| Evento | Data | Descrição |
|--------|------|-----------|
| `start` | `{"status":"started"}` | Início do streaming |
| `message` | `{"chunk":"texto"}` | Chunk da resposta |
| `end` | `{"status":"completed"}` | Fim do streaming |
| `error` | `{"error":"mensagem"}` | Erro durante processamento |

---

## 💾 Memória de Conversação (Redis)

### **Como Funciona**

- Ao enviar `session_key`, o histórico é armazenado automaticamente no Redis
- **TTL:** 60 minutos (renovado a cada mensagem)
- **Expiração:** Automática após 60min de inatividade
- **SEM necessidade** de enviar histórico manualmente

### **Fluxo Recomendado**

1. **Gerar session_key única** no início da conversa
2. **Enviar a mesma session_key** em todas as mensagens
3. Backend gerencia o histórico automaticamente
4. Após 60min de inatividade, histórico expira

### **Formato da session_key**

```javascript
// Geração sugerida
const sessionKey = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Exemplo: "chat_1706349600000_x7k2m9p4q"
```

---

## 📝 Exemplos de Código

### **JavaScript Vanilla (Fetch API)**

#### Chat Simples

```javascript
async function sendChatMessage(message, sessionKey) {
  const response = await fetch('https://api.damaface.com.br/marketing/gerar-imagem/ai/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'  // Se necessário
    },
    body: JSON.stringify({
      message: message,
      session_key: sessionKey
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.message;
}

// Uso
const sessionKey = `chat_${Date.now()}`;
const reply = await sendChatMessage("Olá!", sessionKey);
console.log(reply);
```

#### Chat com Streaming

```javascript
async function sendChatMessageStream(message, sessionKey, onChunk) {
  const response = await fetch('https://api.damaface.com.br/marketing/gerar-imagem/ai/chat/stream/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
      message: message,
      session_key: sessionKey
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));
        
        if (data.chunk) {
          onChunk(data.chunk);  // Callback com cada pedaço
        }
      }
    }
  }
}

// Uso
const sessionKey = `chat_${Date.now()}`;
await sendChatMessageStream("Escreva um poema", sessionKey, (chunk) => {
  console.log(chunk);  // Imprime cada palavra em tempo real
});
```

---

### **React Hooks**

```jsx
import { useState } from 'react';

function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionKey] = useState(`chat_${Date.now()}`);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    setLoading(true);
    
    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/marketing/gerar-imagem/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_key: sessionKey
        })
      });

      const data = await response.json();

      // Adiciona resposta do assistente
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}

// Uso no componente
function ChatComponent() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
```

---

### **React com Streaming**

```jsx
import { useState, useRef } from 'react';

function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [sessionKey] = useState(`chat_${Date.now()}`);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessageStream = async (userMessage) => {
    setIsStreaming(true);
    
    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Prepara para receber resposta em stream
    let assistantMessage = '';
    const messageIndex = messages.length + 1;

    try {
      const response = await fetch('/marketing/gerar-imagem/ai/chat/stream/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_key: sessionKey
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Adiciona mensagem vazia do assistente
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));
            
            if (data.chunk) {
              assistantMessage += data.chunk;
              
              // Atualiza mensagem gradualmente
              setMessages(prev => {
                const updated = [...prev];
                updated[messageIndex] = { 
                  role: 'assistant', 
                  content: assistantMessage 
                };
                return updated;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro no streaming:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, sendMessageStream, isStreaming };
}
```

---

### **Axios**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.damaface.com.br/marketing/gerar-imagem',
  headers: {
    'Content-Type': 'application/json'
  }
});

async function sendChat(message, sessionKey) {
  try {
    const response = await api.post('/ai/chat/', {
      message,
      session_key: sessionKey
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Erro:', error.response?.data);
    throw error;
  }
}

// Uso
const sessionKey = `chat_${Date.now()}`;
const reply = await sendChat("Olá!", sessionKey);
```

---

## 🔒 Autenticação

> **Nota:** Se a API requer autenticação, adicione o header:

```javascript
headers: {
  'Authorization': 'Bearer SEU_TOKEN_AQUI',
  'Content-Type': 'application/json'
}
```

---

## ⚡ Boas Práticas

### ✅ **DO's**

1. **Gere session_key única** por conversa
2. **Reutilize a mesma session_key** durante toda a conversa
3. **Trate erros** adequadamente (try/catch)
4. **Mostre loading** durante requisições
5. **Use streaming** para melhor UX em respostas longas

### ❌ **DON'Ts**

1. ❌ Não envie `conversation_history` manualmente (use `session_key`)
2. ❌ Não gere nova `session_key` a cada mensagem
3. ❌ Não assuma que `tool_calls` sempre retorna algo
4. ❌ Não bloqueie a UI durante streaming

---

## 🐛 Tratamento de Erros

```javascript
async function sendMessageWithErrorHandling(message, sessionKey) {
  try {
    const response = await fetch('/marketing/gerar-imagem/ai/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_key: sessionKey })
    });

    // Erro HTTP
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Erro desconhecido');
    }

    const data = await response.json();
    return data.message;

  } catch (error) {
    if (error.name === 'TypeError') {
      // Erro de rede
      console.error('Erro de conexão:', error);
      alert('Erro de conexão. Verifique sua internet.');
    } else {
      // Erro da API
      console.error('Erro da API:', error.message);
      alert(`Erro: ${error.message}`);
    }
    
    throw error;
  }
}
```

---

## 📊 Tipos TypeScript

```typescript
// Request
interface ChatRequest {
  message: string;
  session_key?: string;
  context?: Record<string, any>;
}

// Response
interface ChatResponse {
  message: string;
  tool_calls: any[] | null;
  metadata: Record<string, any> | null;
}

// Streaming Event
interface StreamEvent {
  chunk?: string;
  status?: 'started' | 'completed';
  error?: string;
}