import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { speechLangMap } from '@/hooks/useSpeech';

interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  highlight: boolean;
  largeCursor: boolean;
  highContrast: boolean;
}

interface SpeechContextType {
  isScreenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  settings: SpeechSettings;
  updateSettings: (settings: Partial<SpeechSettings>) => void;
}

const SpeechContext = createContext<SpeechContextType>({
  isScreenReaderMode: false,
  toggleScreenReaderMode: () => {},
  speak: () => {},
  stop: () => {},
  isSpeaking: false,
  availableVoices: [],
  selectedVoice: null,
  setSelectedVoice: () => {},
  settings: { rate: 0.85, pitch: 1, volume: 1, highlight: false, largeCursor: false, highContrast: false },
  updateSettings: () => {},
});

const SELECTED_VOICE_KEY = 'wwii-memorial-selected-voice';
const SETTINGS_KEY = 'wwii-memorial-settings';

const defaultSettings: SpeechSettings = {
  rate: 0.85,
  pitch: 1,
  volume: 1,
  highlight: false,
  largeCursor: false,
  highContrast: false,
};

function loadSavedSettings(): SpeechSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...defaultSettings };
}

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [settings, setSettings] = useState<SpeechSettings>(loadSavedSettings);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthUnlocked = useRef(false); // ← НОВОЕ: отслеживаем разблокировку

  const updateSettings = useCallback((partial: Partial<SpeechSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      setAvailableVoices(voices);
      
      // Try to restore saved voice
      const savedName = localStorage.getItem(SELECTED_VOICE_KEY);
      if (savedName) {
        const saved = voices.find(v => v.name === savedName);
        if (saved) setSelectedVoiceState(saved);
      }
    };
    
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // ← НОВОЕ: Разблокировка speechSynthesis для мобильных
  useEffect(() => {
    const unlockSynth = () => {
      if (!synthUnlocked.current && window.speechSynthesis) {
        // iOS Safari требует resume() или speak() пустой строки для активации
        window.speechSynthesis.resume?.();
        // Некоторые браузеры требуют speak() для полной активации
        const dummy = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(dummy);
        window.speechSynthesis.cancel(); // сразу отменяем
        synthUnlocked.current = true;
      }
    };

    // Разблокируем по первому клику/тачу
    document.addEventListener('click', unlockSynth, { once: true });
    document.addEventListener('touchstart', unlockSynth, { once: true });
    
    return () => {
      document.removeEventListener('click', unlockSynth);
      document.removeEventListener('touchstart', unlockSynth);
    };
  }, []);

  const setSelectedVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setSelectedVoiceState(voice);
    if (voice) {
      localStorage.setItem(SELECTED_VOICE_KEY, voice.name);
    } else {
      localStorage.removeItem(SELECTED_VOICE_KEY);
    }
  }, []);

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    // 1. Use explicitly selected voice
    if (selectedVoice && availableVoices.some(v => v.name === selectedVoice.name)) {
      return selectedVoice;
    }

    const voices = availableVoices.length > 0 ? availableVoices : (window.speechSynthesis?.getVoices() || []);
    const lang = speechLangMap[i18n.language] || 'en-US';
    const langPrefix = lang.split('-')[0];

    const langVoices = voices.filter((v) => v.lang === lang || v.lang.startsWith(langPrefix));

    if (langVoices.length === 0) {
      return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
    }

    // Priority: Google voices are the best
    const googlePatterns = [
      /Google\s*русский/i,
      /Google\s*Russian/i,
      /Google\s*US/i,
      /Google\s*UK/i,
      /Google/i,
    ];
    for (const pattern of googlePatterns) {
      const match = langVoices.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    // Fallback: Microsoft, Natural, Neural voices
    const qualityPatterns = [
      /Microsoft\s*(?:Irina|Pavel|Ekaterina|Dmitry)/i,
      /Premium/i,
      /Enhanced/i,
      /Natural/i,
      /Neural/i,
      /Wavenet/i,
    ];

    for (const pattern of qualityPatterns) {
      const match = langVoices.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    const roboticPatterns = [/Zarvox/i, /Bad News/i, /Bells/i, /Boing/i, /Bubbles/i, /Cellos/i, /Deranged/i, /Fred/i];
    const nonRobotic = langVoices.filter(
      (v) => !roboticPatterns.some((p) => p.test(v.name))
    );

    return nonRobotic[0] || langVoices[0];
  }, [i18n.language, selectedVoice, availableVoices]);

  const speak = useCallback(
    (text: string) => {
      if (!text || !window.speechSynthesis) return;

      // ← НОВОЕ: Разблокировка перед каждым speak() на мобильных
      if (!synthUnlocked.current) {
        window.speechSynthesis.resume?.();
        synthUnlocked.current = true;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const lang = speechLangMap[i18n.language] || 'en-US';
      utterance.lang = lang;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e.error);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      
      // ← НОВОЕ: Двойной вызов speak() для iOS Safari (известный workaround)
      window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    },
    [i18n.language, getVoice, settings]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleScreenReaderMode = useCallback(() => {
    setIsScreenReaderMode((prev) => {
      if (prev) stop();
      return !prev;
    });
  }, [stop]);

  return (
    <SpeechContext.Provider
      value={{ isScreenReaderMode, toggleScreenReaderMode, speak, stop, isSpeaking, availableVoices, selectedVoice, setSelectedVoice, settings, updateSettings }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechContext() {
  return useContext(SpeechContext);
}