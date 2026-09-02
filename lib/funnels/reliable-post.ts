// lib/funnels/reliable-post.ts
// Envio otimista com retry simples (PDI-front-end-funil.md Fase 1, item 4):
// dispara a chamada sem bloquear a navegação local e tenta de novo em caso de
// falha de rede, com backoff linear. Não usa fila persistente — a resposta já
// foi aplicada localmente no estado do runtime, então perder uma tentativa após
// esgotar os retries não trava o usuário, só o analytics fica incompleto.

export function fireAndRetry(fn: () => Promise<unknown>, attempts = 3, delayMs = 500): void {
  let attempt = 0

  const run = () => {
    attempt += 1
    fn().catch(() => {
      if (attempt < attempts) {
        setTimeout(run, delayMs * attempt)
      }
    })
  }

  run()
}
