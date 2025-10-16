'use client';

import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import HeaderFranqueado from '../components/HeaderFranqueado';
 
const Develop = () => {
  return (
    <>
      <HeaderFranqueado />

      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden ml-64">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-pink/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Animated 404 */}
            <div className="mb-8 animate-on-scroll">
              <div className="relative inline-block">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-purple-400 to-brand-pink animate-pulse">
                  Em desenvolvimento
                </h1>
                <div className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-black text-brand-pink/20 blur-sm">
                  Em desenvolvimento
                </div>
              </div>
            </div>

            {/* Warning Icon with Animation */}
            <div className="flex justify-center mb-6 animate-bounce">
              <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center border-2 border-brand-pink/40">
                <AlertTriangle className="w-8 h-8 text-brand-pink" />
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-12 animate-on-scroll space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">Página</span>{' '}
                <span className="text-brand-pink">Não Encontrada</span>
              </h2>
              
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Ops! A página que você está procurando não foi encontrada. 
                Ela pode ter sido movida, removida ou você digitou o endereço incorretamente.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
              
              {/* Home Card */}
              <Link 
                href="/" 
                className="card-dark group cursor-pointer animate-on-scroll hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 p-6">
                  <div className="w-12 h-12 bg-brand-pink/20 rounded-full flex items-center justify-center group-hover:bg-brand-pink/30 transition-colors">
                    <Home className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-pink transition-colors">
                      Voltar ao Início
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Retorne à página principal
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-brand-pink group-hover:-translate-x-1 transition-all ml-auto" />
                </div>
              </Link>
            </div>

            {/* CTA Button */}
            <div className="mt-12 animate-on-scroll">
              <Link href="/" className="btn-primary">
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Develop;