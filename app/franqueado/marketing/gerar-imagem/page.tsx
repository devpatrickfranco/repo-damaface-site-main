'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiBackend } from '@/lib/api-backend';

import { Send, Sparkles, Image as ImageIcon, ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

const GerarImagemPage = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [sessionKey] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/franqueado");
        }
    }, [isAuthenticated, loading, router]);

    const suggestedQuestions = [
        {
            icon: ImageIcon,
            text: 'Gere uma imagem de um gato laranja',
            category: 'Exemplo'
        },
        {
            icon: Sparkles,
            text: 'Crie uma imagem de paisagem futurista',
            category: 'Exemplo'
        },
        {
            icon: ImageIcon,
            text: 'Desenhe um logo moderno para uma empresa',
            category: 'Exemplo'
        },
        {
            icon: Sparkles,
            text: 'Faça uma ilustração de um café aconchegante',
            category: 'Exemplo'
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
        if (!textToSend || isStreaming) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: textToSend,
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsStreaming(true);

        // Prepara para receber resposta em stream
        let assistantMessage = '';
        const messageIndex = messages.length + 1;



        try {
            // Usa o apiBackend.stream() para streaming
            const reader = await apiBackend.stream('/marketing/gerar-imagem/ai/chat/stream/', {
                message: textToSend,
                session_key: sessionKey
            });

            const decoder = new TextDecoder();

            // Adiciona mensagem vazia do assistente
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
                timestamp: new Date()
            }]);

            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Processa linhas completas do buffer
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Mantém a última linha incompleta no buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            if (data.chunk) {
                                assistantMessage += data.chunk;

                                // Atualiza mensagem gradualmente
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[messageIndex] = {
                                        id: (Date.now() + 1).toString(),
                                        role: 'assistant',
                                        content: assistantMessage,
                                        timestamp: new Date()
                                    };
                                    return updated;
                                });
                            }

                            if (data.status === 'completed') {
                                console.log('Stream completado');
                            }

                            if (data.error) {
                                console.error('Erro no stream:', data.error);
                                throw new Error(data.error);
                            }
                        } catch (parseError) {
                            console.warn('Erro ao parsear linha SSE:', line, parseError);
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error('Erro ao enviar mensagem:', error);

            // Não mostra erro se foi abortado pelo usuário
            if (error.name === 'AbortError') {
                return;
            }

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
                    role: 'assistant',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsStreaming(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewConversation = () => {
        setMessages([]);
        setInputValue('');
    };

    return (
        <div className="bg-gray-900 min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.location.href = '/franqueado/marketing'}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                            <div className="p-2 bg-brand-pink/20 rounded-lg">
                                <ImageIcon className="w-6 h-6 text-brand-pink" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Gerar Imagem com IA</h1>
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
                        Assistente de IA especializado em criar e manipular imagens para suas campanhas
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
                                O que você quer criar hoje?
                            </h2>
                            <p className="text-gray-400 max-w-md">
                                Descreva a imagem que você deseja gerar e deixe a IA fazer o trabalho
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
                                                <span className="text-xs font-medium text-brand-pink">IA</span>
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
                        {isStreaming && (
                            <div className="flex justify-start animate-fade-up">
                                <div className="max-w-[80%] bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 shadow-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-brand-pink" />
                                        <span className="text-xs font-medium text-brand-pink">IA</span>
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
                        <div className="flex items-center space-x-2">
                            {/* Container do input */}
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
                                    placeholder="Descreva a imagem que você quer criar..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-6 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all resize-none overflow-y-auto"
                                    disabled={isStreaming}
                                    style={{ minHeight: '56px', maxHeight: '120px' }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isStreaming}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand-pink hover:bg-pink-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 group"
                        >
                            {isStreaming ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                                <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                        A IA pode cometer erros. Considere verificar informações importantes.
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

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-up {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default GerarImagemPage;
