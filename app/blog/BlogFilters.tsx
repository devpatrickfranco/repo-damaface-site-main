'use client';

import { useState, useEffect } from 'react';

export default function BlogFilters({ categories, tags, onFilter }: { categories: any[], tags: any[], onFilter: (filters: any) => void }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  function handleFilter() {
    onFilter({ search, category: selectedCategory, tag: selectedTag });
  }

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [search, selectedCategory, selectedTag]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Buscar por título ou conteúdo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white flex-1"
      />
      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 rounded bg-gray-700 text-white">
        <option value="">Todas categorias</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="p-2 rounded bg-gray-700 text-white">
        <option value="">Todas tags</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>
    </div>
  );
}
