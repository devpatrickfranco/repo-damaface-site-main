'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiBackend } from '@/lib/api-backend'
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Phone,
  Building2,
  ArrowRight,
  HeadphonesIcon,
  Lock,
  Send,
  ChevronRight,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Tipos (alinhados com a API que retorna array)
// ─────────────────────────────────────────────────────────────

/**
 * registration_status values:
 *   'pending'   – solicitação enviada, aguardando aprovação
 *   'active'    – número ativo, pode usar o módulo
 *   'suspended' – conta suspensa
 */
type RegistrationStatus = 'pending' | 'active' | 'suspended'

interface WabaConnection {
  id: number
  phone_number: string
  display_name?: string
  waba_id?: string
  registration_status: RegistrationStatus
  activated_at?: string
  suspension_reason?: string
}

interface WalletBalance {
  balance: number
  currency: string
}

// ─────────────────────────────────────────────────────────────
// Sub-componente: Spinner centralizado
// ─────────────────────────────────────────────────────────────
function CenteredSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-green-500" />
        </div>
      </div>
      {message && (
        <p className="text-sm text-gray-500 font-medium animate-pulse">{message}</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Estado 0: SEM CONEXÃO — Formulário de Onboarding
// Aparece quando connections.length === 0
// ─────────────────────────────────────────────────────────────
function WhatsAppOnboardingForm({ onSuccess }: { onSuccess: () => void }) {
  const [phone, setPhone] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const digits = value.replace(/\D/g, '').slice(0, 13) // max: 55 + DDD (2) + número (9)
    if (digits.length <= 2) return `+${digits}`
    if (digits.length <= 4) return `+${digits.slice(0, 2)} (${digits.slice(2)}`
    if (digits.length <= 9)
      return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4)}`
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
    setError(null)
  }

  const rawDigits = phone.replace(/\D/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rawDigits.length < 12) {
      setError('Digite um número completo com DDD e o dígito 9.')
      return
    }
    try {
      setIsSending(true)
      setError(null)

      // Envia solicitação de onboarding ao backend
      await apiBackend.post('/whatsapp/connections/register/', {
        phone_number: `+${rawDigits}`,
      })

      setSent(true)
      // Aguarda 2s e dispara re-fetch no componente pai
      setTimeout(() => onSuccess(), 2000)
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Erro ao enviar solicitação. Tente novamente.'
      setError(msg)
    } finally {
      setIsSending(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
          Solicitação enviada!
        </h2>
        <p className="text-gray-500 text-center max-w-xs">
          Nossa equipe irá configurar seu número e você será notificado assim que estiver ativo.
        </p>
        <Loader2 className="w-5 h-5 animate-spin text-gray-400 mt-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      {/* Hero icon */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-200">
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-green-400 animate-ping opacity-20" />
        <div className="absolute -inset-2 rounded-3xl border-2 border-green-300 animate-ping opacity-10 [animation-delay:0.7s]" />
      </div>

      {/* Título */}
      <div className="text-center mb-10 max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Conecte o WhatsApp da Clínica
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Informe o número de telefone da sua clínica. Nossa equipe irá configurar um número WhatsApp Business exclusivo dentro do WABA central DamaFace.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>Número de telefone (WhatsApp)</span>
          </label>
          <div className="relative">
            <input
              id="whatsapp-phone-input"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+55 (19) 98217-7463"
              disabled={isSending}
              className={`
                w-full px-4 py-3.5 rounded-2xl border text-sm font-medium
                bg-white placeholder-gray-400 text-gray-900
                focus:outline-none focus:ring-2 transition-all
                ${error
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{error}</span>
            </p>
          )}
          <p className="text-[11px] text-gray-400">
            Formato: +55 (DDD) 9XXXX-XXXX · Inclua o código do país
          </p>
        </div>

        <button
          id="whatsapp-register-btn"
          type="submit"
          disabled={isSending || rawDigits.length < 12}
          className="
            w-full flex items-center justify-center space-x-2
            px-6 py-4 rounded-2xl font-bold text-base
            bg-green-500 hover:bg-green-600 text-white
            shadow-xl shadow-green-200
            disabled:opacity-50 disabled:cursor-not-allowed
            transform hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-150
          "
        >
          {isSending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enviando solicitação...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Solicitar ativação</span>
            </>
          )}
        </button>
      </form>

      {/* Features preview */}
      <div className="grid grid-cols-2 gap-3 mt-10 w-full max-w-sm">
        {[
          { icon: MessageSquare, label: 'Conversas em tempo real' },
          { icon: Zap, label: 'Disparos em massa' },
          { icon: Users, label: 'CRM Integrado' },
          { icon: ShieldCheck, label: 'WABA Central DamaFace' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-green-600" />
            </div>
            <p className="text-[11px] font-bold text-gray-700 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Trust badge */}
      <div className="flex items-center space-x-2 mt-8 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        <span>Número gerenciado pela DamaFace · Verificado pela Meta</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Estado 1: PENDING — Aguardando ativação
// Aparece quando connections[0].registration_status === 'pending'
// ─────────────────────────────────────────────────────────────
function PendingState({
  connection,
  onRefresh,
}: {
  connection: WabaConnection
  onRefresh: () => void
}) {
  const steps = [
    { label: 'Solicitação de número enviada', done: true },
    { label: 'Número alocado no WABA DamaFace', done: true },
    { label: 'Verificação e configuração do número', done: false, active: true },
    { label: 'Ativação liberada para uso', done: false },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      {/* Ilustração animada */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-200">
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-amber-400 animate-ping opacity-20" />
        <div className="absolute -inset-2 rounded-3xl border-2 border-amber-300 animate-ping opacity-10 [animation-delay:0.7s]" />
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-amber-200 flex items-center justify-center shadow-lg">
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      {/* Título */}
      <div className="text-center mb-8 max-w-md">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-4">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span>EM CONFIGURAÇÃO</span>
        </span>
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Seu número está sendo ativado
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          A equipe DamaFace está configurando o número{' '}
          <span className="font-bold text-gray-700">{connection.phone_number}</span> dentro do
          nosso WABA central. Você será notificado assim que estiver pronto.
        </p>
      </div>

      {/* Checklist de progresso */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">
          Progresso da ativação
        </h3>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="mt-0.5 shrink-0">
                {step.done ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                ) : step.active ? (
                  <div className="w-5 h-5 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-200" />
                )}
              </div>
              <p className={`text-sm font-medium leading-tight ${
                step.done
                  ? 'text-green-700 line-through decoration-green-400'
                  : step.active
                  ? 'text-amber-700'
                  : 'text-gray-400'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Verificar status agora</span>
        </button>
        <a
          href="https://wa.me/5519982177463?text=Olá!%20Meu%20WhatsApp%20ainda%20está%20pendente%20de%20ativação."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-medium text-sm hover:bg-gray-50 transition-all"
        >
          <HeadphonesIcon className="w-4 h-4 text-green-600" />
          <span>Falar com suporte DamaFace</span>
        </a>
      </div>

      <div className="flex items-center space-x-2 mt-8 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        <span>Número alocado no WABA central DamaFace · Gerenciado pela Meta</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Estado 2: ACTIVE — Dashboard Ativo
// Só renderiza quando registration_status === 'active'
// ─────────────────────────────────────────────────────────────
function ActiveDashboard({
  connection,
  wallet,
  isLoadingWallet,
  onRefreshWallet,
}: {
  connection: WabaConnection
  wallet: WalletBalance | null
  isLoadingWallet: boolean
  onRefreshWallet: () => void
}) {
  const router = useRouter()

  const stats = [
    { label: 'Mensagens hoje', value: '—', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
    { label: 'Conversas ativas', value: '—', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Taxa de entrega', value: '—', icon: BarChart3, color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Status Banner */}
      <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-100">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white shadow flex items-center justify-center">
              <Wifi className="w-3 h-3 text-green-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <h2 className="text-base font-black text-gray-900">
                {connection.display_name ?? 'Clínica DamaFace'}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Ativo</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span className="font-medium">{connection.phone_number}</span>
              </span>
              {connection.waba_id && (
                <span className="text-[11px] text-gray-400 font-mono">
                  WABA: {connection.waba_id}
                </span>
              )}
            </div>
            {connection.activated_at && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                Ativo desde{' '}
                {new Date(connection.activated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center space-x-1">
            <Building2 className="w-3 h-3" />
            <span>COEX · WABA Central</span>
          </span>
          <span className="text-[10px] text-gray-400">Gerenciado pela DamaFace</span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Saldo da Wallet
          </p>
          {isLoadingWallet ? (
            <div className="flex items-center space-x-2 h-12">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span className="text-gray-400 text-sm">Carregando...</span>
            </div>
          ) : wallet ? (
            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black tracking-tight">
                {wallet.currency === 'BRL' ? 'R$' : '$'}{' '}
                {wallet.balance.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-sm text-gray-400 mb-1">{wallet.currency}</span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm h-12 flex items-center">
              Sem dados de carteira disponíveis
            </p>
          )}
          <button
            onClick={onRefreshWallet}
            className="mt-4 flex items-center space-x-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors group"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Atualizar saldo</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: MessageSquare, label: 'Conversas em tempo real', desc: 'Atenda pacientes diretamente pelo painel' },
          { icon: Zap, label: 'Disparos em massa', desc: 'Campanhas para toda sua base' },
          { icon: Users, label: 'CRM Integrado', desc: 'Histórico completo de cada contato' },
          { icon: ShieldCheck, label: 'Segurança garantida', desc: 'Dados protegidos e criptografados' },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">{label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">Pronto para atender!</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Acesse as conversas e comece a interagir com os pacientes da sua clínica.
          </p>
        </div>
        <button
          onClick={() => router.push('/franqueado/whatsapp')}
          className="flex items-center space-x-2 px-5 py-2.5 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-md shadow-green-100 whitespace-nowrap"
        >
          <span>Abrir atendimento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Estado 3: SUSPENDED — Conta suspensa
// ─────────────────────────────────────────────────────────────
function SuspendedState({
  connection,
}: {
  connection: WabaConnection
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-200">
          <WifiOff className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-red-200 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
      </div>

      <div className="text-center mb-8 max-w-md">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold mb-4">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          <span>CONTA SUSPENSA</span>
        </span>
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Número {connection.phone_number} suspenso
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          O acesso ao WhatsApp Business desta clínica foi temporariamente suspenso. Entre em
          contato com o suporte DamaFace para regularizar sua situação.
        </p>
      </div>

      {connection.suspension_reason && (
        <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
          <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
            Motivo da suspensão
          </p>
          <p className="text-sm text-red-800 leading-relaxed">{connection.suspension_reason}</p>
        </div>
      )}

      <a
        href="https://wa.me/5519982177463?text=Olá!%20Meu%20WhatsApp%20está%20suspenso%20e%20preciso%20de%20ajuda."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-base hover:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-red-200"
      >
        <HeadphonesIcon className="w-5 h-5" />
        <span>Falar com suporte DamaFace</span>
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Estado Extra: BLOQUEADO — Conexão existe mas não é 'active'
// Banner informativo com cards de métricas bloqueados/opacos
// ─────────────────────────────────────────────────────────────
function LockedDashboard({ connection }: { connection: WabaConnection }) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner de aviso */}
      <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">
            Número em processo de ativação
          </p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            O número <span className="font-bold">{connection.phone_number}</span> foi solicitado
            e está sendo configurado. As funcionalidades abaixo ficarão disponíveis após a ativação
            pela equipe DamaFace.
          </p>
        </div>
      </div>

      {/* Status Banner (bloqueado/visual) */}
      <div className="relative flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Aguardando ativação</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 opacity-40 select-none">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-base font-black text-gray-900">
              {connection.display_name ?? 'Clínica DamaFace'}
            </p>
            <p className="text-sm text-gray-500">{connection.phone_number}</p>
          </div>
        </div>
        <div className="opacity-30 select-none">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Quick Stats — bloqueados */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mensagens hoje', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
          { label: 'Conversas ativas', icon: Users, color: 'text-purple-600 bg-purple-50' },
          { label: 'Taxa de entrega', icon: BarChart3, color: 'text-green-600 bg-green-50' },
        ].map(({ label, icon: Icon, color }) => (
          <div
            key={label}
            className="relative p-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-300" />
            </div>
            <div className="opacity-30 select-none">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-gray-900">—</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contato suporte */}
      <a
        href="https://wa.me/5519982177463?text=Olá!%20Gostaria%20de%20saber%20o%20status%20da%20ativação%20do%20meu%20WhatsApp."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center space-x-2 p-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
      >
        <HeadphonesIcon className="w-4 h-4 text-green-600" />
        <span>Falar com suporte sobre minha ativação</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL — WhatsAppActivationStatus
// ─────────────────────────────────────────────────────────────
export default function WhatsAppActivationStatus() {
  const [isLoading, setIsLoading] = useState(true)
  const [connections, setConnections] = useState<WabaConnection[]>([])
  const [wallet, setWallet] = useState<WalletBalance | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)

  // ── Buscar lista de conexões da franquia ──────────────
  const fetchConnections = useCallback(async () => {
    try {
      setIsLoading(true)
      // A API retorna [] quando não há conexão
      const data = await apiBackend.get<WabaConnection[]>('/whatsapp/connections/')
      setConnections(Array.isArray(data) ? data : [])
    } catch {
      setConnections([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // ── Buscar wallet quando o primeiro número estiver ativo ─
  const fetchWallet = useCallback(async () => {
    try {
      setIsLoadingWallet(true)
      const data = await apiBackend.get<WalletBalance>('/whatsapp/wallet/balance/')
      setWallet(data)
    } catch {
      setWallet(null)
    } finally {
      setIsLoadingWallet(false)
    }
  }, [])

  const activeConnection = connections.find((c) => c.registration_status === 'active')

  useEffect(() => {
    if (activeConnection) {
      fetchWallet()
    }
  }, [activeConnection?.id, fetchWallet])

  // ── Polling automático enquanto houver pendente ───────
  const hasPending = connections.some((c) => c.registration_status === 'pending')
  useEffect(() => {
    if (!hasPending) return
    const interval = setInterval(fetchConnections, 30_000)
    return () => clearInterval(interval)
  }, [hasPending, fetchConnections])

  // ── Renderização ──────────────────────────────────────
  if (isLoading) {
    return <CenteredSpinner message="Verificando status do WhatsApp..." />
  }

  // 0. Sem nenhuma conexão → formulário de onboarding
  if (connections.length === 0) {
    return <WhatsAppOnboardingForm onSuccess={fetchConnections} />
  }

  const connection = connections[0]

  // 1. Número suspenso
  if (connection.registration_status === 'suspended') {
    return <SuspendedState connection={connection} />
  }

  // 2. Número ativo → dashboard completo
  if (connection.registration_status === 'active') {
    return (
      <ActiveDashboard
        connection={connection}
        wallet={wallet}
        isLoadingWallet={isLoadingWallet}
        onRefreshWallet={fetchWallet}
      />
    )
  }

  // 3. Outro status (pending, etc.) → dashboard bloqueado
  // PendingState detalhado OU LockedDashboard com cards bloqueados
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PendingState connection={connection} onRefresh={fetchConnections} />
      <LockedDashboard connection={connection} />
    </div>
  )
}
