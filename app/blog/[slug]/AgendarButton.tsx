// app/blog/[slug]/AgendarButton.tsx
'use client';

export default function AgendarButton() {
  const handleClick = () => {
    window.open(
      'https://wa.me/5511999999999?text=Olá! Li o artigo no blog e gostaria de agendar uma avaliação.',
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
    >
      Agendar Avaliação
    </button>
  );
}
