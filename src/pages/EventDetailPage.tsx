import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, BookOpen, ExternalLink } from 'lucide-react';
import { SpeakButton } from '@/components/SpeakButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslatedEvents } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const eventTypeColors: Record<string, string> = {
  battle: 'bg-[#9B1B1B]',
  operation: 'bg-[#3D6B4A]',
  movement: 'bg-[#6B5D4F]',
  shelling: 'bg-[#C4953A]',
  political: 'bg-[#3D6B4A]',
  strategic: 'bg-[#C4953A]',
  liberation: 'bg-[#3D6B4A]',
  occupation: 'bg-[#9B1B1B]',
  other: 'bg-[#6B5D4F]',
};

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

export function EventDetailPage() {
  const { t, i18n } = useTranslation('pages');
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const events = useTranslatedEvents();
  const event = slug ? events.find(e => e.slug === slug) : undefined;
  const locale = dateLocales[i18n.language] || ru;

  const eventTypeLabels: Record<string, string> = {
    battle: t('eventDetail.typeLabels.battle'),
    operation: t('eventDetail.typeLabels.operation'),
    movement: t('eventDetail.typeLabels.movement'),
    shelling: t('eventDetail.typeLabels.shelling'),
    political: t('eventDetail.typeLabels.political'),
    strategic: t('eventDetail.typeLabels.strategic'),
    liberation: t('eventDetail.typeLabels.liberation'),
    occupation: t('eventDetail.typeLabels.occupation'),
    offensive: t('eventDetail.typeLabels.offensive'),
    defense: t('eventDetail.typeLabels.defense'),
    encirclement: t('eventDetail.typeLabels.encirclement'),
    other: t('eventDetail.typeLabels.other'),
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <h1 className="text-2xl text-[#1F1A16] mb-4">{t('eventDetail.notFound')}</h1>
          <Button onClick={() => navigate('/events')} variant="outline" className="border-[#E8DFD4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('eventDetail.backToEvents')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[#FAF6F0]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="text-[#8A8178] hover:text-[#1F1A16] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('eventDetail.backToEvents')}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge className={`${eventTypeColors[event.type]} text-white mb-4`}>
            {eventTypeLabels[event.type]}
          </Badge>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1F1A16] font-serif">
              {event.title}
            </h1>
            <SpeakButton
              text={`${event.title}. ${format(event.date, 'd MMMM yyyy', { locale })}. ${event.location}. ${event.description} ${event.fullText}`}
              label={t('speech.listen')}
              size="md"
              variant="secondary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#6B5D4F]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C4953A]" />
              <span>
                {format(event.date, 'd MMMM yyyy', { locale })}
                {event.endDate && ` — ${format(event.endDate, 'd MMMM yyyy', { locale })}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C4953A]" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        {event.images && event.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-[#F5F0E8] border border-[#E8DFD4]">
              <img
                src={event.images[0]}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Description */}
          <div className="bg-white rounded-lg p-6 md:p-8 border border-[#E8DFD4] mb-8">
            <p className="text-[#6B5D4F] text-lg leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Full Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1F1A16] mb-4 flex items-center gap-2 font-serif">
              <BookOpen className="w-6 h-6 text-[#C4953A]" />
              {t('eventDetail.details')}
            </h2>
            <div className="prose max-w-none">
              <p className="text-[#6B5D4F] leading-relaxed whitespace-pre-line">
                {event.fullText}
              </p>
            </div>
          </div>

          {/* Sources */}
          {event.sources && event.sources.length > 0 && (
            <div className="mb-8 pt-8 border-t border-[#E8DFD4]">
              <h3 className="text-lg font-semibold text-[#1F1A16] mb-3 font-serif">
                {t('eventDetail.sources')}
              </h3>
              <ul className="space-y-2">
                {event.sources.map((source, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#6B5D4F] text-sm">
                    <ExternalLink className="w-4 h-4 text-[#C4953A]" />
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Related Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[#E8DFD4]"
        >
          <h2 className="text-xl font-semibold text-[#1F1A16] mb-4 font-serif">
            {t('eventDetail.otherEvents')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {events
              .filter(e => e.id !== event.id)
              .slice(0, 5)
              .map(e => (
                <Button
                  key={e.id}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/events/${e.slug}`)}
                  className="border-[#E8DFD4] text-[#6B5D4F] hover:bg-[#F5F0E8] hover:text-[#1F1A16]"
                >
                  {e.title}
                </Button>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
