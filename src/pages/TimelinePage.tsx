import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar, SlidersHorizontal, Volume2, Info, X } from 'lucide-react';
import { useTranslatedEvents } from '@/hooks/useTranslatedData';
import { InteractiveMap } from '@/components/map';
import { MapFlyTo } from '@/components/map/MapFlyTo';
import { TimelinePlayer } from '@/components/timeline/TimelinePlayer';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Event as WarEvent } from '@/types';

const dateLocales: Record<string, typeof ru> = { ru, enUS, be: ru };

const START_DATE = new Date('1941-06-21');
const END_DATE = new Date('1945-09-02');

function getDirections(t: any) {
  return [
    { label: t('timeline.allDirections'), value: 'all' },
    { label: t('timeline.northDirection'), value: 'north' },
    { label: t('timeline.centerDirection'), value: 'center' },
    { label: t('timeline.southDirection'), value: 'south' },
    { label: t('timeline.westDirection'), value: 'west' },
    { label: t('timeline.eastDirection'), value: 'east' },
  ];
}

function getTypeLabels(t: any): Record<string, string> {
  return {
    battle: t('timeline.typeLabels.battle'),
    operation: t('timeline.typeLabels.operation'),
    movement: t('timeline.typeLabels.movement'),
    shelling: t('timeline.typeLabels.shelling'),
    political: t('timeline.typeLabels.political'),
    strategic: t('timeline.typeLabels.strategic'),
    liberation: t('timeline.typeLabels.liberation'),
    occupation: t('timeline.typeLabels.occupation'),
    offensive: t('timeline.typeLabels.offensive'),
    defense: t('timeline.typeLabels.defense'),
    encirclement: t('timeline.typeLabels.encirclement'),
    other: t('timeline.typeLabels.other'),
  };
}

const typeColors: Record<string, { bg: string; text: string }> = {
  battle: { bg: 'rgba(155,27,27,0.12)', text: '#9B1B1B' },
  shelling: { bg: 'rgba(155,27,27,0.08)', text: '#C4953A' },
  movement: { bg: 'rgba(61,107,74,0.12)', text: '#3D6B4A' },
  political: { bg: 'rgba(61,107,74,0.08)', text: '#3D6B4A' },
  strategic: { bg: 'rgba(196,149,58,0.12)', text: '#C4953A' },
  operation: { bg: 'rgba(196,149,58,0.08)', text: '#8A8178' },
  liberation: { bg: 'rgba(61,107,74,0.12)', text: '#3D6B4A' },
  occupation: { bg: 'rgba(155,27,27,0.08)', text: '#8A8178' },
  other: { bg: 'rgba(196,149,58,0.06)', text: '#8A8178' },
  offensive: { bg: 'rgba(155,27,27,0.15)', text: '#9B1B1B' },
  defense: { bg: 'rgba(61,107,74,0.15)', text: '#3D6B4A' },
  encirclement: { bg: 'rgba(196,149,58,0.15)', text: '#C4953A' },
};

export function TimelinePage() {
  const { t, i18n } = useTranslation('pages');
  const navigate = useNavigate();
  const events = useTranslatedEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('1941-06-21'));
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.0, 40.0]);
  const [mapZoom, setMapZoom] = useState(5);
  const [activeEvent, setActiveEvent] = useState<WarEvent | null>(null);
  const [showPlayerGuide, setShowPlayerGuide] = useState(true);
  const [showMobileLegend, setShowMobileLegend] = useState(false);

  const years = [1941, 1942, 1943, 1944, 1945];
  const locale = dateLocales[i18n.language] || ru;

  const goPrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    if (isBefore(newDate, START_DATE)) return;
    setSelectedDate(newDate);
    setActiveEvent(null);
    setMapZoom(5);
  };

  const goNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (isAfter(newDate, END_DATE)) return;
    setSelectedDate(newDate);
    setActiveEvent(null);
    setMapZoom(5);
  };

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedYear !== null) {
      result = result.filter(event => event.date.getFullYear() === selectedYear);
    }
    return result;
  }, [events, selectedYear]);

  const eventsUpToDate = useMemo(() => {
    return filteredEvents.filter(event => event.date <= selectedDate);
  }, [filteredEvents, selectedDate]);

  const selectedEvent = eventsUpToDate.length > 0
    ? eventsUpToDate[eventsUpToDate.length - 1]
    : null;

  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDatePickerClick = () => {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.click();
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime()) && !isBefore(newDate, START_DATE) && !isAfter(newDate, END_DATE)) {
      setSelectedDate(newDate);
      setActiveEvent(null);
      setMapZoom(5);
    }
  };

  const handleYearSelect = (year: number | null) => {
    setSelectedYear(year);
    if (year !== null) {
      const endOfYear = year === 1945 ? END_DATE : new Date(`${year}-12-31`);
      setSelectedDate(endOfYear);
    } else {
      setSelectedDate(START_DATE);
    }
    setActiveEvent(null);
    setMapZoom(5);
  };

  const getTypeStyle = (type: string) => {
    const colors = typeColors[type] || typeColors.other;
    return {
      backgroundColor: colors.bg,
      color: colors.text,
    };
  };

  const handlePlayerDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePlayerEventReach = (event: WarEvent) => {
    setActiveEvent(event);
  };

  const handlePlayerEventLeave = () => {
    setActiveEvent(null);
  };

  const mappableEvents = useMemo(() => {
    return filteredEvents.filter((e): e is WarEvent & { coordinates: [number, number] } => !!e.coordinates);
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Map controls bar — MOBILE OPTIMIZED */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#E8DFD4] shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
          {/* Top row: Date + Direction */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date pagination */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden border border-[#E8DFD4] shrink-0">
              <button
                onClick={goPrevDay}
                disabled={isBefore(subDays(selectedDate, 1), START_DATE)}
                className="px-2 sm:px-3 py-2 text-[#C4953A] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#E8DFD4]"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleDatePickerClick}
                className="px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 hover:bg-[#F5F0E8] transition-colors"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#9B1B1B]" />
                <span className="text-[#1F1A16] font-bold text-xs sm:text-sm whitespace-nowrap">
                  {format(selectedDate, 'd MMM yyyy', { locale })}
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  min={format(START_DATE, 'yyyy-MM-dd')}
                  max={format(END_DATE, 'yyyy-MM-dd')}
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={handleDateInputChange}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                />
              </button>
              <button
                onClick={goNextDay}
                disabled={isAfter(addDays(selectedDate, 1), END_DATE)}
                className="px-2 sm:px-3 py-2 text-[#C4953A] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-[#E8DFD4]"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Direction dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-[#E8DFD4] text-[#1F1A16] hover:bg-[#F5F0E8] hover:text-[#C4953A] gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-[#3D6B4A]" />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    {getDirections(t).find(d => d.value === selectedDirection)?.label || t('timeline.directions')}
                  </span>
                  <span className="text-xs sm:hidden">
                    {t('timeline.filter')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-[#E8DFD4] w-48">
                {getDirections(t).map((dir) => (
                  <DropdownMenuItem
                    key={dir.value}
                    onClick={() => setSelectedDirection(dir.value)}
                    className={`text-[#1F1A16] hover:bg-[#F5F0E8] hover:text-[#C4953A] cursor-pointer text-xs sm:text-sm ${selectedDirection === dir.value ? 'bg-[#C4953A]/10 text-[#C4953A]' : ''}`}
                  >
                    {dir.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile legend toggle */}
            <button
              onClick={() => setShowMobileLegend(!showMobileLegend)}
              className="lg:hidden ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs bg-[#F5F0E8] text-[#6B5D4F] border border-[#E8DFD4]"
            >
              <Info className="w-3 h-3" />
              {t('timeline.legend')}
            </button>
          </div>

          {/* Bottom row: Year filters — horizontal scroll on mobile */}
          <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
            <button
              onClick={() => handleYearSelect(null)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                selectedYear === null
                  ? 'bg-[#9B1B1B] text-white'
                  : 'bg-white text-[#8A8178] border border-[#E8DFD4] hover:border-[#9B1B1B] hover:text-[#1F1A16]'
              }`}
            >
              {t('timeline.allYears')}
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                  selectedYear === year
                    ? 'bg-[#9B1B1B] text-white'
                    : 'bg-white text-[#8A8178] border border-[#E8DFD4] hover:border-[#C4953A] hover:text-[#1F1A16]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Player Guide */}
      <AnimatePresence>
        {showPlayerGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#3D6B4A]/10 border-b border-[#3D6B4A]/20"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 flex items-center gap-2 sm:gap-3">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 text-[#3D6B4A] shrink-0" />
              <p className="text-[#3D6B4A] text-[10px] sm:text-xs flex-1 leading-tight">
                {t('timeline.playerGuide', 'Press Play to watch the war unfold...')}
              </p>
              <button
                onClick={() => setShowPlayerGuide(false)}
                className="text-[#3D6B4A] hover:text-[#1F1A16] text-[10px] sm:text-xs shrink-0 p-1"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <div className="relative">
        <InteractiveMap
          events={filteredEvents}
          selectedDate={selectedDate}
          onEventClick={(event) => navigate(`/events/${event.slug}`)}
          showMonuments={false}
          showFrontLine={true}
          showLegend={false} /* Hide default legend, use mobile toggle instead */
          showTypeFilters={false}
          center={mapCenter}
          zoom={mapZoom}
          height="calc(100vh - 240px)"
        >
          <MapFlyTo center={activeEvent?.coordinates as [number, number] || undefined} zoom={activeEvent ? 11 : mapZoom} duration={1.5} />
        </InteractiveMap>

        {/* Mobile Legend Overlay */}
        <AnimatePresence>
          {showMobileLegend && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-2 left-2 z-[1000] lg:hidden"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-lg border border-[#E8DFD4] p-3 shadow-xl max-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[#1F1A16] font-bold text-xs">{t('map.legendTitle')}</h4>
                  <button onClick={() => setShowMobileLegend(false)} className="text-[#8A8178]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#9B1B1B] border-dashed" style={{borderTop: '2px dashed #9B1B1B'}}></span>
                    <span>{t('map.frontLine')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9B1B1B]"></span>
                    <span>{t('map.battle')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3D6B4A]"></span>
                    <span>{t('map.operation')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8A8178]"></span>
                    <span>{t('map.movement')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C4953A]"></span>
                    <span>{t('map.shelling')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3D6B4A]/70"></span>
                    <span>{t('map.political')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C4953A]/70"></span>
                    <span>{t('map.strategic')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3D6B4A]/50"></span>
                    <span>{t('map.liberation')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8A8178]/50"></span>
                    <span>{t('map.occupation')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active event overlay — MOBILE OPTIMIZED */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10, x: '-50%' }}
              className="absolute bottom-4 sm:bottom-6 left-1/2 z-[1000] w-[calc(100%-16px)] sm:max-w-md sm:w-[90%]"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-lg border border-[#C4953A]/30 p-3 sm:p-5 shadow-2xl">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4953A] mt-0.5 animate-pulse shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <span className="text-[#C4953A] text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0">
                        {format(activeEvent.date, 'd MMM yyyy', { locale })}
                      </span>
                      <span 
                        className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] rounded font-medium shrink-0" 
                        style={getTypeStyle(activeEvent.type)}
                      >
                        {getTypeLabels(t)[activeEvent.type] || activeEvent.type}
                      </span>
                    </div>
                    <h3 className="text-[#1F1A16] font-bold text-sm sm:text-lg leading-tight">
                      {activeEvent.title}
                    </h3>
                  </div>
                </div>
                {activeEvent.images?.[0] && activeEvent.images[0] !== '/images/events/default-event.jpg' && (
                  <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden border border-[#E8DFD4]">
                    <img 
                      src={activeEvent.images[0]} 
                      alt={activeEvent.title}
                      className="w-full h-24 sm:h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <p className="text-[#6B5D4F] text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {activeEvent.description}
                </p>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#E8DFD4] flex items-center justify-between">
                  <span className="text-[#8A8178] text-[10px] sm:text-xs">
                    {t('timeline.narrating')}
                  </span>
                  <button
                    onClick={() => navigate(`/events/${activeEvent.slug}`)}
                    className="text-[#C4953A] hover:text-[#1F1A16] text-[10px] sm:text-xs font-medium shrink-0"
                  >
                    {t('timeline.readMore')} →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Player */}
      <div className="bg-white border-t border-[#E8DFD4]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
          <TimelinePlayer
            events={mappableEvents}
            startDate={START_DATE}
            endDate={END_DATE}
            onDateChange={handlePlayerDateChange}
            onEventReach={handlePlayerEventReach}
            onEventLeave={handlePlayerEventLeave}
            currentDate={selectedDate}
            onMapZoomChange={setMapZoom}
            onMapCenterChange={setMapCenter}
          />
        </div>
      </div>

      {/* Selected event info */}
      {selectedEvent && !activeEvent && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[#E8DFD4] rounded-lg p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-1 self-stretch bg-[#9B1B1B] rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <span className="text-[#C4953A] font-bold text-xs sm:text-sm">
                    {format(selectedEvent.date, 'd MMMM yyyy', { locale })}
                  </span>
                  <span 
                    className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded font-medium shrink-0" 
                    style={getTypeStyle(selectedEvent.type)}
                  >
                    {getTypeLabels(t)[selectedEvent.type] || selectedEvent.type}
                  </span>
                </div>
                {selectedEvent.images?.[0] && selectedEvent.images[0] !== '/images/events/default-event.jpg' && (
                  <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden border border-[#E8DFD4] bg-[#F5F0E8]">
                    <img 
                      src={selectedEvent.images[0]} 
                      alt={selectedEvent.title}
                      className="w-full h-28 sm:h-40 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <h3 className="text-[#1F1A16] font-bold text-base sm:text-lg mb-1 sm:mb-2">{selectedEvent.title}</h3>
                <p className="text-[#6B5D4F] text-xs sm:text-sm leading-relaxed">{selectedEvent.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}