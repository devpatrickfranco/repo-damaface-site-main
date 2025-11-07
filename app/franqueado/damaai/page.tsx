'use client';

export default function DamaAiPage() {
  return (
    <div className="fixed inset-0 flex flex-col">
      <iframe
        src="https://chat.damaface.com.br/app/"
        title="Dama.ai Chat"
        className="w-full h-full border-none"
        allow="microphone; camera; clipboard-write"
      />
    </div>
  );
}