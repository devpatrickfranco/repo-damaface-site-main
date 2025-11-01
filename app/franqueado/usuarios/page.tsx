"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from "react"
import { apiBackend } from "@/lib/api-backend"
import type { Usuario, Franquia } from "@/types/users"

import Avatar from "../components/Avatar"

import { Plus, Search, Edit, Trash2, Eye, EyeOff, Building, User, Crown, Shield, UserCheck, Users, X, Save, AlertCircle } from 'lucide-react'

export default function UsuariosPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  // Estados da UI
  const [activeTab, setActiveTab] = useState<"usuarios" | "franquias">("usuarios")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"usuario" | "franquia">("usuario")
  const [editingItem, setEditingItem] = useState<Usuario | Franquia | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)

  // Estados dos dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [franquias, setFranquias] = useState<Franquia[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")

  // Estado do formulário
  const [formData, setFormData] = useState<{
    nome: string
    email: string
    password?: string
    role: Usuario["role"]
    franquia: number | null
    cnpj: string
  }>({
    nome: "",
    email: "",
    password: "",
    role: "FUNCIONARIO",
    franquia: null,
    cnpj: "",
  })

  // <CHANGE> Corrigida a função de busca de dados com logs detalhados e múltiplas formas de acessar os dados
  const fetchData = useCallback(async () => {
    console.log("[v0] Iniciando busca de dados...")
    setPageLoading(true)
    setDataError(null)
    
    try {
      const [usuariosRes, franquiasRes] = await Promise.allSettled([
        apiBackend.get("/users/usuarios/"),
        apiBackend.get("/users/franquias/"),
      ])

      // Processa usuários
      if (usuariosRes.status === "fulfilled") {
        console.log("[v0] Resposta completa de usuários:", usuariosRes.value)
        console.log("[v0] Tipo da resposta:", typeof usuariosRes.value)
        console.log("[v0] É array?", Array.isArray(usuariosRes.value))
        
        // Tenta acessar os dados de múltiplas formas
        let usuariosData = []
        if (Array.isArray(usuariosRes.value)) {
          // A resposta é diretamente um array
          usuariosData = usuariosRes.value
          console.log("[v0] Dados são array direto")
        } else if (usuariosRes.value?.data && Array.isArray(usuariosRes.value.data)) {
          // A resposta tem propriedade data (formato axios)
          usuariosData = usuariosRes.value.data
          console.log("[v0] Dados estão em response.data")
        } else if (usuariosRes.value?.data?.data && Array.isArray(usuariosRes.value.data.data)) {
          // A resposta tem data aninhado
          usuariosData = usuariosRes.value.data.data
          console.log("[v0] Dados estão em response.data.data")
        }
        
        console.log("[v0] Usuários processados:", usuariosData)
        setUsuarios(usuariosData)
      } else {
        console.error("[v0] Erro ao buscar usuários:", usuariosRes.reason)
        setUsuarios([])
      }

      // Processa franquias
      if (franquiasRes.status === "fulfilled") {
        console.log("[v0] Resposta completa de franquias:", franquiasRes.value)
        console.log("[v0] Tipo da resposta:", typeof franquiasRes.value)
        console.log("[v0] É array?", Array.isArray(franquiasRes.value))
        
        // Tenta acessar os dados de múltiplas formas
        let franquiasData = []
        if (Array.isArray(franquiasRes.value)) {
          // A resposta é diretamente um array
          franquiasData = franquiasRes.value
          console.log("[v0] Dados são array direto")
        } else if (franquiasRes.value?.data && Array.isArray(franquiasRes.value.data)) {
          // A resposta tem propriedade data (formato axios)
          franquiasData = franquiasRes.value.data
          console.log("[v0] Dados estão em response.data")
        } else if (franquiasRes.value?.data?.data && Array.isArray(franquiasRes.value.data.data)) {
          // A resposta tem data aninhado
          franquiasData = franquiasRes.value.data.data
          console.log("[v0] Dados estão em response.data.data")
        }
        
        console.log("[v0] Franquias processadas:", franquiasData)
        setFranquias(franquiasData)
      } else {
        console.error("[v0] Erro ao buscar franquias:", franquiasRes.reason)
        setFranquias([])
      }

      // Se ambas falharam, mostra erro
      if (usuariosRes.status === "rejected" && franquiasRes.status === "rejected") {
        setDataError("Falha ao carregar dados do servidor. Verifique sua conexão.")
      }
    } catch (err) {
      console.error("[v0] Erro geral ao buscar dados:", err)
      setDataError("Erro inesperado ao carregar dados.")
      setUsuarios([])
      setFranquias([])
    } finally {
      setPageLoading(false)
      console.log("[v0] Busca de dados finalizada")
    }
  }, [])

  // Efeito para proteção da rota
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, loading, router])

  // Efeito para buscar dados iniciais
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("[v0] Usuário autenticado, buscando dados...")
      fetchData()
    }
  }, [isAuthenticated, loading, fetchData])

  // Funções de controle do Modal
  const openModal = (type: "usuario" | "franquia", item?: Usuario | Franquia) => {
    setModalType(type)
    setEditingItem(item || null)
    setError("")

    if (item) {
      if (type === "usuario") {
        const usuario = item as Usuario
        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          password: "",
          role: usuario.role,
          franquia: usuario.franquia,
          cnpj: "",
        })
      } else {
        const franquia = item as Franquia
        setFormData({
          nome: franquia.nome,
          cnpj: franquia.cnpj,
          email: "",
          password: "",
          role: "FUNCIONARIO",
          franquia: null,
        })
      }
    } else {
      setFormData({
        nome: "",
        email: "",
        password: "",
        role: "FUNCIONARIO",
        franquia: null,
        cnpj: "",
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setShowPassword(false)
    setError("")
  }

  // Funções de CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitLoading(true)

    const isEditing = !!editingItem

    try {
      if (modalType === "usuario") {
        const url = isEditing ? `/users/usuarios/${editingItem!.id}/` : "/users/usuarios/"
        const method = isEditing ? "put" : "post"

        // Remove a senha se não foi preenchida na edição
        const dataToSend = { ...formData }
        if (isEditing && !formData.password) {
          delete dataToSend.password
        }

        await apiBackend[method](url, dataToSend)
      } else {
        const url = isEditing ? `/users/franquias/${editingItem!.id}/` : "/users/franquias/"
        const method = isEditing ? "put" : "post"
        await apiBackend[method](url, { nome: formData.nome, cnpj: formData.cnpj })
      }

      await fetchData()
      closeModal()
    } catch (err: any) {
      const apiError = err.response?.data?.detail || `Falha ao salvar ${modalType}.`
      setError(apiError)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (type: "usuario" | "franquia", id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      const url = type === "usuario" ? `/users/usuarios/${id}/` : `/users/franquias/${id}/`
      try {
        await apiBackend.delete(url)
        await fetchData()
      } catch (err) {
        setError(`Falha ao excluir ${type}.`)
      }
    }
  }

  // Funções de ajuda para UI
  const getRoleIcon = (role: Usuario["role"]) => {
    switch (role) {
      case "SUPERADMIN":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "ADMIN":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "FRANQUEADO":
        return <UserCheck className="w-4 h-4 text-green-500" />
      case "FUNCIONARIO":
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: Usuario["role"]) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "FRANQUEADO":
        return "bg-green-100 text-green-800 border-green-200"
      case "FUNCIONARIO":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleDisplayName = (role: Usuario["role"]) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin"
      case "ADMIN":
        return "Admin"
      case "FRANQUEADO":
        return "Franqueado"
      case "FUNCIONARIO":
        return "Funcionário"
    }
  }

  // Filtros
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || usuario.role === filterRole
    const matchesTipo =
      filterTipo === "all" ||
      (filterTipo === "franqueadora" && !usuario.franquia) ||
      (filterTipo === "franquia" && usuario.franquia)

    return matchesSearch && matchesRole && matchesTipo
  })

  const filteredFranquias = franquias.filter(
    (franquia) => franquia.nome.toLowerCase().includes(searchTerm.toLowerCase()) || franquia.cnpj.includes(searchTerm),
  )

  // Loading states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gerenciar Usuários e Franquias</h1>
            <p className="text-gray-400">Controle completo de usuários e unidades franqueadas</p>
          </div>

          {/* Error Display */}
          {dataError && (
            <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{dataError}</span>
              <button 
                onClick={() => {
                  setDataError(null)
                  fetchData()
                }} 
                className="ml-auto text-red-400 hover:text-red-300 underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("usuarios")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "usuarios"
                      ? "border-pink-500 text-pink-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Usuários ({usuarios.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("franquias")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "franquias"
                      ? "border-pink-500 text-pink-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Franquias ({franquias.length})</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Filters for usuarios */}
              {activeTab === "usuarios" && (
                <>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">Todas as funções</option>
                    <option value="SUPERADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="FRANQUEADO">Franqueado</option>
                    <option value="FUNCIONARIO">Funcionário</option>
                  </select>

                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="franqueadora">Franqueadora</option>
                    <option value="franquia">Franquia</option>
                  </select>
                </>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={() => openModal(activeTab === "usuarios" ? "usuario" : "franquia")}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar {activeTab === "usuarios" ? "Usuário" : "Franquia"}</span>
            </button>
          </div>

          {/* Content */}
          {activeTab === "usuarios" ? (
            /* Tabela de Usuários */
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Função
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Franquia
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar src={usuario.imgProfile} alt={usuario.nome} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{usuario.nome}</div>
                              <div className="text-sm text-gray-400">{usuario.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(usuario.role)}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(usuario.role)}`}
                            >
                              {getRoleDisplayName(usuario.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              usuario.franquia
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : "bg-purple-100 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {usuario.franquia ? "Franquia" : "Franqueadora"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {usuario.franquia ? franquias.find(f => f.id === usuario.franquia)?.nome || `ID: ${usuario.franquia}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal("usuario", usuario)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete("usuario", usuario.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsuarios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                          {usuarios.length === 0 ? "Nenhum usuário cadastrado" : "Nenhum usuário encontrado com os filtros aplicados"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tabela de Franquias */
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Franquia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        CNPJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Usuários
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredFranquias.map((franquia) => (
                      <tr key={franquia.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                              <Building className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{franquia.nome}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{franquia.cnpj}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {usuarios.filter((u) => u.franquia === franquia.id).length} usuários
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal("franquia", franquia)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete("franquia", franquia.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredFranquias.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          {franquias.length === 0 ? "Nenhuma franquia cadastrada" : "Nenhuma franquia encontrada com os filtros aplicados"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gradient-to-r from-gray-800 to-gray-750 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                  {modalType === "usuario" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Building className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {editingItem ? "Editar" : "Adicionar"} {modalType === "usuario" ? "Usuário" : "Franquia"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {editingItem ? "Atualize as informações" : "Preencha os dados necessários"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-300 text-sm font-medium">Erro</p>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-pink-400" />
                      <span>Nome {modalType === "franquia" ? "da Franquia" : ""}</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    placeholder="Digite o nome..."
                    required
                  />
                </div>

                {modalType === "usuario" ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="w-4 h-4 text-pink-400">@</span>
                          <span>Email</span>
                        </div>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                        placeholder="usuario@exemplo.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-4 h-4 text-pink-400" />
                          <span>Senha {editingItem ? "(deixe em branco para manter)" : ""}</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                          placeholder="Digite a senha..."
                          required={!editingItem}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 rounded transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <Crown className="w-4 h-4 text-pink-400" />
                          <span>Função</span>
                        </div>
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Usuario["role"] })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      >
                        <option value="FUNCIONARIO">Funcionário</option>
                        <option value="FRANQUEADO">Franqueado</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPERADMIN">Super Admin</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className="w-4 h-4 text-pink-400" />
                          <span>Franquia</span>
                        </div>
                      </label>
                      <select
                        value={formData.franquia || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            franquia: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      >
                        <option value="">Nenhuma (Franqueadora)</option>
                        {franquias.map((franquia) => (
                          <option key={franquia.id} value={franquia.id}>
                            {franquia.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-4 h-4 text-pink-400 font-mono text-sm">#</span>
                        <span>CNPJ</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8 border-t border-gray-700 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  disabled={submitLoading}
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingItem ? "Atualizar" : "Criar"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}