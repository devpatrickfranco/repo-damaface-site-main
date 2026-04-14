'use client'

import { FacebookSDKProvider } from './components/FacebookSDKProvider'

export default function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FacebookSDKProvider>
      {children}
    </FacebookSDKProvider>
  )
}
