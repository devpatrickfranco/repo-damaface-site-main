"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Camera, Save, Loader2, X, Plus, Trash2, ImagePlus } from "lucide-react"
import { apiBackend, getMediaUrl } from "@/lib/api-backend"
import type { Profile, MinhaFranquia, FaqFranquia, Franquia } from "@/types/users"

const MAX_FOTOS_GALERIA = 5
const MAX_FAQS = 10

const FORMACAO_OPTIONS: { value: string; label: string }[] = [
  { value: "BIOMEDICA_ESTETICA", label: "Biomédica Estética" },
  { value: "FARMACEUTICA_ESTETICA", label: "Farmacêutica Estética" },
  { value: "DENTISTA", label: "Dentista" },
  { value: "DERMATOLOGISTA", label: "Dermatologista" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"perfil" | "franquia">("perfil")

  // --- Estado da aba Franquia ---
  const [minhaFranquia, setMinhaFranquia] = useState<MinhaFranquia | null>(null)
  const [franquiaFetching, setFranquiaFetching] = useState(false)
  const [franquiaDescricao, setFranquiaDescricao] = useState("")
  const [novasFotos, setNovasFotos] = useState<File[]>([])
  const [novasFotosPreview, setNovasFotosPreview] = useState<string[]>([])
  const [faqs, setFaqs] = useState<FaqFranquia[]>([])
  const [franquiaLoading, setFranquiaLoading] = useState(false)
  const [franquiaError, setFranquiaError] = useState<string | null>(null)

  // --- Seletor de franquia (só para SUPERADMIN) ---
  const [listaFranquias, setListaFranquias] = useState<Franquia[]>([])
  const [franquiaSelecionadaId, setFranquiaSelecionadaId] = useState<number | "">("")

  const [profileData, setProfileData] = useState({
    nome: "",
    bio: "",
    telefone: "",
    profissao: "" as "" | "COMERCIAL" | "ESPECIALISTA",
    formacao: "",
    registro: "",
  })

  const [originalData, setOriginalData] = useState({
    nome: "",
    imgProfile: "",
    bio: "",
    telefone: "",
    profissao: "",
    formacao: "",
    registro: "",
  })

  const PHONE_REGEX = /^\d{10,11}$/
  const [phoneError, setPhoneError] = useState(false)
  const [profissaoError, setProfissaoError] = useState<string | null>(null)

  const MAX_NAME_LENGTH = 100
  const MAX_BIO_LENGTH = 500

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const isSuperAdmin = currentUser?.role === "SUPERADMIN"
  const podeVerAbaFranquia = currentUser?.role === "FRANQUEADO" || isSuperAdmin

  useEffect(() => {
    if (currentUser?.role === "FRANQUEADO") {
      fetchMinhaFranquia()
    } else if (isSuperAdmin) {
      fetchListaFranquias()
    }
  }, [currentUser?.role])

  useEffect(() => {
    if (isSuperAdmin && franquiaSelecionadaId) {
      fetchMinhaFranquia(franquiaSelecionadaId)
    } else if (isSuperAdmin) {
      // Nenhuma franquia selecionada ainda: limpa o form da etapa anterior.
      setMinhaFranquia(null)
      setFranquiaDescricao("")
      setFaqs([])
      setNovasFotos([])
      setNovasFotosPreview([])
    }
  }, [franquiaSelecionadaId])

  const fetchListaFranquias = async () => {
    try {
      const data = await apiBackend.get<Franquia[]>("/users/franquias/")
      setListaFranquias(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Erro ao buscar lista de franquias:", err)
      setFranquiaError("Erro ao carregar lista de franquias")
    }
  }

  const fetchMinhaFranquia = async (franquiaId?: number | "") => {
    try {
      setFranquiaFetching(true)
      setFranquiaError(null)
      const query = franquiaId ? `?franquia_id=${franquiaId}` : ""
      const data = await apiBackend.get<MinhaFranquia>(`/users/franquias/minha/${query}`)
      setMinhaFranquia(data)
      setFranquiaDescricao(data.descricao || "")
      setFaqs(data.faqs && data.faqs.length > 0 ? data.faqs : [])
    } catch (err) {
      console.error("Erro ao buscar dados da franquia:", err)
      setFranquiaError("Erro ao carregar dados da unidade")
    } finally {
      setFranquiaFetching(false)
    }
  }

  const fetchUserData = async () => {
    try {
      setFetching(true)
      const userData = await apiBackend.get<Profile>("/users/me/")

      setCurrentUser(userData)
      setProfileData({
        nome: userData.nome || "",
        bio: userData.bio || "",
        telefone: userData.telefone || "",
        profissao: (userData.profissao || "") as "" | "COMERCIAL" | "ESPECIALISTA",
        formacao: userData.formacao || "",
        registro: userData.registro || "",
      })
      setOriginalData({
        nome: userData.nome || "",
        imgProfile: userData.imgProfile || "",
        bio: userData.bio || "",
        telefone: userData.telefone || "",
        profissao: userData.profissao || "",
        formacao: userData.formacao || "",
        registro: userData.registro || "",
      })

      // Define preview com a URL completa do backend
      if (userData.imgProfile) {
        setPreviewImage(getMediaUrl(userData.imgProfile))
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err)
      setError("Erro ao carregar dados do perfil")
    } finally {
      setFetching(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Apenas arquivos de imagem são permitidos")
        return
      }

      setImageFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setImageFile(null)
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    const telefoneRaw = profileData.telefone.replace(/\D/g, "")
    if (telefoneRaw && !PHONE_REGEX.test(telefoneRaw)) {
      setPhoneError(true)
      return
    }
    setPhoneError(false)

    if (profileData.profissao === "ESPECIALISTA" && (!profileData.formacao || !profileData.registro.trim())) {
      setProfissaoError("Informe a formação e o registro profissional (CRM/CRO...).")
      return
    }
    setProfissaoError(null)

    const hasNameChange = profileData.nome.trim() !== originalData.nome.trim()
    const hasBioChange = (profileData.bio || "").trim() !== (originalData.bio || "").trim()
    const hasTelefoneChange = (profileData.telefone || "").trim() !== (originalData.telefone || "").trim()
    const hasImageChange =
      imageFile !== null || (previewImage === null && originalData.imgProfile)
    const hasProfissaoChange =
      profileData.profissao !== originalData.profissao ||
      profileData.formacao !== originalData.formacao ||
      profileData.registro !== originalData.registro

    if (!hasNameChange && !hasImageChange && !hasBioChange && !hasTelefoneChange && !hasProfissaoChange) {
      alert("Nenhuma alteração foi feita")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append("nome", profileData.nome.trim())
      formData.append("bio", profileData.bio.trim())
      formData.append("telefone", profileData.telefone.replace(/\D/g, ""))

      if (currentUser?.role === "FUNCIONARIO") {
        formData.append("profissao", profileData.profissao)
        formData.append("formacao", profileData.profissao === "ESPECIALISTA" ? profileData.formacao : "")
        formData.append("registro", profileData.profissao === "ESPECIALISTA" ? profileData.registro.trim() : "")
      }

      if (imageFile) {
        formData.append("imgProfile", imageFile)
      } else if (previewImage === null && originalData.imgProfile) {
        formData.append("imgProfile", "")
      }

      // Esperar resposta do tipo Profile
      const response = await apiBackend.patch<Profile>(
        `/users/me/`,
        formData,
      )

      setProfileData({
        nome: response.nome,
        bio: response.bio || "",
        telefone: response.telefone || "",
        profissao: (response.profissao || "") as "" | "COMERCIAL" | "ESPECIALISTA",
        formacao: response.formacao || "",
        registro: response.registro || "",
      })
      setOriginalData({
        nome: response.nome,
        imgProfile: response.imgProfile || "",
        bio: response.bio || "",
        telefone: response.telefone || "",
        profissao: response.profissao || "",
        formacao: response.formacao || "",
        registro: response.registro || "",
      })

      if (response.imgProfile) {
        setPreviewImage(getMediaUrl(response.imgProfile))
      } else {
        setPreviewImage(null)
      }

      setImageFile(null)

      alert("Perfil atualizado com sucesso!")
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err)
      setError(err.message || "Erro ao atualizar perfil")
      alert("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const totalFotos = (minhaFranquia?.fotos.length || 0) + novasFotos.length

  const handleAddFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files || [])
    if (arquivos.length === 0) return

    const vagas = MAX_FOTOS_GALERIA - totalFotos
    if (vagas <= 0) {
      setFranquiaError(`Limite de ${MAX_FOTOS_GALERIA} fotos na galeria.`)
      e.target.value = ""
      return
    }

    const selecionados = arquivos.slice(0, vagas)
    for (const file of selecionados) {
      if (file.size > 5 * 1024 * 1024) {
        setFranquiaError("Cada imagem deve ter no máximo 5MB")
        continue
      }
      if (!file.type.startsWith("image/")) {
        setFranquiaError("Apenas arquivos de imagem são permitidos")
        continue
      }
      setNovasFotos((prev) => [...prev, file])
      const reader = new FileReader()
      reader.onloadend = () => setNovasFotosPreview((prev) => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    }
    e.target.value = ""
  }

  const handleRemoveNovaFoto = (index: number) => {
    setNovasFotos((prev) => prev.filter((_, i) => i !== index))
    setNovasFotosPreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveFotoExistente = async (fotoId: number) => {
    if (!confirm("Remover esta foto da galeria?")) return
    try {
      const query = isSuperAdmin && franquiaSelecionadaId ? `?franquia_id=${franquiaSelecionadaId}` : ""
      await apiBackend.delete(`/users/franquias/minha/fotos/${fotoId}/${query}`)
      setMinhaFranquia((prev) => (prev ? { ...prev, fotos: prev.fotos.filter((f) => f.id !== fotoId) } : prev))
    } catch (err) {
      console.error("Erro ao remover foto:", err)
      setFranquiaError("Erro ao remover foto")
    }
  }

  const handleAddFaq = () => {
    if (faqs.length >= MAX_FAQS) {
      setFranquiaError(`Máximo de ${MAX_FAQS} perguntas.`)
      return
    }
    setFaqs((prev) => [...prev, { pergunta: "", resposta: "" }])
  }

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFaqChange = (index: number, campo: "pergunta" | "resposta", valor: string) => {
    setFaqs((prev) => prev.map((faq, i) => (i === index ? { ...faq, [campo]: valor } : faq)))
  }

  const handleFranquiaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFranquiaError(null)

    if (isSuperAdmin && !franquiaSelecionadaId) {
      setFranquiaError("Selecione uma franquia primeiro.")
      return
    }

    try {
      setFranquiaLoading(true)

      const formData = new FormData()
      formData.append("descricao", franquiaDescricao.trim())
      novasFotos.forEach((file) => formData.append("novas_fotos", file))
      const faqsValidas = faqs.filter((f) => f.pergunta.trim() && f.resposta.trim())
      formData.append("faqs_json", JSON.stringify(faqsValidas))

      const query = isSuperAdmin && franquiaSelecionadaId ? `?franquia_id=${franquiaSelecionadaId}` : ""
      const response = await apiBackend.patch<MinhaFranquia>(`/users/franquias/minha/${query}`, formData)

      setMinhaFranquia(response)
      setFranquiaDescricao(response.descricao || "")
      setFaqs(response.faqs || [])
      setNovasFotos([])
      setNovasFotosPreview([])

      alert("Dados da unidade atualizados com sucesso!")
    } catch (err: any) {
      console.error("Erro ao salvar dados da unidade:", err)
      setFranquiaError(err.message || "Erro ao atualizar dados da unidade")
    } finally {
      setFranquiaLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="bg-background">
        <main className="pt-16 lg:ml-64">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background">

      <div className="p-6">
        <div className="max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">
              Configurações
            </h1>
            <p className="mt-2 text-gray-400">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {podeVerAbaFranquia && (
            <div className="mb-6 border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("perfil")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "perfil"
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                    }`}
                >
                  Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("franquia")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "franquia"
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                    }`}
                >
                  Franquia
                </button>
              </nav>
            </div>
          )}

          {activeTab === "perfil" && error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-md text-red-400">
              {error}
            </div>
          )}

          {activeTab === "perfil" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-700">
              <div className="relative group">
                <div className="size-32 rounded-full overflow-hidden ring-4 ring-gray-700 bg-gray-700">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={profileData.nome}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        const fallback =
                          e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) fallback.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div
                    className={`${previewImage ? "hidden" : ""
                      } size-full bg-brand-pink text-white flex items-center justify-center text-3xl font-medium`}
                  >
                    {profileData.nome
                      ? profileData.nome.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-brand-pink text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Camera className="size-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                    title="Remover imagem"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Clique no ícone para alterar sua foto de perfil
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tamanho máximo: 5MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={currentUser?.email || ""}
                disabled
                className="w-full h-10 px-3 text-gray-400 rounded-md bg-gray-800 border border-gray-700 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-500">
                O email não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="franquia"
                className="block text-sm font-medium text-gray-300"
              >
                Unidade
              </label>
              <input
                id="franquia"
                type="text"
                value={currentUser?.franquia_nome || "Franqueadora"}
                disabled
                className="w-full h-10 px-3 text-gray-400 rounded-md bg-gray-800 border border-gray-700 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-500">
                A franquia não pode ser alterada
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nome Completo
                </label>
                <span className="text-xs text-gray-500">
                  {profileData.nome.length} / {MAX_NAME_LENGTH}
                </span>
              </div>
              <input
                id="name"
                type="text"
                value={profileData.nome}
                onChange={(e) =>
                  setProfileData({ ...profileData, nome: e.target.value })
                }
                placeholder="Digite seu nome completo"
                className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                required
                maxLength={MAX_NAME_LENGTH}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-300"
              >
                Biografia
              </label>
              <textarea
                id="bio"
                rows={4}
                value={profileData.bio || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                placeholder="Fale um pouco sobre você..."
                className="w-full p-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                maxLength={MAX_BIO_LENGTH} // Mantenha o maxLength
              />
              {/* --- TEXTO DE AJUDA MODIFICADO COM CONTADOR --- */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Esta biografia será exibida em seu perfil (opcional)
                </span>
                <span>
                  {(profileData.bio || "").length} / {MAX_BIO_LENGTH}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-300"
              >
                Telefone
              </label>
              <input
                id="telefone"
                type="tel"
                value={profileData.telefone}
                onChange={(e) => {
                  setProfileData({ ...profileData, telefone: e.target.value })
                  setPhoneError(false)
                }}
                placeholder="Ex: 11999998888"
                className={`w-full h-10 px-3 text-white rounded-md bg-gray-900 border ${phoneError ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-brand-pink focus:border-brand-pink"
                  } focus:outline-none focus:ring-2 text-sm placeholder-gray-500`}
                maxLength={15}
              />
              {phoneError && (
                <p className="text-xs text-red-500">
                  Número inválido. Use o formato DDD + número (ex: 11999998888).
                </p>
              )}
              <p className="text-xs text-red-400">
                Garanta que seu telefone esteja correto, ele será usado em casos de suporte.
              </p>
            </div>

            {currentUser?.role === "FUNCIONARIO" && (
              <div className="space-y-4 rounded-md border border-gray-800 p-4">
                <div className="space-y-2">
                  <label
                    htmlFor="profissao"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Profissão
                  </label>
                  <select
                    id="profissao"
                    value={profileData.profissao}
                    onChange={(e) => {
                      const profissao = e.target.value as "" | "COMERCIAL" | "ESPECIALISTA"
                      setProfileData({
                        ...profileData,
                        profissao,
                        ...(profissao !== "ESPECIALISTA" ? { formacao: "", registro: "" } : {}),
                      })
                      setProfissaoError(null)
                    }}
                    className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="COMERCIAL">Comercial</option>
                    <option value="ESPECIALISTA">Especialista</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Usada na exibição da equipe na página da sua unidade.
                  </p>
                </div>

                {profileData.profissao === "ESPECIALISTA" && (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="formacao"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Formação
                      </label>
                      <select
                        id="formacao"
                        value={profileData.formacao}
                        onChange={(e) => {
                          setProfileData({ ...profileData, formacao: e.target.value })
                          setProfissaoError(null)
                        }}
                        className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm"
                      >
                        <option value="">Selecione...</option>
                        {FORMACAO_OPTIONS.map((opcao) => (
                          <option key={opcao.value} value={opcao.value}>
                            {opcao.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="registro"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Registro profissional
                      </label>
                      <input
                        id="registro"
                        type="text"
                        value={profileData.registro}
                        onChange={(e) => {
                          setProfileData({ ...profileData, registro: e.target.value })
                          setProfissaoError(null)
                        }}
                        placeholder="Ex: CRM 123456, CRO 12345..."
                        className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                      />
                    </div>
                  </>
                )}

                {profissaoError && (
                  <p className="text-xs text-red-500">{profissaoError}</p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-medium px-8 py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
          )}

          {activeTab === "franquia" && (
            <>
              {franquiaError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-md text-red-400">
                  {franquiaError}
                </div>
              )}

              {isSuperAdmin && (
                <div className="mb-6 space-y-2">
                  <label htmlFor="franquia-select" className="block text-sm font-medium text-gray-300">
                    Franquia
                  </label>
                  <select
                    id="franquia-select"
                    value={franquiaSelecionadaId}
                    onChange={(e) => setFranquiaSelecionadaId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm"
                  >
                    <option value="">Selecione uma franquia...</option>
                    {listaFranquias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Como superadmin, você vê e edita a mesma tela que o franqueado dessa unidade acessa.
                  </p>
                </div>
              )}

              {isSuperAdmin && !franquiaSelecionadaId ? (
                <p className="text-sm text-gray-400 py-8 text-center">
                  Selecione uma franquia acima para ver e editar as informações.
                </p>
              ) : franquiaFetching ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
                </div>
              ) : (
                <form onSubmit={handleFranquiaSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="franquia-descricao" className="block text-sm font-medium text-gray-300">
                      Texto que simboliza a unidade
                    </label>
                    <textarea
                      id="franquia-descricao"
                      rows={3}
                      value={franquiaDescricao}
                      onChange={(e) => setFranquiaDescricao(e.target.value)}
                      placeholder={`Fale um pouco sobre a Damaface ${minhaFranquia?.nome || ""}...`}
                      className="w-full p-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-500">
                      Esse texto aparece na página pública da unidade
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-sm font-medium text-gray-300">
                        Fotos da clínica
                      </label>
                      <span className="text-xs text-gray-500">
                        {totalFotos} / {MAX_FOTOS_GALERIA}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Recepção, salas de atendimento, café... até {MAX_FOTOS_GALERIA} fotos.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {minhaFranquia?.fotos.map((foto) => (
                        <div key={foto.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-800 group">
                          <img src={getMediaUrl(foto.imagem)} alt="Foto da clínica" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveFotoExistente(foto.id)}
                            className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remover foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {novasFotosPreview.map((preview, index) => (
                        <div key={`nova-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-brand-pink/50 bg-gray-800 group">
                          <img src={preview} alt="Nova foto" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNovaFoto(index)}
                            className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remover foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {totalFotos < MAX_FOTOS_GALERIA && (
                        <label
                          htmlFor="galeria-upload"
                          className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 hover:bg-gray-800 hover:border-pink-500/50 cursor-pointer transition-colors"
                        >
                          <ImagePlus className="w-5 h-5 text-gray-500" />
                          <input
                            id="galeria-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleAddFotos}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-sm font-medium text-gray-300">
                        Perguntas frequentes
                      </label>
                      <span className="text-xs text-gray-500">
                        {faqs.length} / {MAX_FAQS}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Adicione as perguntas mais frequentes que você recebe em {minhaFranquia?.nome || "sua unidade"}
                    </p>

                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div key={index} className="bg-gray-900 border border-gray-700 rounded-md p-4 space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-400"
                            title="Remover pergunta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="space-y-1 pr-8">
                            <label className="block text-xs font-medium text-gray-400">Pergunta</label>
                            <input
                              type="text"
                              value={faq.pergunta}
                              onChange={(e) => handleFaqChange(index, "pergunta", e.target.value)}
                              placeholder="Ex: Vocês atendem aos sábados?"
                              className="w-full h-10 px-3 text-white rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-400">Resposta</label>
                            <textarea
                              rows={2}
                              value={faq.resposta}
                              onChange={(e) => handleFaqChange(index, "resposta", e.target.value)}
                              placeholder="Digite a resposta..."
                              className="w-full p-3 text-white rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {faqs.length < MAX_FAQS && (
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="flex items-center gap-2 text-sm text-brand-pink hover:text-brand-pink/80 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar pergunta
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={franquiaLoading}
                      className="flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-medium px-8 py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {franquiaLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}