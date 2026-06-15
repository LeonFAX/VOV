import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, MapPin, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MonumentCard } from '@/components/cards';
import { InteractiveMap } from '@/components/map';
import { useTranslatedMonuments } from '@/hooks/useTranslatedData';
import type { Monument } from '@/types';

const countryMap: Record<string, string> = {
  // Russia
  'Алтайский край': 'russia', 'Архангельская область': 'russia', 'Астраханская область': 'russia',
  'Белгородская область': 'russia', 'Брянская область': 'russia', 'Бурятия': 'russia',
  'Волгоградская область': 'russia', 'Вологодская область': 'russia', 'Воронежская область': 'russia',
  'Иркутская область': 'russia', 'Калининградская область': 'russia', 'Камчатский край': 'russia',
  'Карелия': 'russia', 'Кемеровская область': 'russia', 'Краснодарский край': 'russia',
  'Курская область': 'russia', 'Ленинградская область': 'russia', 'Липецкая область': 'russia',
  'Магаданская область': 'russia', 'Марий Эл': 'russia', 'Москва': 'russia',
  'Московская область': 'russia', 'Мурманская область': 'russia', 'Нижегородская область': 'russia',
  'Новосибирская область': 'russia', 'Омская область': 'russia', 'Оренбургская область': 'russia',
  'Орловская область': 'russia', 'Пензенская область': 'russia', 'Пермский край': 'russia',
  'Приморский край': 'russia', 'Псковская область': 'russia', 'Ростовская область': 'russia',
  'Рязанская область': 'russia', 'Самарская область': 'russia', 'Санкт-Петербург': 'russia',
  'Саратовская область': 'russia', 'Сахалинская область': 'russia', 'Севастополь': 'russia',
  'Смоленская область': 'russia', 'Ставропольский край': 'russia', 'Тамбовская область': 'russia',
  'Татарстан': 'russia', 'Тверская область': 'russia', 'Томская область': 'russia',
  'Тульская область': 'russia', 'Тюменская область': 'russia', 'Удмуртия': 'russia',
  'Ульяновская область': 'russia', 'Хабаровский край': 'russia', 'Челябинская область': 'russia',
  'Чувашия': 'russia', 'Якутия': 'russia', 'Крым': 'russia', 'Красноярский край': 'russia',
  'Забайкальский край': 'russia', 'Калмыкия': 'russia', 'Кабардино-Балкария': 'russia',
  'Северная Осетия': 'russia', 'Чечня': 'russia', 'Дагестан': 'russia', 'Ингушетия': 'russia',
  // Belarus
  'Брестская область': 'belarus', 'Витебская область': 'belarus', 'Гомельская область': 'belarus',
  'Гродненская область': 'belarus', 'Минская область': 'belarus', 'Могилёвская область': 'belarus',
  'Минск': 'belarus',
  // Ukraine
  'Винницкая область': 'ukraine', 'Волынская область': 'ukraine', 'Днепропетровская область': 'ukraine',
  'Донецкая область': 'ukraine', 'Житомирская область': 'ukraine', 'Закарпатская область': 'ukraine',
  'Запорожская область': 'ukraine', 'Ивано-Франковская область': 'ukraine', 'Киев': 'ukraine',
  'Киевская область': 'ukraine', 'Кировоградская область': 'ukraine', 'Луганская область': 'ukraine',
  'Львовская область': 'ukraine', 'Николаевская область': 'ukraine', 'Одесская область': 'ukraine',
  'Полтавская область': 'ukraine', 'Ровенская область': 'ukraine', 'Сумская область': 'ukraine',
  'Тернопольская область': 'ukraine', 'Харьковская область': 'ukraine', 'Херсонская область': 'ukraine',
  'Хмельницкая область': 'ukraine', 'Черкасская область': 'ukraine', 'Черновицкая область': 'ukraine',
  'Черниговская область': 'ukraine',
  // Poland
  'Варшава': 'poland', 'Вроцлав': 'poland', 'Гданьск': 'poland', 'Катовице': 'poland',
  'Краков': 'poland', 'Лодзь': 'poland', 'Люблинское воеводство': 'poland',
  'Малопольское воеводство': 'poland', 'Познань': 'poland', 'Щецин': 'poland',
  'Гливице': 'poland', 'Быдгощ': 'poland', 'Кельце': 'poland', 'Ольштын': 'poland',
  // Germany
  'Берлин': 'germany', 'Дрезден': 'germany', 'Лейпциг': 'germany', 'Магдебург': 'germany',
  'Потсдам': 'germany', 'Франкфурт-на-Одере': 'germany',
  // Baltic
  'Вильнюс': 'baltic', 'Каунас': 'baltic', 'Шяуляй': 'baltic', 'Рига': 'baltic',
  'Даугавпилс': 'baltic', 'Таллин': 'baltic',
  // Balkans & Central Europe
  'Белград': 'balkans', 'Брно': 'balkans', 'Будапешт': 'balkans', 'Бухарест': 'balkans',
  'Вена': 'balkans', 'Загреб': 'balkans', 'Кишинев': 'balkans', 'Любляна': 'balkans',
  'Нови-Сад': 'balkans', 'Прага': 'balkans', 'Сараево': 'balkans', 'София': 'balkans',
  'Тирана': 'balkans', 'Тимишоара': 'balkans', 'Клуж-Напока': 'balkans', 'Яссы': 'balkans',
  'Брашов': 'balkans', 'Плоешти': 'balkans',
  // Kazakhstan & Central Asia
  'Алматы': 'kazakhstan', 'Алматинская область': 'kazakhstan', 'Бишкек': 'kazakhstan',
  'Жамбылская область': 'kazakhstan', 'Ош': 'kazakhstan',
  // Austria
  'Австрия': 'austria',
};

export function MonumentsPage() {
  const { t } = useTranslation('pages');
  const monuments = useTranslatedMonuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  const regions = [
    { key: 'all', value: 'all' },
    { key: 'russia', value: 'russia' },
    { key: 'belarus', value: 'belarus' },
    { key: 'ukraine', value: 'ukraine' },
    { key: 'poland', value: 'poland' },
    { key: 'germany', value: 'germany' },
    { key: 'baltic', value: 'baltic' },
    { key: 'balkans', value: 'balkans' },
    { key: 'kazakhstan', value: 'kazakhstan' },
    { key: 'other', value: 'other' },
  ];

  const filteredMonuments = useMemo(() => {
    return monuments.filter((monument) => {
      const matchesSearch = searchQuery === '' ||
        monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'all' ||
        selectedRegion === countryMap[monument.region] ||
        (selectedRegion === 'other' && !['belarus', 'russia', 'ukraine', 'poland'].includes(countryMap[monument.region] || ''));

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion, monuments]);

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
            <MapPin className="w-8 h-8 text-[#9B1B1B]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] font-serif">
              {t('monuments.title')}
            </h1>
          </div>
          <p className="text-[#6B5D4F] text-lg max-w-2xl leading-relaxed">
            {t('monuments.description')}
          </p>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#9B1B1B] to-transparent mt-6 opacity-60" />
        </motion.div>

        {/* Filters & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8178]" />
              <Input
                type="text"
                placeholder={t('monuments.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white border-[#E8DFD4] text-[#1F1A16] placeholder:text-[#8A8178] focus:border-[#C4953A] rounded-lg"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={
                  viewMode === 'grid'
                    ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] border-[#9B1B1B] rounded-lg'
                    : 'border-[#E8DFD4] text-[#8A8178] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-lg'
                }
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                {t('actions.grid')}
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={
                  viewMode === 'map'
                    ? 'bg-[#9B1B1B] text-white hover:bg-[#B52B2B] border-[#9B1B1B] rounded-lg'
                    : 'border-[#E8DFD4] text-[#8A8178] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-lg'
                }
              >
                <MapIcon className="w-4 h-4 mr-2" />
                {t('actions.map')}
              </Button>
            </div>
          </div>

          {/* Region Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <MapPin className="w-4 h-4 text-[#8A8178] mr-2" />
            {regions.map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className={
                  selectedRegion === region.value
                    ? 'bg-[#3D6B4A] text-white hover:bg-[#4D7B5A] border-[#3D6B4A] rounded-lg text-sm'
                    : 'border-[#E8DFD4] text-[#8A8178] hover:bg-[#F5F0E8] hover:text-[#1F1A16] rounded-lg text-sm'
                }
              >
                {t(`pages:monuments.regionFilter.${region.key}` as const)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <>
            {/* Map preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="h-[350px] rounded-lg overflow-hidden border border-[#E8DFD4]">
                <InteractiveMap
                  monuments={filteredMonuments}
                  selectedMonument={selectedMonument}
                  onMonumentClick={(m) => {
                    setSelectedMonument(m);
                    const el = document.getElementById(`monument-${m.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  showMonuments={true}
                  showEvents={false}
                  showFrontLine={false}
                  showLegend={false}
                  showTypeFilters={false}
                  center={[52.0, 30.0]}
                  zoom={4}
                  height="100%"
                />
              </div>
              <p className="text-[#8A8178] text-xs mt-2 text-center">
                {t('monuments.mapHint')}
              </p>
            </motion.div>

            {/* Grid */}
            {filteredMonuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMonuments.map((monument, index) => (
                  <div key={monument.id} id={`monument-${monument.id}`}>
                    <MonumentCard monument={monument} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <MapPin className="w-16 h-16 text-[#E8DFD4] mx-auto mb-4" />
                <p className="text-[#8A8178] text-lg">{t('monuments.noResults')}</p>
                <Button
                  variant="ghost"
                  onClick={() => { setSearchQuery(''); setSelectedRegion('all'); }}
                  className="text-[#C4953A] mt-4"
                >
                  {t('actions.resetFilters')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row gap-5"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
          >
            {/* Map */}
            <div className="flex-1 rounded-lg overflow-hidden border border-[#E8DFD4]">
              <InteractiveMap
                monuments={filteredMonuments}
                selectedMonument={selectedMonument}
                onMonumentClick={(m) => setSelectedMonument(m)}
                showMonuments={true}
                showEvents={false}
                showFrontLine={false}
                showLegend={false}
                showTypeFilters={false}
                center={[52.0, 30.0]}
                zoom={4}
                height="100%"
              />
            </div>

            {/* Side panel */}
            <div className="w-full lg:w-[380px] overflow-y-auto rounded-lg border border-[#E8DFD4] bg-white">
              <div className="p-4 border-b border-[#E8DFD4]">
                <h3 className="text-[#C4953A] font-semibold text-sm">
                  {filteredMonuments.length} {t('stats.monuments')}
                </h3>
              </div>
              <div className="divide-y divide-[#E8DFD4]">
                {filteredMonuments.map((monument) => (
                  <button
                    key={monument.id}
                    onClick={() => setSelectedMonument(monument)}
                    className={`w-full text-left p-4 transition-all hover:bg-[#F5F0E8] ${
                      selectedMonument?.id === monument.id ? 'bg-[#C4953A]/5 border-l-2 border-l-[#C4953A]' : ''
                    }`}
                  >
                    <h4 className="font-semibold text-[#1F1A16] text-sm mb-1 line-clamp-2 leading-tight">
                      {monument.name}
                    </h4>
                    <p className="text-[#8A8178] text-xs line-clamp-2">{monument.location}</p>
                    {selectedMonument?.id === monument.id && (
                      <p className="text-[#6B5D4F] text-xs mt-2 line-clamp-3 leading-relaxed">
                        {monument.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
