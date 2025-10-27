'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, FileText, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar'; //
import HeaderFranqueado from '../components/HeaderFranqueado'; //

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AIHelpPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Esta é uma resposta de exemplo. Em produção, aqui será integrada a IA treinada com os dados do sistema DamaFace.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    // 1. O div raiz agora é apenas o container de background
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <HeaderFranqueado />

      {/* 2. Este <main> aplica o padding para o header (pt-16) e sidebar (lg:pl-64) */}
      <main className="pt-16 lg:pl-64">
        
        {/* 3. Este div agora tem a altura correta (100vh - header)
             e contém o layout flex-col da sua página.
             Removi o 'flex-1' daqui e adicionei 'h-[calc(100vh-4rem)]'.
        */}
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
              <div className="p-2 bg-brand-pink/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-brand-pink" />
              </div>
              <h1 className="text-3xl font-bold text-white">Central de Ajuda</h1>
            </div>
            <p className="text-gray-400 text-sm ml-14">
              Assistente inteligente para ajudar você a navegar pelo sistema DamaFace
            </p>
          </div>

          {/* O restante do seu código permanece igual, pois a lógica interna de flex-1 está correta */}
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
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.role === 'user'
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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
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

          <div className="sticky bottom-0 bg-gray-900 pt-4">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-6 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all"
                disabled={isLoading}
              />
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
      </main>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 9999px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default AIHelpPage;