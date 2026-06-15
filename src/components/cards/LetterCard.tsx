import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Letter } from '@/types';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

interface LetterCardProps {
  letter: Letter;
  index?: number;
}

export function LetterCard({ letter, index = 0 }: LetterCardProps) {
  const { i18n } = useTranslation('pages');
  const locale = dateLocales[i18n.language] || ru;
  const dateStr = format(letter.date, 'd MMM yyyy', { locale });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/letters/${letter.slug}`} className="block h-full">
        <div className="group h-full flex flex-col bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <div className="relative h-44 overflow-hidden bg-[#C9B8A0] shrink-0">
            <img
              src="/images/letter-envelope.png"
              alt="Полевая почта"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-[#2B1F16]/70 text-[#F5F0E8] text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                {dateStr}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-[#9B1B1B]/80 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                Письмо с фронта
              </span>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-[#1F1A16] text-lg font-bold font-serif mb-2 group-hover:text-[#9B1B1B] transition-colors truncate">
              {letter.recipient}
            </h3>
            <div className="w-10 h-[2px] bg-[#C4953A] mb-3 shrink-0" />
            <div className="flex-1" />
            <div className="pt-3 border-t border-[#E8DFD4] flex items-center justify-between gap-2 shrink-0">
              <span className="text-[#9B1B1B] text-sm font-medium truncate">
                {letter.author}
              </span>
              <span className="text-[#C4953A] text-sm font-medium group-hover:text-[#9B1B1B] transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                Читать далее <span className="text-lg">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
