'use client';

import { useState } from 'react';

export function useIllustration() {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return {
    imageError,
    handleImageError
  };
} 