import { create } from 'zustand';
import type { Language, SearchFilters, Hero, Event, Letter, Monument } from '@/types';
import { letters as initialLetters, monuments as initialMonuments } from '@/data';

// UI Store
interface UIStore {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  language: Language;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setLanguage: (lang: Language) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  modalContent: null,
  language: 'ru',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
  setLanguage: (lang) => set({ language: lang }),
}));

// Content Store с CRUD операциями
interface ContentStore {
  heroes: Hero[];
  events: Event[];
  letters: Letter[];
  monuments: Monument[];
  loading: boolean;
  error: string | null;
  
  // Heroes CRUD
  addHero: (hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHero: (id: string, hero: Partial<Hero>) => void;
  deleteHero: (id: string) => void;
  
  // Events CRUD
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Letters CRUD
  addLetter: (letter: Omit<Letter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLetter: (id: string, letter: Partial<Letter>) => void;
  deleteLetter: (id: string) => void;
  
  // Monuments CRUD
  addMonument: (monument: Omit<Monument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMonument: (id: string, monument: Partial<Monument>) => void;
  deleteMonument: (id: string) => void;
  
  // Initialize heroes & events
  initializeHeroes: () => Promise<void>;
  initializeEvents: () => Promise<void>;
  
  // Reload (for dev/HMR)
  reloadEvents: () => Promise<void>;
  reloadHeroes: () => Promise<void>;
  
  // Reset
  resetToInitial: () => void;
}

export const useContentStore = create<ContentStore>((set) => {
  const store: ContentStore = {
    heroes: [],
    events: [],
    letters: [...initialLetters],
    monuments: [...initialMonuments],
    loading: false,
    error: null,
    
    // Initialize heroes from JSON
    initializeHeroes: async () => {
      const { loadHeroes } = await import('@/data/heroes');
      const heroes = await loadHeroes();
      set({ heroes });
    },
    
    // Initialize events from JSON
    initializeEvents: async () => {
  const response = await fetch('/data/events.json');
  const rawEvents = await response.json();
  
  const events = rawEvents.map((e: any) => ({
    ...e,
    id: String(e.id),
    date: new Date(e.date),
    endDate: e.endDate ? new Date(e.endDate) : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  
  set({ events });
},
    
    // Reload events (bypasses module cache)
    // store/index.ts — исправь reloadEvents:
reloadEvents: async () => {
  try {
    const response = await fetch('/data/events.json?t=' + Date.now());
    const rawEvents = await response.json();
    
    // Преобразование типов
    const events = rawEvents.map((e: any) => ({
      ...e,
      id: String(e.id),           // number → string
      date: new Date(e.date),      // string → Date
      endDate: e.endDate ? new Date(e.endDate) : undefined,
      createdAt: new Date(),        // добавь дефолтные
      updatedAt: new Date(),
    }));
    
    set({ events, error: null });
  } catch (e) {
    console.error('Failed to reload events:', e);
    set({ error: 'Failed to reload events' });
  }
},
    
    // Reload heroes (bypasses module cache)
    reloadHeroes: async () => {
      try {
        const response = await fetch('/data/heroes.json?t=' + Date.now());
        const heroes = await response.json();
        set({ heroes, error: null });
      } catch (e) {
        console.error('Failed to reload heroes:', e);
        set({ error: 'Failed to reload heroes' });
      }
    },
    
    // Heroes
    addHero: (heroData) => set((state) => {
      const newHero: Hero = {
        ...heroData as Hero,
        id: `hero-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { heroes: [...state.heroes, newHero] };
    }),
    
    updateHero: (id, heroData) => set((state) => ({
      heroes: state.heroes.map(h => h.id === id ? { ...h, ...heroData, updatedAt: new Date() } : h)
    })),
    
    deleteHero: (id) => set((state) => ({
      heroes: state.heroes.filter(h => h.id !== id)
    })),
    
    // Events
    addEvent: (eventData) => set((state) => {
      const newEvent: Event = {
        ...eventData as Event,
        id: `event-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { events: [...state.events, newEvent] };
    }),
    
    updateEvent: (id, eventData) => set((state) => ({
      events: state.events.map(e => e.id === id ? { ...e, ...eventData, updatedAt: new Date() } : e)
    })),
    
    deleteEvent: (id) => set((state) => ({
      events: state.events.filter(e => e.id !== id)
    })),
    
    // Letters
    addLetter: (letterData) => set((state) => {
      const newLetter: Letter = {
        ...letterData as Letter,
        id: `letter-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { letters: [...state.letters, newLetter] };
    }),
    
    updateLetter: (id, letterData) => set((state) => ({
      letters: state.letters.map(l => l.id === id ? { ...l, ...letterData, updatedAt: new Date() } : l)
    })),
    
    deleteLetter: (id) => set((state) => ({
      letters: state.letters.filter(l => l.id !== id)
    })),
    
    // Monuments
    addMonument: (monumentData) => set((state) => {
      const newMonument: Monument = {
        ...monumentData as Monument,
        id: `monument-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { monuments: [...state.monuments, newMonument] };
    }),
    
    updateMonument: (id, monumentData) => set((state) => ({
      monuments: state.monuments.map(m => m.id === id ? { ...m, ...monumentData, updatedAt: new Date() } : m)
    })),
    
    deleteMonument: (id) => set((state) => ({
      monuments: state.monuments.filter(m => m.id !== id)
    })),
    
    // Reset
    resetToInitial: () => set({
      heroes: [],
      events: [],
      letters: [...initialLetters],
      monuments: [...initialMonuments],
    }),
  };

  // HMR for dev: auto-reload when events.json changes
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      console.log('[HMR] Reloading events...');
      store.reloadEvents();
    });
  }

  return store;
});

// Map Store
interface MapStore {
  selectedDate: Date;
  selectedRegion: string | null;
  setSelectedDate: (date: Date) => void;
  setSelectedRegion: (region: string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedDate: new Date('1941-06-21'),
  selectedRegion: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
}));

// Search Store
interface SearchStore {
  query: string;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  filters: {},
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),
}));

// Auth Store
interface AuthStore {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    if (email === 'admin@example.com' && password === 'admin') {
      set({ isAuthenticated: true, user: { name: 'Администратор', email, role: 'admin' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));