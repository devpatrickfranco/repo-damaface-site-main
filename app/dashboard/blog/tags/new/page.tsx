import { createTag } from '../actions';

export default function NewTagPage() {
  async function handleCreateTag(formData: FormData): Promise<void> {
    await createTag(formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nova Tag</h1>
      <form action={handleCreateTag} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm">Nome</label>
          <input type="text" id="name" name="name" required className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm">Slug</label>
          <input type="text" id="slug" name="slug" required className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <button type="submit" className="bg-brand-pink text-white px-4 py-2 rounded">Criar</button>
      </form>
    </div>
  );
}
