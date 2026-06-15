import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import type { Monument } from '@/types';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };

interface MonumentCardProps {
  monument: Monument;
  index?: number;
}

export function MonumentCard({ monument, index = 0 }: MonumentCardProps) {
  const { t, i18n } = useTranslation('pages');
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/monuments/${monument.slug}`}>
        <div className="group bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:border-[#C4953A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F0E8]">
            {monument.images.length > 0 ? (
              <img
                src={monument.images[0]}
                alt={monument.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-[#C4B4A0]" />
              </div>
            )}
            
            {/* Region Badge */}
            <div className="absolute top-3 left-3 bg-[#1F1A16]/75 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              {monument.region}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-[#1F1A16] font-semibold text-lg mb-2 group-hover:text-[#C4953A] transition-colors line-clamp-2">
              {monument.name}
            </h3>

            <p className="text-[#6B5D4F] text-sm leading-relaxed mb-4 line-clamp-2">
              {monument.description}
            </p>

            <div className="flex flex-wrap gap-3 text-[#8A8178] text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{monument.location}</span>
              </div>
              {monument.openingDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(monument.openingDate, 'yyyy', { locale: dateLocales[i18n.language] || ru })}</span>
                </div>
              )}
            </div>

            {/* View Details */}
            <div className="mt-4 pt-4 border-t border-[#E8DFD4] flex items-center justify-between">
              <span className="text-[#C4953A] text-sm font-medium">
                {t('buttons.readMore')}
              </span>
              <ExternalLink className="w-4 h-4 text-[#C4953A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
