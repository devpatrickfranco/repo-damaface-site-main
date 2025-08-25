import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ScrollAnimations from "@/components/ScrollAnimations"
import NextAuthProvider from './components/NextAuthProvider'

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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
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
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
          <ScrollAnimations />
        </div>
      </body>
    </html>
  )
}
