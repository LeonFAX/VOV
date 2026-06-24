import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const languages = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'be', label: 'Беларуская', flag: '🇧🇾' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // ← ref для dropdown
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  // ← ИСПРАВЛЕНО: Проверяем оба ref — trigger и dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickedTrigger = ref.current && ref.current.contains(target);
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      
      if (!clickedTrigger && !clickedDropdown) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePosition = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, updatePosition]);

  const switchLang = (code: string) => {
    console.log('Switching to:', code); // ← для отладки
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
          ref={dropdownRef} // ← ref для проверки клика
          className="fixed bg-[#1C1810] border border-[#3D3225] rounded-sm shadow-xl overflow-hidden z-[9999] min-w-[160px]"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-[#3D3225]/50 flex items-center gap-2 ${
                i18n.language === lang.code
                  ? 'text-[#C9A86A] bg-[#3D3225]/30'
                  : 'text-[#A09080]'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}