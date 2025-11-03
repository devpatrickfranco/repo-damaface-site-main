"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiBackend } from "@/lib/api-backend"
import { useRouter } from 'next/navigation'

import ComunicadoActions from "./components/ComunicadoActions"
import ComunicadoList from "./components/ComunicadoList"

export default function ComunicadosPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [comunicados, setComunicados] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  const fetchComunicados = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setPageLoading(true)
        console.log("[v0] Buscando comunicados...")
        
        const response = await apiBackend.get("/dashboard/comunicados/")
        let comunicadosData = []
        if (Array.isArray(response)) {
          comunicadosData = response
        } else if (response?.data && Array.isArray(response.data)) {

          comunicadosData = response.data
        } else if (response?.data?.data && Array.isArray(response.data.data)) {

          comunicadosData = response.data.data
          console.log("[v0] Dados estão em response.data.data")
        }
        
        setComunicados(comunicadosData)
      } catch (error) {
        setComunicados([])
      } finally {
        setPageLoading(false)
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/franqueado")
    } else if (isAuthenticated) {
      fetchComunicados()
    }
  }, [isAuthenticated, loading, router, fetchComunicados])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-white">Comunicados</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Mantenha-se atualizado com os últimos comunicados e informações importantes.
            </p>
          </div>

          <ComunicadoActions />

          {pageLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ComunicadoList comunicados={comunicados} onUpdate={fetchComunicados} />
          )}
        </div>
    </div>
  )
}