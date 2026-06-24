import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

// ← КЛЮЧЕВАЯ ФУНКЦИЯ: Разбудить speechSynthesis (Android Chrome требует это в обработчике)
function unlockSpeechSynthesis() {
  if (!window.speechSynthesis) return;
  
  // Android Chrome: resume + speak('') + cancel прямо в момент взаимодействия
  window.speechSynthesis.resume?.();
  const dummy = new SpeechSynthesisUtterance('');
  window.speechSynthesis.speak(dummy);
  window.speechSynthesis.cancel();
}

export function SpeakButton({
  text,
  label,
  className,
  size = 'md',
  variant = 'primary',
}: SpeakButtonProps) {
  const { speak, stop, isSpeaking } = useSpeechContext();
  const [localSpeaking, setLocalSpeaking] = useState(false);

  const isActive = isSpeaking || localSpeaking;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    primary: isActive
      ? 'bg-[#8B3A3A] text-[#D4C4A0] hover:bg-[#8B3A3A]/80 border-[#8B3A3A]'
      : 'bg-[#2E5A3C] text-[#D4C4A0] hover:bg-[#2E5A3C]/80 border-[#2E5A3C]',
    secondary: isActive
      ? 'bg-[#8B3A3A]/20 text-[#8B3A3A] border-[#8B3A3A]/30'
      : 'bg-[#C9A86A]/10 text-[#C9A86A] border-[#C9A86A]/30 hover:bg-[#C9A86A]/20',
    ghost: isActive
      ? 'text-[#8B3A3A] hover:bg-[#8B3A3A]/10'
      : 'text-[#8A7D6E] hover:text-[#C9A86A] hover:bg-[#C9A86A]/10',
  };

  const handleClick = () => {
    // ← КЛЮЧЕВОЙ ФИКС: Будим synthesis ПРЯМО В ОБРАБОТЧИКЕ КЛИКА
    unlockSpeechSynthesis();

    if (isActive) {
      stop();
      setLocalSpeaking(false);
    } else {
      setLocalSpeaking(true);
      speak(text);
      setTimeout(() => setLocalSpeaking(false), 15000);
    }
  };

  useEffect(() => {
    if (!isSpeaking) setLocalSpeaking(false);
  }, [isSpeaking]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center rounded-sm font-medium transition-all duration-200 border',
        sizeClasses[size],
        variantClasses[variant],
        isActive && 'animate-pulse',
        className
      )}
      title={isActive ? 'Stop' : label || 'Listen'}
      type="button"
    >
      {isActive ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
      {(label || size !== 'sm') && (
        <span>{isActive ? 'Stop' : label || 'Listen'}</span>
      )}
    </button>
  );
}

// Screen reader hover wrapper
export function SpeakOnHover({
  children,
  text,
  className,
}: {
  children: React.ReactNode;
  text: string;
  className?: string;
}) {
  const { speak, stop, isScreenReaderMode } = useSpeechContext();

  const handleMouseEnter = () => {
    if (isScreenReaderMode && text) {
      unlockSpeechSynthesis(); // ← тоже будим здесь
      speak(text);
    }
  };

  const handleMouseLeave = () => {
    if (isScreenReaderMode) {
      stop();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </span>
  );
}