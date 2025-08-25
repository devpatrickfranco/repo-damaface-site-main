'use client';
import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

export default function ImageUploader({ defaultValue = '' }: { defaultValue?: string }) {
  const isDefaultValueUrl = defaultValue.startsWith('http');
  const [uploadType, setUploadType] = useState(isDefaultValueUrl ? 'url' : 'upload');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Imagem de Capa</label>
      <div className="flex items-center space-x-4 mb-4">
        <button type="button" onClick={() => setUploadType('url')} className={`px-3 py-1 text-sm rounded-md ${uploadType === 'url' ? 'bg-brand-pink text-white' : 'bg-gray-600'}`}> <LinkIcon size={16} className="inline mr-1"/> URL </button>
        <button type="button" onClick={() => setUploadType('upload')} className={`px-3 py-1 text-sm rounded-md ${uploadType === 'upload' ? 'bg-brand-pink text-white' : 'bg-gray-600'}`}> <Upload size={16} className="inline mr-1"/> Upload </button>
      </div>

      {uploadType === 'url' ? (
        <div>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://exemplo.com/imagem.png"
            defaultValue={isDefaultValueUrl ? defaultValue : ''}
            className="w-full bg-gray-700 border-gray-600 rounded-md text-white focus:ring-brand-pink focus:border-brand-pink"
          />
          <input type="hidden" name="imageUpload" value="" />
        </div>
      ) : (
        <div>
          <input
            type="file"
            name="imageUpload"
            accept="image/png, image/jpeg, image/webp"
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-pink file:text-white hover:file:opacity-90"
          />
           <input type="hidden" name="imageUrl" value={!isDefaultValueUrl ? defaultValue : ''} />
        </div>
      )}
    </div>
  );
}