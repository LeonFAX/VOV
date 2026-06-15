import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SpeechProvider } from '@/contexts/SpeechContext';
import { Layout } from '@/components/layout/Layout';
import { useContentStore } from '@/store';
import './i18n';
import { EventEditPage } from './pages/admin/EventEditPage';
import { MonumentEditPage } from './pages/admin/MonumentEditPage';
import { LetterEditPage } from './pages/admin/LetterEditPage';

// Lazy load all pages for code splitting (named exports wrapped)
const HomePage = lazy(() => import('@/pages').then(m => ({ default: m.HomePage })));
const HeroesPage = lazy(() => import('@/pages').then(m => ({ default: m.HeroesPage })));
const HeroDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.HeroDetailPage })));
const LettersPage = lazy(() => import('@/pages').then(m => ({ default: m.LettersPage })));
const LetterDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.LetterDetailPage })));
const EventsPage = lazy(() => import('@/pages').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.EventDetailPage })));
const MonumentsPage = lazy(() => import('@/pages').then(m => ({ default: m.MonumentsPage })));
const MonumentDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.MonumentDetailPage })));
const TimelinePage = lazy(() => import('@/pages').then(m => ({ default: m.TimelinePage })));
const SearchPage = lazy(() => import('@/pages').then(m => ({ default: m.SearchPage })));
const PrivacyPage = lazy(() => import('@/pages').then(m => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import('@/pages').then(m => ({ default: m.AboutPage })));
const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })));
const AdminPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminPage })));
const SourcesPage = lazy(() => import('@/pages').then(m => ({ default: m.SourcesPage })));
const ContactPage = lazy(() => import('@/pages').then(m => ({ default: m.ContactPage })));

// Admin pages
const HeroesListPage = lazy(() => import('@/pages/admin/HeroesListPage').then(m => ({ default: m.HeroesListPage })));
const EventsListPage = lazy(() => import('@/pages/admin/EventsListPage').then(m => ({ default: m.EventsListPage })));
const LettersListPage = lazy(() => import('@/pages/admin/LettersListPage').then(m => ({ default: m.LettersListPage })));
const MonumentsListPage = lazy(() => import('@/pages/admin/MonumentsListPage').then(m => ({ default: m.MonumentsListPage })));
const HeroCreatePage = lazy(() => import('@/pages/admin/HeroCreatePage').then(m => ({ default: m.HeroCreatePage })));
const EventCreatePage = lazy(() => import('@/pages/admin/EventCreatePage').then(m => ({ default: m.EventCreatePage })));
const LetterCreatePage = lazy(() => import('@/pages/admin/LetterCreatePage').then(m => ({ default: m.LetterCreatePage })));
const MonumentCreatePage = lazy(() => import('@/pages/admin/MonumentCreatePage').then(m => ({ default: m.MonumentCreatePage })));
const HeroEditPage = lazy(() => import('@/pages/admin/HeroEditPage').then(m => ({ default: m.HeroEditPage })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#C4953A] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const initializeHeroes = useContentStore((state) => (state as any).initializeHeroes);
  const initializeEvents = useContentStore((state) => (state as any).initializeEvents);

  useEffect(() => {
    initializeHeroes?.();
    initializeEvents?.();
  }, [initializeHeroes, initializeEvents]);

  return (
    <HashRouter>
      <SpeechProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="heroes" element={<HeroesPage />} />
          <Route path="heroes/:slug" element={<HeroDetailPage />} />
          <Route path="letters" element={<LettersPage />} />
          <Route path="letters/:slug" element={<LetterDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="monuments" element={<MonumentsPage />} />
          <Route path="monuments/:slug" element={<MonumentDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/heroes" element={<HeroesListPage />} />
        <Route path="/admin/heroes/:id/edit" element={<HeroEditPage />} />
        <Route path="/admin/heroes/new" element={<HeroCreatePage />} />
        <Route path="/admin/events" element={<EventsListPage />} />
        <Route path="/admin/events/:id/edit" element={<EventEditPage />} />
        <Route path="/admin/monuments/:id/edit" element={<MonumentEditPage />} />
        <Route path="/admin/letters/:id/edit" element={<LetterEditPage />} />
        <Route path="/admin/events/new" element={<EventCreatePage />} />
        <Route path="/admin/letters" element={<LettersListPage />} />
        <Route path="/admin/letters/new" element={<LetterCreatePage />} />
        <Route path="/admin/monuments" element={<MonumentsListPage />} />
        <Route path="/admin/monuments/new" element={<MonumentCreatePage />} />
      </Routes>
        </Suspense>
      </SpeechProvider>
    </HashRouter>
  );
}

export default App;
