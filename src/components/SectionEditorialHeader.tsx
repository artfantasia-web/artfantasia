import React, { useRef, useState, useEffect } from 'react';

export interface SectionEditorialHeaderProps {
  title: React.ReactNode;
  subtitle: string;
}

export const SectionEditorialHeader: React.FC<SectionEditorialHeaderProps> = ({
  title,
  subtitle,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    // Trigger immediately if already in view
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className={`flex flex-col items-start justify-start mb-5 sm:mb-6 relative z-10 select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 blur-none'
          : 'opacity-0 translate-y-6 scale-95 blur-sm'
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span
          className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-[0_0_14px_rgba(251,191,36,0.6)] shrink-0 transition-all duration-1000 delay-150 ${
            isVisible ? 'h-5 sm:h-6 md:h-7 lg:h-8 opacity-100' : 'h-0 opacity-0'
          }`}
        />
        <h2 className="font-['Noto_Sans_KR',sans-serif] font-black text-2xl sm:text-3xl md:text-[32px] lg:text-4xl text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] text-left leading-none">
          {title}
        </h2>
      </div>
      <div
        className={`flex items-center gap-1.5 text-[10.5px] sm:text-xs font-mono tracking-widest text-amber-400/90 uppercase font-semibold mt-2 pl-3.5 sm:pl-4.5 transition-all duration-1000 delay-300 notranslate ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
        translate="no"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="notranslate" translate="no">{subtitle}</span>
      </div>
    </div>
  );
};
