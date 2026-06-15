import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronRight } from 'lucide-react';
import type { Event } from '@/types';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };

interface TimelineProps {
  events: Event[];
  vertical?: boolean;
}

const eventTypeColors: Record<string, string> = {
  battle: 'bg-[#8B3A3A]',
  operation: 'bg-[#166534]',
  political: 'bg-[#8B6914]',
  other: 'bg-[#8A7D6E]',
};

export function Timeline({ events, vertical = true }: TimelineProps) {
  const { t, i18n } = useTranslation('pages');
  const locale = dateLocales[i18n.language] || ru;
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const eventTypeLabels: Record<string, string> = {
    battle: t('events.battle'),
    operation: t('events.operation'),
    political: t('events.political'),
    other: t('events.other'),
  };

  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!vertical) {
    // Horizontal timeline
    return (
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 gap-4">
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[300px]"
            >
              <div className="bg-[#2C2318] rounded-lg p-4 border border-[#8B6914]/20">
                <div className={`inline-block ${eventTypeColors[event.type]} text-white text-xs px-2 py-0.5 rounded mb-2`}>
                  {eventTypeLabels[event.type]}
                </div>
                <p className="text-[#8B6914] text-sm font-medium mb-1">
                  {format(event.date, 'd MMM yyyy', { locale })}
                </p>
                <h3 className="text-[#D4C4A0] font-semibold text-sm">{event.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#C9B896] md:-translate-x-1/2" />

      {/* Events */}
      <div className="space-y-8">
        {sortedEvents.map((event, index) => {
          const isExpanded = expandedEvent === event.id;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-start gap-8 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#8B6914] rounded-full border-4 border-[#3D2D1F] md:-translate-x-1/2 z-10" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                <div
                  className="bg-[#2C2318] rounded-lg p-5 border border-[#8B6914]/20 hover:border-[#8B6914]/30 transition-all cursor-pointer"
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                >
                  {/* Type Badge */}
                  <div className={`inline-block ${eventTypeColors[event.type]} text-white text-xs px-2 py-0.5 rounded mb-3`}>
                    {eventTypeLabels[event.type]}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-[#8B6914] text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {format(event.date, 'd MMMM yyyy', { locale })}
                      {event.endDate && ` — ${format(event.endDate, 'd MMMM yyyy', { locale })}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#D4C4A0] font-semibold text-lg mb-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-[#6A5D50] text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {event.description}
                  </p>

                  {/* Expand Button */}
                  <div className="mt-3 flex items-center gap-2 text-[#8B6914] text-sm">
                    <span>{isExpanded ? t('events.collapse') : t('events.readMore')}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
