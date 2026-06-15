import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Crosshair } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/cards';
import { useTranslatedEvents } from '@/hooks/useTranslatedData';

export function EventsPage() {
  const { t } = useTranslation('pages');
  const events = useTranslatedEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');

  const yearFilters = [
    { label: t('events.allYears'), value: 'all' },
    { label: '1941', value: '1941' },
    { label: '1942', value: '1942' },
    { label: '1943', value: '1943' },
    { label: '1944', value: '1944' },
    { label: '1945', value: '1945' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = filterYear === 'all' || String(event.date.getFullYear()) === filterYear;

      return matchesSearch && matchesYear;
    });
  }, [searchQuery, filterYear, events]);

  const byYear = useMemo(() => {
    const groups: Record<number, typeof events> = {};
    filteredEvents.forEach((e) => {
      const y = new Date(e.date).getFullYear();
      if (!groups[y]) groups[y] = [];
      groups[y].push(e);
    });
    return groups;
  }, [filteredEvents]);

  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen py-12 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#9B1B1B] to-transparent mb-6 opacity-60" />
          <div className="flex items-center gap-3 mb-4">
            <Crosshair className="w-8 h-8 text-[#9B1B1B]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] font-serif">
              {t('events.title')}
            </h1>
          </div>
          <p className="text-[#6B5D4F] text-lg max-w-2xl leading-relaxed">
            {t('events.description')}
          </p>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#9B1B1B] to-transparent mt-6 opacity-60" />
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8178]" />
          <Input
            type="text"
            placeholder={t('events.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 bg-white border-[#E8DFD4] text-[#1F1A16] placeholder:text-[#8A8178] focus:border-[#C4953A] rounded-lg"
          />
        </div>

        {/* Year filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {yearFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={filterYear === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterYear(filter.value)}
              className={
                filterYear === filter.value
                  ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] border-[#9B1B1B] rounded-lg text-sm'
                  : 'border-[#E8DFD4] text-[#8A8178] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-lg text-sm'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Results */}
        {years.length === 0 ? (
          <div className="text-center py-20">
            <Crosshair className="w-16 h-16 text-[#E8DFD4] mx-auto mb-4" />
            <p className="text-[#8A8178] text-lg">{t('events.noResults')}</p>
            <Button
              variant="ghost"
              onClick={() => { setSearchQuery(''); setFilterYear('all'); }}
              className="text-[#C4953A] mt-4"
            >
              {t('actions.resetFilters')}
            </Button>
          </div>
        ) : (
          years.map((year) => (
            <div key={year} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#9B1B1B] rounded-full" />
                  <h2 className="text-2xl font-bold text-[#C4953A] font-serif">{year}</h2>
                </div>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#C4953A] to-transparent" />
                <span className="text-[#8A8178] text-sm">{byYear[year].length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {byYear[year].map((event, i) => (
                  <div key={event.id} id={`event-${event.id}`}>
                    <EventCard event={event} index={i} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
