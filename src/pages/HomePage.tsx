import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroCard, EventCard, LetterCard, MonumentCard } from '@/components/cards';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/ParallaxSection';
import { useTranslatedEvents, useTranslatedHeroes, useTranslatedLetters, useTranslatedMonuments } from '@/hooks/useTranslatedData';
import { useCountUp, useScrollAnimation } from '@/hooks/useScrollAnimation';

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 });
  const { count, startAnimation } = useCountUp(value, 2000);

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible, startAnimation]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C4953A] mb-2 font-serif">
        {count.toLocaleString('en-US')}{suffix}
      </div>
      <p className="text-[#8A8178] text-xs sm:text-sm">{label}</p>
    </motion.div>
  );
}

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-memorial.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-[#1F1A16]/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Year Badge */}
          <div className="inline-flex items-center gap-2 bg-[#9B1B1B]/90 border border-[#9B1B1B] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
            <span className="text-white font-bold text-sm sm:text-base">1941 — 1945</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 font-serif leading-tight drop-shadow-lg px-2">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#C4953A] mb-3 sm:mb-4 font-serif px-4">
            {t('hero.subtitle')}
          </p>

          {/* Description */}
          <p className="text-[#E8DFD4] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-10 px-4">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link to="/timeline" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-[#C4953A] text-[#1F1A16] hover:bg-[#A67B3D] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('buttons.explore')}
              </Button>
            </Link>
            <Link to="/heroes" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-white/80 text-white bg-white/10 hover:bg-white/20 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('nav.heroes')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-white/70"
        >
          <span className="text-xs mb-2">{t('hero.scrollDown')}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="pt-6 sm:pt-8 pb-0 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <FadeInOnScroll>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1A16] mb-3 sm:mb-4 font-serif">
              {t('sections.stats')}
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[#C4953A] mx-auto" />
          </div>
        </FadeInOnScroll>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          <StaggerItem><StatCounter value={1418} label={ 'Дней войны'} /></StaggerItem>
          <StaggerItem><StatCounter value={11600} label={'Героев СССР'} /></StaggerItem>
          <StaggerItem><StatCounter value={27000000} label={ 'Погибших'} /></StaggerItem>
          <StaggerItem><StatCounter value={13} label={'Городов-героев'} /></StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

function FeaturedHeroesSection() {
  const { t } = useTranslation();
  const heroes = useTranslatedHeroes();
  // Show heroes with real portraits first, then fall back to first 4
  const featuredHeroes = useMemo(() => {
    const withPortraits = heroes.filter(h => 
      h.images?.[0] && h.images[0] !== '/images/heroes/placeholder.jpg'
    );
    return withPortraits.length >= 4 ? withPortraits.slice(0, 8) : heroes.slice(0, 4);
  }, [heroes]);

  return (
    <section className="pt-6 sm:pt-8 pb-12 sm:pb-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <FadeInOnScroll direction="left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1A16] mb-2 font-serif">
                {t('sections.featuredHeroes') || 'Легендарные герои'}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-[#C4953A]" />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="right">
            <Link to="/heroes">
              <Button variant="ghost" className="text-[#C4953A] hover:text-[#1F1A16] hover:bg-[#C4953A]/10 text-sm sm:text-base">
                {t('buttons.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeInOnScroll>
        </div>

        {/* FIXED: 1 column on mobile, 2 on sm, 3 on md, 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredHeroes.map((hero, index) => (
            <HeroCard key={hero.id} hero={hero} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestEventsSection() {
  const { t } = useTranslation();
  const events = useTranslatedEvents();
  const featuredEvents = events.slice(0, 3);

  return (
    <section className="pt-12 sm:pt-20 pb-0 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <FadeInOnScroll direction="left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1A16] mb-2 font-serif">
                {t('sections.events')}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-[#C4953A]" />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="right">
            <Link to="/events">
              <Button variant="ghost" className="text-[#C4953A] hover:text-[#1F1A16] hover:bg-[#C4953A]/10 text-sm sm:text-base">
                {t('buttons.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeInOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestLettersSection() {
  const { t } = useTranslation();
  const letters = useTranslatedLetters();
  const featuredLetters = letters.slice(0, 3);

  return (
    <section className="pt-6 sm:pt-8 pb-12 sm:pb-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <FadeInOnScroll direction="left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1A16] mb-2 font-serif">
                {t('sections.letters')}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-[#C4953A]" />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="right">
            <Link to="/letters">
              <Button variant="ghost" className="text-[#C4953A] hover:text-[#1F1A16] hover:bg-[#C4953A]/10 text-sm sm:text-base">
                {t('buttons.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeInOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredLetters.map((letter, index) => (
            <LetterCard key={letter.id} letter={letter} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MonumentsPreviewSection() {
  const { t } = useTranslation();
  const monuments = useTranslatedMonuments();
  const featuredMonuments = monuments.slice(0, 4);

  return (
    <section className="pt-6 sm:pt-8 pb-12 sm:pb-20 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <FadeInOnScroll direction="left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1A16] mb-2 font-serif">
                {t('sections.monuments')}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-[#C4953A]" />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="right">
            <Link to="/monuments">
              <Button variant="ghost" className="text-[#C4953A] hover:text-[#1F1A16] hover:bg-[#C4953A]/10 text-sm sm:text-base">
                {t('buttons.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeInOnScroll>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredMonuments.map((monument, index) => (
            <MonumentCard key={monument.id} monument={monument} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Smooth gradient transitions between sections with different backgrounds */
function SectionTransition({ from, to }: { from: string; to: string }) {
  return <div className={`h-8 sm:h-12 bg-gradient-to-b ${from} ${to}`} />;
}

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <SectionTransition from="from-[#1F1A16]" to="to-[#FAF6F0]" />
      <StatsSection />
      {/* Stats beige → Heroes white */}
      <SectionTransition from="from-[#FAF6F0]" to="to-white" />
      <FeaturedHeroesSection />
      {/* Heroes white → Events beige */}
      <SectionTransition from="from-white" to="to-[#FAF6F0]" />
      <LatestEventsSection />
      {/* Events beige → Letters white */}
      <SectionTransition from="from-[#FAF6F0]" to="to-white" />
      <LatestLettersSection />
      {/* Letters white → Monuments beige */}
      <SectionTransition from="from-white" to="to-[#FAF6F0]" />
      <MonumentsPreviewSection />
    </div>
  );
}