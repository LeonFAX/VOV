import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, addDays, isAfter, isEqual, isSameDay, format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipBack, SkipForward, Radio, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechContext } from '@/contexts/SpeechContext';
import type { Event } from '@/types';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };
const PLAY_SPEED_DAYS = 1;
const BASE_PLAY_INTERVAL_MS = 500;
const BASE_PAUSE_MS = 18000;
const CHARS_PER_SECOND = 35;
const MIN_PAUSE_MS = 18000;
const MAX_PAUSE_MS = 40000;

interface TimelinePlayerProps {
  events: Event[];
  startDate: Date;
  endDate: Date;
  onDateChange: (date: Date) => void;
  onEventReach: (event: Event) => void;
  onEventLeave: () => void;
  currentDate: Date;
  onMapZoomChange?: (zoom: number) => void;
  onMapCenterChange?: (center: [number, number]) => void;
}

export function TimelinePlayer({
  events, startDate, endDate, onDateChange, onEventReach, onEventLeave,
  currentDate, onMapZoomChange, onMapCenterChange,
}: TimelinePlayerProps) {
  const { t, i18n } = useTranslation('pages');
  const { speak, stop, availableVoices, selectedVoice, setSelectedVoice } = useSpeechContext();
  const locale = dateLocales[i18n.language] || ru;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPausedOnEvent, setIsPausedOnEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [pauseCountdown, setPauseCountdown] = useState(0);
  const [visitedEvents, setVisitedEvents] = useState<Set<string>>(new Set());
  const [eventsRemainingToday, setEventsRemainingToday] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentDateRef = useRef<Date>(currentDate);

  const processEventRef = useRef<(event: Event, remaining: Event[], date: Date) => void>(undefined);
  const startPlaybackLoopRef = useRef<() => void>(undefined);

  useEffect(() => { currentDateRef.current = currentDate; }, [currentDate]);

  const { mappableEvents, eventsByDate } = useMemo(() => {
    const sorted = [...events].filter(e => e.coordinates).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const byDate = new Map<string, Event[]>();
    for (const event of sorted) {
      const key = format(new Date(event.date), 'yyyy-MM-dd');;
      const arr = byDate.get(key) || [];
      arr.push(event);
      byDate.set(key, arr);
    }
    return { mappableEvents: sorted, eventsByDate: byDate };
  }, [events]);

  const clearTimers = useCallback(() => {
    if (playIntervalRef.current) { clearInterval(playIntervalRef.current); playIntervalRef.current = null; }
    if (eventTimeoutRef.current) { clearTimeout(eventTimeoutRef.current); eventTimeoutRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  }, []);

  useEffect(() => () => { clearTimers(); stop(); }, [clearTimers, stop]);

  const doStop = useCallback(() => {
    clearTimers(); stop(); setIsPlaying(false); setIsPausedOnEvent(false);
    setCurrentEvent(null); setPauseCountdown(0); setEventsRemainingToday(0);
    onEventLeave(); onMapZoomChange?.(5);
  }, [clearTimers, stop, onEventLeave, onMapZoomChange]);

  const startCountdown = useCallback((seconds: number) => {
    setPauseCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setPauseCountdown(prev => prev > 1 ? prev - 1 : 0);
    }, 1000);
  }, []);

  const getAdaptivePauseMs = useCallback((text: string): number => {
    const estimated = BASE_PAUSE_MS + (text.length / CHARS_PER_SECOND) * 1000;
    return Math.max(MIN_PAUSE_MS, Math.min(MAX_PAUSE_MS, estimated));
  }, []);

  const processEvent = useCallback((event: Event, remainingQueue: Event[], date: Date) => {
    setCurrentEvent(event);
    setVisitedEvents(prev => new Set([...prev, event.id]));
    setEventsRemainingToday(remainingQueue.length);
    onDateChange(date); onEventReach(event);
    onMapCenterChange?.(event.coordinates as [number, number]);
    onMapZoomChange?.(11);

    const speakText = `${event.title}. ${format(date, 'd MMMM yyyy', { locale })}. ${event.location || ''}. ${event.description}`;
    const pauseMs = getAdaptivePauseMs(speakText);
    speak(speakText);
    startCountdown(Math.round(pauseMs / 1000));

    eventTimeoutRef.current = setTimeout(() => {
      if (remainingQueue.length > 0) {
        processEventRef.current?.(remainingQueue[0], remainingQueue.slice(1), date);
      } else {
        setIsPausedOnEvent(false); setCurrentEvent(null); setPauseCountdown(0); setEventsRemainingToday(0);
        onEventLeave(); onMapZoomChange?.(5);
        startPlaybackLoopRef.current?.();
      }
    }, pauseMs);
  }, [onDateChange, onEventReach, onEventLeave, onMapCenterChange, onMapZoomChange, speak, locale, startCountdown, getAdaptivePauseMs]);

  const startPlaybackLoop = useCallback(() => {
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    const adjustedInterval = Math.round(BASE_PLAY_INTERVAL_MS / playbackSpeed);
    playIntervalRef.current = setInterval(() => {
      const nextDate = addDays(currentDateRef.current, PLAY_SPEED_DAYS);
      if (isAfter(nextDate, endDate) || isEqual(nextDate, endDate)) {
        clearTimers(); setIsPlaying(false); onDateChange(endDate); stop(); return;
      }
      const dateKey = format(nextDate, 'yyyy-MM-dd');
      const eventsOnDay = (eventsByDate.get(dateKey) || []).filter(e => !visitedEvents.has(e.id));
      if (eventsOnDay.length > 0) {
        clearTimers(); setIsPausedOnEvent(true); currentDateRef.current = nextDate;
        processEventRef.current?.(eventsOnDay[0], eventsOnDay.slice(1), nextDate); return;
      }
      currentDateRef.current = nextDate; onDateChange(nextDate);
    }, adjustedInterval);
  }, [endDate, onDateChange, eventsByDate, visitedEvents, clearTimers, stop, playbackSpeed]);

  useEffect(() => {
    processEventRef.current = processEvent;
    startPlaybackLoopRef.current = startPlaybackLoop;
  }, [processEvent, startPlaybackLoop]);

  const togglePlay = useCallback(() => {
    if (isPlaying) { doStop(); }
    else {
      setIsPlaying(true); setVisitedEvents(new Set());
      if (isAfter(currentDateRef.current, endDate) || isEqual(currentDateRef.current, endDate)) {
        currentDateRef.current = startDate; onDateChange(startDate);
      }
      startPlaybackLoopRef.current?.();
    }
  }, [isPlaying, doStop, endDate, startDate, onDateChange]);

  const skipToStart = useCallback(() => { doStop(); setVisitedEvents(new Set()); currentDateRef.current = startDate; onDateChange(startDate); }, [doStop, startDate, onDateChange]);
  const skipToEnd = useCallback(() => { doStop(); currentDateRef.current = endDate; onDateChange(endDate); }, [doStop, endDate, onDateChange]);

  const skipToNextEvent = useCallback(() => {
    clearTimers(); stop();
    if (isPausedOnEvent && currentEvent) {
      const dateKey = format(currentEvent.date, 'yyyy-MM-dd');
      const eventsOnDay = (eventsByDate.get(dateKey) || []).filter(e => !visitedEvents.has(e.id));
      if (eventsOnDay.length > 0) {
        processEventRef.current?.(eventsOnDay[0], eventsOnDay.slice(1), currentEvent.date);
      } else {
        setIsPausedOnEvent(false); setCurrentEvent(null); setPauseCountdown(0); setEventsRemainingToday(0);
        onEventLeave(); onMapZoomChange?.(5); startPlaybackLoopRef.current?.();
      }
    } else {
      for (const event of mappableEvents) {
        if (isAfter(event.date, currentDateRef.current) || isSameDay(event.date, currentDateRef.current)) {
          if (visitedEvents.has(event.id)) continue;
          doStop(); setIsPlaying(false); setIsPausedOnEvent(true); setCurrentEvent(event);
          setVisitedEvents(prev => new Set([...prev, event.id]));
          currentDateRef.current = event.date; onDateChange(event.date); onEventReach(event);
          onMapCenterChange?.(event.coordinates as [number, number]); onMapZoomChange?.(11);
          const speakText = `${event.title}. ${format(event.date, 'd MMMM yyyy', { locale })}. ${event.location || ''}. ${event.description}`;
          const pauseMs = getAdaptivePauseMs(speakText);
          speak(speakText); startCountdown(Math.round(pauseMs / 1000));
          eventTimeoutRef.current = setTimeout(() => {
            setIsPausedOnEvent(false); setCurrentEvent(null); setPauseCountdown(0);
            onEventLeave(); onMapZoomChange?.(5);
          }, pauseMs); break;
        }
      }
    }
  }, [isPausedOnEvent, currentEvent, eventsByDate, visitedEvents, mappableEvents, clearTimers, stop, doStop, onDateChange, onEventReach, onEventLeave, onMapCenterChange, onMapZoomChange, speak, locale, startCountdown, getAdaptivePauseMs]);

  const totalDays = Math.max(1, differenceInDays(endDate, startDate));
  const currentDays = differenceInDays(currentDate, startDate);
  const progress = Math.min(100, Math.max(0, (currentDays / totalDays) * 100));

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newDays = Math.round((newProgress / 100) * totalDays);
    const newDate = addDays(startDate, newDays);
    doStop(); currentDateRef.current = newDate > endDate ? endDate : newDate;
    onDateChange(currentDateRef.current); setVisitedEvents(new Set());
  }, [totalDays, startDate, endDate, onDateChange, doStop]);

  return (
    <div className="bg-white rounded-lg p-4 border border-[#E8DFD4] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#8A8178] text-sm">{format(startDate, 'dd.MM.yyyy')}</div>
        <div className="flex flex-col items-center">
          <motion.div key={format(currentDate, 'yyyy-MM-dd')} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
            className={`text-xl font-bold font-serif ${isPausedOnEvent ? 'text-[#C4953A]' : 'text-[#9B1B1B]'}`}>
            {format(currentDate, 'd MMMM yyyy', { locale })}
          </motion.div>
          <AnimatePresence mode="wait">
            {isPausedOnEvent && currentEvent && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 mt-1">
                <Volume2 className="w-3 h-3 text-[#C4953A] animate-pulse" />
                <span className="text-[#C4953A] text-xs font-medium max-w-[250px] truncate">{currentEvent.title}</span>
                <span className="text-[#8A8178] text-xs">{pauseCountdown}s</span>
                {eventsRemainingToday > 0 && <span className="text-[#9B1B1B] text-xs">(+{eventsRemainingToday} {t('timeline.moreEvents')})</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-[#8A8178] text-sm">{format(endDate, 'dd.MM.yyyy')}</div>
      </div>

      <div className="relative mb-4">
        <div className="w-full h-2 bg-[#E8DFD4] rounded-lg overflow-hidden">
          <motion.div className="h-full bg-[#C4953A]" style={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="ghost" size="icon" onClick={skipToStart} className="text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8]" title={t('timeline.skipToStart')}>
          <SkipBack className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlay}
          className={`${isPlaying ? 'text-[#C4953A] hover:text-[#1F1A16]' : 'text-[#9B1B1B] hover:text-[#1F1A16]'} hover:bg-[#F5F0E8]`}
          title={isPlaying ? (isPausedOnEvent ? t('timeline.resume') : t('timeline.pause')) : t('timeline.play')}>
          {isPlaying && !isPausedOnEvent ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={skipToNextEvent} className="text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8]" title={isPausedOnEvent ? t('timeline.resume') : t('timeline.nextEvent')}>
          <SkipForward className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={skipToEnd} className="text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8]" title={t('timeline.skipToEnd')}>
          <Radio className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[#E8DFD4]">
          {[0.5, 1, 1.5, 2].map((speed) => (
            <Button
              key={speed}
              variant="ghost"
              size="sm"
              onClick={() => setPlaybackSpeed(speed)}
              className={`text-xs h-8 px-2 font-medium ${
                playbackSpeed === speed
                  ? 'text-[#C4953A] bg-[#C4953A]/10'
                  : 'text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8]'
              }`}
            >
              {speed}x
            </Button>
          ))}
        </div>
      </div>

      {isPlaying && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-[#E8DFD4]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPausedOnEvent ? 'bg-[#C4953A] animate-pulse' : 'bg-[#3D6B4A]'}`} />
              <span className="text-[#8A8178]">
                {isPausedOnEvent
                  ? (eventsRemainingToday > 0 ? `${t('timeline.pausedOnEvent')} (${eventsRemainingToday + 1} ${t('timeline.eventsRemaining')})` : t('timeline.pausedOnEvent'))
                  : t('timeline.playing')}
              </span>
            </div>
            <span className="text-[#8A8178]">
              {mappableEvents.filter(e => visitedEvents.has(e.id)).length} / {mappableEvents.length} {t('timeline.eventsVisited')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Voice Selector */}
      {availableVoices.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#E8DFD4]">
          <label className="text-[10px] text-[#8A8178] uppercase tracking-wider mb-1.5 block">Голос диктора / Narrator voice</label>
          <div className="flex gap-2">
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                setSelectedVoice(voice || null);
                if (voice) {
                  const u = new SpeechSynthesisUtterance('Тест голоса. Проверка озвучки.');
                  u.voice = voice;
                  u.rate = 0.85;
                  window.speechSynthesis.speak(u);
                }
              }}
              className="flex-1 bg-white border border-[#E8DFD4] rounded px-2 py-1.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C4953A]"
            >
              <option value="">Авто / Auto</option>
              <optgroup label="Google">
                {availableVoices
                  .filter(v => v.name.includes('Google'))
                  .map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
              </optgroup>
              <optgroup label="Microsoft / Apple / Other">
                {availableVoices
                  .filter(v => !v.name.includes('Google'))
                  .map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
              </optgroup>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const voice = selectedVoice || availableVoices[0];
                if (voice) {
                  const u = new SpeechSynthesisUtterance(currentEvent ? `${currentEvent.title}` : 'Тест голоса диктора');
                  u.voice = voice;
                  u.rate = 0.85;
                  window.speechSynthesis.speak(u);
                }
              }}
              className="text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8] text-xs px-2"
            >
              <Volume2 className="w-3.5 h-3.5 mr-1" />
              Тест
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
