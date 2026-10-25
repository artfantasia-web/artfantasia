import React, { useState, useEffect } from 'react';
import { NavCategory } from '../types';
import { Menu, X, ArrowUpRight, Send, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeSection: NavCategory;
  onNavigate: (section: NavCategory) => void;
  onOpenInquiry: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenInquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavCategory; label: string; sub: string }[] = [
    { id: 'home', label: language === 'ko' ? '홈으로' : 'Home', sub: 'HOME' },
    { id: 'about', label: language === 'ko' ? '회사소개' : 'About', sub: 'ABOUT' },
    { id: 'video', label: language === 'ko' ? '영상제작' : 'Film & Video', sub: 'FILM' },
    { id: 'audio', label: language === 'ko' ? '라디오광고' : 'Radio CM', sub: 'RADIO' },
    { id: 'afanmusic', label: language === 'ko' ? '아판뮤직' : 'Afan Music', sub: 'AFAN MUSIC' },
    { id: 'marketing', label: language === 'ko' ? '마케팅' : 'Marketing', sub: 'MARKETING' },
    { id: 'notice', label: language === 'ko' ? '소식' : 'News', sub: 'NEWS' },
  ];

  const handleNavClick = (id: NavCategory) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? 'bg-[#09090b]/98 border-zinc-800 shadow-2xl py-3' : 'bg-[#09090b]/90 border-zinc-800/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Top Bar: Brand Logo on Left (Go to Home) & Category Links on Right */}
          <div className="flex items-center justify-between gap-6 xl:gap-8">
            {/* Zone 1: Official Brand Logo Image (Click to Navigate to Home) */}
            <button
              onClick={() => handleNavClick('home')}
              className="group flex items-center text-left whitespace-nowrap shrink-0 transition-opacity hover:opacity-80 cursor-pointer py-0.5"
              aria-label={language === 'ko' ? '아트판타지아 홈으로 이동' : 'Art Fantasia Home'}
              title={language === 'ko' ? '홈으로 이동' : 'Go to Home'}
            >
              <img
                src="/01lo.png"
                alt="Art Fantasia"
                className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://github.com/artfantasia-web/new1/blob/main/01lo.png?raw=true';
                }}
              />
            </button>

            {/* Zone 2: Clean Single-Line Nav Links + 언어 번역 버튼 + 제작문의 Button */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 font-apple antialiased scale-[1.08] origin-right">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`group relative py-1.5 px-0.5 text-[15px] tracking-tight transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-zinc-300 hover:text-white font-semibold'
                    }`}
                  >
                    <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2.5px] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-full bg-gradient-to-r from-[#f97316] via-[#ef4444] to-[#d91b5c] shadow-[0_0_10px_rgba(249,115,22,0.7)]'
                          : 'w-0 bg-gradient-to-r from-[#f97316] to-[#d91b5c] group-hover:w-full opacity-80'
                      }`}
                    />
                  </button>
                );
              })}

              {/* 공지사항 바로 뒤: 한국어, 영어 언어 번역 버튼 */}
              <div
                className="flex items-center gap-0.5 px-1 py-1 rounded-full bg-zinc-900/95 border border-zinc-700/80 shadow-inner shrink-0"
                role="group"
                aria-label="언어 선택 / Language Selector"
              >
                <div className="flex items-center pl-1.5 pr-0.5 text-zinc-400">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  translate="no"
                  onClick={() => setLanguage('ko')}
                  title="한국어"
                  className={`notranslate px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    language === 'ko'
                      ? 'bg-gradient-to-r from-[#f97316] to-[#d91b5c] text-white shadow-sm font-bold scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className="notranslate" translate="no">한국어</span>
                </button>
                <span className="text-zinc-600 text-[10px] select-none notranslate" translate="no">/</span>
                <button
                  type="button"
                  translate="no"
                  onClick={() => setLanguage('en')}
                  title="English"
                  className={`notranslate px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-[#f97316] to-[#d91b5c] text-white shadow-sm font-bold scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className="notranslate" translate="no">ENG</span>
                </button>
              </div>

              {/* 제작문의 버튼 (하단 영상제작 바로가기 스타일 & 효과 적용: bg-amber-400, text-zinc-950, shadow-amber-400, hover:scale-[1.02]) */}
              <button
                onClick={() => handleNavClick('inquiry')}
                className={`ml-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-black font-apple tracking-tight transition-all duration-200 cursor-pointer text-zinc-950 shadow-md shadow-amber-400/20 hover:shadow-amber-400/35 hover:scale-[1.02] active:scale-95 ${
                  activeSection === 'inquiry'
                    ? 'bg-amber-400 ring-2 ring-white/90 shadow-[0_0_16px_rgba(251,191,36,0.6)]'
                    : 'bg-amber-400 hover:bg-amber-300'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-zinc-950" />
                <span className="text-zinc-950 font-black">{language === 'ko' ? '제작문의' : 'Inquiry'}</span>
              </button>
            </nav>

            {/* Mobile Menu Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-300 hover:text-white rounded focus:outline-none cursor-pointer"
                aria-label={language === 'ko' ? '메뉴 열기' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col justify-between pb-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                Navigation Menu
              </span>
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs notranslate" translate="no">
                <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1" />
                <button
                  type="button"
                  translate="no"
                  onClick={() => setLanguage('ko')}
                  className={`notranslate px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                    language === 'ko' ? 'bg-gradient-to-r from-[#f97316] to-[#d91b5c] text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  <span className="notranslate" translate="no">한국어</span>
                </button>
                <button
                  type="button"
                  translate="no"
                  onClick={() => setLanguage('en')}
                  className={`notranslate px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                    language === 'en' ? 'bg-gradient-to-r from-[#f97316] to-[#d91b5c] text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  <span className="notranslate" translate="no">ENG</span>
                </button>
              </div>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between py-3.5 border-b border-zinc-800 text-left text-lg font-semibold font-apple tracking-tight transition-colors ${
                  activeSection === item.id
                    ? 'text-white font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {activeSection === item.id && (
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#f97316] to-[#d91b5c] shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  )}
                  <span className="font-apple">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">{item.sub}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3.5 text-center text-sm font-black text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-400/20"
            >
              <span>{language === 'ko' ? '프로젝트 제작 및 견적 문의하기' : 'Request Project Quotation & Inquiry'}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-950" />
            </button>

            <div className="text-xs text-zinc-500 text-center font-mono pt-1">
              TEL: 010-8739-8611 · artfantasia01@gmail.com
            </div>
          </div>
        </div>
      )}
    </>
  );
};
