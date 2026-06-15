import type { Hero } from '@/types';

let cachedHeroes: Hero[] | null = null;

function parseDate(dateStr: string | null): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

function convertHeroDates(hero: any): Hero {
  return {
    ...hero,
    birthDate: parseDate(hero.birthDate),
    deathDate: parseDate(hero.deathDate),
    createdAt: parseDate(hero.createdAt),
    updatedAt: parseDate(hero.updatedAt),
  };
}

export async function loadHeroes(): Promise<Hero[]> {
  if (cachedHeroes !== null) {
    return cachedHeroes;
  }

  try {
    const response = await fetch('/data/heroes.json');
    if (!response.ok) {
      throw new Error(`Failed to load heroes: ${response.status}`);
    }
    const data = await response.json();
    cachedHeroes = (data as any[]).map(convertHeroDates);
    return cachedHeroes;
  } catch (error) {
    console.error('Error loading heroes:', error);
    cachedHeroes = [];
    return cachedHeroes;
  }
}

// For backward compatibility - loads synchronously if already cached
export function getCachedHeroes(): Hero[] {
  return cachedHeroes || [];
}

export function getHeroBySlug(slug: string): Hero | undefined {
  return (cachedHeroes || []).find(h => h.slug === slug);
}

export function getHeroesByAward(awardName: string): Hero[] {
  return (cachedHeroes || []).filter(h =>
    h.awards.some(a => a.name.toLowerCase().includes(awardName.toLowerCase()))
  );
}
