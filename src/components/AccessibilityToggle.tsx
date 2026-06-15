import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Volume2, VolumeX, ChevronUp, Settings } from 'lucide-react';
import { useSpeechContext } from '@/contexts/SpeechContext';

export function AccessibilityToggle() {
  const {
    isScreenReaderMode,
    toggleScreenReaderMode,
    isSpeaking,
    stop,
    settings,
    updateSettings,
  } = useSpeechContext();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPanel]);

  const toggleMode = () => {
    toggleScreenReaderMode();
    if (isScreenReaderMode) {
      setShowPanel(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Кнопка в шапке */}
      <button
        onClick={toggleMode}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
          isScreenReaderMode
            ? 'bg-[#C4953A] text-white shadow-lg shadow-[#C4953A]/30'
            : 'text-[#8A8178] hover:text-[#C4953A] hover:bg-[#C4953A]/10'
        }`}
        aria-label={isScreenReaderMode ? 'Выключить режим для слабовидящих' : 'Включить режим для слабовидящих'}
        title={isScreenReaderMode ? 'Режим для слабовидящих включён' : 'Режим для слабовидящих'}
      >
        {isScreenReaderMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        <span className="hidden md:inline text-sm font-medium">Доступность</span>
        {isScreenReaderMode && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#9B1B1B] rounded-full animate-pulse" />
        )}
      </button>

      {/* Панель настроек — светлый стиль как на сайте */}
      {isScreenReaderMode && (
        <div className="absolute top-full right-0 mt-3 w-[320px] bg-white rounded-xl shadow-2xl border border-[#E8DFD4] z-50 overflow-hidden">
          {/* Заголовок панели */}
          <div className="bg-[#FAF6F0] px-5 py-4 border-b border-[#E8DFD4]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C4953A]/15 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#C4953A]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F1A16] text-sm">Режим для слабовидящих</h3>
                  <p className="text-xs text-[#8A8178] mt-0.5">Наведите курсор на элемент для озвучивания</p>
                </div>
              </div>
              <button
                onClick={() => setShowPanel(!showPanel)}
                className="w-7 h-7 rounded-lg bg-white border border-[#E8DFD4] flex items-center justify-center text-[#8A8178] hover:text-[#1F1A16] hover:border-[#C4953A] transition-all"
                aria-label={showPanel ? 'Свернуть настройки' : 'Развернуть настройки'}
              >
                {showPanel ? <ChevronUp className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Индикатор озвучивания */}
          {isSpeaking && (
            <div className="mx-4 mt-3 bg-[#9B1B1B]/8 rounded-lg p-2.5 border border-[#9B1B1B]/20 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#9B1B1B]/15 flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5 text-[#9B1B1B]" />
              </div>
              <span className="text-xs text-[#9B1B1B] font-medium">Озвучивание...</span>
              <button
                onClick={stop}
                className="ml-auto w-6 h-6 rounded-full hover:bg-[#9B1B1B]/15 flex items-center justify-center transition-colors"
                aria-label="Остановить"
              >
                <VolumeX className="w-3.5 h-3.5 text-[#9B1B1B]" />
              </button>
            </div>
          )}

          {/* Содержимое панели */}
          {showPanel && (
            <div className="p-4 space-y-4">
              {/* Слайдеры */}
              <div className="space-y-3">
                <Slider
                  label="Скорость речи"
                  value={settings.rate}
                  min={0.3}
                  max={1.5}
                  step={0.05}
                  format={(v) => `${v.toFixed(2)}x`}
                  onChange={(v) => updateSettings({ rate: v })}
                />
                <Slider
                  label="Высота голоса"
                  value={settings.pitch}
                  min={0.5}
                  max={2}
                  step={0.1}
                  format={(v) => v.toFixed(1)}
                  onChange={(v) => updateSettings({ pitch: v })}
                />
                <Slider
                  label="Громкость"
                  value={settings.volume}
                  min={0.1}
                  max={1}
                  step={0.1}
                  format={(v) => `${Math.round(v * 100)}%`}
                  onChange={(v) => updateSettings({ volume: v })}
                />
              </div>

              {/* Разделитель */}
              <div className="h-px bg-[#E8DFD4]" />

              {/* Переключатели */}
              <div className="space-y-2.5">
                <Toggle
                  label="Подсветка элементов"
                  description="Выделение рамкой при наведении"
                  checked={settings.highlight}
                  onChange={(v) => updateSettings({ highlight: v })}
                />
                <Toggle
                  label="Увеличенный курсор"
                  description="Большой курсор для навигации"
                  checked={settings.largeCursor}
                  onChange={(v) => updateSettings({ largeCursor: v })}
                />
                <Toggle
                  label="Высокая контрастность"
                  description="Чёрный фон, белый текст"
                  checked={settings.highContrast}
                  onChange={(v) => updateSettings({ highContrast: v })}
                />
              </div>
            </div>
          )}

          {/* Подвал панели */}
          <div className="bg-[#FAF6F0] px-4 py-2.5 border-t border-[#E8DFD4]">
            <p className="text-[10px] text-[#8A8178] text-center">
              Настройки сохраняются автоматически
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Слайдер
function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-[#5c4a3a]">{label}</span>
        <span className="text-xs font-bold text-[#C4953A] bg-[#C4953A]/10 px-2 py-0.5 rounded">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-[#E8DFD4] rounded-full appearance-none cursor-pointer accent-[#C4953A]"
        aria-label={label}
      />
    </div>
  );
}

// Переключатель
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-sm font-medium text-[#1F1A16]">{label}</p>
        {description && <p className="text-xs text-[#8A8178] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#C4953A]' : 'bg-[#E8DFD4]'
        }`}
        aria-checked={checked}
        role="switch"
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
