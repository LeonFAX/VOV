import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AccessibilityToggle } from '@/components/AccessibilityToggle';

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/timeline', label: 'nav.timeline' },
  { path: '/heroes', label: 'nav.heroes' },
  { path: '/letters', label: 'nav.letters' },
  { path: '/events', label: 'nav.events' },
  { path: '/monuments', label: 'nav.monuments' },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E8DFD4]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <path d="M20 2L24.5 14.5H37.5L27 22L31 34.5L20 27L9 34.5L13 22L2.5 14.5H15.5L20 2Z" fill="#C4953A" stroke="#3D6B4A" strokeWidth="1"/>
                <circle cx="20" cy="20" r="4" fill="#9B1B1B"/>
              </svg>
              <span className="hidden sm:block text-[#1F1A16] font-semibold text-sm max-w-[150px] leading-tight font-serif tracking-wide">
                {t('hero.title')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive(item.path)
                      ? 'text-[#C4953A] border border-[#C4953A] bg-[#C4953A]/5'
                      : 'text-[#6B5D4F] hover:text-[#1F1A16] border border-transparent hover:border-[#E8DFD4]'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#E8DFD4]/30"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>

              <AccessibilityToggle />
              
              <LanguageSwitcher />

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#E8DFD4]/30"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F8F5F0] border-t border-[#E8DFD4] shadow-lg">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-6 py-3 text-base font-medium transition-colors border-l-2 ${
                    isActive(item.path)
                      ? 'text-[#C4953A] border-[#C4953A] bg-[#C4953A]/5'
                      : 'text-[#6B5D4F] border-transparent hover:text-[#1F1A16] hover:bg-[#E8DFD4]/20'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
