import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Event } from '@/types';

// === ВСЕ типы событий с цветами ===
const typeAccentColors: Record<string, string> = {
  battle: '#9B1B1B',
  operation: '#3D6B4A',
  movement: '#6B5D4F',
  shelling: '#C4953A',
  political: '#8A8178',
  strategic: '#C4953A',
  liberation: '#3D6B4A',
  occupation: '#9B1B1B',
  offensive: '#B52B2B',
  defense: '#4A7C9B',
  encirclement: '#C97A3A',
  other: '#6B5D4F',
};

const dateLocales: Record<string, typeof ru> = { ru, en: ru, be: ru };

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { t, i18n } = useTranslation('pages');
  const imgSrc = event.images?.[0] || '/images/events/june-22-1941.jpg';

  const locale = dateLocales[i18n.language] || ru;

  // Защита: если тип неизвестен — показываем "Событие"
  const eventType = event.type || 'other';
  const typeLabel = t(`events.typeLabels.${eventType}`, eventType);
  const typeColor = typeAccentColors[eventType] || typeAccentColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group h-full"
    >
      <Link to={`/events/${event.slug}`} className="block h-full">
        <div className="bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:border-[#C4953A]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">

          {/* === ИЗОБРАЖЕНИЕ === */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F0E8]">
            <img
              src={imgSrc}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A16]/50 via-transparent to-transparent" />

          </div>

          {/* === КОНТЕНТ === */}
          <div className="p-5 flex flex-col flex-1">

            {/* Тип + год — фиксированная ширина бейджа */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white min-w-[100px] text-center"
                style={{ backgroundColor: `${typeColor}CC` }}
              >
                {typeLabel}
              </span>
              <span className="text-[#8A8178] text-xs font-semibold tabular-nums">
                {new Date(event.date).getFullYear()}
              </span>
            </div>

            {/* Заголовок */}
            <h3 className="text-[#1F1A16] font-semibold text-lg mb-2 group-hover:text-[#C4953A] transition-colors duration-300 line-clamp-2">
              {event.title}
            </h3>

            {/* Описание */}
            <p className="text-[#6B5D4F] text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
              {event.description}
            </p>

            {/* Дата и место */}
            <div className="flex items-center gap-3 text-xs mt-auto pt-3 border-t border-[#E8DFD4]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#8A8178]" />
                <span className="text-[#8A8178]">
                  {format(event.date, 'd MMMM', { locale })}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8A8178]" />
                  <span className="text-[#8A8178] truncate max-w-[120px]">
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
