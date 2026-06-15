// Базовый интерфейс с ID и метаданными
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Награда
export interface Award {
  name: string;
  description: string;
  image?: string;
  date?: Date;
}

// Герой войны
export interface Hero extends BaseEntity {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: Date;
  deathDate?: Date;
  birthPlace?: string;
  militaryRank: string;
  awards: Award[];
  biography: string;
  feat: string;
  images: string[];
  slug: string;
}

// Событие войны
export type EventType = 'battle' | 'operation' | 'political' | 'movement' | 'shelling' | 'strategic' | 'liberation' | 'occupation' | 'offensive' | 'defense' | 'encirclement' | 'other';

export interface Event extends BaseEntity {
  title: string;
  date: Date;
  endDate?: Date;
  type: EventType;
  description: string;
  hideDate?: Date;
  fullText: string;
  location?: string;
  coordinates?: [number, number];
  images: string[];
  relatedHeroes: string[];
  sources: string[];
  slug: string;
}

// Письмо с фронта
export interface Letter extends BaseEntity {
  author: string;
  authorId?: string;
  date: Date;
  recipient: string;
  text: string;
  preview?: string;
  originalScan?: string;
  transcription?: string;
  context?: string;
  audioUrl?: string;
  slug: string;
  images?: string[];
}

// Памятник
export interface Monument extends BaseEntity {
  name: string;
  description: string;
  location: string;
  coordinates: [number, number];
  region: string;
  images: string[];
  history: string;
  architect?: string;
  sculptor?: string;
  openingDate?: Date;
  slug: string;
}

// Позиция линии фронта для карты
export interface FrontLinePosition {
  date: Date;
  path: string;
  occupiedTerritory: string;
}

// Пользователь (для админ-панели)
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

// Результат поиска
export interface SearchResult {
  item: Hero | Event | Letter | Monument;
  type: 'hero' | 'event' | 'letter' | 'monument';
  relevance: number;
}

// Фильтры поиска
export interface SearchFilters {
  type?: ('hero' | 'event' | 'letter' | 'monument')[];
  dateFrom?: Date;
  dateTo?: Date;
  year?: number;
  region?: string;
}

// Язык
export type Language = 'ru' | 'en';

// Тема
export type Theme = 'dark' | 'light';


