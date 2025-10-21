"use client"

import type React from "react"
import { useState } from "react"
import HeaderFranqueado from "@/app/franqueado/components/HeaderFranqueado"
import Sidebar from "@/app/franqueado/components/Sidebar"
import { Camera, Save } from "lucide-react"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Maria Silva",
    bio: "Especialista em estética facial com mais de 10 anos de experiência. Apaixonada por realçar a beleza natural de cada cliente.",
    avatar: "/placeholder-user.jpg",
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados salvos:", profileData)
    alert("Perfil atualizado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderFranqueado />
      <Sidebar active="/settings" />

      <main className="pt-16 lg:ml-64">
        {/* 1. Padding da página ajustado para p-6 (como no Dashboard) */}
        <div className="p-6">
          {/* 2. Removido 'mx-auto' para alinhar à esquerda, mantido 'max-w-3xl' para o formulário não ficar muito largo */}
          <div className="max-w-3xl">
            {/* Cabeçalho da Página (Mantido) */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Configurações de Perfil</h1>
              <p className="mt-2 text-gray-400">Gerencie suas informações pessoais e preferências</p>
            </div>

            {/* 3. O 'div' do card (bg-gray-800, border) foi REMOVIDO */}
            {/* 4. O 'div' do cabeçalho do card (Informações Pessoais) foi REMOVIDO */}

            {/* 5. O 'div' de padding 'p-6' do corpo do card foi REMOVIDO */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seção do Avatar */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-700">
                <div className="relative">
                  <div className="size-32 rounded-full overflow-hidden ring-4 ring-gray-700 bg-gray-700">
                    <img
                      src={previewImage || profileData.avatar}
                      alt={profileData.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                    <div className="hidden size-full bg-brand-pink text-white flex items-center justify-center text-3xl font-medium">
                      {profileData.name.charAt(0)}
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
                </div>
                <p className="text-sm text-gray-400">Clique no ícone para alterar sua foto de perfil</p>
              </div>

              {/* Campo Nome */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Digite seu nome completo"
                  className="w-full h-10 px-3 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm placeholder-gray-500"
                />
              </div>

              {/* Campo Biografia */}
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                  Biografia
                </label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você..."
                  rows={5}
                  className="w-full px-3 py-2 text-white rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm resize-none placeholder-gray-500"
                />
                <p className="text-xs text-gray-400">{profileData.bio.length} caracteres</p>
              </div>

              {/* Botão Salvar */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-medium px-8 py-2.5 rounded-md transition-colors"
                >
                  <Save className="size-4" />
                  Salvar Alterações
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </main>
    </div>
  )
}