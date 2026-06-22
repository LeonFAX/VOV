import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Calendar, MapPin, Star } from 'lucide-react';

import type { Hero } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroCardProps {
  hero: Hero;
  index?: number;
}

export function HeroCard({ hero, index = 0 }: HeroCardProps) {
  const { t } = useTranslation('pages');
  const fullName = `${hero.lastName} ${hero.firstName}${hero.middleName ? ` ${hero.middleName}` : ''}`;
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError || !hero.images?.length ? '/images/heroes/placeholder.jpg' : hero.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="relative group"
    >
      <Link to={`/heroes/${hero.slug}`}>
        <div className="bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:border-[#C4953A]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
          {/* Gold top stripe */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#C4953A] to-transparent" />

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0E8]">
            <img
              src={imgSrc}
              alt={fullName}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />

            {/* Awards Badge */}
            {hero.awards.length > 0 && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-[#9B1B1B]/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Award className="w-3 h-3 text-[#C4953A]" />
                <span className="text-white text-[10px] sm:text-xs font-medium">{hero.awards.length}</span>
              </div>
            )}

            {/* Subtle star */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 opacity-30">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#9B1B1B] fill-[#9B1B1B]" />
            </div>
          </div>

          {/* Content */}
          <div className="p-2 sm:p-4">
            {/* Name — smaller on mobile, allow wrapping */}
            <div className="flex items-start gap-1.5 sm:gap-2 mb-1">
              {hero.awards.some(a => (typeof a === 'string' ? a : a?.name)?.toLowerCase().includes('герой') || (typeof a === 'string' ? a : a?.name)?.toLowerCase().includes('hero')) && (
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#9B1B1B] fill-[#9B1B1B] flex-shrink-0 mt-0.5" />
              )}
              <h3 className="text-[#1F1A16] font-semibold text-sm sm:text-base md:text-lg group-hover:text-[#C4953A] transition-colors duration-300 leading-tight break-words">
                {fullName}
              </h3>
            </div>

            {/* Rank — smaller, no tracking on mobile */}
            <p className="text-[#C4953A] text-xs sm:text-sm font-medium mb-2 sm:mb-3 sm:tracking-wide">
              {hero.militaryRank}
            </p>

            {/* Dates & Place — compact on mobile */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 text-[#8A8178] text-[10px] sm:text-xs">
              {hero.birthDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C4953A] flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {hero.birthDate.getFullYear()} — {hero.deathDate ? hero.deathDate.getFullYear() : t('heroes.present')}
                  </span>
                </div>
              )}
              {hero.birthPlace && (
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-[#9B1B1B] flex-shrink-0" />
                  <span className="truncate">{hero.birthPlace}</span>
                </div>
              )}
            </div>

            {/* Awards Preview — scrollable on mobile */}
            {hero.awards.length > 0 && (
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#E8DFD4]">
                <div className="flex gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide pb-1 sm:flex-wrap sm:overflow-visible">
                  {hero.awards.slice(0, 4).map((award, i) => (
                    <Tooltip key={i} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <span className="inline-block bg-[#F5F0E8] text-[#6B5D4F] border border-[#E8DFD4] px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] cursor-help hover:bg-[#C4953A]/10 hover:border-[#C4953A]/30 transition-colors duration-300 whitespace-nowrap shrink-0">
                          {award.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={6}
                        className="bg-white text-[#1F1A16] border border-[#E8DFD4] max-w-[200px] sm:max-w-[260px] p-0 shadow-xl overflow-hidden rounded-lg"
                      >
                        <div className="flex gap-2 sm:gap-3 p-2 sm:p-3">
                          {award.image && (
                            <img src={award.image} alt={award.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0" />
                          )}
                          <div className="space-y-1 min-w-0">
                            <p className="font-semibold text-[#C4953A] text-[10px] sm:text-xs">{award.name}</p>
                            <p className="text-[9px] sm:text-[10px] text-[#8A8178] leading-relaxed">{award.description}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {hero.awards.length > 4 && (
                    <span className="text-[#C4953A] text-[9px] sm:text-[10px] px-1 shrink-0">+{hero.awards.length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}