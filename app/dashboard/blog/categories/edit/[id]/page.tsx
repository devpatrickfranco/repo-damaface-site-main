// No seu componente de edição
import { updateCategory } from '../../actions'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const updateCategoryWithId = updateCategory.bind(null, params.id);

  return (
    <form action={updateCategoryWithId} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm">Nome</label>
        <input type="text" id="name" name="name" required className="w-full p-2 rounded bg-gray-700 text-white" />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm">Slug</label>
        <input type="text" id="slug" name="slug" required className="w-full p-2 rounded bg-gray-700 text-white" />
      </div>
      <button type="submit" className="bg-brand-pink text-white px-4 py-2 rounded">Atualizar</button>
    </form>
  );
}