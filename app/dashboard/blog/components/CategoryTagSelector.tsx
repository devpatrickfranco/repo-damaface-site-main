import { prisma } from '@/lib/prisma';
import { useEffect, useState } from 'react';

export default function CategoryTagSelector({ selectedCategories = [], selectedTags = [] }: { selectedCategories?: string[], selectedTags?: string[] }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const catRes = await fetch('/api/categories');
      const tagRes = await fetch('/api/tags');
      setCategories(await catRes.json());
      setTags(await tagRes.json());
    }
    fetchData();
  }, []);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Categorias</label>
        <select 
          name="categories" 
          multiple 
          className="w-full p-2 rounded bg-gray-700 text-white"
          defaultValue={selectedCategories}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
        <select 
          name="tags" 
          multiple 
          className="w-full p-2 rounded bg-gray-700 text-white"
          defaultValue={selectedTags}
        >
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}