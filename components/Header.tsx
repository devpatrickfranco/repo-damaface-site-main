"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import logoDamaFace from '/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'

import { Menu, X, Phone, Users } from "lucide-react"
import { CtaButtonWhatsapp } from "./CtaButtonWhatsapp"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Facial", href: "/facial" },
    { name: "Corporal", href: "/corporal" },
    { name: "Não Invasivos", href: "/nao-invasivos" },
    { name: "Franquia", href: "https://franquia.damaface.com.br/" },
    { name: "Blog", href: "/blog" },
    // { name: "Contato", href: "/contato" },
  ]

  const handleWhatsAppClick = () => {
    window.open("https://typebot.damaface.com.br/agendar", "_self")
  }

  const handleFranchiseClick = () => {
    window.open("https://franquia.damaface.com.br/", "_blank")
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/20 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-10 mr-2" onClick={handleNavClick}>
            <Image
              src={logoDamaFace}
              alt="DamaFace"
              width={150}
              height={50}
              className="h-10 w-auto transition-all duration-300 hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-white font-medium px-3 py-1 rounded-md transition-all duration-300 hover:text-brand-pink group"
                onClick={handleNavClick}
              >
                {item.name}
                <span className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <CtaButtonWhatsapp />
            <button
              onClick={handleFranchiseClick}
              className="relative flex items-center space-x-2 bg-brand-pink text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 overflow-hidden group hover:shadow-lg hover:shadow-brand-pink/25 min-h-[40px] h-12"
              style={{ fontSize: "1rem" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
              <Users className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10">Seja Franqueado</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10">
            <nav className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white hover:text-brand-pink font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/5"
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}

              <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    handleWhatsAppClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-600/25"
                >
                  <Phone className="w-4 h-4" />
                  <span>Avaliação WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    handleFranchiseClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-brand-pink/25"
                >
                  <Users className="w-4 h-4" />
                  <span>Seja Franqueado</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
