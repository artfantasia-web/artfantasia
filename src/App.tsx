import { useState, useEffect, lazy, Suspense } from 'react';
import { NavCategory } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';
import { Loader2 } from 'lucide-react';

// Code-split heavy page views and modals for ultra-fast initial bundle & performance
const AboutSection = lazy(() => import('./components/AboutSection').then((m) => ({ default: m.AboutSection })));
const VideoPortfolio = lazy(() => import('./components/VideoPortfolio').then((m) => ({ default: m.VideoPortfolio })));
const AudioPortfolio = lazy(() => import('./components/AudioPortfolio').then((m) => ({ default: m.AudioPortfolio })));
const MarketingSection = lazy(() => import('./components/MarketingSection').then((m) => ({ default: m.MarketingSection })));
const NoticeSection = lazy(() => import('./components/NoticeSection').then((m) => ({ default: m.NoticeSection })));
const AfanMusicSection = lazy(() => import('./components/AfanMusicSection').then((m) => ({ default: m.AfanMusicSection })));
const InquirySection = lazy(() => import('./components/InquirySection').then((m) => ({ default: m.InquirySection })));
const AdminLoginModal = lazy(() => import('./components/admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal })));
const AdminDashboardModal = lazy(() => import('./components/admin/AdminDashboardModal').then((m) => ({ default: m.AdminDashboardModal })));

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

function AppContent() {
  const [activeSection, setActiveSection] = useState<NavCategory>('home');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  const { isAdminLoggedIn } = useAdminData();

  // Switch to dedicated page view
  const handleNavigate = (section: NavCategory) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  // URL hash (#admin) support for fast direct access to Admin Console
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        handleOpenAdminTrigger();
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdminLoggedIn]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. Global Header placed at the very top */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenInquiry={() => handleNavigate('inquiry')}
        onOpenAdmin={handleOpenAdminTrigger}
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
            <NoticeSection onOpenAdmin={handleOpenAdminTrigger} />
          )}

          {activeSection === 'inquiry' && (
            <InquirySection />
          )}
        </Suspense>
      </main>

      {/* Admin Login Modal */}
      {adminLoginOpen && (
        <Suspense fallback={null}>
          <AdminLoginModal
            isOpen={adminLoginOpen}
            onClose={() => setAdminLoginOpen(false)}
            onLoginSuccess={() => {
              setAdminLoginOpen(false);
              setAdminDashboardOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* Admin Dashboard / Console Modal */}
      {adminDashboardOpen && (
        <Suspense fallback={null}>
          <AdminDashboardModal
            isOpen={adminDashboardOpen}
            onClose={() => setAdminDashboardOpen(false)}
          />
        </Suspense>
      )}

      {/* Footer (with 3-click trigger on Copyright text) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInquiry={() => handleNavigate('inquiry')}
        onOpenAdmin={handleOpenAdminTrigger}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminDataProvider>
      <AppContent />
    </AdminDataProvider>
  );
}
