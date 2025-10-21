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
    // Aqui você pode adicionar a lógica para salvar os dados
    alert("Perfil atualizado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <HeaderFranqueado />
      <Sidebar active="/settings" />

      <main className="pt-16 md:pl-64">
        <div className="p-6 md:p-8">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-dark-solid">Configurações de Perfil</h1>
              <p className="mt-2 text-gray-600">Gerencie suas informações pessoais e preferências</p>
            </div>

            {/* Settings Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark-solid">Informações Pessoais</h2>
                <p className="mt-1 text-sm text-gray-500">Atualize sua foto de perfil, nome e biografia</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center gap-4 pb-6 border-b border-light-gray">
                    <div className="relative">
                      <div className="size-32 rounded-full overflow-hidden ring-4 ring-light-gray bg-gray-100">
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
                    <p className="text-sm text-gray-500">Clique no ícone para alterar sua foto de perfil</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-dark-solid">
                      Nome Completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Digite seu nome completo"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-dark-solid">
                      Biografia
                    </label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                      rows={5}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">{profileData.bio.length} caracteres</p>
                  </div>

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
          </div>
        </div>
      </main>
    </div>
  )
}
