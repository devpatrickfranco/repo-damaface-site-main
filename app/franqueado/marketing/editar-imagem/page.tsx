'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiBackend } from '@/lib/api-backend';

import { Send, Sparkles, Edit, ArrowLeft, RotateCcw, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface ImageItem {
    name: string;
    path: string;
    url: string;
    size: number;
    last_modified: string;
}

const EditarImagemPage = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    // Chat states
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [sessionKey] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Image gallery states
    const [images, setImages] = useState<ImageItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
    const [loadingImages, setLoadingImages] = useState(false);
    const [errorImages, setErrorImages] = useState<string | null>(null);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProcedure, setSelectedProcedure] = useState<string>('');

    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const ITEMS_PER_PAGE = 20;

    const categories: Record<string, string[]> = {
        "facial": [
            "botox",
            "Full-Face",
            "bioestimulador",
            "preenchimento-labial",
            "bigode-chines",
            "olheiras",
            "queixo",
            "mandibula",
            "Fios de pdo",
            "skinbooster",
            "lipo-de-papada",
            "peeling-quimico",
            "microagulhamento"
        ],
        "corporal": [
            "bioestimulador",
            "peim",
            "preenchimento-de-gluteo",
            "enzimas-gordura-localizada"
        ],
        "dia-de": [
            "ultraformer",
            "lavieen",
            "criolipolise",
            "depilacao-laser"
        ]
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/franqueado");
        }
    }, [isAuthenticated, loading, router]);

    // Handle filter changes
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSelectedProcedure(''); // Reset procedure
        setImages([]); // Clear images
        setPage(1);
        setErrorImages(null);
    };

    const handleProcedureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProcedure(e.target.value);
        setPage(1); // Reset page to 1 when changing procedure
    };

    // Fetch images when procedure or page changes
    useEffect(() => {
        const fetchImages = async () => {
            if (!selectedCategory || !selectedProcedure) return;

            try {
                setLoadingImages(true);
                setErrorImages(null);

                const prefix = `${selectedCategory}/${selectedProcedure}/`;
                const params = new URLSearchParams({
                    bucket: 'canva',
                    prefix: prefix,
                    page: page.toString(),
                    page_size: ITEMS_PER_PAGE.toString()
                });

                const response = await apiBackend.get(`/marketing/editar-imagem/listar/?${params}`);

                if (response.items) {
                    setImages(response.items);
                    const totalItems = response.count || 0;
                    const loadedItems = (page - 1) * ITEMS_PER_PAGE + response.items.length;
                    setHasMore(loadedItems < totalItems);
                } else {
                    setImages([]);
                    setHasMore(false);
                }
            } catch (err) {
                console.error('Erro ao carregar imagens:', err);
                setErrorImages('Não foi possível carregar as imagens. Tente novamente mais tarde.');
            } finally {
                setLoadingImages(false);
            }
        };

        fetchImages();
    }, [selectedCategory, selectedProcedure, page]);



    const suggestedQuestions = [
        {
            icon: Edit,
            text: 'Remova o fundo da imagem',
            category: 'Edição'
        },
        {
            icon: Sparkles,
            text: 'Melhore a iluminação e cores',
            category: 'Ajuste'
        },
        {
            icon: Edit,
            text: 'Adicione o logo da DamaFace no canto superior',
            category: 'Branding'
        },
        {
            icon: Sparkles,
            text: 'Crie uma variação para stories',
            category: 'Formato'
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
        if (!textToSend || isStreaming || !selectedImage) return;

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

        try {
            // Usa o apiBackend.stream() para streaming
            // Inclui metadados da imagem selecionada na requisição
            const reader = await apiBackend.stream('/marketing/editar-imagem/ai/chat/stream/', {
                message: textToSend,
                session_key: sessionKey,
                image_context: {
                    path: selectedImage.path,
                    name: selectedImage.name,
                    url: selectedImage.url
                }
            });

            const decoder = new TextDecoder();

            let buffer = '';
            let isFirstChunk = true;

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

                                if (isFirstChunk) {
                                    isFirstChunk = false;
                                    // Cria a mensagem apenas quando recebe o primeiro chunk
                                    setMessages(prev => [...prev, {
                                        id: (Date.now() + 1).toString(),
                                        role: 'assistant',
                                        content: assistantMessage,
                                        timestamp: new Date()
                                    }]);
                                } else {
                                    // Atualiza mensagem existente
                                    setMessages(prev => {
                                        const updated = [...prev];
                                        updated[updated.length - 1] = {
                                            ...updated[updated.length - 1],
                                            content: assistantMessage
                                        };
                                        return updated;
                                    });
                                }
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

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Renderiza a galeria de imagens se nenhuma imagem foi selecionada
    const renderGallery = () => (
        <div className="flex-1 overflow-y-auto animate-fade-in">
            <div className="mb-8 space-y-6">
                {/* Seção de Filtros */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">O que você está buscando?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium text-gray-400">Categoria</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-pink focus:border-brand-pink block p-2.5"
                            >
                                <option value="">Selecione uma categoria</option>
                                {Object.keys(categories).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="procedure" className="text-sm font-medium text-gray-400">Procedimento</label>
                            <select
                                id="procedure"
                                value={selectedProcedure}
                                onChange={handleProcedureChange}
                                disabled={!selectedCategory}
                                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-pink focus:border-brand-pink block p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {!selectedCategory ? 'Selecione uma categoria primeiro' : 'Selecione um procedimento'}
                                </option>
                                {selectedCategory && categories[selectedCategory]?.map((proc) => (
                                    <option key={proc} value={proc}>
                                        {proc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado Inicial ou Carregando */}
            {!selectedProcedure ? (
                <div className="text-center py-20 text-gray-500">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <p>Selecione uma categoria e procedimento para ver as imagens.</p>
                </div>
            ) : loadingImages ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
                </div>
            ) : errorImages ? (
                <div className="text-center py-20 text-red-400">
                    <p>{errorImages}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p>Nenhuma imagem encontrada para este procedimento.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                        {images.map((img) => (
                            <div
                                key={img.path}
                                onClick={() => setSelectedImage(img)}
                                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-700 hover:border-brand-pink cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/10 bg-gray-800"
                            >
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white text-sm font-medium truncate">{img.name}</p>
                                    <p className="text-gray-300 text-xs">{formatFileSize(img.size)}</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-brand-pink rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginação */}
                    <div className="flex justify-between items-center py-4 border-t border-gray-800">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === 1
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                        >
                            Anterior
                        </button>
                        <span className="text-gray-400 text-sm">Página {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hasMore}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!hasMore
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    // Renderiza o chat se uma imagem foi selecionada
    const renderChat = () => (
        <>
            {/* Barra de contexto da imagem selecionada */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 mb-6 flex items-center justify-between animate-fade-in">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-700">
                        <img
                            src={selectedImage?.url}
                            alt={selectedImage?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-md">
                            {selectedImage?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {selectedImage && formatFileSize(selectedImage.size)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setSelectedImage(null);
                        setMessages([]);
                        setInputValue('');
                    }}
                    className="text-xs text-brand-pink hover:text-pink-400 font-medium px-3 py-1.5 hover:bg-brand-pink/10 rounded-lg transition-colors flex-shrink-0"
                >
                    Trocar Imagem
                </button>
            </div>

            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
                    <div className="text-center space-y-3 mb-8">
                        <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-brand-pink" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">
                            Como você quer editar esta imagem?
                        </h2>
                        <p className="text-gray-400 max-w-md">
                            Descreva as edições que você deseja fazer e a IA vai ajudar
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
                    {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
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
                                placeholder="Descreva as edições que você quer fazer na imagem..."
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
        </>
    );

    return (
        <div className="bg-gray-900 min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => {
                                    if (selectedImage) {
                                        setSelectedImage(null);
                                    } else {
                                        window.location.href = '/franqueado/marketing';
                                    }
                                }}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                            <div className="p-2 bg-brand-pink/20 rounded-lg">
                                <Edit className="w-6 h-6 text-brand-pink" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Editar Imagem com IA</h1>
                        </div>

                        {selectedImage && messages.length > 0 && (
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
                        Assistente de IA especializado em editar e manipular imagens
                    </p>
                </div>

                {/* Conteúdo principal - Alterna entre Galeria e Chat */}
                {selectedImage ? renderChat() : renderGallery()}

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

export default EditarImagemPage;
