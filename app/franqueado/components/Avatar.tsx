'use client';

import React from 'react';
import { User } from 'lucide-react';
import { getMediaUrl } from '@/lib/api-backend';

interface AvatarProps {
  src?: string | null;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar' }) => {
  if (src) {
    return (
      <img
        src={getMediaUrl(src)}
        alt={alt}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-white" />
    </div>
  );
};

export default Avatar;
