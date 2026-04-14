'use client'

import { useEffect, useState, useCallback } from 'react'
import { useFacebookSDK } from './FacebookSDKProvider'
import { apiBackend } from '@/lib/api-backend'
import {
  MessageSquare,
  Wifi,
  WifiOff,
  Loader2,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

// --- Tipos ---
interface WabaConnection {
  id: number
  waba_id: string
  phone_number: string
  display_name: string
  status: string
}

interface WalletBalance {
  balance: number
  currency: string
}

// --- Sub-componente: Loading Spinner Centralizado ---
function CenteredSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-green-500" />
        </div>
      </div>
      {message && <p className="text-sm text-gray-500 font-medium animate-pulse">{message}</p>}
    </div>
  )
}

// --- Sub-componente: Empty State (Onboarding) ---
function OnboardingState({
  onConnect,
  isConnecting,
  isSdkLoaded,
  error,
}: {
  onConnect: () => void
  isConnecting: boolean
  isSdkLoaded: boolean
  error: string | null
}) {
  const features = [
    { icon: MessageSquare, label: 'Conversas em tempo real', desc: 'Gerencie atendimentos diretamente pelo painel' },
    { icon: Zap, label: 'Disparo em massa', desc: 'Envie campanhas para toda sua base de clientes' },
    { icon: Users, label: 'CRM integrado', desc: 'Histórico completo de cada contato' },
    { icon: BarChart3, label: 'Analytics avançado', desc: 'Métricas de entrega, abertura e conversão' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      {/* Ilustração animada */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-200">
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-3xl border-2 border-green-400 animate-ping opacity-20" />
        <div className="absolute -inset-2 rounded-3xl border-2 border-green-300 animate-ping opacity-10 [animation-delay:0.5s]" />
        {/* Desconectado badge */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-lg">
          <WifiOff className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Título */}
      <div className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Conecte o WhatsApp da Clínica
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Integre sua conta WhatsApp Business para gerenciar conversas, disparar campanhas e atender seus pacientes diretamente pelo painel DamaFace.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-xl">
        {features.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">{label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-center space-x-2 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 max-w-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Botão principal - Meta Branding */}
      <button
        id="whatsapp-connect-btn"
        onClick={onConnect}
        disabled={!isSdkLoaded || isConnecting}
        className="
          relative flex items-center justify-center space-x-3
          px-8 py-4 rounded-2xl font-bold text-base
          bg-[#1877F2] hover:bg-[#166FE5]
          text-white shadow-xl shadow-blue-200
          disabled:opacity-60 disabled:cursor-not-allowed
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-150 min-w-[280px]
        "
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Conectando...</span>
          </>
        ) : !isSdkLoaded ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando SDK...</span>
          </>
        ) : (
          <>
            {/* Facebook "f" logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Entrar com o Facebook</span>
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="flex items-center space-x-4 mt-5 text-[11px] text-gray-400">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span>Conexão verificada pela Meta</span>
        </div>
        <span>·</span>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span>Dados protegidos</span>
        </div>
      </div>
    </div>
  )
}

// --- Sub-componente: Dashboard Ativo ---
function ConnectedDashboard({
  connection,
  wallet,
  onDisconnect,
  isLoadingWallet,
}: {
  connection: WabaConnection
  wallet: WalletBalance | null
  onDisconnect: () => void
  isLoadingWallet: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md shadow-green-100">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white shadow flex items-center justify-center">
              <Wifi className="w-3 h-3 text-green-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-gray-900">{connection.display_name}</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Conectado</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{connection.phone_number}</p>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">WABA ID: {connection.waba_id}</p>
          </div>
        </div>

        <button
          onClick={onDisconnect}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Desconectar</span>
        </button>
      </div>

      {/* Wallet Card */}
      <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saldo da Wallet</p>
          {isLoadingWallet ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span className="text-gray-400 text-sm">Carregando...</span>
            </div>
          ) : wallet ? (
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-black tracking-tight">
                {wallet.currency === 'BRL' ? 'R$' : '$'}{' '}
                {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Sem dados de carteira</p>
          )}
          <button className="mt-4 flex items-center space-x-1 text-[11px] font-bold text-gray-400 hover:text-white transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>Atualizar saldo</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mensagens hoje', value: '—', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
          { label: 'Conversas ativas', value: '—', icon: Users, color: 'text-purple-600 bg-purple-50' },
          { label: 'Taxa de entrega', value: '—', icon: BarChart3, color: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* CTA - ir para atendimento */}
      <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Pronto para atender!</h3>
          <p className="text-xs text-gray-500 mt-0.5">Acesse as conversas e comece a interagir com seus clientes.</p>
        </div>
        <a
          href="/franqueado/whatsapp"
          className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-colors shadow-md shadow-green-100 whitespace-nowrap"
        >
          Abrir atendimento →
        </a>
      </div>
    </div>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL — WhatsAppConfig
// ============================================================
export default function WhatsAppConfig() {
  const { isSdkLoaded } = useFacebookSDK()

  // Estados principais
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connection, setConnection] = useState<WabaConnection | null>(null)
  const [wallet, setWallet] = useState<WalletBalance | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- 1. Verificar se já existe WabaConnection no backend ---
  const checkConnection = useCallback(async () => {
    try {
      setIsCheckingConnection(true)
      const data = await apiBackend.get<WabaConnection>('/api/whatsapp/connection/')
      setConnection(data)
      setIsConnected(true)
    } catch {
      // 404 = sem conexão, isso é esperado
      setIsConnected(false)
      setConnection(null)
    } finally {
      setIsCheckingConnection(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  // --- 2. Buscar wallet quando conectado ---
  useEffect(() => {
    if (!isConnected) return
    const fetchWallet = async () => {
      try {
        setIsLoadingWallet(true)
        const data = await apiBackend.get<WalletBalance>('/api/whatsapp/wallet/balance/')
        setWallet(data)
      } catch {
        setWallet(null)
      } finally {
        setIsLoadingWallet(false)
      }
    }
    fetchWallet()
  }, [isConnected])

  // --- Auxiliar: troca o code OAuth pelo WabaConnection no backend ---
  const exchangeCodeForConnection = useCallback((code: string) => {
    apiBackend
      .post<WabaConnection>('/api/whatsapp/exchange-token/', { code })
      .then((result) => {
        setConnection(result)
        setIsConnected(true)
      })
      .catch((err: any) => {
        const msg = err?.message || 'Erro ao processar a autorização. Tente novamente.'
        setError(msg)
      })
      .finally(() => {
        setIsConnecting(false)
      })
  }, [])

  // --- Auxiliar: executa a desconexão no backend ---
  const performDisconnect = useCallback(() => {
    apiBackend
      .delete('/api/whatsapp/connection/')
      .then(() => {
        setIsConnected(false)
        setConnection(null)
        setWallet(null)
      })
      .catch(() => {
        setError('Não foi possível desconectar. Tente novamente.')
      })
  }, [])

  // --- 3. Embedded Signup via FB.login (callback estritamente síncrono) ---
  const handleConnect = useCallback(() => {
    if (!isSdkLoaded || !window.FB) {
      setError('SDK do Facebook ainda não carregou. Aguarde um momento e tente novamente.')
      return
    }

    setError(null)
    setIsConnecting(true)

    const configId = process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID || ''

    // ⚠️ O callback do FB.login deve ser síncrono — toda lógica async
    // fica em exchangeCodeForConnection, chamada via método auxiliar
    window.FB.login(
      (response) => {
        if (response.authResponse?.code) {
          exchangeCodeForConnection(response.authResponse.code)
        } else {
          // Usuário cancelou o popup ou negou permissões
          setError('Autorização cancelada ou negada. Por favor, tente novamente e conceda todas as permissões.')
          setIsConnecting(false)
        }
      },
      {
        response_type: 'code',
        config_id: configId,
        override_default_response_type: true,
      }
    )
  }, [isSdkLoaded, exchangeCodeForConnection])

  // --- 4. Desconectar (síncrono — delega ao auxiliar performDisconnect) ---
  const handleDisconnect = useCallback(() => {
    if (!confirm('Tem certeza que deseja desconectar o WhatsApp desta clínica?')) return
    performDisconnect()
  }, [performDisconnect])

  // --- Renderização ---
  if (isCheckingConnection) {
    return <CenteredSpinner message="Verificando conexão WhatsApp..." />
  }

  return (
    <div className="max-w-3xl mx-auto">
      {isConnected && connection ? (
        <ConnectedDashboard
          connection={connection}
          wallet={wallet}
          onDisconnect={handleDisconnect}
          isLoadingWallet={isLoadingWallet}
        />
      ) : (
        <OnboardingState
          onConnect={handleConnect}
          isConnecting={isConnecting}
          isSdkLoaded={isSdkLoaded}
          error={error}
        />
      )}
    </div>
  )
}
