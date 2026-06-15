import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar, SlidersHorizontal, Volume2, Info } from 'lucide-react';
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
      {/* Map controls bar */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#E8DFD4] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
          {/* Date pagination */}
          <div className="flex items-center bg-white rounded-lg overflow-hidden border border-[#E8DFD4]">
            <button
              onClick={goPrevDay}
              disabled={isBefore(subDays(selectedDate, 1), START_DATE)}
              className="px-3 py-2 text-[#C4953A] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#E8DFD4]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleDatePickerClick}
              className="px-4 py-2 flex items-center gap-2 hover:bg-[#F5F0E8] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#9B1B1B]" />
              <span className="text-[#1F1A16] font-bold text-sm whitespace-nowrap">
                {format(selectedDate, 'd MMMM yyyy', { locale })}
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
              className="px-3 py-2 text-[#C4953A] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-[#E8DFD4]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Direction dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white border-[#E8DFD4] text-[#1F1A16] hover:bg-[#F5F0E8] hover:text-[#C4953A] gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#3D6B4A]" />
                <span className="text-sm">
                  {getDirections(t).find(d => d.value === selectedDirection)?.label || t('timeline.directions')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-[#E8DFD4]">
              {getDirections(t).map((dir) => (
                <DropdownMenuItem
                  key={dir.value}
                  onClick={() => setSelectedDirection(dir.value)}
                  className={`text-[#1F1A16] hover:bg-[#F5F0E8] hover:text-[#C4953A] cursor-pointer ${selectedDirection === dir.value ? 'bg-[#C4953A]/10 text-[#C4953A]' : ''}`}
                >
                  {dir.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year quick filters */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => handleYearSelect(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3">
              <Info className="w-4 h-4 text-[#3D6B4A] shrink-0" />
              <p className="text-[#3D6B4A] text-xs flex-1">
                {t('timeline.playerGuide', 'Press Play to watch the war unfold...')}
              </p>
              <button
                onClick={() => setShowPlayerGuide(false)}
                className="text-[#3D6B4A] hover:text-[#1F1A16] text-xs shrink-0"
              >
                {t('timeline.dismiss')}
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
          showLegend={true}
          showTypeFilters={true}
          center={mapCenter}
          zoom={mapZoom}
          height="calc(100vh - 280px)"
        >
          <MapFlyTo center={activeEvent?.coordinates as [number, number] || undefined} zoom={activeEvent ? 11 : mapZoom} duration={1.5} />
        </InteractiveMap>

        {/* Active event overlay */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10, x: '-50%' }}
              className="absolute bottom-6 left-1/2 z-[1000] max-w-md w-[90%]"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-lg border border-[#C4953A]/30 p-5 shadow-2xl">
                <div className="flex items-start gap-3 mb-3">
                  <Volume2 className="w-5 h-5 text-[#C4953A] mt-0.5 animate-pulse shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#C4953A] text-xs font-bold uppercase tracking-wider">
                        {format(activeEvent.date, 'd MMMM yyyy', { locale })}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] rounded font-medium" style={getTypeStyle(activeEvent.type)}>
                        {getTypeLabels(t)[activeEvent.type] || activeEvent.type}
                      </span>
                    </div>
                    <h3 className="text-[#1F1A16] font-bold text-lg leading-tight">
                      {activeEvent.title}
                    </h3>
                  </div>
                </div>
                {activeEvent.images?.[0] && activeEvent.images[0] !== '/images/events/default-event.jpg' && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-[#E8DFD4]">
                    <img 
                      src={activeEvent.images[0]} 
                      alt={activeEvent.title}
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <p className="text-[#6B5D4F] text-sm leading-relaxed line-clamp-3">
                  {activeEvent.description}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E8DFD4] flex items-center justify-between">
                  <span className="text-[#8A8178] text-xs">
                    {t('timeline.narrating')}
                  </span>
                  <button
                    onClick={() => navigate(`/events/${activeEvent.slug}`)}
                    className="text-[#C4953A] hover:text-[#1F1A16] text-xs font-medium"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[#E8DFD4] rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-1.5 self-stretch bg-[#9B1B1B] rounded-full shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#C4953A] font-bold text-sm">
                    {format(selectedEvent.date, 'd MMMM yyyy', { locale })}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded font-medium" style={getTypeStyle(selectedEvent.type)}>
                    {getTypeLabels(t)[selectedEvent.type] || selectedEvent.type}
                  </span>
                </div>
                {selectedEvent.images?.[0] && selectedEvent.images[0] !== '/images/events/default-event.jpg' && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-[#E8DFD4] bg-[#F5F0E8]">
                    <img 
                      src={selectedEvent.images[0]} 
                      alt={selectedEvent.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <h3 className="text-[#1F1A16] font-bold text-lg mb-2">{selectedEvent.title}</h3>
                <p className="text-[#6B5D4F] text-sm leading-relaxed">{selectedEvent.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
