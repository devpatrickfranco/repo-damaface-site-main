'use client';

import { useState, useEffect, JSX } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import { apiBackend } from '@/lib/api-backend'; 
import { 
  Plus, 
  Settings, 
  X, 
  Save, 
  Edit, 
  Trash2, 
  User, 
  Users,
  ChevronDown,
  ChevronRight,
  Tag,
  Loader2,
  Clock // NOVO ÍCONE
} from 'lucide-react';

// --- INTERFACES ALINHADAS COM A RESPOSTA DA API DJANGO ---
interface ApiUsuario {
  id: number;
  nome: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'FRANQUEADO' | 'FUNCIONARIO';
}

// ALTERADO: Adicionado prazo_resolucao_horas
interface ApiSubcategoria {
  id: number;
  nome: string;
  responsaveis: number[];
  responsaveis_details: ApiUsuario[];
  prazo_resolucao_horas: number; 
}

interface ApiCategoria {
  id: number;
  nome: string;
  subcategorias: ApiSubcategoria[];
  somente_superadmin: boolean;
}

export default function CategoryManager() {
  const { user } = useAuth();
  
  // Estados do Componente
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de Dados (populados pela API)
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [categorias, setCategorias] = useState<ApiCategoria[]>([]);

  // Estados de UI
  const [activeTab, setActiveTab] = useState<'categorias' | 'usuarios'>('categorias');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [editingItem, setEditingItem] = useState<{ type: 'categoria' | 'subcategoria', id: number, parentId?: number } | null>(null);
  
  // Estados dos Formulários
  const [newItemName, setNewItemName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newPrazo, setNewPrazo] = useState<number>(72); // NOVO ESTADO: Armazena o prazo em horas (padrão 72h)

  // --- LÓGICA DE FILTRAGEM ---
  const usuariosParaAtribuicao = usuarios.filter(u => u.role === 'ADMIN');

  // --- BUSCA DE DADOS DA API ---
  const fetchCategorias = async () => {
    try {
      const response = await apiBackend.get<ApiCategoria[]>('/chamados/categorias/');
      setCategorias(response);
    } catch (err) {
      setError('Falha ao carregar as categorias.');
      console.error(err);
    }
  };
  
  const fetchUsuarios = async () => {
    try {
      const response = await apiBackend.get<ApiUsuario[]>('/users/usuarios/');
      setUsuarios(response);
    } catch (err) {
      setError('Falha ao carregar os usuários.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      Promise.all([fetchCategorias(), fetchUsuarios()])
        .finally(() => setLoading(false));
    }
  }, [isOpen]);


  if (user?.role !== "SUPERADMIN") {
    return null;
  }

  // --- FUNÇÕES DE LÓGICA ---

  const resetFormState = () => {
    setNewItemName('');
    setSelectedUsers([]);
    setNewPrazo(72); // Reseta o prazo para o padrão
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = async () => {
    if (!newItemName.trim()) return;
    try {
      await apiBackend.post('/chamados/categorias/', { nome: newItemName, somente_superadmin: false });
      await fetchCategorias();
      resetFormState();
    } catch (err) {
      alert('Erro ao adicionar categoria.');
      console.error(err);
    }
  };

  // ALTERADO: Inclui o prazo na criação da subcategoria
  const handleAddSubcategory = async (categoryId: number) => {
    if (!newItemName.trim()) return;
    try {
      await apiBackend.post('/chamados/subcategorias/', {
        nome: newItemName,
        categoria: categoryId,
        responsaveis: selectedUsers,
        prazo_resolucao_horas: newPrazo,
      });
      await fetchCategorias();
      resetFormState();
    } catch (err) {
      alert('Erro ao adicionar subcategoria.');
      console.error(err);
    }
  };

  // ALTERADO: Popula o estado do prazo ao iniciar a edição
  const handleEdit = (type: 'categoria' | 'subcategoria', id: number, parentId?: number) => {
    setEditingItem({ type, id, parentId });
    
    if (type === 'categoria') {
      const categoria = categorias.find(c => c.id === id);
      setNewItemName(categoria?.nome || '');
    } else {
      const categoria = categorias.find(c => c.id === parentId);
      const subcategoria = categoria?.subcategorias.find(s => s.id === id);
      setNewItemName(subcategoria?.nome || '');
      setSelectedUsers(subcategoria?.responsaveis_details.map(u => u.id) || []);
      setNewPrazo(subcategoria?.prazo_resolucao_horas || 72); // Popula o prazo existente
    }
  };

  // ALTERADO: Envia o prazo ao salvar a edição
  const handleSaveEdit = async () => {
    if (!editingItem || !newItemName.trim()) return;
    
    try {
      if (editingItem.type === 'categoria') {
        await apiBackend.patch(`/chamados/categorias/${editingItem.id}/`, { nome: newItemName });
      } else {
        await apiBackend.patch(`/chamados/subcategorias/${editingItem.id}/`, {
          nome: newItemName,
          responsaveis: selectedUsers,
          prazo_resolucao_horas: newPrazo,
        });
      }
      await fetchCategorias(); 
      setEditingItem(null);
      resetFormState();
    } catch (err) {
      alert('Erro ao salvar a edição.');
      console.error(err);
    }
  };

  const handleDelete = async (type: 'categoria' | 'subcategoria', id: number) => {
    if (!confirm(`Tem certeza que deseja excluir esta ${type}?`)) return;
    
    try {
      if (type === 'categoria') {
        await apiBackend.delete(`/chamados/categorias/${id}/`);
      } else {
        await apiBackend.delete(`/chamados/subcategorias/${id}/`);
      }
      await fetchCategorias();
    } catch (err) {
      alert('Erro ao excluir.');
      console.error(err);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>Gerenciar Categorias</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Gerenciar Categorias e Usuários</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-shrink-0 border-b border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button onClick={() => setActiveTab('categorias')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'categorias' ? 'border-pink-500 text-pink-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
                  <div className="flex items-center space-x-2"><Tag className="w-4 h-4" /><span>Categorias</span></div>
                </button>
                <button onClick={() => setActiveTab('usuarios')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'usuarios' ? 'border-pink-500 text-pink-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
                  <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>Usuários (Admins)</span></div>
                </button>
              </nav>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
              ) : error ? (
                <div className="text-red-400 text-center">{error}</div>
              ) : activeTab === 'categorias' ? (
                <div className="space-y-6">
                  {/* Adicionar Nova Categoria */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Adicionar Nova Categoria</h3>
                    <div className="flex space-x-3">
                      <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nome da categoria" className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500" />
                      <button onClick={handleAddCategory} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Adicionar</span></button>
                    </div>
                  </div>

                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="p-4 border-b border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => toggleCategory(categoria.id)} className="text-gray-400 hover:text-white">
                                    {expandedCategories.includes(categoria.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                                {editingItem?.type === 'categoria' && editingItem.id === categoria.id ? (
                                    <div className="flex items-center space-x-2">
                                      <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm" />
                                      <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300"><Save className="w-4 h-4" /></button>
                                      <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-300"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <>
                                      <h3 className="text-lg font-medium text-white">{categoria.nome}</h3>
                                      <span className="text-sm text-gray-400">({categoria.subcategorias.length} subcategorias)</span>
                                    </>
                                )}
                            </div>
                            {editingItem?.type !== 'categoria' || editingItem.id !== categoria.id ? (
                                <div className="flex items-center space-x-2">
                                  <button onClick={() => handleEdit('categoria', categoria.id)} className="text-blue-400 hover:text-blue-300 p-1"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete('categoria', categoria.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ) : null}
                        </div>
                      </div>
                      {expandedCategories.includes(categoria.id) && (
                        <div className="p-4 space-y-4">
                            {/* Adicionar Subcategoria */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <h4 className="text-sm font-medium text-white mb-3">Adicionar Subcategoria</h4>
                              <div className="space-y-3">
                                <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nome da subcategoria" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 text-sm"/>
                                
                                {/* NOVO CAMPO DE PRAZO */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Prazo de Resolução (horas)</label>
                                    <input 
                                        type="number" 
                                        value={newPrazo} 
                                        onChange={(e) => setNewPrazo(parseInt(e.target.value, 10) || 0)} 
                                        placeholder="Ex: 72" 
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 text-sm"
                                    />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-300 mb-2">Usuários Responsáveis (Admins)</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {usuariosParaAtribuicao.map((usuario) => (
                                      <label key={usuario.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={selectedUsers.includes(usuario.id)} onChange={() => toggleUserSelection(usuario.id)} className="w-3 h-3 text-pink-500 border-gray-600 rounded focus:ring-pink-500" />
                                        <span className="text-xs text-gray-300">{usuario.nome}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <button onClick={() => handleAddSubcategory(categoria.id)} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"><Plus className="w-3 h-3" /><span>Adicionar</span></button>
                              </div>
                            </div>
                            {/* Lista de Subcategorias */}
                            {categoria.subcategorias.map((subcategoria) => (
                                <div key={subcategoria.id} className="bg-gray-800/30 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        {editingItem?.type === 'subcategoria' && editingItem.id === subcategoria.id ? (
                                            <div className="space-y-2">
                                                <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"/>
                                                
                                                {/* NOVO CAMPO DE PRAZO NA EDIÇÃO */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">Prazo de Resolução (horas)</label>
                                                    <input 
                                                        type="number" 
                                                        value={newPrazo} 
                                                        onChange={(e) => setNewPrazo(parseInt(e.target.value, 10) || 0)} 
                                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">Usuários Responsáveis (Admins)</label>
                                                    <div className="grid grid-cols-2 gap-1">
                                                        {usuariosParaAtribuicao.map((usuario) => (
                                                          <label key={usuario.id} className="flex items-center space-x-1 cursor-pointer">
                                                              <input type="checkbox" checked={selectedUsers.includes(usuario.id)} onChange={() => toggleUserSelection(usuario.id)} className="w-3 h-3 text-pink-500 border-gray-600 rounded focus:ring-pink-500"/>
                                                              <span className="text-xs text-gray-300">{usuario.nome}</span>
                                                          </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300"><Save className="w-3 h-3" /></button>
                                                    <button onClick={() => { setEditingItem(null); resetFormState(); }} className="text-gray-400 hover:text-gray-300"><X className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-sm font-medium text-white">{subcategoria.nome}</h4>
                                                    {/* EXIBIÇÃO DO PRAZO CONFIGURADO */}
                                                    <span className="inline-flex items-center space-x-1 text-xs text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{subcategoria.prazo_resolucao_horas}h</span>
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {subcategoria.responsaveis_details.map((userResp) => (
                                                      <span key={userResp.id} className="inline-flex items-center space-x-1 bg-pink-900/30 text-pink-300 text-xs px-2 py-1 rounded-full">
                                                          <User className="w-3 h-3" />
                                                          <span>{userResp.nome}</span>
                                                      </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                      </div>
                                      {editingItem?.type !== 'subcategoria' || editingItem.id !== subcategoria.id ? (
                                        <div className="flex items-center space-x-1 ml-2">
                                            <button onClick={() => handleEdit('subcategoria', subcategoria.id, categoria.id)} className="text-blue-400 hover:text-blue-300 p-1"><Edit className="w-3 h-3" /></button>
                                            <button onClick={() => handleDelete('subcategoria', subcategoria.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                 // ... (código da aba de usuários permanece o mesmo)
                 <div className="space-y-4">
                  {usuariosParaAtribuicao.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      Nenhum usuário com perfil de Admin encontrado
                    </div>
                  ) : (
                    usuariosParaAtribuicao.map((usuario) => (
                      <div key={usuario.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white">{usuario.nome}</h4>
                            <p className="text-xs text-gray-400">{usuario.email}</p>
                            <p className="text-xs text-pink-400 font-medium">{usuario.role}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-gray-300 mb-2">Subcategorias Atribuídas:</h5>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const subcategoriasAtribuidas: JSX.Element[] = [];
                              
                              categorias.forEach(cat => {
                                if (cat.subcategorias && Array.isArray(cat.subcategorias)) {
                                  cat.subcategorias.forEach(sub => {
                                    const temUsuario = sub.responsaveis_details && 
                                                      Array.isArray(sub.responsaveis_details) && 
                                                      sub.responsaveis_details.some(resp => resp.id === usuario.id);
                                    
                                    if (temUsuario) {
                                      subcategoriasAtribuidas.push(
                                        <span key={`${cat.id}-${sub.id}`} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                          {cat.nome} → {sub.nome}
                                        </span>
                                      );
                                    }
                                  });
                                }
                              });
                              
                              return subcategoriasAtribuidas.length > 0 ? subcategoriasAtribuidas : (
                                <span className="text-xs text-gray-500 italic">Nenhuma subcategoria atribuída</span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 p-6 bg-gray-700/30 border-t border-gray-700">
              <div className="flex justify-end">
                <button onClick={() => setIsOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-lg">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}