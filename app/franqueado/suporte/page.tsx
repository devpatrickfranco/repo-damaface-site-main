"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { apiBackend } from "@/lib/api-backend"

import CategoryManager from "./components/CategoryManager"

import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Tag,
  Send,
  X,
  Loader2,
  PlayCircle,
  Shield,
  Flag,
  RefreshCcw,
  Power,
  TriangleAlert,
  TrendingUp,
  Activity,
  Users,
  FileText,
  Timer,
  CheckCircle2,
  Paperclip,
  Download,
} from "lucide-react"

// --- HOOK PARA DEBOUNCE (Otimiza a busca) ---
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

// --- INTERFACES ALINHADAS COM A API DJANGO ---
interface ApiUsuarioSimple {
  id: number
  nome: string
  email: string
}

interface ApiComentario {
  id: number
  autor: ApiUsuarioSimple
  conteudo: string
  data_envio: string
}

interface ApiAnexo {
  id: number
  nome: string
  url: string
  enviado_em: string
  autor: ApiUsuarioSimple
}

type ChamadoStatus = "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO" | "FECHADO" | "ATRASADO" | "REABERTO"
type ChamadoPrioridade = "BAIXA" | "MEDIA" | "ALTA"

interface ApiChamadoList {
  id: number
  titulo: string
  status: ChamadoStatus
  prioridade: ChamadoPrioridade
  categoria: string
  subcategoria: string
  criado_em: string
  atualizado_em: string
  prazo_final: string
  comentarios_count: number
}

interface ApiChamadoDetail extends Omit<ApiChamadoList, "comentarios_count"> {
  descricao: string
  criado_por: ApiUsuarioSimple
  atribuido_para: ApiUsuarioSimple | null
  comentarios: ApiComentario[]
  anexos: ApiAnexo[]
}

interface ApiCategoria {
  id: number
  nome: string
  subcategorias: { id: number; nome: string }[]
}

export default function SuportePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Estados de controle da UI
  const [activeView, setActiveView] = useState<"lista" | "detalhes" | "criar">("lista")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados de dados
  const [chamados, setChamados] = useState<ApiChamadoList[]>([])
  const [selectedChamado, setSelectedChamado] = useState<ApiChamadoDetail | null>(null)
  const [categorias, setCategorias] = useState<ApiCategoria[]>([])
  const [franquias, setFranquias] = useState<{ id: number; nome: string }[]>([])

  // Estados de formulários e filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [sortField, setSortField] = useState("criado_em")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [newMessage, setNewMessage] = useState("")
  const [novoChamado, setNovoChamado] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    subcategoria: "",
    franquia: "",
    prioridade: "MEDIA" as ChamadoPrioridade,
  })
  const [anexos, setAnexos] = useState<File[]>([])

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, authLoading, router])

  const fetchChamados = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm)
      }

      if (statusFilter) params.append("status", statusFilter)
      if (priorityFilter) params.append("prioridade", priorityFilter)

      if (sortField) {
        params.append("ordering", `${sortOrder === "desc" ? "-" : ""}${sortField}`)
      }

      const response = await apiBackend.get<ApiChamadoList[]>(`/chamados/chamados/?${params.toString()}`)
      setChamados(response)
    } catch (err) {
      setError("Falha ao carregar os chamados.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChamados()
  }, [isAuthenticated, debouncedSearchTerm, statusFilter, priorityFilter, sortField, sortOrder])

  const handleOpenCreateView = async () => {
    try {
      const catResponse = await apiBackend.get<ApiCategoria[]>("/chamados/categorias/")
      setCategorias(catResponse)

      if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
        const franqResponse = await apiBackend.get<{ id: number; nome: string }[]>("/users/franquias/")
        setFranquias(franqResponse)
      }
      setActiveView("criar")
    } catch (err) {
      alert("Erro ao carregar dados. Tente novamente.")
      console.error(err)
    }
  }

  const handleViewDetails = async (chamadoId: number) => {
    try {
      setLoading(true)
      const response = await apiBackend.get<ApiChamadoDetail>(`/chamados/chamados/${chamadoId}/`)
      setSelectedChamado(response)
      setActiveView("detalhes")
    } catch (err) {
      alert("Erro ao carregar detalhes do chamado.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      titulo: novoChamado.titulo,
      descricao: novoChamado.descricao,
      categoria: Number.parseInt(novoChamado.categoria, 10),
      subcategoria: Number.parseInt(novoChamado.subcategoria, 10),
      prioridade: novoChamado.prioridade,
      franquia:
        user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? Number.parseInt(novoChamado.franquia, 10) : undefined,
    }

    if ((user?.role === "ADMIN" || user?.role === "SUPERADMIN") && !payload.franquia) {
      alert("Por favor, selecione uma franquia de destino.")
      return
    }

    try {
      // Usa FormData para permitir anexos
      const formData = new FormData()
      formData.append("titulo", String(payload.titulo))
      formData.append("descricao", String(payload.descricao))
      formData.append("categoria", String(payload.categoria))
      formData.append("subcategoria", String(payload.subcategoria))
      formData.append("prioridade", String(payload.prioridade))
      if (payload.franquia !== undefined) {
        formData.append("franquia", String(payload.franquia))
      }
      anexos.forEach((file) => {
        // campo "anexos" (aceita múltiplos). Ajuste o nome conforme a API se necessário
        formData.append("anexos", file)
      })

      await apiBackend.post("/chamados/chamados/", formData)
      alert("Chamado criado com sucesso!")
      setActiveView("lista")
      fetchChamados()
      setAnexos([])
    } catch (err: any) {
      console.error("Erro detalhado:", err.response)
      const errorMessages = err.response?.data
        ? Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("\n")
        : ""
      alert(`Erro ao criar chamado:\n${errorMessages || "Verifique o console para detalhes."}`)
    }
  }

  const handleTicketAction = async (action: "assumir" | "resolver" | "reabrir" | "fechar") => {
    if (!selectedChamado) return
    if (!confirm(`Tem certeza que deseja ${action.replace("_", " ")} este chamado?`)) return

    try {
      setLoading(true)
      const response = await apiBackend.post<ApiChamadoDetail>(`/chamados/chamados/${selectedChamado.id}/${action}/`)
      setSelectedChamado(response)
    } catch (error: any) {
      alert(`Erro ao executar ação: ${error.response?.data?.error || "Tente novamente."}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChamado) return

    try {
      await apiBackend.post(`/chamados/chamados/${selectedChamado.id}/adicionar-comentario/`, {
        conteudo: newMessage,
      })
      setNewMessage("")
      await handleViewDetails(selectedChamado.id)
    } catch (err) {
      alert("Erro ao enviar mensagem.")
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-pink animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: ChamadoStatus) => {
    switch (status) {
      case "ABERTO":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "EM_ANDAMENTO":
        return <PlayCircle className="w-4 h-4 text-yellow-400" />
      case "RESOLVIDO":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "FECHADO":
        return <XCircle className="w-4 h-4 text-gray-500" />
      case "ATRASADO":
        return <TriangleAlert className="w-4 h-4 text-red-400" />
      case "REABERTO":
        return <RefreshCcw className="w-4 h-4 text-purple-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadgeColor = (status: ChamadoStatus) => {
    switch (status) {
      case "ABERTO":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "EM_ANDAMENTO":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "RESOLVIDO":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "FECHADO":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      case "ATRASADO":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "REABERTO":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getPriorityIcon = (priority: ChamadoPrioridade) => {
    switch (priority) {
      case "BAIXA":
        return <Flag className="w-4 h-4 text-gray-400" />
      case "MEDIA":
        return <Flag className="w-4 h-4 text-yellow-400" />
      case "ALTA":
        return <Flag className="w-4 h-4 text-red-400" />
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const renderListaTickets = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-brand-pink" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Central de Suporte</h1>
              <p className="text-muted-foreground">Gerencie seus tickets e obtenha suporte especializado</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-soft"></div>
              <span className="text-muted-foreground">
                {chamados.filter((c) => c.status === "ABERTO").length} abertos
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse-soft"></div>
              <span className="text-muted-foreground">
                {chamados.filter((c) => c.status === "EM_ANDAMENTO").length} em andamento
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-soft"></div>
              <span className="text-muted-foreground">
                {chamados.filter((c) => c.status === "ATRASADO").length} atrasados
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === "SUPERADMIN" && <CategoryManager />}
          <button
            onClick={handleOpenCreateView}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg hover:shadow-brand-pink/25"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Ticket</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por ID, título, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
          >
            <option value="">Todos os status</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="FECHADO">Fechado</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="REABERTO">Reaberto</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
          >
            <option value="">Todas as prioridades</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
          >
            <option value="criado_em">Data de Criação</option>
            <option value="status">Status</option>
            <option value="prioridade">Prioridade</option>
            <option value="prazo_final">Prazo Final</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigos</option>
          </select>
        </div>

        {debouncedSearchTerm && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Search className="w-4 h-4 text-brand-pink" />
            <span className="text-muted-foreground">Buscando por:</span>
            <span className="text-brand-pink font-medium bg-brand-pink/10 px-2 py-1 rounded-lg">
              "{debouncedSearchTerm}"
            </span>
            <button
              onClick={() => setSearchTerm("")}
              className="text-muted-foreground hover:text-foreground ml-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Buscando...</span>
              </div>
            ) : (
              <span>
                {chamados.length} chamado{chamados.length !== 1 ? "s" : ""} encontrado{chamados.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {(debouncedSearchTerm || statusFilter || priorityFilter) && (
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setPriorityFilter("")
              }}
              className="text-brand-pink hover:text-brand-pink/80 text-sm font-medium transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3 animate-slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && chamados.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center animate-slide-in-up">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Nenhum chamado encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                {debouncedSearchTerm
                  ? `Não foram encontrados chamados para "${debouncedSearchTerm}"`
                  : "Não há chamados para exibir com os filtros selecionados"}
              </p>
            </div>
            {(debouncedSearchTerm || statusFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("")
                  setPriorityFilter("")
                }}
                className="text-brand-pink hover:text-brand-pink/80 font-medium transition-colors"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {chamados.map((chamado, index) => (
          <div
            key={chamado.id}
            className="bg-card rounded-2xl border border-border p-6 hover:border-brand-pink/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/5 animate-slide-in-up group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-pink font-mono text-lg font-bold bg-brand-pink/10 px-3 py-1 rounded-lg">
                          #{chamado.id}
                        </span>
                        <div className="h-1 w-1 bg-muted-foreground rounded-full"></div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(chamado.criado_em)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-pink transition-colors">
                      {chamado.titulo}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleViewDetails(chamado.id)}
                    className="text-muted-foreground hover:text-brand-pink p-3 rounded-xl hover:bg-brand-pink/10 transition-all duration-200 hover:scale-105"
                    title={`Ver detalhes do chamado #${chamado.id}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(chamado.status)}
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusBadgeColor(chamado.status)}`}
                    >
                      {chamado.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getPriorityIcon(chamado.prioridade)}
                    <span className="text-sm font-medium">{chamado.prioridade}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm">{chamado.subcategoria}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm">Prazo: {formatDate(chamado.prazo_final)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">
                      {chamado.comentarios_count} mensagen{chamado.comentarios_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCriarTicket = () => {
    const subcategoriasFiltradas =
      categorias.find((c) => c.id === Number.parseInt(novoChamado.categoria))?.subcategorias || []
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => setActiveView("lista")}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-6 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-brand-pink" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Criar Novo Chamado</h1>
              <p className="text-muted-foreground">Descreva seu problema ou solicitação detalhadamente</p>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleCreateTicket}
          className="bg-card rounded-2xl border border-border p-8 space-y-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Título do Chamado *</label>
            <input
              type="text"
              value={novoChamado.titulo}
              onChange={(e) => setNovoChamado({ ...novoChamado, titulo: e.target.value })}
              placeholder="Descreva brevemente o problema"
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Categoria *</label>
              <select
                value={novoChamado.categoria}
                onChange={(e) => setNovoChamado({ ...novoChamado, categoria: e.target.value, subcategoria: "" })}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
              >
                <option value="" disabled>
                  Selecione
                </option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Subcategoria *</label>
              <select
                value={novoChamado.subcategoria}
                onChange={(e) => setNovoChamado({ ...novoChamado, subcategoria: e.target.value })}
                required
                disabled={!novoChamado.categoria}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all disabled:opacity-50"
              >
                <option value="" disabled>
                  Selecione
                </option>
                {subcategoriasFiltradas.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Prioridade *</label>
            <select
              value={novoChamado.prioridade}
              onChange={(e) => setNovoChamado({ ...novoChamado, prioridade: e.target.value as ChamadoPrioridade })}
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
          {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Destino (Franquia) *</label>
              <select
                value={novoChamado.franquia}
                onChange={(e) => setNovoChamado({ ...novoChamado, franquia: e.target.value })}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all"
              >
                <option value="" disabled>
                  Selecione
                </option>
                {franquias.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Descrição Detalhada *</label>
            <textarea
              value={novoChamado.descricao}
              onChange={(e) => setNovoChamado({ ...novoChamado, descricao: e.target.value })}
              placeholder="Descreva o problema em detalhes..."
              required
              rows={6}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all resize-none"
            />
          </div>
          <div>
          <label className="block text-sm font-medium text-foreground mb-3">Anexos (opcional)</label>
          {/* Container do input customizado */}
          <div className="relative w-full px-4 py-3 bg-input border-2 border-border rounded-xl hover:border-brand-pink/50 transition-all flex items-center gap-3">
            {/* Input file escondido */}
            <input
              type="file"
              multiple
              onChange={(e) => setAnexos(e.target.files ? Array.from(e.target.files) : [])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            
            {/* Botão customizado */}
            <button
              type="button"
              className="relative z-0 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-300 whitespace-nowrap pointer-events-none"
            >
              Escolher arquivos
            </button>
            
            {/* Texto de feedback */}
            <span className="text-sm text-muted-foreground flex-1 truncate">
              {anexos.length === 0 
                ? 'Nenhum arquivo escolhido' 
                : `${anexos.length} arquivo${anexos.length > 1 ? 's' : ''} selecionado${anexos.length > 1 ? 's' : ''}`
              }
            </span>
          </div>

          {/* Lista de arquivos selecionados */}
          {anexos.length > 0 && (
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
              {anexos.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">Você pode selecionar múltiplos arquivos.</p>
        </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveView("lista")}
              className="flex-1 px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-brand-pink/25"
            >
              Criar Chamado
            </button>
          </div>
        </form>
      </div>
    )
  }

  const renderDetalhesTicket = () => {
    if (loading) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
          </div>
          <p className="text-muted-foreground">Carregando detalhes do chamado...</p>
        </div>
      )
    }

    if (!selectedChamado) return null

    const isAgent = user?.role === "ADMIN" || user?.role === "SUPERADMIN"
    const isCreator = user?.id === selectedChamado.criado_por.id

    // <CHANGE> Função para separar anexos da criação vs conversação
    const separarAnexos = () => {
      if (!selectedChamado.anexos || selectedChamado.anexos.length === 0) {
        return { anexosCriacao: [], anexosConversacao: [] }
      }

      // Agrupa anexos por timestamp
      const timestampGroups: { [key: string]: typeof selectedChamado.anexos } = {}
      
      selectedChamado.anexos.forEach(anexo => {
        const timestamp = new Date(anexo.enviado_em).getTime()
        const timestampKey = Math.floor(timestamp / 60000).toString() // Agrupa por minuto
        
        if (!timestampGroups[timestampKey]) {
          timestampGroups[timestampKey] = []
        }
        timestampGroups[timestampKey].push(anexo)
      })

      // O maior grupo é considerado anexos da criação
      const grupos = Object.values(timestampGroups)
      const maiorGrupo = grupos.reduce((prev, current) => 
        current.length > prev.length ? current : prev
      , grupos[0])

      const anexosCriacao = maiorGrupo
      const anexosConversacao = selectedChamado.anexos.filter(
        anexo => !maiorGrupo.find(a => a.id === anexo.id)
      )

      return { anexosCriacao, anexosConversacao }
    }

    const { anexosCriacao, anexosConversacao } = separarAnexos()

    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedChamado(null)
              setActiveView("lista")
              fetchChamados()
            }}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-brand-pink/10 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </div>
            <span>Voltar para a lista</span>
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-brand-pink" />
              <h3 className="font-semibold text-foreground">Ações Rápidas</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAgent && (selectedChamado.status === "ABERTO" || selectedChamado.status === "REABERTO") && (
                <button
                  onClick={() => handleTicketAction("assumir")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  Assumir Chamado
                </button>
              )}

              {isAgent &&
                selectedChamado.atribuido_para?.id === user?.id &&
                selectedChamado.status === "EM_ANDAMENTO" && (
                  <button
                    onClick={() => handleTicketAction("resolver")}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-green-500/25"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Resolver Chamado
                  </button>
                )}

              {(isCreator || isAgent) && selectedChamado.status === "RESOLVIDO" && (
                <button
                  onClick={() => handleTicketAction("reabrir")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                  Reabrir Chamado
                </button>
              )}

              {isAgent && selectedChamado.status === "RESOLVIDO" && (
                <button
                  onClick={() => handleTicketAction("fechar")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-gray-500/25"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                  Fechar Definitivo
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Clique para alterar o status do chamado conforme seu perfil de acesso.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Header com gradiente sutil */}
          <div className="bg-gradient-to-r from-brand-pink/5 to-brand-pink/10 p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-brand-pink font-mono text-3xl font-bold bg-brand-pink/10 px-4 py-2 rounded-xl">
                    #{selectedChamado.id}
                  </span>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedChamado.status)}
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-medium border ${getStatusBadgeColor(selectedChamado.status)}`}
                    >
                      {selectedChamado.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {selectedChamado.titulo}
                </h1>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getPriorityIcon(selectedChamado.prioridade)}
                    <span className="font-medium">Prioridade {selectedChamado.prioridade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span>{selectedChamado.subcategoria}</span>
                  </div>
                  {selectedChamado.prazo_final && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      <span>Prazo: {formatDate(selectedChamado.prazo_final)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(selectedChamado.criado_em)}</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Atualizado em {formatDate(selectedChamado.atualizado_em)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6 space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descrição do Problema
              </h3>
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedChamado.descricao}</p>
              </div>
            </div>

            {/* <CHANGE> Seção de Anexos da Criação */}
            {anexosCriacao.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Anexos Iniciais
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {anexosCriacao.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {anexosCriacao.map((anexo) => (
                    <a
                      key={anexo.id}
                      href={anexo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl hover:bg-muted hover:border-brand-pink/30 transition-all group"
                    >
                      <div className="flex-shrink-0 w-9 h-9 bg-brand-pink/10 rounded-lg flex items-center justify-center border border-brand-pink/20 group-hover:bg-brand-pink/20 transition-colors">
                        <FileText className="w-4 h-4 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-brand-pink transition-colors truncate">
                          {anexo.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enviado por {anexo.autor.nome}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-brand-pink transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Pessoas envolvidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Criado por
                </h3>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                  <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{selectedChamado.criado_por.nome}</p>
                    <p className="text-muted-foreground text-sm">{selectedChamado.criado_por.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Atribuído para
                </h3>
                {selectedChamado.atribuido_para ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{selectedChamado.atribuido_para.nome}</p>
                      <p className="text-muted-foreground text-sm">{selectedChamado.atribuido_para.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Aguardando atendente</p>
                      <p className="text-muted-foreground text-sm">Nenhum agente atribuído</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-brand-pink/5 to-brand-pink/10 p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-brand-pink" />
                <h2 className="text-xl font-semibold text-foreground">Conversação</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink/10 rounded-lg">
                <span className="text-sm font-medium text-brand-pink">
                  {selectedChamado.comentarios.length} mensagen{selectedChamado.comentarios.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Lista de comentários melhorada */}
          <div className="p-6">
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {selectedChamado.comentarios.length > 0 ? (
                selectedChamado.comentarios.map((comentario, index) => {
                  // <CHANGE> Busca anexos relacionados a este comentário
                  const anexosDoComentario = anexosConversacao.filter(anexo => {
                    const comentarioTime = new Date(comentario.data_envio).getTime()
                    const anexoTime = new Date(anexo.enviado_em).getTime()
                    // Considera anexos enviados até 5 minutos após o comentário
                    return Math.abs(anexoTime - comentarioTime) < 300000 && anexo.autor.id === comentario.autor.id
                  })

                  return (
                    <div
                      key={comentario.id}
                      className={`flex ${comentario.autor.id === user?.id ? "justify-end" : "justify-start"} animate-slide-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          comentario.autor.id === user?.id ? "bg-brand-pink text-white" : "bg-muted text-foreground"
                        } rounded-2xl p-4 shadow-sm`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              comentario.autor.id === user?.id ? "bg-white/20" : "bg-brand-pink"
                            }`}
                          >
                            <User
                              className={`w-4 h-4 ${comentario.autor.id === user?.id ? "text-white" : "text-white"}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{comentario.autor.nome}</span>
                              <span
                                className={`text-xs ${
                                  comentario.autor.id === user?.id ? "text-white/70" : "text-muted-foreground"
                                }`}
                              >
                                {formatDate(comentario.data_envio)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{comentario.conteudo}</p>
                        
                        {/* <CHANGE> Exibe anexos da conversação junto com a mensagem */}
                        {anexosDoComentario.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            {anexosDoComentario.map((anexo) => (
                              <a
                                key={anexo.id}
                                href={anexo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                                  comentario.autor.id === user?.id 
                                    ? "bg-white/10 hover:bg-white/20" 
                                    : "bg-brand-pink/10 hover:bg-brand-pink/20"
                                }`}
                              >
                                <Paperclip className="w-3 h-3 flex-shrink-0" />
                                <span className="text-xs truncate flex-1">{anexo.nome}</span>
                                <Download className="w-3 h-3 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-medium">Nenhuma mensagem ainda</p>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      {selectedChamado.status === "ABERTO" || selectedChamado.status === "REABERTO"
                        ? "Aguardando um atendente assumir o chamado para iniciar a conversa."
                        : "Inicie uma conversa quando o chamado estiver em andamento."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* <CHANGE> Formulário de nova mensagem e upload de anexos separados */}
            {selectedChamado.status === "EM_ANDAMENTO" ? (
              <div className="border-t border-border pt-6 space-y-4">
                {/* Input de anexos separado */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Anexar arquivos (opcional)
                  </label>
                  <div className="relative w-full px-4 py-3 bg-input border-2 border-border rounded-xl hover:border-brand-pink/50 transition-all flex items-center gap-3">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        // Aqui você vai implementar o upload usando a rota específica
                        const files = e.target.files ? Array.from(e.target.files) : []
                        console.log("[v0] Arquivos selecionados para upload:", files)
                        // TODO: Implementar upload via rota específica
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="conversation-file-upload"
                    />
                    <button
                      type="button"
                      className="relative z-0 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-300 whitespace-nowrap pointer-events-none"
                    >
                      Escolher arquivos
                    </button>
                    <span className="text-sm text-muted-foreground flex-1 truncate">
                      Nenhum arquivo escolhido
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Os arquivos serão enviados separadamente da mensagem
                  </p>
                </div>

                {/* Formulário de mensagem */}
                <form onSubmit={handleSendMessage}>
                  <div className="relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      rows={3}
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-all resize-none pr-16"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || loading}
                      className="absolute right-3 top-3 p-2.5 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg hover:shadow-brand-pink/25"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Pressione Ctrl+Enter para enviar rapidamente
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center border-t border-border pt-6">
                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {selectedChamado.status === "ABERTO" || selectedChamado.status === "REABERTO"
                      ? "Um atendente precisa assumir o chamado para iniciar a conversação."
                      : selectedChamado.status === "RESOLVIDO"
                        ? "Chamado resolvido. Você pode reabrir se necessário."
                        : "A conversação está encerrada para este chamado."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
        <div className="p-6">
          {activeView === "lista" && renderListaTickets()}
          {activeView === "criar" && renderCriarTicket()}
          {activeView === "detalhes" && renderDetalhesTicket()}
        </div>
  )
}
