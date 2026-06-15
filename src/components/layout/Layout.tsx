import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ScreenReaderOverlay } from '@/components/ScreenReaderOverlay';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const { settings } = useSpeechContext();
  const showProgress = location.pathname.split('/').length > 2;

  // Применяем CSS-классы для настроек доступности к body
  useEffect(() => {
    document.body.classList.toggle('sr-highlight', settings.highlight);
    document.body.classList.toggle('sr-large-cursor', settings.largeCursor);
    document.body.classList.toggle('sr-high-contrast', settings.highContrast);
  }, [settings.highlight, settings.largeCursor, settings.highContrast]);

  return (
    <div className="min-h-screen bg-[#181410] flex flex-col">
      {showProgress && <ReadingProgress />}
      <Header />
      <main className="flex-1 pt-[75px]">
        <Outlet />
      </main>
      <Footer />
      <ScreenReaderOverlay />
    </div>
  );
}