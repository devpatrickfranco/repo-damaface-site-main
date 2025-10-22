"use client"

import type React from "react"
import { useState, useEffect } from "react"
import HeaderFranqueado from "@/app/franqueado/components/HeaderFranqueado"
import Sidebar from "@/app/franqueado/components/Sidebar"
import { Camera, Save, Loader2, X } from "lucide-react"
import { apiBackend } from "@/lib/api-backend"
import type { Usuario } from "@/types/users"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    nome: "",
  })
  
  const [originalData, setOriginalData] = useState({
    nome: "",
    imgProfile: "",
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<Usuario   | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setFetching(true)
      const userData = await apiBackend.get<Usuario >("/users/me/")
      
      setCurrentUser(userData)
      setProfileData({
        nome: userData.nome || "",
      })
      setOriginalData({
        nome: userData.nome || "",
        imgProfile: userData.imgProfile || "",
      })
      
      // Define preview com a URL completa do backend
      if (userData.imgProfile) {
        const imageUrl = userData.imgProfile.startsWith('http') 
          ? userData.imgProfile 
          : `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${userData.imgProfile}`
        setPreviewImage(imageUrl)
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
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) return

    const hasNameChange = profileData.nome !== originalData.nome
    const hasImageChange = imageFile !== null || (previewImage === null && originalData.imgProfile)

    if (!hasNameChange && !hasImageChange) {
      alert("Nenhuma alteração foi feita")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('nome', profileData.nome.trim())
      
      if (imageFile) {
        formData.append('imgProfile', imageFile)
      } else if (previewImage === null && originalData.imgProfile) {
        formData.append('imgProfile', '')
      }

      const response = await apiBackend.patch<Usuario >(
        `/users/me/`,
        formData
      )

      setProfileData({
        nome: response.nome,
      })
      setOriginalData({
        nome: response.nome,
        imgProfile: response.imgProfile || "",
      })
      
      if (response.imgProfile) {
        const imageUrl = response.imgProfile.startsWith('http') 
          ? response.imgProfile 
          : `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${response.imgProfile}`
        setPreviewImage(imageUrl)
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

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderFranqueado />
        <Sidebar active="/settings" />
        <main className="pt-16 lg:ml-64">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderFranqueado />
      <Sidebar active="/settings" />

      <main className="pt-16 lg:ml-64">
        <div className="p-6">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Configurações de Perfil</h1>
              <p className="mt-2 text-gray-400">Gerencie suas informações pessoais e preferências</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-md text-red-400">
                {error}
              </div>
            )}

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
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div 
                      className={`${previewImage ? "hidden" : ""} size-full bg-brand-pink text-white flex items-center justify-center text-3xl font-medium`}
                    >
                      {profileData.nome ? profileData.nome.charAt(0).toUpperCase() : "U"}
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
                  <p className="text-sm text-gray-400">Clique no ícone para alterar sua foto de perfil</p>
                  <p className="text-xs text-gray-500 mt-1">Tamanho máximo: 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full h-10 px-3 text-gray-400 rounded-md bg-gray-800 border border-gray-700 cursor-not-allowed text-sm"
                />
                <p className="text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={profileData.nome}
                  onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                  placeholder="Digite seu nome completo"
                  className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                  required
                />
              </div>

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
          </div>
        </div>
      </main>
    </div>
  )
}