import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ko' | 'en';

interface Translations {
  nav: {
    home: string;
    about: string;
    video: string;
    audio: string;
    afanmusic: string;
    marketing: string;
    notice: string;
    inquiry: string;
    languageToggle: string;
    ko: string;
    en: string;
  };
  common: {
    inquiryButton: string;
    homeAria: string;
    close: string;
    more: string;
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    nav: {
      home: '홈으로',
      about: '회사소개',
      video: '영상제작',
      audio: '라디오광고',
      afanmusic: '아판뮤직',
      marketing: '마케팅',
      notice: '공지사항',
      inquiry: '제작문의',
      languageToggle: '언어 번역',
      ko: '한국어',
      en: '영어',
    },
    common: {
      inquiryButton: '제작문의',
      homeAria: '아트판타지아 홈으로 이동',
      close: '닫기',
      more: '더보기',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      video: 'Film & Video',
      audio: 'Radio CM',
      afanmusic: 'Afan Music',
      marketing: 'Marketing',
      notice: 'Notice',
      inquiry: 'Inquiry',
      languageToggle: 'Language',
      ko: 'Korean',
      en: 'English',
    },
    common: {
      inquiryButton: 'Inquiry',
      homeAria: 'Go to Art Fantasia Home',
      close: 'Close',
      more: 'More',
    },
  },
};

// DOM node protection to prevent React NotFoundError crashes during Google Translate DOM mutations
if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    try {
      return originalRemoveChild.call(this, child) as T;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'NotFoundError') {
        return child;
      }
      throw e;
    }
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    try {
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'NotFoundError') {
        return newNode;
      }
      throw e;
    }
  };
}

/**
 * Triggers Google Translate whole-page translation
 */
function applyGoogleTranslate(targetLang: Language) {
  if (typeof window === 'undefined') return;

  const hostname = window.location.hostname;
  const cookieVal = targetLang === 'en' ? '/ko/en' : '/ko/ko';

  if (targetLang === 'en') {
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      if (parts.length > 2) {
        document.cookie = `googtrans=${cookieVal}; path=/; domain=.${parts.slice(-2).join('.')};`;
      }
    }
  } else {
    // Clear cookies when returning to Korean
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      if (parts.length > 2) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parts.slice(-2).join('.')};`;
      }
    }
    document.cookie = `googtrans=/ko/ko; path=/;`;
    document.documentElement.lang = 'ko';
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  }

  // Trigger Google Translate select element
  let attempts = 0;
  const maxAttempts = 35;
  const interval = setInterval(() => {
    attempts++;
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      clearInterval(interval);
      if (targetLang === 'en') {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      } else {
        const koOption = Array.from(combo.options).find(opt => opt.value === 'ko');
        if (koOption) {
          combo.value = 'ko';
        } else {
          combo.value = '';
        }
        combo.dispatchEvent(new Event('change'));

        // Restore original if banner restore button exists
        const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement | null;
        if (iframe?.contentWindow) {
          try {
            const restoreBtn = iframe.contentWindow.document.querySelector('.goog-te-button button') as HTMLElement | null;
            if (restoreBtn) restoreBtn.click();
          } catch {}
        }
      }
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      // Fallback: If combo is not available yet, dynamically ensure script is inserted
      if (!document.getElementById('google-translate-script-dynamic')) {
        const s = document.createElement('script');
        s.id = 'google-translate-script-dynamic';
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(s);
      }
    }
  }, 100);
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ko',
  setLanguage: () => {},
  t: translations.ko,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('artfantasia_lang');
      if (saved === 'ko' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ko';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('artfantasia_lang', lang);
    } catch {
      // ignore
    }
    applyGoogleTranslate(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'en') {
      applyGoogleTranslate('en');
    } else {
      applyGoogleTranslate('ko');
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
