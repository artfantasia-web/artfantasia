import { useState, useEffect, lazy, Suspense } from 'react';
import { NavCategory } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { NoticeProvider } from './context/NoticeContext';
import { AdminNoticeModal } from './components/admin/AdminNoticeModal';
import { Loader2 } from 'lucide-react';

// Code-split heavy page views for ultra-fast initial bundle & performance
const AboutSection = lazy(() => import('./components/AboutSection').then((m) => ({ default: m.AboutSection })));
const VideoPortfolio = lazy(() => import('./components/VideoPortfolio').then((m) => ({ default: m.VideoPortfolio })));
const AudioPortfolio = lazy(() => import('./components/AudioPortfolio').then((m) => ({ default: m.AudioPortfolio })));
const MarketingSection = lazy(() => import('./components/MarketingSection').then((m) => ({ default: m.MarketingSection })));
const NoticeSection = lazy(() => import('./components/NoticeSection').then((m) => ({ default: m.NoticeSection })));
const AfanMusicSection = lazy(() => import('./components/AfanMusicSection').then((m) => ({ default: m.AfanMusicSection })));
const InquirySection = lazy(() => import('./components/InquirySection').then((m) => ({ default: m.InquirySection })));

const PageLoadingFallback = () => (
  <div className="min-h-[45vh] flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider">
        LOADING // ART FANTASIA
      </span>
    </div>
  </div>
);

const getSectionFromUrl = (): NavCategory => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash.startsWith('video')) return 'video';
  if (hash.startsWith('audio')) return 'audio';
  if (hash.startsWith('afanmusic') || hash.startsWith('afan')) return 'afanmusic';
  if (hash.startsWith('marketing')) return 'marketing';
  if (hash.startsWith('notice')) return 'notice';
  if (hash.startsWith('inquiry') || hash.startsWith('contact')) return 'inquiry';
  if (hash.startsWith('about')) return 'about';

  const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
  if (pathname.startsWith('video')) return 'video';
  if (pathname.startsWith('audio')) return 'audio';
  if (pathname.startsWith('afanmusic') || pathname.startsWith('afan')) return 'afanmusic';
  if (pathname.startsWith('marketing')) return 'marketing';
  if (pathname.startsWith('notice')) return 'notice';
  if (pathname.startsWith('inquiry') || pathname.startsWith('contact')) return 'inquiry';
  if (pathname.startsWith('about')) return 'about';

  return 'home';
};

function AppContent() {
  const [activeSection, setActiveSection] = useState<NavCategory>(() => getSectionFromUrl());

  useEffect(() => {
    const handleUrlChange = () => {
      const section = getSectionFromUrl();
      setActiveSection(section);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Switch to dedicated page view
  const handleNavigate = (section: NavCategory) => {
    setActiveSection(section);
    if (section === 'home') {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    } else {
      if (!window.location.hash.startsWith(`#${section}`)) {
        window.location.hash = section;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. Global Header placed at the very top */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenInquiry={() => handleNavigate('inquiry')}
      />

      {/* 2. Page View Router: Switches between dedicated pages */}
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          {activeSection === 'home' && (
            <Hero
              onExploreVideo={() => handleNavigate('video')}
              onExploreAudio={() => handleNavigate('audio')}
              onOpenInquiry={() => handleNavigate('inquiry')}
              onNavigate={handleNavigate}
            />
          )}

          {activeSection === 'about' && (
            <AboutSection onOpenInquiry={() => handleNavigate('inquiry')} />
          )}

          {activeSection === 'video' && (
            <VideoPortfolio onOpenInquiry={() => handleNavigate('inquiry')} />
          )}

          {activeSection === 'audio' && (
            <AudioPortfolio onOpenInquiry={() => handleNavigate('inquiry')} />
          )}

          {activeSection === 'afanmusic' && (
            <AfanMusicSection onOpenInquiry={() => handleNavigate('inquiry')} />
          )}

          {activeSection === 'marketing' && (
            <MarketingSection onOpenInquiry={() => handleNavigate('inquiry')} />
          )}

          {activeSection === 'notice' && (
            <NoticeSection />
          )}

          {activeSection === 'inquiry' && (
            <InquirySection />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInquiry={() => handleNavigate('inquiry')}
      />

      {/* Admin Notice Manager Modal */}
      <AdminNoticeModal />
    </div>
  );
}

export default function App() {
  return (
    <NoticeProvider>
      <AppContent />
    </NoticeProvider>
  );
}
