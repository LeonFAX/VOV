import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Mail, PenLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LetterCard } from '@/components/cards';
import { useTranslatedLetters } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

export function LettersPage() {
  const { t, i18n } = useTranslation('pages');
  const letters = useTranslatedLetters();
  const [searchQuery, setSearchQuery] = useState('');
  const locale = dateLocales[i18n.language] || ru;

  const filteredLetters = useMemo(() => {
    if (!searchQuery.trim()) return letters;
    const q = searchQuery.toLowerCase();
    return letters.filter(
      (l) =>
        l.author.toLowerCase().includes(q) ||
        l.recipient.toLowerCase().includes(q) ||
        l.text.toLowerCase().includes(q) ||
        format(l.date, 'd MMMM yyyy', { locale }).toLowerCase().includes(q)
    );
  }, [searchQuery, letters, locale]);

  const byYear = useMemo(() => {
    const groups: Record<number, typeof letters> = {};
    filteredLetters.forEach((l) => {
      const y = l.date.getFullYear();
      if (!groups[y]) groups[y] = [];
      groups[y].push(l);
    });
    return groups;
  }, [filteredLetters]);

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b);

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
            <Mail className="w-8 h-8 text-[#9B1B1B]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1A16] font-serif">
              {t('letters.title')}
            </h1>
          </div>
          <p className="text-[#6B5D4F] text-lg max-w-2xl leading-relaxed">
            {t('letters.description')}
          </p>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#9B1B1B] to-transparent mt-6 opacity-60" />
        </motion.div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] px-4 py-2 rounded-lg">
            <PenLine className="w-4 h-4 text-[#C4953A]" />
            <span className="text-[#1F1A16] text-sm font-medium">{t('letters.lettersCount', { count: letters.length })}</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] px-4 py-2 rounded-lg">
            <Mail className="w-4 h-4 text-[#3D6B4A]" />
            <span className="text-[#1F1A16] text-sm font-medium">{t('letters.uniqueAuthors')}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8178]" />
          <Input
            type="text"
            placeholder={t('letters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 bg-white border-[#E8DFD4] text-[#1F1A16] placeholder:text-[#8A8178] focus:border-[#C4953A] rounded-lg"
          />
        </div>

        {/* Letters by year */}
        {years.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-16 h-16 text-[#E8DFD4] mx-auto mb-4" />
            <p className="text-[#8A8178] text-lg">{t('letters.noResults')}</p>
          </div>
        ) : (
          years.map((year) => (
            <div key={year} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#9B1B1B] rounded-full" />
                  <h2 className="text-2xl font-bold text-[#C4953A] font-serif">{year}</h2>
                </div>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#C4953A] to-transparent" />
                <span className="text-[#8A8178] text-sm">{t('letters.lettersCount', { count: byYear[year].length })}</span>
              </div>

              {/* Grid с auto-rows для корректной работы row-span */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
                {byYear[year].map((letter, i) => (
                  <LetterCard key={letter.id} letter={letter} index={i} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
