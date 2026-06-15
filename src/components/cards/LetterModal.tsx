import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import type { Letter } from '@/types';

const dateLocales: Record<string, typeof ru> = { ru, en: enUS, be: ru };

interface LetterModalProps {
  letter: Letter | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LetterModal({ letter, isOpen, onClose }: LetterModalProps) {
  const { t, i18n } = useTranslation('pages');
  const locale = dateLocales[i18n.language] || ru;
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!letter) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          {/* Letter Paper */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded"
            initial={{ rotateX: -90, scale: 0.7, opacity: 0 }}
            animate={{ rotateX: 0, scale: 1, opacity: 1 }}
            exit={{ rotateX: 90, scale: 0.7, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 120,
              duration: 0.8,
            }}
            style={{
              transformOrigin: 'top center',
              backgroundImage: 'url(/paper-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,69,19,0.2)',
            }}
          >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-[#F5E6C8]/30 pointer-events-none" />

            {/* Paper edges effect */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 60px rgba(139,69,19,0.15)',
              }}
            />

            <div className="relative p-8 md:p-12">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#5C3D2E] hover:text-[#9A4A4A] transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Letter header */}
              <div className="border-b-2 border-[#8B4513]/40 pb-4 mb-6">
                <h2 className="text-[#2C1810] font-bold text-2xl md:text-3xl mb-4 leading-tight">
                  {t('letters.letterFromFront')} {letter.recipient.charAt(0).toUpperCase() + letter.recipient.slice(1)}
                </h2>

                <div className="flex flex-wrap gap-4 text-sm text-[#5C3D2E]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#8B4513]" />
                    <span className="font-medium">
                      {format(letter.date, 'd MMMM yyyy', { locale })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#8B4513]" />
                    <span><strong>{t('letters.fromShort')}:</strong> {letter.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#8B4513]" />
                    <span><strong>{t('letters.toShort')}:</strong> {letter.recipient.charAt(0).toUpperCase() + letter.recipient.slice(1)}</span>
                  </div>
                </div>
              </div>

              {/* Letter body text */}
              <div className="text-[#2C1810] leading-relaxed text-base md:text-lg space-y-4"
                style={{
                  fontFamily: '"Times New Roman", Georgia, serif',
                  textAlign: 'justify',
                }}
              >
                {letter.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="indent-8">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 my-8">
                <div className="h-px w-16 bg-[#8B4513]/40" />
                <div className="w-2 h-2 rounded-full bg-[#8B4513]/60" />
                <div className="h-px w-16 bg-[#8B4513]/40" />
              </div>

              {/* Footer */}
              <div className="text-right text-[#5C3D2E] italic">
                <p className="font-medium">{letter.author}</p>
                <p className="text-sm">
                  {format(letter.date, 'd MMMM yyyy', { locale })}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
