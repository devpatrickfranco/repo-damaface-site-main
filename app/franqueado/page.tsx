'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Link } from 'lucide-react';

import Image from 'next/image';

export default function FranqueadoPage() {
    const { isAuthenticated, loading, login } = useAuth(); // Pegue o login aqui também
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Efeito para redirecionar se já estiver logado
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/franqueado/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return null; 
    }

    if (isAuthenticated) {
        return null;
    }


  // Função para determinar a saudação baseada no horário
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      return 'Bom dia!';
    } else if (hour >= 12 && hour < 19) {
      return 'Boa tarde!';
    } else {
      return 'Boa noite!';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/franqueado/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-base text-white">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md card-dark p-8 rounded-2xl shadow-lg">
          {/* Greeting */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
              {getGreeting()}
            </h1>
            <p className="text-gray-400">Seja bem-vindo(a)</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Usuário
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                className="w-full px-4 py-3 rounded-lg bg-dark-solid border border-gray-700 focus:ring-2 focus:ring-brand-pink outline-none text-white"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-dark-solid border border-gray-700 focus:ring-2 focus:ring-brand-pink outline-none text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-pink"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Entrar
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <a href="/franqueado/reset_password" className="text-brand-pink hover:underline font-medium">
                Esqueci minha senha
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Gif */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-gray-900/40">
        <div className="relative w-full max-w-lg animate-fade-up">
          <Image
            src="/login-security.gif"
            alt="Login animado"
            width={600}
            height={600}
            className="rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
