import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // ← добавить

const languages = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'be', label: 'Беларуская', flag: '🇧🇾' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

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

  // Вычисляем позицию dropdown при открытии
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 140),
      });
    }
  }, [open]);

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

      {open && createPortal(
        <div 
          className="fixed bg-[#1C1810] border border-[#3D3225] rounded-sm shadow-xl overflow-hidden z-[9999] min-w-[140px]"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
        >
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
        </div>,
        document.body
      )}
    </div>
  );
}