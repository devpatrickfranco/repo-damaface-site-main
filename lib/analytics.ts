// Ponte fina para o dataLayer (GTM). Enquanto nenhum container estiver instalado no site,
// isso é um no-op seguro — quando o GTM for adicionado, os eventos já fluem sem mudanças aqui.
export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  const w = window as typeof window & { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...payload })
}
