import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, X, User, Calendar, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useTranslatedHeroes, useTranslatedEvents, useTranslatedLetters, useTranslatedMonuments } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };

export function SearchPage() {
  const { t, i18n } = useTranslation('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const heroes = useTranslatedHeroes();
  const events = useTranslatedEvents();
  const letters = useTranslatedLetters();
  const monuments = useTranslatedMonuments();
  const locale = dateLocales[i18n.language] || ru;

  const searchTypes = [
    { value: 'all', label: t('search.all'), icon: Search },
    { value: 'hero', label: t('search.heroes'), icon: User },
    { value: 'event', label: t('search.events'), icon: Calendar },
    { value: 'letter', label: t('search.letters'), icon: Mail },
    { value: 'monument', label: t('search.monuments'), icon: MapPin },
  ];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{ item: any; type: string; title: string; subtitle: string; link: string }> = [];

    if (selectedType === 'all' || selectedType === 'hero') {
      heroes.forEach(hero => {
        const fullName = `${hero.lastName} ${hero.firstName} ${hero.middleName || ''}`;
        if (fullName.toLowerCase().includes(query) || 
            hero.biography.toLowerCase().includes(query) ||
            hero.militaryRank.toLowerCase().includes(query)) {
          results.push({
            item: hero,
            type: 'hero',
            title: fullName,
            subtitle: hero.militaryRank,
            link: `/heroes/${hero.slug}`,
          });
        }
      });
    }

    if (selectedType === 'all' || selectedType === 'event') {
      events.forEach(event => {
        if (event.title.toLowerCase().includes(query) || 
            event.description.toLowerCase().includes(query) ||
            (event.location && event.location.toLowerCase().includes(query))) {
          results.push({
            item: event,
            type: 'event',
            title: event.title,
            subtitle: format(event.date, 'd MMMM yyyy', { locale }),
            link: `/events/${event.slug}`,
          });
        }
      });
    }

    if (selectedType === 'all' || selectedType === 'letter') {
      letters.forEach(letter => {
        if (letter.author.toLowerCase().includes(query) || 
            letter.recipient.toLowerCase().includes(query) ||
            letter.text.toLowerCase().includes(query)) {
          results.push({
            item: letter,
            type: 'letter',
            title: t('search.letterFrom', { author: letter.author }),
            subtitle: t('search.letterTo', { recipient: letter.recipient }),
            link: `/letters/${letter.slug}`,
          });
        }
      });
    }

    if (selectedType === 'all' || selectedType === 'monument') {
      monuments.forEach(monument => {
        if (monument.name.toLowerCase().includes(query) || 
            monument.description.toLowerCase().includes(query) ||
            monument.location.toLowerCase().includes(query)) {
          results.push({
            item: monument,
            type: 'monument',
            title: monument.name,
            subtitle: monument.location,
            link: `/monuments/${monument.slug}`,
          });
        }
      });
    }

    return results;
  }, [searchQuery, selectedType, heroes, events, letters, monuments, t, locale]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-[#9B1B1B]';
      case 'event': return 'bg-[#166534]';
      case 'letter': return 'bg-[#8B6914]';
      case 'monument': return 'bg-[#6B5D4F]';
      default: return 'bg-[#C4953A]';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hero': return t('search.typeHero');
      case 'event': return t('search.typeEvent');
      case 'letter': return t('search.typeLetter');
      case 'monument': return t('search.typeMonument');
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 lg:py-16">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] mb-4 font-serif">
            {t('search.title')}
          </h1>
          <p className="text-[#6B5D4F] text-lg">
            {t('search.description')}
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8178]" />
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 bg-white border-[#E8DFD4] text-[#1F1A16] placeholder:text-[#8A8178] focus:border-[#C4953A] focus:ring-[#C4953A]/20 rounded-lg shadow-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#E8DFD4]/50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-[#8A8178] mr-2" />
            {searchTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={
                    selectedType === type.value
                      ? 'bg-[#C4953A] text-white hover:bg-[#A87B2D] border-[#C4953A]'
                      : 'border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#E8DFD4] hover:text-[#1F1A16] bg-white'
                  }
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Results */}
        {searchQuery.length >= 2 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 text-[#6B5D4F] text-sm">
              {t('search.found')}: <span className="font-semibold text-[#1F1A16]">{searchResults.length}</span> {t('search.resultsCount', { count: searchResults.length })}
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.type}-${result.item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link to={result.link}>
                      <div className="bg-white rounded-lg p-4 border border-[#E8DFD4] hover:border-[#C4953A] hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getTypeColor(result.type)} text-white text-xs`}>
                                {getTypeLabel(result.type)}
                              </Badge>
                            </div>
                            <h3 className="text-[#1F1A16] font-semibold text-lg mb-1">
                              {result.title}
                            </h3>
                            <p className="text-[#6B5D4F] text-sm">
                              {result.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E8DFD4]">
                <Search className="w-12 h-12 text-[#C4953A] mx-auto mb-4" />
                <p className="text-[#6B5D4F] font-medium">{t('search.noResults')}</p>
                <p className="text-[#8A8178] text-sm mt-2">{t('search.tryDifferent')}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-[#8A8178]">
            <Search className="w-12 h-12 text-[#C4953A] mx-auto mb-4" />
            <p>{t('search.minChars')}</p>
          </div>
        )}
      </div>
    </div>
  );
}