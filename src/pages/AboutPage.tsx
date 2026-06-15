import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Heart } from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation('pages');

  const features = [
    { title: t('about.timelineDesc'), description: t('about.timelineFeatureDesc') },
    { title: t('about.heroesDesc'), description: t('about.heroesFeatureDesc') },
    { title: t('about.lettersDesc'), description: t('about.lettersFeatureDesc') },
    { title: t('about.mapDesc'), description: t('about.mapFeatureDesc') },
    { title: t('about.searchDesc'), description: t('about.searchFeatureDesc') },
    { title: t('about.i18nDesc'), description: t('about.i18nFeatureDesc') },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="relative bg-[#2A2520] py-16 mb-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-[900px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              {t('about.title')}
            </h1>
            <div className="w-20 h-1 bg-[#C9A84C] mx-auto" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 border border-[#E0D8C8] shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2A2520] mb-4 flex items-center gap-3">
              <Heart className="w-6 h-6 text-[#8B0000]" />
              {t('about.mission')}
            </h2>
            <p className="text-[#5A5040] leading-relaxed mb-4">
              {t('about.missionText')}
            </p>
            <p className="text-[#5A5040] leading-relaxed">
              {t('about.missionText2')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#2A2520] mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#C9A84C]" />
            {t('about.featuresTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 border border-[#E0D8C8] hover:border-[#C9A84C] transition-colors shadow-sm"
              >
                <h3 className="text-[#2A2520] font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#7A6E5D] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-[#E0D8C8]"
        >
          <p className="text-[#9A9080] text-sm text-center">
            {t('about.disclaimer')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}