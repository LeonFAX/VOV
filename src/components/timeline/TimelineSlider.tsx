import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays, addDays } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };

interface TimelineSliderProps {
  startDate: Date;
  endDate: Date;
  value: Date;
  onChange: (date: Date) => void;
  keyDates?: { date: Date; label: string }[];
}

export function TimelineSlider({
  startDate,
  endDate,
  value,
  onChange,
  keyDates = [],
}: TimelineSliderProps) {
  const { t, i18n } = useTranslation('pages');
  const locale = dateLocales[i18n.language] || ru;
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Use exact day differences without Math.ceil to avoid rounding errors
  const totalDays = Math.max(1, differenceInDays(endDate, startDate));
  const currentDays = differenceInDays(value, startDate);
  const progress = Math.min(100, Math.max(0, (currentDays / totalDays) * 100));

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newDays = Math.round((newProgress / 100) * totalDays);
    const newDate = addDays(startDate, newDays);
    // Clamp to end date
    if (newDate > endDate) {
      onChange(endDate);
    } else {
      onChange(newDate);
    }
  }, [totalDays, startDate, endDate, onChange]);

  const play = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const currentDateRef = { current: value };
      intervalRef.current = setInterval(() => {
        const newDate = addDays(currentDateRef.current, 7);
        if (newDate >= endDate) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsPlaying(false);
          currentDateRef.current = endDate;
          onChange(endDate);
        } else {
          currentDateRef.current = newDate;
          onChange(newDate);
        }
      }, 600);
    }
  }, [isPlaying, endDate, onChange, value]);

  const skipToStart = useCallback(() => {
    onChange(startDate);
  }, [onChange, startDate]);

  const skipToEnd = useCallback(() => {
    onChange(endDate);
  }, [onChange, endDate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Sync slider position when value changes externally
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.value = String(progress);
    }
  }, [progress]);

  return (
    <div className="bg-[#231E15] rounded-lg p-4 border border-[#3D3225]">
      {/* Date Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#B8A080] text-sm">
          {format(startDate, 'dd.MM.yyyy')}
        </div>
        <motion.div
          key={format(value, 'yyyy-MM-dd')}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-[#8B6914] text-xl font-bold font-serif"
        >
          {format(value, 'd MMMM yyyy', { locale })}
        </motion.div>
        <div className="text-[#B8A080] text-sm">
          {format(endDate, 'dd.MM.yyyy')}
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-4">
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#C9B896] rounded-lg appearance-none cursor-pointer accent-[#8B6914]"
        />
        
        {/* Key Dates Markers */}
        {keyDates.map((keyDate) => {
          const keyDays = differenceInDays(keyDate.date, startDate);
          const keyProgress = (keyDays / totalDays) * 100;
          
          return (
            <div
              key={keyDate.label}
              className="absolute top-0 w-0.5 h-4 bg-[#8B3A3A] -mt-1"
              style={{ left: `${keyProgress}%` }}
              title={keyDate.label}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={skipToStart}
          className="text-[#6A5D50] hover:text-[#D4C4A0] hover:bg-[#3D3225]"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={play}
          className="text-[#8B6914] hover:text-[#D4C4A0] hover:bg-[#3D3225]"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={skipToEnd}
          className="text-[#6A5D50] hover:text-[#D4C4A0] hover:bg-[#3D3225]"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Key Dates Labels */}
      {keyDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#3D3225]">
          <p className="text-[#B8A080] text-xs mb-2">{t('events.keyDates')}:</p>
          <div className="flex flex-wrap gap-2">
            {keyDates.map((keyDate) => (
              <button
                key={keyDate.label}
                onClick={() => onChange(keyDate.date)}
                className="text-xs bg-[#C9B896] text-[#6A5D50] px-2 py-1 rounded hover:bg-[#8B6914]/20 hover:text-[#8B6914] transition-colors"
              >
                {keyDate.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
