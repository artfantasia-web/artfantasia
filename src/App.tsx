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

const PAGE_SEO_MAP: Record<NavCategory, { title: string; desc: string; path: string }> = {
  home: {
    title: '아트판타지아 | AatFantasia - 홍보영상 · 광고영상 · AI영상제작 · 미디어파사드 · 음악라디오 · 종합마케팅',
    desc: '크리에이티브 프로덕션, 광고영상제작, AI 영상제작, 공공기관·기업·교육기관 홍보영상제작, 여성기업 영상제작사, 브랜드필름, 미디어파사드, 음악·라디오제작, 데이터 기반 마케팅',
    path: '/',
  },
  about: {
    title: '회사소개 | 아트판타지아 (Artfantasia) - 종합 영상제작사 프로필 및 비전',
    desc: '중소벤처기업부 인증 여성기업 종합 영상제작사 아트판타지아. 기획·시네마촬영·AI·사운드 100% 인하우스 원스톱 제작 시스템, 대한민국 정부·대기업 52개 기관 파트너십 및 기업 프로필.',
    path: '/about',
  },
  video: {
    title: '영상제작 | 아트판타지아 - 기업홍보영상 · TV CF 광고 · AI영상제작 포트폴리오',
    desc: '삼성전자, 현대자동차, 중앙정부 부처 등 50여 곳이 신뢰하는 하이엔드 영상제작. 기업홍보영상, 브랜드 필름, TV CF 광고, 유튜브 브랜디드 영상, AI 영상제작 공식 포트폴리오.',
    path: '/video',
  },
  audio: {
    title: '라디오광고 | 아트판타지아 - 지상파 라디오 CM · CM송 · 사운드 디자인',
    desc: '자체 전문 레코딩 스튜디오와 BGM 작·편곡, 16개국 글로벌 성우 네트워크, 방송 심의 대행 원스톱 지원. 지상파 온에어 라디오광고 CM송 및 오리지널 브랜드 사운드 포트폴리오.',
    path: '/audio',
  },
  afanmusic: {
    title: '아판뮤직 | 아트판타지아 - 100% 자체 제작 무료 음원 라이브러리',
    desc: '아트판타지아가 100% 자체 기획·작사·작곡·가창·믹싱하여 무료 공개한 오리지널 음원 라이브러리 (Afan Music). 고품질 배경음악(BGM), 감성 음악, 프로젝트 음원 무료 스트리밍.',
    path: '/afanmusic',
  },
  marketing: {
    title: '종합마케팅 | 아트판타지아 - 데이터 기반 종합마케팅 & 미디어믹스 전략',
    desc: '데이터 기반 퍼포먼스 마케팅, 온·오프라인 미디어믹스, 브랜드 성장 전략 컨설팅. 영상 콘텐츠 제작과 디지털 광고 마케팅을 통합한 종합 마케팅 솔루션.',
    path: '/marketing',
  },
  notice: {
    title: '소식 & 공지사항 | 아트판타지아 - 프로젝트 뉴스 및 주요 공지',
    desc: '아트판타지아의 최신 제작 프로젝트 소식, 국가 공인 선정 이력, 기업 공지사항 및 업데이트. 신규 포트폴리오 론칭 및 주요 프로젝트 안내.',
    path: '/notice',
  },
  inquiry: {
    title: '제작문의 & 견적상담 | 아트판타지아 - 영상제작 · 라디오광고 · 마케팅 빠른 견적 문의',
    desc: '홍보영상, 광고 CF, AI영상, 라디오광고, 종합마케팅 프로젝트 맞춤 견적 및 제작 상담. 예산과 일정에 최적화된 올인원 책임 제작 제안서를 신속하게 제공합니다.',
    path: '/inquiry',
  },
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

  // Synchronize document title, meta description, and canonical link with active page
  useEffect(() => {
    const seo = PAGE_SEO_MAP[activeSection] || PAGE_SEO_MAP.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.desc);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://artfantasia.co.kr${seo.path === '/' ? '/' : seo.path}`);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://artfantasia.co.kr${seo.path === '/' ? '/' : seo.path}`);
  }, [activeSection]);

  // Switch to dedicated page view and update browser URL
  const handleNavigate = (section: NavCategory) => {
    setActiveSection(section);
    const targetPath = section === 'home' ? '/' : `/${section}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
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
