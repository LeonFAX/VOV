import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Mail, BookOpen } from 'lucide-react';
import { SpeakButton } from '@/components/SpeakButton';
import { Button } from '@/components/ui/button';
import { useTranslatedLetters } from '@/hooks/useTranslatedData';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = {
  ru,
  en: enUS,
  be: ru,
};

export function LetterDetailPage() {
  const { t, i18n } = useTranslation('pages');
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const letters = useTranslatedLetters();
  const letter = slug ? letters.find((l) => l.slug === slug) : undefined;
  const locale = dateLocales[i18n.language] || ru;

  if (!letter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <h1 className="text-2xl text-[#1F1A16] mb-4">{t('letters.notFound')}</h1>
          <Button onClick={() => navigate('/letters')} variant="outline" className="border-[#E8DFD4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('letters.backToLetters')}
          </Button>
        </div>
      </div>
    );
  }

  const dateStr = format(letter.date, 'd MMMM yyyy', { locale });

  return (
    <div className="min-h-screen py-12 bg-[#FAF6F0]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/letters')}
            className="text-[#8A8178] hover:text-[#1F1A16] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('letters.backToLetters')}
          </Button>
        </motion.div>

        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-lg overflow-hidden shadow-xl border border-[#E8DFD4] bg-white">
            
            {/* Header with envelope image */}
            <div className="relative h-48 overflow-hidden bg-[#C9B8A0]">
              <img 
                src="/images/letter-envelope.png" 
                alt="Полевая почта"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              
              {/* Date badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#2B1F16]/70 text-[#F5F0E8] text-sm font-bold px-3 py-1.5 rounded backdrop-blur-sm">
                  {dateStr}
                </span>
              </div>
            </div>

            <div className="relative p-8 md:p-12">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-6 text-sm flex-wrap">
                <Calendar className="w-4 h-4 text-[#8A8178]" />
                <span className="text-[#8A8178] font-bold">{dateStr}</span>
                <SpeakButton
                  text={`${t('letters.fromShort')}: ${letter.author}. ${t('letters.toShort')}: ${letter.recipient}. ${dateStr}. ${letter.text}`}
                  label={t('speech.listen')}
                  size="sm"
                  variant="secondary"
                />
                <span className="text-[#E8DFD4] mx-2">|</span>
                <Mail className="w-4 h-4 text-[#9B1B1B]" />
                <span className="text-[#9B1B1B] text-xs font-bold uppercase tracking-wider">
                  {t('letters.letterFromFront')}
                </span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gradient-to-r from-[#C4953A] via-[#E8DFD4] to-transparent mb-8" />

              {/* From / To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <span className="text-[#8A8178] text-xs uppercase tracking-wider">{t('letters.from')}</span>
                  <p className="text-[#1F1A16] text-xl font-bold mt-1 font-serif">
                    {letter.author}
                  </p>
                </div>
                <div>
                  <span className="text-[#8A8178] text-xs uppercase tracking-wider">{t('letters.to')}</span>
                  <p className="text-[#1F1A16] text-lg font-semibold mt-1 font-serif">
                    {letter.recipient}
                  </p>
                </div>
              </div>

              {/* Main text */}
              <div className="relative bg-[#F5F0E8] rounded-lg p-6 md:p-8 border border-[#E8DFD4]">
                <p className="text-[#1F1A16] text-base md:text-lg leading-relaxed whitespace-pre-line font-serif italic">
                  {letter.text}
                </p>
              </div>

              {/* Context */}
              {letter.context && (
                <div className="mt-10 pt-6 border-t border-dashed border-[#E8DFD4]">
                  <h3 className="text-[#8A8178] font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    {t('letters.historicalContext')}
                  </h3>
                  <p className="text-[#6B5D4F] text-sm leading-relaxed">{letter.context}</p>
                </div>
              )}

              {/* Bottom marks */}
              <div className="mt-10 pt-6 border-t border-dashed border-[#E8DFD4] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#3D6B4A] rounded-full" />
                  <span className="text-[#8A8178] text-[10px] uppercase tracking-wider">
                    {t('letters.passedCensorship')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#9B1B1B] rounded-full" />
                  <span className="text-[#8A8178] text-[10px] uppercase tracking-wider">
                    {t('letters.archiveDocument')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related letters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="h-[2px] bg-gradient-to-r from-[#C4953A] to-transparent mb-6 w-20" />
          <h2 className="text-xl font-semibold text-[#1F1A16] mb-6 font-serif">
            {t('letters.otherLetters')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {letters
              .filter((l) => l.id !== letter.id)
              .slice(0, 4)
              .map((l, _i) => (
                <Link key={l.id} to={`/letters/${l.slug}`} className="block h-full">
                  <div className="group h-full flex flex-col bg-white rounded-lg overflow-hidden border border-[#E8DFD4] hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    {/* Фото конверта */}
                    <div className="relative h-32 overflow-hidden bg-[#C9B8A0] shrink-0">
                      <img 
                        src="/images/letter-envelope.png" 
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Только дата */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-[#2B1F16]/70 text-[#F5F0E8] text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                          {format(l.date, 'd MMM yyyy', { locale })}
                        </span>
                      </div>
                    </div>

                    {/* Текст */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-[#1F1A16] text-sm font-bold font-serif mb-1 group-hover:text-[#9B1B1B] transition-colors truncate">
                        {l.recipient}
                      </h3>
                      <div className="w-8 h-[2px] bg-[#C4953A] mb-2 shrink-0" />
                      <div className="flex-1" />
                      <div className="pt-2 border-t border-[#E8DFD4] flex items-center justify-between gap-2 shrink-0">
                        <span className="text-[#9B1B1B] text-xs font-medium truncate">
                          {l.author}
                        </span>
                        <span className="text-[#C4953A] text-xs font-medium group-hover:text-[#9B1B1B] transition-colors whitespace-nowrap">
                          Читать →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
