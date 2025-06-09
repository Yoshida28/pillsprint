import React from 'react';
import { Pill } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeMap = {
    small: {
      containerClass: 'h-8 w-8',
      iconSize: 16,
    },
    medium: {
      containerClass: 'h-10 w-10',
      iconSize: 20,
    },
    large: {
      containerClass: 'h-12 w-12',
      iconSize: 24,
    },
  };

  const { containerClass, iconSize } = sizeMap[size];

  return (
    <div className={`${containerClass} bg-primary-500 rounded-full flex items-center justify-center`}>
      <Pill size={iconSize} className="text-white transform rotate-45" />
    </div>
  );
};

export default Logo;