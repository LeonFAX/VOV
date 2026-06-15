import { useEffect, useCallback, useRef } from 'react';
import { useSpeechContext } from '@/contexts/SpeechContext';

function getElementDescription(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent?.trim() || '';
  }

  const alt = element.getAttribute('alt');
  if (alt) return alt;

  const title = element.getAttribute('title');
  if (title) return title;

  const tag = element.tagName.toLowerCase();

  if (tag === 'img') return 'Изображение';

  if (tag === 'input') {
    const type = element.getAttribute('type') || 'text';
    const placeholder = element.getAttribute('placeholder');
    const label = document.querySelector(`label[for="${element.id}"]`);
    return placeholder || label?.textContent?.trim() || `Поле ввода ${type}`;
  }

  if (tag === 'button') {
    return element.textContent?.trim() || 'Кнопка';
  }

  if (tag === 'a') {
    const text = element.textContent?.trim() || '';
    return text ? `Ссылка: ${text}` : 'Ссылка';
  }

  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    return `Заголовок: ${element.textContent?.trim() || ''}`;
  }

  if (tag === 'nav') return 'Навигация';
  if (tag === 'header') return 'Шапка сайта';
  if (tag === 'footer') return 'Подвал сайта';
  if (tag === 'main') return 'Основное содержимое';
  if (tag === 'article') return 'Статья';
  if (tag === 'section') return 'Раздел страницы';

  const text = element.textContent?.trim();
  if (text && text.length < 150) return text;

  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) return `Карточка: ${heading.textContent?.trim() || ''}`;

  return text?.substring(0, 100) || '';
}

export function ScreenReaderOverlay() {
  const { isScreenReaderMode, speak, isSpeaking, stop: _stop } = useSpeechContext();
  const lastElementRef = useRef<string>('');
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ЛОГ при монтировании и изменении режима
  useEffect(() => {
    console.log('[ScreenReaderOverlay] Mounted, isScreenReaderMode:', isScreenReaderMode);
  }, [isScreenReaderMode]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    console.log('[ScreenReader] mouseover fired, isScreenReaderMode:', isScreenReaderMode);

    if (!isScreenReaderMode) {
      console.log('[ScreenReader] Mode OFF, skipping');
      return;
    }

    const target = e.target as HTMLElement;
    if (!target) {
      console.log('[ScreenReader] No target');
      return;
    }

    // Пропускаем панель доступности и скрытые элементы
    if (target.closest('.accessibility-panel')) {
      console.log('[ScreenReader] Skipping accessibility-panel element');
      return;
    }
    if (target.closest('[aria-hidden="true"]')) {
      console.log('[ScreenReader] Skipping aria-hidden element');
      return;
    }
    if (target.tagName === 'SCRIPT' || target.tagName === 'STYLE') return;
    if (target.tagName === 'HTML' || target.tagName === 'BODY') return;

    const description = getElementDescription(target);
    console.log('[ScreenReader] Element:', target.tagName, 'Description:', description, 'Last:', lastElementRef.current);

    if (!description) {
      console.log('[ScreenReader] No description');
      return;
    }

    if (description === lastElementRef.current) {
      console.log('[ScreenReader] Same as last, skipping');
      return;
    }

    lastElementRef.current = description;

    // Отменяем предыдущий таймер
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Озвучиваем сразу без задержки для теста
    console.log('[ScreenReader] Calling speak() for:', description);
    speak(description);
    console.log('[ScreenReader] isSpeaking after speak:', isSpeaking);

  }, [isScreenReaderMode, speak, isSpeaking]);

  const handleMouseOut = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleFocus = useCallback((e: FocusEvent) => {
    console.log('[ScreenReader] focus fired');
    if (!isScreenReaderMode) return;

    const target = e.target as HTMLElement;
    if (!target) return;
    if (target.closest('.accessibility-panel')) return;

    const description = getElementDescription(target);
    if (description && description !== lastElementRef.current) {
      lastElementRef.current = description;
      speak(description);
    }
  }, [isScreenReaderMode, speak]);

  useEffect(() => {
    console.log('[ScreenReaderOverlay] Setting up listeners, isScreenReaderMode:', isScreenReaderMode);

    if (!isScreenReaderMode) {
      lastElementRef.current = '';
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      return;
    }

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('focus', handleFocus, true);

    return () => {
      console.log('[ScreenReaderOverlay] Cleaning up listeners');
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('focus', handleFocus, true);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [isScreenReaderMode, handleMouseOver, handleMouseOut, handleFocus]);

  return null;
}
