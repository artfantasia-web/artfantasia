import { useState, useEffect } from 'react';

/**
 * Hook to detect whether the page has been translated by the browser (e.g. Chrome Translate).
 * Chrome adds classes like 'translated-ltr' or 'translated-rtl' to <html> or alters document.documentElement.lang.
 */
export function useIsTranslated(): boolean {
  const [isTranslated, setIsTranslated] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    const html = document.documentElement;
    return (
      html.classList.contains('translated-ltr') ||
      html.classList.contains('translated-rtl') ||
      (html.getAttribute('lang') !== null && html.getAttribute('lang') !== 'ko')
    );
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkTranslation = () => {
      const html = document.documentElement;
      const translated =
        html.classList.contains('translated-ltr') ||
        html.classList.contains('translated-rtl') ||
        (html.getAttribute('lang') !== null && html.getAttribute('lang') !== 'ko');
      setIsTranslated(translated);
    };

    checkTranslation();

    const observer = new MutationObserver(() => {
      checkTranslation();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'lang'],
    });

    return () => observer.disconnect();
  }, []);

  return isTranslated;
}
