import { prisma } from '@/lib/prisma';
import { updateTag } from '../../action';

export default async function EditTagPage({ params }: { params: { id: string } }) {  
    const tag = await prisma.tag.findUnique({ where: { id: params.id } });
    if (!tag) return <div>Tag não encontrada.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Tag</h1>
      <form
        action={async (formData: FormData) => {
          await updateTag(tag.id, formData);
        }}
        className="space-y-4 max-w-md"
      >
        <div>
          <label htmlFor="name" className="block text-sm">Nome</label>
          <input type="text" id="name" name="name" required defaultValue={tag.name} className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm">Slug</label>
          <input type="text" id="slug" name="slug" required defaultValue={tag.slug} className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <button type="submit" className="bg-brand-pink text-white px-4 py-2 rounded">Salvar</button>
      </form>
    </div>
  );
}
