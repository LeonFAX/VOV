import { useCallback, useRef, useState } from 'react';

interface UseSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const { lang = 'en-US', rate = 0.9, pitch = 1, volume = 1 } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Try to find a voice matching the language
    const langPrefix = lang.split('-')[0];
    const voice = voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang.startsWith(langPrefix)) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];
    return voice;
  }, [lang]);

  const speak = useCallback(
    (text: string) => {
      if (!text || !window.speechSynthesis) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [lang, rate, pitch, volume, getVoice]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  return { speak, stop, pause, resume, isSpeaking, isPaused };
}

// Map i18n language codes to speech synthesis language codes
export const speechLangMap: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  be: 'ru-RU', // Belarusian uses Russian voice
};
