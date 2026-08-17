// Geolocalização do usuário para a página nacional de procedimento (LocationFinder).
//
// Fluxo: Geolocation API do navegador -> lat/lng -> geocodificação reversa -> cidade/UF
// -> priorização de unidades. Nada disso é persistido; a lat/lng nunca é enviada ao backend,
// só usada no cliente para decidir a ordem de exibição das unidades.

export type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "error"

export interface ResolvedLocation {
  city: string
  state: string
  stateCode: string
  latitude: number
  longitude: number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

/** Distância em linha reta entre duas coordenadas, em metros (fórmula de Haversine). */
export const calculateHaversineDistance = (source: Coordinates, destination: Coordinates): number => {
  const R = 6371e3 // Raio da Terra em metros
  const toRadians = (deg: number) => (deg * Math.PI) / 180

  const phi1 = toRadians(source.latitude)
  const phi2 = toRadians(destination.latitude)
  const deltaPhi = toRadians(destination.latitude - source.latitude)
  const deltaLambda = toRadians(destination.longitude - source.longitude)

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distância em metros
}

/** Normaliza nomes de cidade/estado para comparação: remove acentos, caixa e espaços extras. */
export function normalizeLocationName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

const UF_POR_ESTADO: Record<string, string> = {
  acre: "AC",
  alagoas: "AL",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceara: "CE",
  "distrito federal": "DF",
  "espirito santo": "ES",
  goias: "GO",
  maranhao: "MA",
  "mato grosso": "MT",
  "mato grosso do sul": "MS",
  "minas gerais": "MG",
  para: "PA",
  paraiba: "PB",
  parana: "PR",
  pernambuco: "PE",
  piaui: "PI",
  "rio de janeiro": "RJ",
  "rio grande do norte": "RN",
  "rio grande do sul": "RS",
  rondonia: "RO",
  roraima: "RR",
  "santa catarina": "SC",
  "sao paulo": "SP",
  sergipe: "SE",
  tocantins: "TO",
}

function ufFromStateName(state: string): string {
  if (state.length === 2) return state.toUpperCase()
  return UF_POR_ESTADO[normalizeLocationName(state)] ?? ""
}

/**
 * Geocodificação reversa abstraída atrás desta função: hoje usa a API pública do
 * Nominatim/OpenStreetMap (gratuita, sem chave, cobertura razoável no Brasil). Trocar de
 * provedor no futuro (custo, limites, precisão) significa reimplementar só esta função.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<ResolvedLocation | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    zoom: "10",
    addressdetails: "1",
    "accept-language": "pt-BR",
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { Accept: "application/json" },
  })
  if (!response.ok) return null

  const data = await response.json()
  const address = data?.address
  if (!address) return null

  const city: string | undefined = address.city || address.town || address.village || address.municipality || address.county
  const state: string | undefined = address.state
  if (!city || !state) return null

  return { city, state, stateCode: ufFromStateName(state), latitude, longitude }
}

export function getGeolocationErrorState(error: GeolocationPositionError): LocationState {
  if (error.code === error.PERMISSION_DENIED) return "denied"
  return "error"
}
