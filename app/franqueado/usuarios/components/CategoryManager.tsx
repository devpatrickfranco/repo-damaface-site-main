'use client';

import { useState } from 'react';
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
  UserPlus
} from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

interface Subcategoria {
  id: string;
  nome: string;
  usuariosAtribuidos: string[];
}

interface Categoria {
  id: string;
  nome: string;
  subcategorias: Subcategoria[];
}

export default function CategoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'categorias' | 'usuarios'>('categorias');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<{ type: 'categoria' | 'subcategoria', id: string, parentId?: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Dados mockados
  const [usuarios] = useState<Usuario[]>([
    { id: '1', nome: 'Suporte Técnico', email: 'suporte@damaface.com' },
    { id: '2', nome: 'Equipe de Treinamento', email: 'treinamento@damaface.com' },
    { id: '3', nome: 'Financeiro', email: 'financeiro@damaface.com' },
    { id: '4', nome: 'Marketing', email: 'marketing@damaface.com' },
    { id: '5', nome: 'Qualidade', email: 'qualidade@damaface.com' }
  ]);

  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: '1',
      nome: 'Sistema',
      subcategorias: [
        { id: '1-1', nome: 'Problemas de Login', usuariosAtribuidos: ['1'] },
        { id: '1-2', nome: 'Bugs do Sistema', usuariosAtribuidos: ['1'] },
        { id: '1-3', nome: 'Integração', usuariosAtribuidos: ['1', '5'] }
      ]
    },
    {
      id: '2',
      nome: 'Produto',
      subcategorias: [
        { id: '2-1', nome: 'Informações Técnicas', usuariosAtribuidos: ['2'] },
        { id: '2-2', nome: 'Disponibilidade', usuariosAtribuidos: ['3'] },
        { id: '2-3', nome: 'Qualidade', usuariosAtribuidos: ['5'] }
      ]
    },
    {
      id: '3',
      nome: 'Treinamento',
      subcategorias: [
        { id: '3-1', nome: 'Agendamento', usuariosAtribuidos: ['2'] },
        { id: '3-2', nome: 'Material Didático', usuariosAtribuidos: ['2'] },
        { id: '3-3', nome: 'Certificação', usuariosAtribuidos: ['2', '5'] }
      ]
    },
    {
      id: '4',
      nome: 'Marketing',
      subcategorias: [
        { id: '4-1', nome: 'Materiais Promocionais', usuariosAtribuidos: ['4'] },
        { id: '4-2', nome: 'Campanhas', usuariosAtribuidos: ['4'] },
        { id: '4-3', nome: 'Redes Sociais', usuariosAtribuidos: ['4'] }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = () => {
    if (!newItemName.trim()) return;
    
    const newCategory: Categoria = {
      id: Date.now().toString(),
      nome: newItemName,
      subcategorias: []
    };
    
    setCategorias([...categorias, newCategory]);
    setNewItemName('');
  };

  const handleAddSubcategory = (categoryId: string) => {
    if (!newItemName.trim()) return;
    
    setCategorias(categorias.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            subcategorias: [
              ...cat.subcategorias,
              {
                id: `${categoryId}-${Date.now()}`,
                nome: newItemName,
                usuariosAtribuidos: selectedUsers
              }
            ]
          }
        : cat
    ));
    
    setNewItemName('');
    setSelectedUsers([]);
  };

  const handleEdit = (type: 'categoria' | 'subcategoria', id: string, parentId?: string) => {
    setEditingItem({ type, id, parentId });
    
    if (type === 'categoria') {
      const categoria = categorias.find(c => c.id === id);
      setNewItemName(categoria?.nome || '');
    } else {
      const categoria = categorias.find(c => c.id === parentId);
      const subcategoria = categoria?.subcategorias.find(s => s.id === id);
      setNewItemName(subcategoria?.nome || '');
      setSelectedUsers(subcategoria?.usuariosAtribuidos || []);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem || !newItemName.trim()) return;
    
    if (editingItem.type === 'categoria') {
      setCategorias(categorias.map(cat => 
        cat.id === editingItem.id 
          ? { ...cat, nome: newItemName }
          : cat
      ));
    } else {
      setCategorias(categorias.map(cat => 
        cat.id === editingItem.parentId
          ? {
              ...cat,
              subcategorias: cat.subcategorias.map(sub =>
                sub.id === editingItem.id
                  ? { ...sub, nome: newItemName, usuariosAtribuidos: selectedUsers }
                  : sub
              )
            }
          : cat
      ));
    }
    
    setEditingItem(null);
    setNewItemName('');
    setSelectedUsers([]);
  };

  const handleDelete = (type: 'categoria' | 'subcategoria', id: string, parentId?: string) => {
    if (!confirm(`Tem certeza que deseja excluir esta ${type}?`)) return;
    
    if (type === 'categoria') {
      setCategorias(categorias.filter(cat => cat.id !== id));
    } else {
      setCategorias(categorias.map(cat => 
        cat.id === parentId
          ? { ...cat, subcategorias: cat.subcategorias.filter(sub => sub.id !== id) }
          : cat
      ));
    }
  };

  const getUserName = (userId: string) => {
    return usuarios.find(u => u.id === userId)?.nome || 'Usuário não encontrado';
  };

  const toggleUserSelection = (userId: string) => {
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
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Gerenciar Categorias e Subcategorias</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('categorias')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'categorias'
                      ? 'border-pink-500 text-pink-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Categorias</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'usuarios'
                      ? 'border-pink-500 text-pink-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Usuários Disponíveis</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              
              {activeTab === 'categorias' ? (
                <div className="space-y-6">
                  
                  {/* Add Category */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Adicionar Nova Categoria</h3>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nome da categoria"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                      <button
                        onClick={handleAddCategory}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="space-y-4">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className="bg-gray-700/30 rounded-lg border border-gray-600">
                        
                        {/* Category Header */}
                        <div className="p-4 border-b border-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleCategory(categoria.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                {expandedCategories.includes(categoria.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              
                              {editingItem?.type === 'categoria' && editingItem.id === categoria.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                  />
                                  <button
                                    onClick={handleSaveEdit}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingItem(null)}
                                    className="text-gray-400 hover:text-gray-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-lg font-medium text-white">{categoria.nome}</h3>
                                  <span className="text-sm text-gray-400">
                                    ({categoria.subcategorias.length} subcategorias)
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {editingItem?.type !== 'categoria' || editingItem.id !== categoria.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit('categoria', categoria.id)}
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete('categoria', categoria.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Subcategories */}
                        {expandedCategories.includes(categoria.id) && (
                          <div className="p-4 space-y-4">
                            
                            {/* Add Subcategory */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <h4 className="text-sm font-medium text-white mb-3">Adicionar Subcategoria</h4>
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={newItemName}
                                  onChange={(e) => setNewItemName(e.target.value)}
                                  placeholder="Nome da subcategoria"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 text-sm"
                                />
                                
                                {/* User Selection */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-300 mb-2">
                                    Usuários Responsáveis
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {usuarios.map((usuario) => (
                                      <label key={usuario.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={selectedUsers.includes(usuario.id)}
                                          onChange={() => toggleUserSelection(usuario.id)}
                                          className="w-3 h-3 text-pink-500 border-gray-600 rounded focus:ring-pink-500"
                                        />
                                        <span className="text-xs text-gray-300">{usuario.nome}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => handleAddSubcategory(categoria.id)}
                                  className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Adicionar</span>
                                </button>
                              </div>
                            </div>

                            {/* Subcategories List */}
                            <div className="space-y-2">
                              {categoria.subcategorias.map((subcategoria) => (
                                <div key={subcategoria.id} className="bg-gray-800/30 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      {editingItem?.type === 'subcategoria' && editingItem.id === subcategoria.id ? (
                                        <div className="space-y-2">
                                          <input
                                            type="text"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                          />
                                          <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                              Usuários Responsáveis
                                            </label>
                                            <div className="grid grid-cols-2 gap-1">
                                              {usuarios.map((usuario) => (
                                                <label key={usuario.id} className="flex items-center space-x-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(usuario.id)}
                                                    onChange={() => toggleUserSelection(usuario.id)}
                                                    className="w-3 h-3 text-pink-500 border-gray-600 rounded focus:ring-pink-500"
                                                  />
                                                  <span className="text-xs text-gray-300">{usuario.nome}</span>
                                                </label>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={handleSaveEdit}
                                              className="text-green-400 hover:text-green-300"
                                            >
                                              <Save className="w-3 h-3" />
                                            </button>
                                            <button
                                              onClick={() => setEditingItem(null)}
                                              className="text-gray-400 hover:text-gray-300"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <h4 className="text-sm font-medium text-white">{subcategoria.nome}</h4>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {subcategoria.usuariosAtribuidos.map((userId) => (
                                              <span key={userId} className="inline-flex items-center space-x-1 bg-pink-900/30 text-pink-300 text-xs px-2 py-1 rounded-full">
                                                <User className="w-3 h-3" />
                                                <span>{getUserName(userId)}</span>
                                              </span>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    
                                    {editingItem?.type !== 'subcategoria' || editingItem.id !== subcategoria.id ? (
                                      <div className="flex items-center space-x-1 ml-2">
                                        <button
                                          onClick={() => handleEdit('subcategoria', subcategoria.id, categoria.id)}
                                          className="text-blue-400 hover:text-blue-300 p-1"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete('subcategoria', subcategoria.id, categoria.id)}
                                          className="text-red-400 hover:text-red-300 p-1"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Users Tab */
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Usuários Disponíveis para Atribuição</h3>
                  <div className="grid gap-4">
                    {usuarios.map((usuario) => (
                      <div key={usuario.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white">{usuario.nome}</h4>
                            <p className="text-xs text-gray-400">{usuario.email}</p>
                          </div>
                        </div>
                        
                        {/* Show assigned subcategories */}
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-gray-300 mb-2">Subcategorias Atribuídas:</h5>
                          <div className="flex flex-wrap gap-1">
                            {categorias.flatMap(cat => 
                              cat.subcategorias
                                .filter(sub => sub.usuariosAtribuidos.includes(usuario.id))
                                .map(sub => (
                                  <span key={sub.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                    {cat.nome} → {sub.nome}
                                  </span>
                                ))
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-700/30 border-t border-gray-700">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-lg"
                >
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