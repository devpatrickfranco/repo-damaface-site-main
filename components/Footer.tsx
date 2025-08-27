'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Botox', href: '/facial/botox' },
    { name: 'Preenchimento Labial', href: '/facial/preenchimento-labial' },
    { name: 'Bioestimulador', href: '/facial/bioestimulador' },
    { name: 'Criolipólise', href: '/corporal/criolipolise' },
    { name: 'Limpeza de Pele', href: '/nao-invasivos/limpeza-de-pele' },
    { name: 'Peeling Químico', href: '/nao-invasivos/peeling-quimico' }
  ];

  const services = [
    { name: 'Tratamentos Faciais', href: '/facial' },
    { name: 'Tratamentos Corporais', href: '/corporal' },
    { name: 'Procedimentos Não Invasivos', href: '/nao-invasivos' },
    { name: 'Seja um Franqueado', href: 'https://franquia.damaface.com.br/' }
  ];

  const company = [
    // { name: 'Blog', href: '/blog' },
    // { name: 'Sobre Nós', href: '/sobre' },
    // { name: 'Contato', href: '/contato' },
    { name: 'Política de Privacidade', href: '/privacidade' }
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="http://damaface.com.br/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png"
                alt="DamaFace"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Especialistas em estética facial e corporal, oferecendo tratamentos 
              personalizados com resultados naturais e duradouros. Tecnologia de 
              ponta e profissionais certificados para sua segurança e satisfação.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-brand-pink" />
                <span>(19) 99553-4809</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-brand-pink" />
                <span>contato@damaface.com.br</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-pink mt-0.5" />
                <span>R. Gustavo Ambrust, 36 <br />Nova Campinas - Campinas/SP<br />CEP: 13092-106</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://instagram.com/damafacefranquias"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/profile.php?id=61555121465049"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Procedimentos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Serviços</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3 mb-6">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Business Hours */}
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">Horários</h4>
              <div className="text-gray-400 text-xs space-y-1">
                <p>Seg - Sex: 9h às 18h</p>
                <p>Sábado: 9h às 14h</p>
                <p className="text-brand-pink">Domingo: Fechado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-3">Receba nossas novidades</h3>
            <p className="text-gray-400 text-sm mb-4">
              Dicas exclusivas de beleza e promoções especiais direto no seu e-mail
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-pink transition-colors"
              />
              <button className="bg-brand-pink hover:bg-brand-pink/90 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>
              © 2025 DamaFace Clínica de Estética. Todos os direitos reservados.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/termos" className="hover:text-brand-pink transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-brand-pink transition-colors">
                Política de Privacidade
              </Link>
              <span>CNPJ: 00.000.000/0001-00</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
