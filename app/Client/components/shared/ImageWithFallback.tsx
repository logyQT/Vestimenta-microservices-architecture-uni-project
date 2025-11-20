import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<Props> = ({ src, alt, className, fallbackText, ...props }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-zinc-900 flex flex-col items-center justify-center text-zinc-600 ${className}`}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs uppercase tracking-widest opacity-50">{fallbackText || "Image Unavailable"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};