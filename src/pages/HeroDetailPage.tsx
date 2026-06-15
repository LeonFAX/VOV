import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Calendar, MapPin, Award, BookOpen, Star, Users } from 'lucide-react';
import { SpeakButton } from '@/components/SpeakButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslatedHeroes } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { getHeroCoordsSync } from '@/lib/geocoding';

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

function MiniMap({ coords, placeName }: { coords: [number, number]; placeName: string }) {
  return (
    <MapContainer
      center={coords}
      zoom={9}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      dragging={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coords}>
        <Popup>{placeName}</Popup>
      </Marker>
    </MapContainer>
  );
}

function getHeroCategory(hero: any): string {
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

const categoryNames: Record<string, string> = {
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

export function HeroDetailPage() {
  const { t, i18n } = useTranslation('pages');
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const heroes = useTranslatedHeroes();
  const hero = slug ? heroes.find(h => h.slug === slug) : undefined;
  const [imgError, setImgError] = useState(false);
  const [relatedImgErrors, setRelatedImgErrors] = useState<Record<string, boolean>>({});
  const locale = dateLocales[i18n.language] || ru;

  if (!hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <h1 className="text-2xl text-[#1F1A16] mb-4">{t('heroes.notFound')}</h1>
          <Button onClick={() => navigate('/heroes')} variant="outline" className="border-[#E8DFD4] text-[#6B5D4F] hover:text-[#1F1A16]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('heroes.backToHeroes')}
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${hero.lastName} ${hero.firstName}${hero.middleName ? ` ${hero.middleName}` : ''}`;
  const imgSrc = imgError || !hero.images?.length ? '/images/heroes/placeholder.jpg' : hero.images[0];

  // Find hero's coordinates
  const heroCoords = useMemo(() => getHeroCoordsSync(hero.birthPlace || ''), [hero.birthPlace]);

  // Find related heroes from the same city
  const cityHeroes = useMemo(() => {
    if (!hero.birthPlace) return [];
    return heroes
      .filter(h => h.id !== hero.id && h.birthPlace === hero.birthPlace)
      .slice(0, 6);
  }, [hero, heroes]);



  return (
    <div className="min-h-screen py-12 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/heroes')}
            className="text-[#8A8178] hover:text-[#1F1A16] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('heroes.backToHeroes')}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F0E8] border border-[#E8DFD4]">
                <img
                  src={imgSrc}
                  alt={fullName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3">
                {hero.birthDate && (
                  <div className="flex items-center gap-3 text-[#6B5D4F]">
                    <Calendar className="w-5 h-5 text-[#C4953A]" />
                    <span>
                      {format(hero.birthDate, 'd MMMM yyyy', { locale })}
                      {' — '}
                      {hero.deathDate ? format(hero.deathDate, 'd MMMM yyyy', { locale }) : 'н.в.'}
                    </span>
                  </div>
                )}
                {hero.birthPlace && (
                  <div className="flex items-center gap-3 text-[#6B5D4F]">
                    <MapPin className="w-5 h-5 text-[#9B1B1B]" />
                    <span>{hero.birthPlace}</span>
                  </div>
                )}
              </div>

              {/* Mini Map */}
              {heroCoords && (
                <div className="mt-6 rounded-lg overflow-hidden border border-[#E8DFD4] h-[200px] relative">
                  <MiniMap coords={heroCoords} placeName={hero.birthPlace || ''} />
                </div>
              )}

              {/* City Heroes Quick Links */}
              {cityHeroes.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10px] text-[#8A8178] uppercase tracking-wider mb-2 font-medium">
                    Также из {hero.birthPlace} — {cityHeroes.length} {cityHeroes.length === 1 ? 'герой' : cityHeroes.length < 5 ? 'героя' : 'героев'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cityHeroes.map(h => (
                      <Link
                        key={h.id}
                        to={`/heroes/${h.slug}`}
                        className="px-2 py-1 bg-[#F5F0E8] hover:bg-[#EBE4D8] text-[#6B5D4F] hover:text-[#9B1B1B] text-xs rounded border border-[#E8DFD4] hover:border-[#C4953A] transition-all truncate max-w-[140px]"
                      >
                        {h.lastName} {h.firstName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="h-[2px] bg-gradient-to-r from-[#C4953A] to-transparent mb-4 w-20" />
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] mb-4 font-serif">
                    {fullName}
                  </h1>
                  <p className="text-[#C4953A] text-xl font-medium">
                    {hero.militaryRank}
                  </p>
                </div>
                <SpeakButton
                  text={`${fullName}. ${hero.militaryRank}. ${hero.birthDate ? `Born ${format(hero.birthDate, 'd MMMM yyyy', { locale })}` : ''} ${hero.birthPlace ? `in ${hero.birthPlace}.` : ''} ${hero.biography} ${hero.feat}`}
                  label={t('speech.listen')}
                  size="md"
                  variant="secondary"
                />
              </div>
            </div>

            {/* Awards */}
            {hero.awards.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#1F1A16] mb-4 flex items-center gap-2 font-serif">
                  <Award className="w-5 h-5 text-[#C4953A]" />
                  {t('heroes.awards')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hero.awards.map((award, index) => (
                    <Tooltip key={index} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="bg-[#F5F0E8] text-[#6B5D4F] border border-[#E8DFD4] px-3 py-1 cursor-help hover:bg-[#C4953A]/10 hover:border-[#C4953A]/30 hover:text-[#1F1A16] transition-colors duration-300 rounded-md"
                        >
                          {award.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={8}
                        className="bg-white text-[#1F1A16] border border-[#E8DFD4] max-w-[300px] p-0 shadow-xl overflow-hidden rounded-lg"
                      >
                        <div className="flex gap-4 p-4">
                          {award.image && (
                            <img
                              src={award.image}
                              alt={award.name}
                              className="w-20 h-20 object-contain flex-shrink-0"
                            />
                          )}
                          <div className="space-y-1.5 min-w-0">
                            <p className="font-semibold text-[#C4953A] text-sm">{award.name}</p>
                            <p className="text-xs text-[#8A8178] leading-relaxed">{award.description}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Biography */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#1F1A16] mb-4 flex items-center gap-2 font-serif">
                <BookOpen className="w-5 h-5 text-[#C4953A]" />
                {t('heroes.biography')}
              </h2>
              <div className="bg-white rounded-lg p-6 border border-[#E8DFD4]">
                <p className="text-[#6B5D4F] leading-relaxed whitespace-pre-line">
                  {hero.biography}
                </p>
              </div>
            </div>

            {/* Feat */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#1F1A16] mb-4 flex items-center gap-2 font-serif">
                <Award className="w-5 h-5 text-[#9B1B1B]" />
                {t('heroes.feat')}
              </h2>
              <div className="bg-[#9B1B1B]/5 rounded-lg p-6 border border-[#9B1B1B]/15">
                <p className="text-[#1F1A16] leading-relaxed whitespace-pre-line">
                  {hero.feat}
                </p>
              </div>
            </div>

            {/* Related Heroes by Category */}
            {useMemo(() => {
              const heroCategory = getHeroCategory(hero);
              const related = heroes
                ?.filter(h => h.id !== hero.id && getHeroCategory(h) === heroCategory)
                .slice(0, 4);
              
              if (!related?.length) return null;
              
              return (
                <div className="mt-12 pt-8 border-t border-[#E8DFD4]">
                  <div className="h-[2px] bg-gradient-to-r from-[#C4953A] to-transparent mb-4 w-20" />
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-[#9B1B1B]" />
                    <h2 className="text-xl font-semibold text-[#1F1A16] font-serif">
                      {categoryNames[heroCategory] || t('heroes.relatedHeroes')}
                    </h2>
                    <span className="text-sm text-[#8A8178]">— {related.length} героя</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {related.map((h, idx) => {
                      const relImg = relatedImgErrors[h.id] || !h.images?.length 
                        ? '/images/heroes/placeholder.jpg' 
                        : h.images[0];
                      return (
                        <motion.div
                          key={h.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                          <Link to={`/heroes/${h.slug}`} className="group block">
                            <div className="bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:border-[#C4953A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                              <div className="aspect-[3/4] overflow-hidden bg-[#F5F0E8] relative">
                                <img
                                  src={relImg}
                                  alt={`${h.lastName} ${h.firstName}`}
                                  onError={() => setRelatedImgErrors(prev => ({ ...prev, [h.id]: true }))}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                />
                                {h.awards?.some((a: any) => {
                                  const name = typeof a === 'string' ? a : a.name || '';
                                  return name.includes('Герой Советского Союза');
                                }) && (
                                  <div className="absolute top-2 right-2">
                                    <Star className="w-4 h-4 text-[#C4953A] fill-[#C4953A]" />
                                  </div>
                                )}
                              </div>
                              <div className="p-3">
                                <p className="font-semibold text-[#1F1A16] text-sm group-hover:text-[#C4953A] transition-colors truncate">
                                  {h.lastName} {h.firstName}
                                </p>
                                <p className="text-[#8A8178] text-xs truncate mt-0.5">{h.militaryRank}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            }, [hero, heroes, relatedImgErrors, t])}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
