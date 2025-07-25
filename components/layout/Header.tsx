import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  showNavigation?: boolean;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showNavigation = true,
  currentPage 
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-subtle border-b border-boring-mint/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-boring-teal to-boring-dark-gray rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-boring-teal">
                Boring Mortgages Ontario
              </h1>
              <p className="text-sm text-boring-dark-gray">Making complex mortgages boringly simple</p>
            </div>
          </Link>

          {/* Navigation */}
          {showNavigation && (
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className={`text-boring-dark-gray dark:text-boring-light-gray hover:text-boring-teal dark:hover:text-boring-teal font-medium transition-colors ${
                    currentPage === 'home' ? 'text-boring-teal' : ''
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/mortgage-payment-calculator" 
                  className={`text-boring-dark-gray dark:text-boring-light-gray hover:text-boring-teal dark:hover:text-boring-teal font-medium transition-colors ${
                    currentPage === 'calculator' ? 'text-boring-teal' : ''
                  }`}
                >
                  Calculators
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  href="https://callme.mortgagewithford.ca"
                >
                  Book Consultation →
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;