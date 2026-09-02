// lib/funnels/attribution.ts
// Captura de atribuição (source_page, UTM, referrer) no momento em que o funil
// é disparado — back-end-funil.md §8 pede persistência de first_touch/last_touch
// entre a chegada via Meta Ad e o clique no CTA, já que a UTM pode não estar
// mais na URL quando o usuário finalmente abre o funil.

import type { FunnelAttribution } from '@/types/funnels'

const STORAGE_KEY = 'df_funnel_attribution_first_touch'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>

function readUtmFromLocation(): UtmParams {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm: UtmParams = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) utm[key] = value
  }
  return utm
}

/** Chamar o quanto antes na página de conteúdo (ex: mount de `/vinhedo/botox`) para fixar o first_touch. */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return
  const utm = readUtmFromLocation()
  if (Object.keys(utm).length === 0) return
  if (window.sessionStorage.getItem(STORAGE_KEY)) return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm))
}

function readFirstTouch(): UtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

/** Monta a atribuição no momento em que o funil abre — last_touch (URL atual) tem prioridade, com fallback pro first_touch salvo. */
export function buildFunnelAttribution(): FunnelAttribution {
  if (typeof window === 'undefined') {
    return { source_page: '', source_url: '', referrer: null }
  }

  const lastTouch = readUtmFromLocation()
  const firstTouch = readFirstTouch()

  return {
    source_page: window.location.pathname,
    source_url: window.location.href,
    referrer: document.referrer || null,
    utm_source: lastTouch.utm_source ?? firstTouch.utm_source ?? null,
    utm_medium: lastTouch.utm_medium ?? firstTouch.utm_medium ?? null,
    utm_campaign: lastTouch.utm_campaign ?? firstTouch.utm_campaign ?? null,
    utm_content: lastTouch.utm_content ?? firstTouch.utm_content ?? null,
    utm_term: lastTouch.utm_term ?? firstTouch.utm_term ?? null,
  }
}
