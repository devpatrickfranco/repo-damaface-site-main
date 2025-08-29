import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ScrollAnimations from "@/components/ScrollAnimations"
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "DamaFace - Clínica de Estética Facial e Corporal",
    template: "%s | DamaFace",
  },
  description:
    "Especialistas em estética facial e corporal com resultados naturais. Botox, preenchimento, bioestimulador e tratamentos não invasivos.",
  keywords: [
    "estética facial",
    "botox",
    "preenchimento labial",
    "bioestimulador",
    "clínica de estética",
    "tratamentos faciais",
    "procedimentos estéticos",
  ],
  authors: [{ name: "DamaFace" }],
  creator: "DamaFace",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://damaface.com.br",
    siteName: "DamaFace",
    title: "DamaFace - Clínica de Estética Facial e Corporal",
    description: "Especialistas em estética facial e corporal com resultados naturais.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DamaFace - Clínica de Estética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DamaFace - Clínica de Estética Facial e Corporal",
    description: "Especialistas em estética facial e corporal com resultados naturais.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
    generator: 'DamaFace - technology'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="canonical" href="https://damaface.com.br" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.addEventListener('beforeunload', () => {
                window.scrollTo(0, 0);
              });
            `,
          }}
        />
        <div className="min-h-screen bg-black">
          {children}
          <ScrollAnimations />
          <Toaster
          position="top-right"
          toastOptions={{
            // Estilo customizado para combinar com seu design
            style: {
              background: '#1f2937', // gray-800
              color: '#f3f4f6',      // gray-100
              border: '1px solid #374151', // gray-700
            },
            success: {
              style: {
                background: '#065f46', // green-800
                color: '#d1fae5',      // green-100
                border: '1px solid #059669', // green-600
              },
              iconTheme: {
                primary: '#10b981', // green-500
                secondary: '#d1fae5',
              },
            },
            error: {
              style: {
                background: '#7f1d1d', // red-800
                color: '#fee2e2',      // red-100
                border: '1px solid #dc2626', // red-600
              },
              iconTheme: {
                primary: '#ef4444', // red-500
                secondary: '#fee2e2',
              },
            },
            // Duração dos toasts
            duration: 4000,
          }}
        />
        </div>
      </body>
    </html>
  )
}
