import "./globals.css"

import ScrollAnimations from "@/components/ScrollAnimations"

import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/context/AuthContext"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.damaface.com.br"),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "Damaface - Clínica de Estética Facial e Corporal",
    template: "%s | Damaface",
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

  authors: [{ name: "Damaface" }],

  creator: "Damaface",

  generator: "Damaface - technology",

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.damaface.com.br",
    siteName: "Damaface",
    title: "Damaface - Clínica de Estética Facial e Corporal",
    description:
      "Especialistas em estética facial e corporal com resultados naturais.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Damaface - Clínica de Estética",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Damaface - Clínica de Estética Facial e Corporal",
    description:
      "Especialistas em estética facial e corporal com resultados naturais.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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

        <AuthProvider>
          <div className="min-h-screen bg-black">
            {children}

            <ScrollAnimations />

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1f2937",
                  color: "#f3f4f6",
                  border: "1px solid #374151",
                },

                success: {
                  style: {
                    background: "#065f46",
                    color: "#d1fae5",
                    border: "1px solid #059669",
                  },

                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#d1fae5",
                  },
                },

                error: {
                  style: {
                    background: "#7f1d1d",
                    color: "#fee2e2",
                    border: "1px solid #dc2626",
                  },

                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fee2e2",
                  },
                },

                duration: 4000,
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}