import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundTextureProps {
  variant?: 'light-gray' | 'mint-gradient' | 'purple-accent' | 'gradient-accent';
  intensity?: 'subtle' | 'normal' | 'strong';
  children: React.ReactNode;
  className?: string;
}

const BackgroundTexture: React.FC<BackgroundTextureProps> = ({
  variant = 'light-gray',
  intensity = 'normal',
  children,
  className
}) => {
  const variants = {
    'light-gray': 'bg-boring-light-gray',
    'mint-gradient': 'bg-gradient-to-br from-boring-light-gray via-boring-mint/30 to-boring-light-gray',
    'purple-accent': 'bg-gradient-to-br from-boring-purple/10 to-boring-purple/5',
    'gradient-accent': 'bg-gradient-accent-subtle',
  };

  const intensities = {
    'subtle': 'grain-texture-subtle',
    'normal': 'grain-texture',
    'strong': 'grain-texture-strong',
  };

  return (
    <div className={cn(
      'relative',
      variants[variant],
      intensities[intensity],
      className
    )}>
      {children}
    </div>
  );
};

export default BackgroundTexture;