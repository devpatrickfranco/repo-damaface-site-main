'use client'

import { useState } from 'react'
import { apiBackend } from '@/lib/api-backend'

/**
 * Tipos de dados para o hook de download
 */
type DriveFile = {
    id: number
    nome: string
    arquivo_url: string
}

type DriveFolder = {
    id: number
    nome: string
}

/**
 * Estados retornados pelo hook
 */
type UseFileDownloadReturn = {
    download: (files: DriveFile[], currentFolder?: DriveFolder | null) => Promise<void>
    isDownloading: boolean
    error: string | null
}

/**
 * Payload enviado para o backend Django
 */
type DownloadZipPayload = {
    folder_name: string
    files: Array<{
        path: string
        name: string
    }>
}

/**
 * Hook reutilizável para download de arquivos do módulo de marketing
 * 
 * Funcionalidades:
 * - Download direto de arquivo único (forçado via Blob)
 * - Download de múltiplos arquivos como ZIP via backend Django
 * - Nomeação automática do ZIP baseada na pasta atual
 * 
 * @example
 * ```tsx
 * const { download, isDownloading, error } = useFileDownload()
 * 
 * // Download de arquivo único
 * await download([file])
 * 
 * // Download de múltiplos arquivos
 * await download([file1, file2, file3], currentFolder)
 * ```
 */
export function useFileDownload(): UseFileDownloadReturn {
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Realiza o download de um único arquivo
     * Faz fetch direto na URL, converte para Blob e força o download
     */
    const downloadSingleFile = async (file: DriveFile): Promise<void> => {
        try {
            // Resolve URL completa do arquivo (GET não precisa de CSRF)
            const fileUrl = file.arquivo_url.startsWith('http')
                ? file.arquivo_url
                : `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${file.arquivo_url}`

            const response = await fetch(fileUrl)

            if (!response.ok) {
                throw new Error(`Erro ao baixar arquivo: ${response.statusText}`)
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = file.nome
            link.style.display = 'none'

            document.body.appendChild(link)
            link.click()

            // Limpeza
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            throw new Error(
                err instanceof Error
                    ? `Falha no download: ${err.message}`
                    : 'Erro desconhecido ao baixar arquivo'
            )
        }
    }

    /**
     * Realiza o download de múltiplos arquivos como ZIP
     * Envia requisição POST para o backend Django que gera o ZIP
     * Usa apiBackend para incluir CSRF token automaticamente
     */
    const downloadMultipleFilesAsZip = async (
        files: DriveFile[],
        currentFolder?: DriveFolder | null
    ): Promise<void> => {
        try {
            const folderName = currentFolder?.nome || 'arquivos'

            const payload: DownloadZipPayload = {
                folder_name: folderName,
                files: files.map(file => ({
                    path: file.arquivo_url,
                    name: file.nome
                }))
            }

            // Usa apiBackend.request para ter CSRF token
            const response = await apiBackend.request<Blob>('/marketing/drive/download-zip/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            // A resposta já é um Blob (apiBackend trata isso)
            // Mas precisamos fazer fetch manual para pegar o blob corretamente
            // Vamos usar uma abordagem diferente

            // Fazer requisição manual com CSRF do apiBackend
            const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL
            const csrfToken = getCsrfToken()

            const fetchResponse = await fetch(`${BASE_URL}/marketing/drive/download-zip/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken || '',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            if (!fetchResponse.ok) {
                throw new Error(`Erro ao gerar ZIP: ${fetchResponse.statusText}`)
            }

            const blob = await fetchResponse.blob()

            // Verifica se realmente recebeu um ZIP
            if (blob.type !== 'application/zip' && !blob.type.includes('zip')) {
                console.warn('Tipo de resposta inesperado:', blob.type)
            }

            const url = window.URL.createObjectURL(blob)
            const zipFileName = `${folderName}.zip`

            const link = document.createElement('a')
            link.href = url
            link.download = zipFileName
            link.style.display = 'none'

            document.body.appendChild(link)
            link.click()

            // Limpeza
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            throw new Error(
                err instanceof Error
                    ? `Falha ao gerar ZIP: ${err.message}`
                    : 'Erro desconhecido ao gerar ZIP'
            )
        }
    }

    /**
     * Função principal de download
     * Decide entre download único ou múltiplo baseado na quantidade de arquivos
     */
    const download = async (
        files: DriveFile[],
        currentFolder?: DriveFolder | null
    ): Promise<void> => {
        // Validação de entrada
        if (!files || files.length === 0) {
            setError('Nenhum arquivo selecionado para download')
            return
        }

        setIsDownloading(true)
        setError(null)

        try {
            if (files.length === 1) {
                // Download direto de arquivo único
                await downloadSingleFile(files[0])
            } else {
                // Download de múltiplos arquivos como ZIP
                await downloadMultipleFilesAsZip(files, currentFolder)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar download'
            setError(errorMessage)
            console.error('Erro no download:', err)
        } finally {
            setIsDownloading(false)
        }
    }

    return {
        download,
        isDownloading,
        error
    }
}

/**
 * Função auxiliar para extrair o CSRF token dos cookies
 */
function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null

    const cookies = document.cookie.split('; ')
    const csrfCookie = cookies.find(row => row.startsWith('csrftoken='))

    if (!csrfCookie) {
        return null
    }

    const token = csrfCookie.split('=')[1]
    return token
}
