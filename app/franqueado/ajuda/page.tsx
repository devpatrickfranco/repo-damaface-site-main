'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useSessionId } from './useSessionId';

import { Send, Sparkles, MessageCircle, FileText, Users, GraduationCap, ArrowLeft, RotateCcw, Plus, Image as ImageIcon, X, Flame } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}



const AIHelpPage = () => {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()
  const { sessionId, resetSession } = useSessionId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageGenerationMode, setImageGenerationMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, loading, router])

  const suggestedQuestions = [
    {
      icon: GraduationCap,
      text: 'Como encontrar o curso de POPs?',
      category: 'Academy'
    },
    {
      icon: Users,
      text: 'Quem é responsável por chamados de Marketing?',
      category: 'Suporte'
    },
    {
      icon: FileText,
      text: 'Como solicitar compras de produtos?',
      category: 'Compras'
    },
    {
      icon: MessageCircle,
      text: 'Onde encontro os comunicados recentes?',
      category: 'Comunicados'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n-n8n.i4khe5.easypanel.host/webhook/ajuda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId: sessionId,
          userName: user?.nome
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar resposta');
      }

      const responseText = await response.text();
      const contentType = response.headers.get('content-type') || '';

      let messageContent: string;

      // Verifica se a resposta é JSON
      if (contentType.includes('application/json')) {
        try {
          const data = JSON.parse(responseText);
          messageContent = data.output || data.message || responseText;
        } catch (parseError) {
          // Se falhar o parse mas o content-type é JSON, usa o texto como fallback
          messageContent = responseText.trim() || 'Desculpe, não consegui processar sua pergunta.';
        }
      } else {
        // Resposta é texto HTML ou texto simples - usa diretamente
        messageContent = responseText.trim() || 'Desculpe, não consegui processar sua pergunta.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: messageContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
          role: 'assistant',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    resetSession();
    setMessages([]);
    setImageGenerationMode(false); // Reset badge
  };

  return (
    <div className=" bg-gray-900 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/franqueado/dashboard'}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
              <div className="p-2 bg-brand-pink/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-brand-pink" />
              </div>
              <h1 className="text-3xl font-bold text-white">Central de Ajuda</h1>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewConversation}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-brand-pink/50 rounded-lg transition-all duration-200 group"
              >
                <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-brand-pink transition-colors" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Nova Conversa</span>
              </button>
            )}
          </div>
          <p className="text-gray-400 text-sm ml-14">
            Assistente inteligente para ajudar você a navegar pelo sistema DamaFace
          </p>
        </div>

        {/* Conteúdo principal */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="text-center space-y-3 mb-8">
              <div className="w-20 h-20 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-brand-pink" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Como posso ajudar você hoje?
              </h2>
              <p className="text-gray-400 max-w-md">
                Faça perguntas sobre cursos, procedimentos, responsáveis ou qualquer dúvida sobre o sistema
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question.text)}
                  className="group p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-brand-pink/50 rounded-lg transition-all duration-200 text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-700 group-hover:bg-brand-pink/20 rounded-lg transition-colors">
                      <question.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-pink transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-brand-pink font-medium mb-1">
                        {question.category}
                      </div>
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {question.text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                >
                  <div
                    className={`max-w-[80%] ${message.role === 'user'
                      ? 'bg-brand-pink text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                      } rounded-2xl px-5 py-3 shadow-lg`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-brand-pink" />
                        <span className="text-xs font-medium text-brand-pink">Help</span>
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-up">
                <div className="max-w-[80%] bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-brand-pink" />
                    <span className="text-xs font-medium text-brand-pink">Help</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Barra inferior */}
        <div className="sticky bottom-0 bg-gray-900 pb-4 pt-2">
          <div className="relative">
            {/* Menu de opções */}
            {showMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[240px] animate-fade-up">
                <button
                  onClick={() => {
                    setImageGenerationMode(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-750 hover:text-white transition-colors flex items-center space-x-3"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Criar imagem</span>
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Botão + */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-brand-pink/50 rounded-xl transition-all duration-200 group flex-shrink-0"
              >
                <Plus className={`w-5 h-5 text-gray-400 group-hover:text-brand-pink transition-all duration-200 ${showMenu ? 'rotate-45' : ''}`} />
              </button>

              {/* Container do input com badge */}
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    // Auto-resize
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder={imageGenerationMode ? "Descreva a imagem..." : "Digite sua pergunta..."}
                  className={`w-full bg-gray-800 border border-gray-700 rounded-2xl ${imageGenerationMode ? 'pl-28 sm:pl-32' : 'pl-6'} pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all resize-none overflow-y-auto`}
                  disabled={isLoading}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />

                {/* Badge de modo de geração de imagem - posicionado dentro do input */}
                {imageGenerationMode && (
                  <div className="absolute left-3 top-4 flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 border border-orange-500/40 rounded-md">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                    <span className="text-xs sm:text-sm font-medium text-orange-300 hidden sm:inline">Imagem</span>
                    <button
                      onClick={() => setImageGenerationMode(false)}
                      className="p-0.5 hover:bg-orange-500/30 rounded transition-colors"
                      title="Remover modo de imagem"
                    >
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand-pink hover:bg-pink-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 group"
            >
              <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            O Help pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 9999px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #64748b;
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default AIHelpPage;