import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Event, Hero, Letter, Monument } from '@/types';

export function useTranslatedEvents(): Event[] {
  const { i18n } = useTranslation();
  const { events } = useContentStore();
  const lang = i18n.language;

  if (lang === 'ru') return events;

  const data = i18n.getResourceBundle(lang, 'data');
  if (!data?.events && !data?.eventLocations && !data?.eventFullTexts) return events;

  return events.map(event => {
    const translation = data.events[event.id];
    const locTranslation = data.eventLocations?.[event.id];
    const fullTextTranslation = data.eventFullTexts?.[event.id];
    if (!translation && !locTranslation && !fullTextTranslation) return event;
    return {
      ...event,
      title: translation?.title || event.title,
      description: translation?.description || event.description,
      location: locTranslation || event.location,
      fullText: fullTextTranslation || event.fullText,
    };
  });
}

export function useTranslatedHeroes(): Hero[] {
  const { i18n } = useTranslation();
  const { heroes } = useContentStore();
  const lang = i18n.language;

  if (lang === 'ru') return heroes;

  const data = i18n.getResourceBundle(lang, 'data');
  if (!data?.heroes) return heroes;

  return heroes.map(hero => {
    const key = hero.slug;
    const translation = data.heroes[key];
    
    // Translate awards
    const translatedAwards = hero.awards?.map(award => {
      const translatedName = data.awards?.[award.name] || award.name;
      return { ...award, name: translatedName };
    });
    
    // Translate birthPlace, biography, feat
    const translatedBirthPlace = data.birthplaces?.[key] || hero.birthPlace;
    const translatedBiography = data.heroBiographies?.[key] || hero.biography;
    const translatedFeat = data.heroFeats?.[key] || hero.feat;
    
    if (!translation) {
      return { ...hero, awards: translatedAwards, birthPlace: translatedBirthPlace, biography: translatedBiography, feat: translatedFeat };
    }
    
    const nameParts = (translation.name || '').split(' ');
    return {
      ...hero,
      firstName: nameParts[0] || hero.firstName,
      lastName: nameParts[1] || hero.lastName,
      middleName: translation ? (translation.middleName ?? '') : hero.middleName,
      militaryRank: translation.rank || hero.militaryRank,
      feat: translatedFeat,
      biography: translatedBiography,
      birthPlace: translatedBirthPlace,
      awards: translatedAwards,
    };
  });
}

export function useTranslatedMonuments(): Monument[] {
  const { i18n } = useTranslation();
  const { monuments } = useContentStore();
  const lang = i18n.language;

  if (lang === 'ru') return monuments;

  const data = i18n.getResourceBundle(lang, 'data');
  if (!data?.monuments) return monuments;

  return monuments.map(monument => {
    const translation = data.monuments[monument.id];
    const descTranslation = data.monumentDescriptions?.[monument.id];
    const regionTranslation = data.monumentRegions?.[monument.id];
    if (!translation && !descTranslation && !regionTranslation) return monument;
    return {
      ...monument,
      name: translation?.name || monument.name,
      location: translation?.location || monument.location,
      description: descTranslation || monument.description,
      region: regionTranslation || monument.region,
    };
  });
}

export function useTranslatedLetters(): Letter[] {
  const { i18n } = useTranslation();
  const { letters } = useContentStore();
  const lang = i18n.language;

  if (lang === 'ru') return letters;

  const data = i18n.getResourceBundle(lang, 'data');
  if (!data?.letters && !data?.letterTexts && !data?.letterContexts) return letters;

  return letters.map(letter => {
    const translation = data.letters[letter.slug];
    const textTranslation = data.letterTexts?.[letter.slug];
    const contextTranslation = data.letterContexts ? data.letterContexts[letter.slug] : undefined;
    if (!translation && !textTranslation && !contextTranslation) return letter;
    return {
      ...letter,
      author: translation?.author || letter.author,
      recipient: translation?.recipient || letter.recipient,
      preview: translation?.preview || letter.preview,
      text: textTranslation || letter.text,
      context: contextTranslation !== undefined ? contextTranslation : letter.context,
    };
  });
}
