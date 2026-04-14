'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// --- Tipagem do SDK da Meta/Facebook ---
declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string
        cookie: boolean
        xfbml: boolean
        version: string
      }) => void
      login: (
        callback: (response: { authResponse?: { code?: string; accessToken?: string }; status: string }) => void,
        options: { response_type: string; config_id: string; override_default_response_type: boolean }
      ) => void
    }
    fbAsyncInit: () => void
  }
}

interface FacebookSDKContextType {
  isSdkLoaded: boolean
}

const FacebookSDKContext = createContext<FacebookSDKContextType>({ isSdkLoaded: false })

export function FacebookSDKProvider({ children }: { children: React.ReactNode }) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)

  useEffect(() => {
    // Evita re-carregamento se o script já existe
    if (document.getElementById('facebook-jssdk')) {
      if (window.FB) setIsSdkLoaded(true)
      return
    }

    // Callback disparado pelo SDK após carregamento
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      })
      setIsSdkLoaded(true)
    }

    // Injeção assíncrona do script
    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/pt_BR/sdk.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      // Cleanup opcional (útil em dev com hot reload)
      const existingScript = document.getElementById('facebook-jssdk')
      if (existingScript) existingScript.remove()
    }
  }, [])

  return (
    <FacebookSDKContext.Provider value={{ isSdkLoaded }}>
      {children}
    </FacebookSDKContext.Provider>
  )
}

export function useFacebookSDK() {
  return useContext(FacebookSDKContext)
}
