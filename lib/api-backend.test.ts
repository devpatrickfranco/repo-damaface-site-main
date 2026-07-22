import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import { apiBackend } from './api-backend';

const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BACKEND_URL = 'https://api.example.test';
});

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_BACKEND_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BACKEND_URL = originalBaseUrl;
  }
});

test('não cancela automaticamente requisições sem signal explícito', async () => {
  let receivedSignal: AbortSignal | null | undefined;

  globalThis.fetch = async (_input, init) => {
    receivedSignal = init?.signal;
    return Response.json({ id: 123 }, { status: 201 });
  };

  const result = await apiBackend.post<{ id: number }>('/chamados/chamados/', {
    titulo: 'Teste',
  });

  assert.deepEqual(result, { id: 123 });
  assert.equal(receivedSignal, undefined);
});

test('aceita resposta HTTP bem-sucedida sem corpo', async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });

  const result = await apiBackend.post('/chamados/chamados/1/fechar/');

  assert.deepEqual(result, {});
});
