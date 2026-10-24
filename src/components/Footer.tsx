import React, { useState, useRef } from 'react';
import { COMPANY_INFO } from '../data/content';
import { NavCategory } from '../types';
import { Mail, Phone, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: NavCategory) => void;
  onOpenInquiry: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInquiry, onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<any>(null);

  const handleCopyrightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setClickCount(0);
      if (onOpenAdmin) {
        onOpenAdmin();
      }
      return;
    }
    setClickCount(nextCount);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1500);
  };
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Wordmark & Tagline */}
          <div className="md:col-span-7 space-y-4">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center cursor-pointer text-left focus:outline-none"
              title="홈으로 이동"
            >
              <img
                src="/01lo.png"
                alt="Art Fantasia Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-opacity hover:opacity-85"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://github.com/artfantasia-web/new1/blob/main/01lo.png?raw=true';
                }}
              />
            </button>
            <div className="pt-2 text-xs font-apple text-zinc-400">
              <div className="font-apple text-zinc-300 leading-normal">
                <span
                  onClick={handleCopyrightClick}
                  className="cursor-pointer select-none transition-colors hover:text-amber-400"
                  title="Art Fantasia"
                >
                  Copyright
                </span>{' '}
                (C) 2025 아트판타지아 (ArtFantasia). ALL RIGHTS RESERVED.
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-sm font-apple font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-md transition-all cursor-pointer shadow-sm group"
                title="페이지 맨 위로 이동"
              >
                <ArrowUp className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
                <span>맨 위로</span>
              </button>
            </div>
          </div>

          {/* Contact Direct Phone & Email */}
          <div className="md:col-span-5 flex flex-col md:items-end md:text-right space-y-4">
            <div className="space-y-3 font-apple">
              <a
                href={`tel:${COMPANY_INFO.inquiryPhone}`}
                className="flex items-center gap-2.5 md:justify-end text-white hover:text-amber-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-apple text-base sm:text-lg font-semibold tracking-tight">
                  {COMPANY_INFO.inquiryPhone}
                </span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.contactEmail}`}
                className="flex items-center gap-2.5 md:justify-end text-zinc-200 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-apple text-sm sm:text-base font-medium tracking-tight">
                  {COMPANY_INFO.contactEmail}
                </span>
              </a>
            </div>

            <div className="pt-2 md:flex md:justify-end">
              <button
                onClick={() => (onOpenInquiry ? onOpenInquiry() : onNavigate('inquiry'))}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-sm font-apple font-medium text-amber-300 hover:text-amber-200 border border-zinc-700 hover:border-amber-400/50 rounded-md transition-all shadow-sm cursor-pointer"
              >
                온라인 제작 의뢰하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
