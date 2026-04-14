'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  UserPlus, 
  ArrowRightLeft, 
  Tag, 
  CheckCircle2, 
  Check, 
  Image as ImageIcon,
  FileText,
  Video,
  ChevronRight,
  ChevronDown,
  Edit2,
  Phone,
  Mail,
  X,
  Plus,
  Clock,
  CheckCheck,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import clsx from 'clsx'
import { apiBackend } from '@/lib/api-backend'

// Mock Data
const CONVERSATIONS = [
  { id: 1, name: 'Ana Silva', number: '+55 11 98765-4321', lastMessage: 'Oi, preciso de...', time: '2 min ago', status: 'read', unread: 1, avatar: 'AS' },
  { id: 2, name: 'Carlos Souza', number: '+55 11 98765-4789', lastMessage: 'Olá, gostaria de saber...', time: '10 min ago', status: 'delivered', unread: 0, avatar: 'CS' },
  { id: 3, name: 'Beatriz Lima', number: '+55 11 91234-5678', lastMessage: 'Pode me ajudar?', time: '1 hour ago', status: 'sent', unread: 2, avatar: 'BL' },
  { id: 4, name: 'Marcos Oliveira', number: '+55 11 94444-5555', lastMessage: 'Obrigado!', time: '2 hours ago', status: 'read', unread: 0, avatar: 'MO' },
  { id: 5, name: 'Fernanda Rocha', number: '+55 11 93333-2222', lastMessage: 'Amanhã estarei aí.', time: '5 hours ago', status: 'read', unread: 0, avatar: 'FR' },
]

const MESSAGES = [
  { id: 1, type: 'text', content: 'Oi, preciso de ajuda com meu pedido.', sender: 'client', time: '10:00 AM' },
  { id: 2, type: 'text', content: 'Olá Ana! Como posso te ajudar hoje?', sender: 'agent', agentName: 'Atendente João', time: '10:05 AM', status: 'read' },
  { id: 3, type: 'hsm', content: 'Olá! Temos uma novidade para você. Clique no botão abaixo para saber mais.', sender: 'agent', agentName: 'Sistema', time: '10:10 AM', status: 'read' },
  { id: 4, type: 'media', images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f'], sender: 'client', time: '10:15 AM' },
  { id: 5, type: 'audio', duration: '0:12', sender: 'agent', agentName: 'Atendente João', time: '10:20 AM', status: 'delivered' },
]

export default function WhatsAppDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Open')
  const [selectedConversation, setSelectedConversation] = useState(CONVERSATIONS[0])
  const [isCrmOpen, setIsCrmOpen] = useState(true)

  // --- Guard: verificar se a franquia tem WhatsApp ativo (Single-WABA Multi-tenant) ---
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await apiBackend.get<{ registration_status: string }[]>('/whatsapp/connections/')
        const hasActive = Array.isArray(data) && data.some((c) => c.registration_status === 'active')
        if (!hasActive) {
          router.replace('/franqueado/whatsapp/configurar')
          return
        }
        // Existe ao menos uma conexão ativa → renderiza normalmente
      } catch {
        router.replace('/franqueado/whatsapp/configurar')
        return
      } finally {
        setIsCheckingConnection(false)
      }
    }
    checkConnection()
  }, [router])

  if (isCheckingConnection) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500 font-medium animate-pulse">Verificando conexão WhatsApp...</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden text-gray-800">
      {/* Column 1: Conversation List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-bottom border-gray-100">
          <h1 className="text-xl font-bold mb-4">Conversations</h1>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            {['Open', 'Waiting', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'flex-1 py-1.5 text-sm font-medium rounded-md transition-all',
                  activeTab === tab ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
            <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages or contacts..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-green-700 uppercase">Main WABA number</span>
              <span className="text-xs font-medium text-green-800">+55 11 2345-6789</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-700">Connected (COEX Mode)</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={clsx(
                'group relative flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
                selectedConversation.id === conv.id ? 'bg-pink-50 border-pink-500' : 'border-transparent'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">
                {conv.avatar}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold truncate">{conv.name}</h3>
                  <span className="text-[10px] text-gray-500 uppercase font-medium">{conv.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500">{conv.number}</span>
                    <p className="text-xs text-gray-600 truncate max-w-[140px]">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {conv.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    {conv.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-400" />}
                    {conv.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                    {conv.unread > 0 && (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-[#F0F2F5] relative">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {selectedConversation.avatar}
            </div>
            <div className="ml-3">
              <div className="flex items-center space-x-1">
                <h2 className="text-sm font-bold">{selectedConversation.name}</h2>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500">online - Customer info</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
               <UserPlus className="w-3.5 h-3.5" />
               <span>Assign to Agent</span>
             </button>
             <button className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
               <ArrowRightLeft className="w-3.5 h-3.5" />
               <span>Transfer</span>
             </button>
             <button className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
               <Tag className="w-3.5 h-3.5" />
               <span>Labels</span>
             </button>
             <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">
               <CheckCircle2 className="w-3.5 h-3.5" />
               <span>Resolve</span>
             </button>
             <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
               <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-center my-6">
            <span className="px-3 py-1 bg-white shadow-sm rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100">Today</span>
          </div>

          {MESSAGES.map((msg) => (
            <div key={msg.id} className={clsx('flex', msg.sender === 'agent' ? 'justify-end' : 'justify-start')}>
              <div className={clsx(
                'max-w-[70%] group relative rounded-2xl p-3 shadow-sm transition-all',
                msg.sender === 'agent' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              )}>
                {msg.sender === 'agent' && (
                  <div className="flex justify-between items-center mb-1 space-x-4">
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Sender: {msg.agentName}</span>
                  </div>
                )}
                {msg.sender === 'client' && (
                   <span className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-tighter">Customer</span>
                )}

                {msg.type === 'text' && <p className="text-sm leading-relaxed">{msg.content}</p>}
                
                {msg.type === 'hsm' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium border-l-4 border-blue-400 pl-3 py-1 bg-blue-500/10 rounded">Template Message</p>
                    <p className="text-sm leading-relaxed italic">{msg.content}</p>
                  </div>
                )}

                {msg.type === 'media' && (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {msg.images?.map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt="Media" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {msg.type === 'audio' && (
                  <div className="flex items-center space-x-3 bg-blue-500/20 p-2 rounded-xl">
                    <button className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white ring-2 ring-white/20">
                      <Mic className="w-4 h-4 fill-current" />
                    </button>
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="w-[40%] h-full bg-white rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold">{msg.duration}</span>
                  </div>
                )}

                <div className="mt-1 flex items-center justify-end space-x-1 opacity-70">
                    <span className="text-[9px] font-medium">{msg.time}</span>
                    {msg.sender === 'agent' && (
                      msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
           <div className="flex items-end space-x-3">
             <div className="flex items-center space-x-1.5 pb-2">
                <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                  <FileText className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                  <Mic className="w-5 h-5" />
                </button>
             </div>
             
             <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 border border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20 transition-all">
                <textarea 
                   placeholder="Type a message..." 
                   className="w-full bg-transparent border-none focus:ring-0 resize-none py-1 text-sm max-h-32"
                   rows={1}
                />
             </div>

             <button className="mb-1 p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all transform active:scale-95 flex items-center justify-center">
               <Send className="w-5 h-5" />
               <span className="ml-2 font-bold text-xs">Send</span>
             </button>
           </div>
        </div>
      </div>

      {/* Column 3: Contact CRM */}
      <div 
        className={clsx(
          'bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
          isCrmOpen ? 'w-80' : 'w-0 overflow-hidden border-none'
        )}
      >
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Contact Information</h2>
          <button onClick={() => setIsCrmOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-gray-50 relative">
               {selectedConversation.avatar}
               <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
             </div>
             <h3 className="mt-4 text-lg font-bold text-gray-900">{selectedConversation.name}</h3>
             <p className="text-sm text-gray-500 font-medium">{selectedConversation.number}</p>
             <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-gray-200">
               <Edit2 className="w-3.5 h-3.5" />
               <span>Edit Contact</span>
             </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Phone</span>
              </label>
              <p className="text-sm font-semibold text-gray-700">{selectedConversation.number}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </label>
              <p className="text-sm font-semibold text-gray-700">anasilva@gmail.com</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>Tags</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Premium Customer', 'Interested', 'Support'].map(tag => (
                  <span key={tag} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[10px] font-bold text-gray-600">
                    <span>{tag}</span>
                    <button className="hover:text-red-500 transition-colors"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <button className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 border-dashed rounded-md text-[10px] font-bold text-pink-500 hover:bg-pink-50 transition-colors">
                   <Plus className="w-2.5 h-2.5" />
                   <span>Add Tag</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Custom Fields</h4>
            
            <div className="space-y-3">
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">CPF</label>
                  <input type="text" defaultValue="123.456.789-00" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-pink-500 outline-none" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Lead Type (Order ID)</label>
                  <input type="text" defaultValue="#ORD-9876" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-pink-500 outline-none" />
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Notes</label>
             <textarea 
                className="w-full bg-yellow-50/50 border border-yellow-200 rounded-xl px-3 py-3 text-sm italic text-gray-600 outline-none focus:ring-1 focus:ring-yellow-300 min-h-[100px]"
                placeholder="Visible only to agents"
             />
          </div>

          <div className="pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Conversation History</h4>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
             </div>
             
             <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex space-x-3 group">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Conversa resolvida</p>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                         <span className="text-[10px] text-gray-400 font-medium">Resolvido por Atendente João</span>
                         <span className="text-[10px] text-gray-300">•</span>
                         <span className="text-[10px] text-gray-400 uppercase">2 days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Toggle CRM Button (Mobile/Small screens) */}
      {!isCrmOpen && (
        <button 
          onClick={() => setIsCrmOpen(true)}
          className="fixed right-4 bottom-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-pink-700 transition-all transform hover:scale-110 active:scale-95 z-50"
        >
          <UserPlus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
