import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import { SpeakButton } from '@/components/SpeakButton';
import { Button } from '@/components/ui/button';
import { InteractiveMap } from '@/components/map';
import { useTranslatedMonuments } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

export function MonumentDetailPage() {
  const { t, i18n } = useTranslation('pages');
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const monuments = useTranslatedMonuments();
  const monument = slug ? monuments.find(m => m.slug === slug) : undefined;
  const locale = dateLocales[i18n.language] || ru;

  if (!monument) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <h1 className="text-2xl text-[#1F1A16] mb-4">{t('monuments.notFound')}</h1>
          <Button onClick={() => navigate('/monuments')} variant="outline" className="border-[#E8DFD4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('monuments.backToMonuments')}
          </Button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate('/monuments')}
            className="text-[#8A8178] hover:text-[#1F1A16] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('monuments.backToMonuments')}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[#F5F0E8] border border-[#E8DFD4]">
              {monument.images.length > 0 ? (
                <img
                  src={monument.images[0]}
                  alt={monument.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-20 h-20 text-[#C4B4A0]" />
                </div>
              )}
            </div>

            {/* Map */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#1F1A16] mb-3 font-serif">{t('monuments.location')}</h3>
              <div className="rounded-lg overflow-hidden border border-[#E8DFD4]">
                <InteractiveMap
                  monuments={[monument]}
                  center={monument.coordinates}
                  zoom={12}
                  height="300px"
                  showLegend={false}
                  showTypeFilters={false}
                  showFrontLine={false}  
                  showEvents={false} 
                />
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Region Badge */}
            <div className="inline-block bg-[#1F1A16] text-white text-sm px-3 py-1 rounded mb-4">
              {monument.region}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F1A16] font-serif">
                {monument.name}
              </h1>
              <SpeakButton
                text={`${monument.name}. ${monument.region}. ${monument.location}. ${monument.description} ${monument.history}`}
                label={t('speech.listen')}
                size="md"
                variant="secondary"
              />
            </div>

            {/* Quick Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[#6B5D4F]">
                <MapPin className="w-5 h-5 text-[#C4953A]" />
                <span>{monument.location}</span>
              </div>
              {monument.openingDate && (
                <div className="flex items-center gap-3 text-[#6B5D4F]">
                  <Calendar className="w-5 h-5 text-[#C4953A]" />
                  <span>{t('monuments.opened')}: {format(monument.openingDate, 'd MMMM yyyy', { locale })}</span>
                </div>
              )}
              {(monument.architect || monument.sculptor) && (
                <div className="flex items-center gap-3 text-[#6B5D4F]">
                  <User className="w-5 h-5 text-[#C4953A]" />
                  <span>
                    {monument.architect && `${t('monuments.architectLabel')}: ${monument.architect}`}
                    {monument.architect && monument.sculptor && ', '}
                    {monument.sculptor && `${t('monuments.sculptorLabel')}: ${monument.sculptor}`}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#1F1A16] mb-3 font-serif">{t('monuments.description')}</h2>
              <p className="text-[#6B5D4F] leading-relaxed">
                {monument.description}
              </p>
            </div>

            {/* History */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#1F1A16] mb-3 font-serif">{t('monuments.history')}</h2>
              <div className="bg-white rounded-lg p-6 border border-[#E8DFD4]">
                <p className="text-[#6B5D4F] leading-relaxed whitespace-pre-line">
                  {monument.history}
                </p>
              </div>
            </div>

            {/* Coordinates */}
            <div className="pt-6 border-t border-[#E8DFD4]">
              <p className="text-[#8A8178] text-sm">
                {t('monuments.coordinates')}: {monument.coordinates[0].toFixed(4)}, {monument.coordinates[1].toFixed(4)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Monuments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-[#E8DFD4]"
        >
          <h2 className="text-xl font-semibold text-[#1F1A16] mb-4 font-serif">
            {t('monuments.otherMonuments')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {monuments
              .filter(m => m.id !== monument.id)
              .slice(0, 5)
              .map(m => (
                <Button
                  key={m.id}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/monuments/${m.slug}`)}
                  className="border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] hover:text-[#1F1A16]"
                >
                  {m.name}
                </Button>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
