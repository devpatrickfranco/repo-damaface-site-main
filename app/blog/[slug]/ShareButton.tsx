'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

// O componente agora recebe as informações do post para poder compartilhá-las
interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blog/${slug}`;
    const shareData = {
      title: title,
      text: `Confira este artigo: ${title}`,
      url: shareUrl,
    };

    // Tenta usar a API de compartilhamento nativa do navegador (mobile, etc.)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      // Fallback para desktops: copiar o link para a área de transferência
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Mostra a mensagem "Copiado!" por 2 segundos
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-gray-400 hover:text-brand-pink transition-colors rounded-lg hover:bg-gray-800 relative"
      title="Compartilhar"
    >
      <Share2 className="w-4 h-4" />
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-pink text-white text-xs px-2 py-1 rounded-md">
          Copiado!
        </span>
      )}
    </button>
  );
}