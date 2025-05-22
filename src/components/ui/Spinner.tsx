import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'white';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const colorClasses = {
  green: 'border-green-500',
  blue: 'border-blue-500',
  white: 'border-white',
};

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'green',
  className = '' 
}) => {
  return (
    <div 
      className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Loading"
    />
  );
}; 