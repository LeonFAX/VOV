import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'be', label: 'Беларуская', flag: '🇧🇾' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLang = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm text-[#A09080] hover:text-[#D4C4A0] hover:bg-[#3D3225]/40 transition-all"
        title={currentLang.label}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium uppercase">{currentLang.code}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#1C1810] border border-[#3D3225] rounded-sm shadow-xl overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#3D3225]/50 ${
                i18n.language === lang.code
                  ? 'text-[#C9A86A] bg-[#3D3225]/30'
                  : 'text-[#A09080]'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
