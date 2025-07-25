import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  href,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boring-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Purple (#8c7fff): Primary CTAs, active states, key highlights
    primary: 'bg-boring-purple text-white hover:bg-boring-purple/90 hover:transform hover:-translate-y-0.5 shadow-boring hover:shadow-lg active:transform active:translate-y-0',
    
    // Teal (#003e32): Headers, navigation, secondary buttons
    secondary: 'bg-transparent border-2 border-boring-teal text-boring-teal hover:bg-boring-teal hover:text-white hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    
    // Green (#00f78c): Success states, positive indicators
    accent: 'bg-boring-bright-green text-boring-charcoal hover:bg-boring-bright-green/90 hover:transform hover:-translate-y-0.5 shadow-sm hover:shadow-md active:transform active:translate-y-0',
    
    // Subtle ghost button
    ghost: 'bg-transparent text-boring-dark-gray hover:bg-boring-light-gray hover:text-boring-charcoal',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;