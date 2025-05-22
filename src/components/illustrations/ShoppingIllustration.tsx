'use client';

import Image from 'next/image';
import { useIllustration } from './useIllustration';

export function ManagementIllustration() {
  const { imageError, handleImageError } = useIllustration();
  
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {!imageError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src="/login_management.svg"
            alt="Login Management"
            className="w-full h-auto max-h-full"
            width={1200}
            height={900}
            priority
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="text-center">
          <div className="text-6xl">👥</div>
          <p className="mt-4 text-lg text-gray-600">Welcome to our management platform</p>
        </div>
      )}
    </div>
  );
} 