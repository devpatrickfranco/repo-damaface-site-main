"use client"

import type React from "react"
import { useState } from "react"
import {
  Plus, Building, User, Crown, Shield, UserCheck, Users, X, Save, AlertCircle,
  Eye, EyeOff, Phone, MapPin, Camera, ChevronLeft, ChevronRight, Check,
} from "lucide-react"

type Usuario = {
  id: number
  nome: string
  email: string
  role: "SUPERADMIN" | "ADMIN" | "FRANQUEADO" | "FUNCIONARIO"
  franquia: number | null
}
type Franquia = { id: number; nome: string; cnpj: string; foto?: string | null }

const dummyFranquias: Franquia[] = [
  { id: 1, nome: "Unidade Pinheiros", cnpj: "00.000.000/0001-00" },
  { id: 2, nome: "Unidade Moema", cnpj: "00.000.000/0002-00" },
]

export default function QaModalPreviewPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"usuario" | "franquia">("franquia")
  const [editingItem, setEditingItem] = useState<Usuario | Franquia | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const franquias = dummyFranquias

  const franquiaSteps = [
    { label: "Dados Gerais", icon: Building },
    { label: "Contato", icon: Phone },
    { label: "Endereço e Foto", icon: MapPin },
  ]

  const [formData, setFormData] = useState<{
    nome: string
    email: string
    password?: string
    role: Usuario["role"]
    franquia: number | null
    cnpj: string
    cidade: string
    estado: string
    bairro: string
    endereco: string
    numero: string
    cep: string
    telefone: string
    whatsapp: string
    franquiaEmail: string
    instagram: string
  }>({
    nome: "", email: "", password: "", role: "FUNCIONARIO", franquia: null, cnpj: "",
    cidade: "", estado: "", bairro: "", endereco: "", numero: "", cep: "",
    telefone: "", whatsapp: "", franquiaEmail: "", instagram: "",
  })

  const openModal = (type: "usuario" | "franquia") => {
    setModalType(type)
    setEditingItem(null)
    setError("")
    setModalStep(1)
    setFotoFile(null)
    setFotoPreview(null)
    setFormData({
      nome: "", email: "", password: "", role: "FUNCIONARIO", franquia: null, cnpj: "",
      cidade: "", estado: "", bairro: "", endereco: "", numero: "", cep: "",
      telefone: "", whatsapp: "", franquiaEmail: "", instagram: "",
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setShowPassword(false)
    setError("")
    setModalStep(1)
    setFotoFile(null)
    setFotoPreview(null)
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      setError("Apenas arquivos de imagem são permitidos")
      return
    }
    setFotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setFotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemoveFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    const fileInput = document.getElementById("foto-fachada-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const goToNextStep = () => {
    if (modalStep === 1 && (!formData.nome.trim() || !formData.cnpj.trim())) {
      setError("Preencha o nome e o CNPJ da franquia para continuar.")
      return
    }
    setError("")
    setModalStep((step) => Math.min(step + 1, franquiaSteps.length))
  }

  const goToPrevStep = () => {
    setError("")
    setModalStep((step) => Math.max(step - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === "franquia" && modalStep < franquiaSteps.length) {
      goToNextStep()
      return
    }
    setSubmitLoading(true)
    setTimeout(() => {
      setSubmitLoading(false)
      closeModal()
    }, 600)
  }

  return (
    <div className="bg-gray-900 min-h-screen p-10 flex items-center justify-center space-x-4">
      <button
        onClick={() => openModal("franquia")}
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar Franquia</span>
      </button>
      <button
        onClick={() => openModal("usuario")}
        className="bg-gray-700 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar Usuário</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gradient-to-r from-gray-800 to-gray-750 flex-shrink-0">
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

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {modalType === "franquia" && (
                <div className="px-6 pt-5 flex-shrink-0">
                  <div className="flex items-center">
                    {franquiaSteps.map((step, index) => {
                      const stepNumber = index + 1
                      const isActive = modalStep === stepNumber
                      const isCompleted = modalStep > stepNumber
                      const StepIcon = step.icon
                      return (
                        <div
                          key={step.label}
                          className={`flex items-center ${index < franquiaSteps.length - 1 ? "flex-1" : ""}`}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                                ? "bg-pink-500 border-pink-500"
                                : isActive
                                  ? "border-pink-500 bg-gray-800 text-pink-400"
                                  : "border-gray-600 bg-gray-800 text-gray-500"
                                }`}
                            >
                              {isCompleted ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <span
                              className={`mt-1.5 text-[11px] font-medium text-center whitespace-nowrap ${isActive ? "text-pink-400" : isCompleted ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {index < franquiaSteps.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${isCompleted ? "bg-pink-500" : "bg-gray-700"}`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
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

                {modalType === "usuario" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-pink-400" />
                          <span>Nome</span>
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
                          <span>Senha</span>
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
                          setFormData({ ...formData, franquia: e.target.value ? Number(e.target.value) : null })
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
                  </div>
                ) : (
                  <>
                    {modalStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <Building className="w-4 h-4 text-pink-400" />
                              <span>Nome da Franquia</span>
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
                      </div>
                    )}

                    {modalStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="w-4 h-4 text-pink-400">@</span>
                              <span>Email</span>
                            </div>
                          </label>
                          <input
                            type="email"
                            value={formData.franquiaEmail}
                            onChange={(e) => setFormData({ ...formData, franquiaEmail: e.target.value })}
                            placeholder="contato@franquia.com"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <Phone className="w-4 h-4 text-pink-400" />
                              <span>Telefone</span>
                            </div>
                          </label>
                          <input
                            type="text"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="(00) 0000-0000"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span>WhatsApp</span>
                            </div>
                          </label>
                          <input
                            type="text"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            placeholder="(00) 00000-0000"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span>Instagram</span>
                            </div>
                          </label>
                          <input
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            placeholder="@franquia"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {modalStep === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <Camera className="w-4 h-4 text-pink-400" />
                              <span>Foto da fachada</span>
                            </div>
                          </label>

                          {fotoPreview ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-600 bg-gray-700/50">
                              <img src={fotoPreview} alt="Fachada da franquia" className="w-full h-full object-cover" />
                              <label
                                htmlFor="foto-fachada-upload"
                                className="absolute bottom-3 right-3 flex items-center space-x-2 bg-gray-900/80 hover:bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Trocar</span>
                                <input id="foto-fachada-upload" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                              </label>
                              <button
                                type="button"
                                onClick={handleRemoveFoto}
                                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                                title="Remover imagem"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="foto-fachada-upload"
                              className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-gray-600 bg-gray-700/30 hover:bg-gray-700/50 hover:border-pink-500/50 cursor-pointer transition-colors"
                            >
                              <Camera className="w-8 h-8 text-gray-500 mb-2" />
                              <span className="text-sm text-gray-400 font-medium">Clique para enviar a foto da fachada</span>
                              <span className="text-xs text-gray-500 mt-1">PNG ou JPG, até 5MB</span>
                              <input id="foto-fachada-upload" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                            </label>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>Cidade</span></label>
                            <input type="text" value={formData.cidade} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} placeholder="Cidade" className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>Estado (UF)</span></label>
                            <input type="text" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })} placeholder="SP" maxLength={2} className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>Bairro</span></label>
                            <input type="text" value={formData.bairro} onChange={(e) => setFormData({ ...formData, bairro: e.target.value })} placeholder="Bairro" className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>Endereço</span></label>
                            <input type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} placeholder="Rua / Avenida" className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>Número</span></label>
                            <input type="text" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} placeholder="Número" className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300"><span>CEP</span></label>
                            <input type="text" value={formData.cep} onChange={(e) => setFormData({ ...formData, cep: e.target.value })} placeholder="00000-000" className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 border-t border-gray-700 flex-shrink-0">
                {modalType === "usuario" ? (
                  <>
                    <button type="button" onClick={closeModal} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2" disabled={submitLoading}>
                      <X className="w-4 h-4" /><span>Cancelar</span>
                    </button>
                    <button type="submit" disabled={submitLoading} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-pink-500/25">
                      {submitLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Salvando...</span></>) : (<><Save className="w-4 h-4" /><span>{editingItem ? "Atualizar" : "Criar"}</span></>)}
                    </button>
                  </>
                ) : (
                  <>
                    {modalStep === 1 ? (
                      <button type="button" onClick={closeModal} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2" disabled={submitLoading}>
                        <X className="w-4 h-4" /><span>Cancelar</span>
                      </button>
                    ) : (
                      <button type="button" onClick={goToPrevStep} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2" disabled={submitLoading}>
                        <ChevronLeft className="w-4 h-4" /><span>Voltar</span>
                      </button>
                    )}
                    {modalStep < franquiaSteps.length ? (
                      <button type="submit" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-pink-500/25">
                        <span>Próximo</span><ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button type="submit" disabled={submitLoading} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-pink-500/25">
                        {submitLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Salvando...</span></>) : (<><Save className="w-4 h-4" /><span>{editingItem ? "Atualizar" : "Criar"}</span></>)}
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
