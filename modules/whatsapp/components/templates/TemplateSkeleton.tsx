'use client';

export function TemplateSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
        >
          <div className="w-36 h-4 bg-gray-700 rounded-md" />
          <div className="w-20 h-6 bg-gray-700 rounded-full" />
          <div className="w-24 h-4 bg-gray-700 rounded-md" />
          <div className="w-16 h-4 bg-gray-700 rounded-md ml-auto" />
          <div className="w-24 h-4 bg-gray-700 rounded-md" />
          <div className="flex gap-2 ml-4">
            <div className="w-8 h-8 bg-gray-700 rounded-lg" />
            <div className="w-8 h-8 bg-gray-700 rounded-lg" />
            <div className="w-8 h-8 bg-gray-700 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
