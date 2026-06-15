import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Award, User, Star, MapPin, List, Map as MapIcon, X, ChevronLeft, ChevronRight, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeroCard } from '@/components/cards';
import { useTranslatedHeroes } from '@/hooks/useTranslatedData';
import { HeroesMap } from '@/components/map/HeroesMap';
import type { Hero } from '@/types';

type SortOption = 'nameAsc' | 'nameDesc' | 'rank' | 'birthYear' | 'awards';
type CategoryFilter = 'all' | 'marshals' | 'generals' | 'pilots' | 'tankists' | 'snipers' | 'infantry' | 'artillery' | 'navy' | 'medics' | 'scouts' | 'partisans';

const HEROES_PER_PAGE = 24;

function getHeroCategory(hero: Hero): string {
  const rank = (hero.militaryRank || '').toLowerCase();
  if (rank.includes('генералиссимус') || rank.includes('маршал')) return 'marshals';
  if (rank.includes('генерал') || rank.includes('адмирал')) return 'generals';
  if (rank.includes('лётчик') || rank.includes('пилот') || rank.includes('штурман')) return 'pilots';
  if (rank.includes('танк')) return 'tankists';
  if (rank.includes('снайпер')) return 'snipers';
  if (rank.includes('артиллер')) return 'artillery';
  if (rank.includes('мор') || rank.includes('корабл') || rank.includes('подводн')) return 'navy';
  if (rank.includes('медицин') || rank.includes('санитар') || rank.includes('фельдшер')) return 'medics';
  if (rank.includes('разведчик')) return 'scouts';
  if (rank.includes('партизан')) return 'partisans';
  return 'infantry';
}

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'Все',
  marshals: 'Маршалы',
  generals: 'Генералы',
  pilots: 'Лётчики',
  tankists: 'Танкисты',
  snipers: 'Снайперы',
  infantry: 'Пехота',
  artillery: 'Артиллерия',
  navy: 'ВМФ',
  medics: 'Медики',
  scouts: 'Разведчики',
  partisans: 'Партизаны',
};

export function HeroesPage() {
  const { t } = useTranslation();
  const heroes = useTranslatedHeroes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAward, setFilterAward] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nameAsc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);

  const awardFilters = useMemo(() => [
    { label: t('heroes.all'), value: null, key: 'all' },
    { label: t('heroes.heroesUSSR'), value: t('heroes.filterHeroUSSR'), key: 'heroUSSR' },
    { label: t('heroes.orderLenin'), value: t('heroes.filterOrderLenin'), key: 'orderLenin' },
    { label: t('heroes.orderRedBanner'), value: t('heroes.filterOrderRedBanner'), key: 'orderRedBanner' },
  ], [t]);

  const filteredHeroes = useMemo(() => {
    let result = (heroes as Hero[]).filter((hero: any) => {
      const fullName = `${hero.lastName || ''} ${hero.firstName || ''} ${hero.middleName || ''}`.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        fullName.includes(searchQuery.toLowerCase()) ||
        (hero.militaryRank || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAward = filterAward === null ||
        (hero.awards || []).some((award: any) => {
          const awardName = typeof award === 'string' ? award : award.name || '';
          return awardName.includes(filterAward);
        });

      const matchesCategory = filterCategory === 'all' || getHeroCategory(hero) === filterCategory;

      return matchesSearch && matchesAward && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case 'nameAsc':
        result.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || '', 'ru'));
        break;
      case 'nameDesc':
        result.sort((a, b) => (b.lastName || '').localeCompare(a.lastName || '', 'ru'));
        break;
      case 'rank':
        result.sort((a, b) => (a.militaryRank || '').localeCompare(b.militaryRank || '', 'ru'));
        break;
      case 'birthYear':
        result.sort((a, b) => {
          const yearA = a.birthDate ? a.birthDate.getFullYear() : 0;
          const yearB = b.birthDate ? b.birthDate.getFullYear() : 0;
          return yearA - yearB;
        });
        break;
      case 'awards':
        result.sort((a, b) => (b.awards?.length || 0) - (a.awards?.length || 0));
        break;
    }

    return result;
  }, [searchQuery, filterAward, filterCategory, sortBy, heroes]);

  // Pagination
  const totalPages = Math.ceil(filteredHeroes.length / HEROES_PER_PAGE);
  const paginatedHeroes = useMemo(() => {
    const start = (currentPage - 1) * HEROES_PER_PAGE;
    return filteredHeroes.slice(start, start + HEROES_PER_PAGE);
  }, [filteredHeroes, currentPage]);

  // Reset page on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterAward, filterCategory, sortBy]);

  const selectedHero = useMemo(() =>
    (heroes as any[]).find(h => h.id === selectedHeroId || h.slug === selectedHeroId),
  [heroes, selectedHeroId]);

  // Найти других героев из того же города
  const relatedHeroes = useMemo(() => {
    if (!selectedHero) return [];
    const place = selectedHero.birthPlace;
    if (!place) return [];
    return (heroes as any[]).filter(h =>
      h.id !== selectedHero.id &&
      h.birthPlace &&
      h.birthPlace === place
    );
  }, [selectedHero, heroes]);

  const handleMarkerClick = useCallback((heroId: string) => {
    setSelectedHeroId(prev => prev === heroId ? null : heroId);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterAward(null);
    setFilterCategory('all');
    setSortBy('nameAsc');
    setCurrentPage(1);
  }, []);

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
          <div className="h-[2px] bg-gradient-to-r from-[#9B1B1B] to-transparent mb-6 w-20 opacity-60" />
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-7 h-7 text-[#9B1B1B] fill-[#9B1B1B]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] font-serif">
              {t('sections.heroes')}
            </h1>
            <Star className="w-7 h-7 text-[#9B1B1B] fill-[#9B1B1B]" />
          </div>
          <p className="text-[#6B5D4F] text-lg max-w-2xl leading-relaxed">
            {t('heroes.description')}
          </p>
          <div className="h-[2px] bg-gradient-to-r from-[#9B1B1B] to-transparent mt-6 w-20 opacity-60" />
        </motion.div>

        {/* Search Bar */}
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
              placeholder={t('heroes.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white border-[#E8DFD4] text-[#1F1A16] placeholder:text-[#8A8178] focus:border-[#C4953A] rounded-lg text-base"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-[#8A8178] mr-1 flex-shrink-0" />
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat)}
                className={
                  filterCategory === cat
                    ? 'bg-[#1F1A16] text-white hover:bg-[#3D342B] border-[#1F1A16] rounded-full text-xs'
                    : 'border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-full text-xs'
                }
              >
                {categoryLabels[cat]}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Award Filters + Sort + View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            {awardFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={filterAward === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterAward(filter.value)}
                className={
                  filterAward === filter.value
                    ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] border-[#9B1B1B] rounded-lg text-xs'
                    : 'border-[#E8DFD4] text-[#8A8178] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-lg text-xs'
                }
              >
                {filter.key === 'heroUSSR' && <Award className="w-3 h-3 mr-1" />}
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-[#E8DFD4] px-3 py-1.5">
              <SortAsc className="w-4 h-4 text-[#8A8178]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs text-[#6B5D4F] outline-none cursor-pointer"
              >
                <option value="nameAsc">По фамилии (А-Я)</option>
                <option value="nameDesc">По фамилии (Я-А)</option>
                <option value="rank">По званию</option>
                <option value="birthYear">По году рождения</option>
                <option value="awards">По наградам</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-[#E8DFD4]">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setViewMode('grid');
                  setSelectedHeroId(null);
                }}
                className={viewMode === 'grid'
                  ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] rounded-md h-8 w-8 p-0'
                  : 'text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8] rounded-md h-8 w-8 p-0'
                }
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map'
                  ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] rounded-md h-8 w-8 p-0'
                  : 'text-[#8A8178] hover:text-[#1F1A16] hover:bg-[#F5F0E8] rounded-md h-8 w-8 p-0'
                }
              >
                <MapIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-[#8A8178] text-sm font-medium tracking-wide flex items-center justify-between">
          <span>
            {t('search.results')}: <strong className="text-[#1F1A16]">{filteredHeroes.length}</strong> {filteredHeroes.length === 1 ? 'герой' : filteredHeroes.length < 5 ? 'героя' : 'героев'}
            {totalPages > 1 && (
              <span className="ml-2 text-xs">
                (страница {currentPage} из {totalPages})
              </span>
            )}
          </span>
          {(searchQuery || filterAward || filterCategory !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-[#C4953A] hover:text-[#9B1B1B] text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Сбросить фильтры
            </Button>
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {paginatedHeroes.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedHeroes.map((hero, index) => (
                      <HeroCard key={(hero as any).id || (hero as any).slug} hero={hero as any} index={index} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] disabled:opacity-40 rounded-lg h-9 w-9 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first, last, current, and neighbors
                          return page === 1 || page === totalPages ||
                            Math.abs(page - currentPage) <= 1;
                        })
                        .reduce<(number | string)[]>((acc, page, idx, arr) => {
                          if (idx > 0 && (arr[idx - 1] as number) !== page - 1) {
                            acc.push('...');
                          }
                          acc.push(page);
                          return acc;
                        }, [])
                        .map((item, i) => (
                          typeof item === 'string' ? (
                            <span key={`dots-${i}`} className="text-[#8A8178] px-2">{item}</span>
                          ) : (
                            <Button
                              key={item}
                              variant={currentPage === item ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(item)}
                              className={
                                currentPage === item
                                  ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] border-[#9B1B1B] rounded-lg h-9 w-9 p-0 text-sm font-medium'
                                  : 'border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] rounded-lg h-9 w-9 p-0 text-sm'
                              }
                            >
                              {item}
                            </Button>
                          )
                        ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] disabled:opacity-40 rounded-lg h-9 w-9 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <User className="w-16 h-16 text-[#E8DFD4] mx-auto mb-4" />
                  <p className="text-[#8A8178] text-lg">{t('heroes.noResults')}</p>
                  <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="text-[#C4953A] mt-4 hover:text-[#1F1A16]"
                  >
                    {t('actions.resetFilters')}
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <HeroesMap
                heroes={filteredHeroes as Hero[]}
                selectedHeroId={selectedHeroId}
                onMarkerClick={handleMarkerClick}
                center={[55.7558, 37.6173]}
                zoom={4}
                height="600px"
              />

              {/* Selected Hero Info Bar */}
              <AnimatePresence>
                {selectedHero && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-xl border border-[#E8DFD4] p-6 shadow-sm relative"
                  >
                    <button
                      onClick={() => setSelectedHeroId(null)}
                      className="absolute top-4 right-4 text-[#8A8178] hover:text-[#9B1B1B] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                      {selectedHero.images?.[0] ? (
                        <img
                          src={selectedHero.images[0]}
                          alt={`${selectedHero.lastName || ''} ${selectedHero.firstName || ''}`}
                          className="w-20 h-20 rounded-lg object-cover border border-[#E8DFD4] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-[#F5F0E8] flex items-center justify-center border border-[#E8DFD4] flex-shrink-0">
                          <Star className="w-10 h-10 text-[#E8DFD4]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif font-bold text-[#1F1A16] text-xl">
                            {selectedHero.lastName || ''} {selectedHero.firstName || ''} {selectedHero.middleName || ''}
                          </h3>
                          {(selectedHero.awards || []).some((a: any) => {
                            const name = typeof a === 'string' ? a : a.name || '';
                            return name.includes('Герой Советского Союза');
                          }) && (
                            <Award className="w-5 h-5 text-[#C4953A]" />
                          )}
                        </div>
                        
                        <p className="text-[#C4953A] font-medium mb-2">{selectedHero.militaryRank || '—'}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-[#6B5D4F]">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#9B1B1B]" />
                            {selectedHero.birthPlace || '—'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 flex items-center justify-center text-[#8A8178]">📅</span>
                            {selectedHero.birthDate ? new Date(selectedHero.birthDate).getFullYear() : '—'} — {selectedHero.deathDate ? new Date(selectedHero.deathDate).getFullYear() : 'н.в.'}
                          </span>
                        </div>

                        {selectedHero.awards && selectedHero.awards.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {selectedHero.awards.slice(0, 6).map((award: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#F5F0E8] text-[#6B5D4F] text-xs rounded border border-[#E8DFD4]"
                              >
                                {typeof award === 'string' ? award : award.name}
                              </span>
                            ))}
                            {selectedHero.awards.length > 6 && (
                              <span className="px-2 py-0.5 text-[#8A8178] text-xs">
                                +{selectedHero.awards.length - 6}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Related Heroes from same city */}
                    {relatedHeroes.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#E8DFD4]">
                        <p className="text-[10px] text-[#8A8178] uppercase tracking-wider mb-3 font-medium">
                          Также из {selectedHero.birthPlace} — {relatedHeroes.length} {relatedHeroes.length === 1 ? 'герой' : relatedHeroes.length < 5 ? 'героя' : 'героев'}
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {relatedHeroes.map((h: any) => (
                            <button
                              key={h.id}
                              onClick={() => setSelectedHeroId(h.id || h.slug)}
                              className="flex items-center gap-2 bg-[#F5F0E8] hover:bg-[#EBE4D8] rounded-lg px-3 py-2 border border-[#E8DFD4] hover:border-[#C4953A] transition-all min-w-fit group text-left"
                            >
                              {h.images?.[0] ? (
                                <img
                                  src={h.images[0]}
                                  alt={h.lastName || ''}
                                  className="w-10 h-10 rounded-full object-cover border border-[#E8DFD4] group-hover:border-[#C4953A] transition-colors flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#E8DFD4] flex items-center justify-center flex-shrink-0">
                                  <Star className="w-5 h-5 text-[#C4B4A0]" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[#1F1A16] font-semibold text-sm truncate group-hover:text-[#9B1B1B] transition-colors">
                                  {h.lastName || ''} {h.firstName || ''}
                                </p>
                                <p className="text-[#8A8178] text-[11px] truncate">{h.militaryRank || ''}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
