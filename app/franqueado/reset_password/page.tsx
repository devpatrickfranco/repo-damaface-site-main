'use client';

import { useState, FormEvent } from 'react';
import { ArrowLeft, Mail, Shield, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { apiBackend } from '@/lib/api-backend';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validação de senha forte
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Envio do email com o código de verificação
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {

      
      const response = await apiBackend.post<{ success: boolean; message: string }>(
        '/users/password-reset/request/',
        { email }
      );
      
      setSuccess(response?.message || 'Código enviado com sucesso!');
      
      // Aguarda 2 segundos para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        setCurrentStep(2);
        setSuccess('');
      }, 2000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao enviar email. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verificação do código
  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      
      const response = await apiBackend.post<{ success: boolean; message: string }>(
        '/users/password-reset/verify/',
        { email, code }
      );
      
      setSuccess(response?.message || 'Código verificado!');
      
      setTimeout(() => {
        setCurrentStep(3);
        setSuccess('');
      }, 1500);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Código inválido ou expirado. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset de senha
  const handlePasswordSubmit = async (e: FormEvent) => {    
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (!isPasswordValid) {
      setError('A senha não atende aos critérios de segurança');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      
      const response = await apiBackend.post<{ success: boolean; message: string }>(
        '/users/password-reset/set-new/',
        {
          email,
          code,
          password: newPassword,
          password_confirm: confirmPassword,
        }
      );
      
      setSuccess(response?.message || 'Senha redefinida com sucesso!');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/franqueado?reset=success');
      }, 2000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.password?.[0] || 
                          err.response?.data?.error || 
                          'Erro ao redefinir senha. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reenviar Código
  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      
      const response = await apiBackend.post<{ success: boolean; message: string }>(
        '/users/password-reset/request/',
        { email }
      );
      
      setSuccess('Código reenviado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao reenviar o código.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: Mail,
          title: 'Redefinir Senha',
          subtitle: 'Digite seu email para receber o código de verificação',
          form: (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-dark-light focus:ring-2 focus:ring-brand focus:border-brand text-black placeholder:text-gray-500 outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
          )
        };

      case 2:
        return {
          icon: Shield,
          title: 'Verificar Email',
          subtitle: `Enviamos um código de 6 dígitos para ${email}`,
          form: (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Código de Verificação
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg bg-dark border border-dark-light focus:ring-2 focus:ring-brand text-black placeholder:text-gray-500 outline-none disabled:opacity-50"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Não recebeu o código?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-brand hover:underline disabled:opacity-50"
                  >
                    Reenviar
                  </button>
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>
            </form>
          )
        };

      case 3:
        return {
          icon: Lock,
          title: 'Nova Senha',
          subtitle: 'Digite sua nova senha',
          form: (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-dark border border-dark-light focus:ring-2 focus:ring-brand text-black placeholder:text-gray-500 outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-light disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-dark border border-dark-light focus:ring-2 focus:ring-brand text-black placeholder:text-gray-500 outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-light disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <div className="mt-4 p-4 rounded-lg card-dark">
                  <h4 className="text-sm font-medium text-light mb-3">Critérios da senha:</h4>
                  <div className="space-y-2 text-xs">
                    <p className={passwordValidation.minLength ? 'text-green-500' : 'text-red-500'}>
                      • Pelo menos 8 caracteres
                    </p>
                    <p className={passwordValidation.hasUppercase ? 'text-green-500' : 'text-red-500'}>
                      • 1 letra maiúscula
                    </p>
                    <p className={passwordValidation.hasLowercase ? 'text-green-500' : 'text-red-500'}>
                      • 1 letra minúscula
                    </p>
                    <p className={passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'}>
                      • 1 número
                    </p>
                    <p className={passwordValidation.hasSpecialChar ? 'text-green-500' : 'text-red-500'}>
                      • 1 caractere especial (!, @, #, $...)
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </form>
          )
        };

      default:
        return null;
    }
  };

  const stepContent = getStepContent();
  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-dark-light z-50">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-16">
        <div className="w-full max-w-md card-dark p-8 rounded-2xl">
          <div className="mb-8">
            <Link
              href="/franqueado"
              className="inline-flex items-center space-x-2 text-light hover:text-brand"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Login</span>
            </Link>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center">
              {stepContent && <stepContent.icon className="w-6 h-6 text-brand" />}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-light mb-2">
              {stepContent?.title}
            </h1>
            <p className="text-gray-400">{stepContent?.subtitle}</p>
          </div>

          {stepContent?.form}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-brand' : 'bg-dark-light'
                }`}
              />
            ))}
          </div>
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