import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/content';
import { Send, CheckCircle2, Phone, Mail, ShieldCheck } from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';
import { useIsTranslated } from '../hooks/useIsTranslated';

interface InquirySectionProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const InquirySection: React.FC<InquirySectionProps> = ({ isModal = false, onClose }) => {
  const isTranslated = useIsTranslated();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [quickForm, setQuickForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    category: '영상제작',
    budget: 'B클래스 1억원 ~ 5천만원',
    details: '',
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.name || !quickForm.phone || !quickForm.email) {
      setErrorMessage('담당자명, 연락처, 이메일을 모두 입력해 주세요.');
      return;
    }
    setErrorMessage('');
    const randomTicket = `AF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(randomTicket);
    setFormSubmitted(true);
  };

  return (
    <section id="inquiry" className={`font-sans ${isModal ? 'p-4 sm:p-6' : 'pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b] text-white'}`}>
      <div className={isModal ? 'w-full' : 'max-w-7xl mx-auto px-6 sm:px-8'}>
        {!isModal && (
          <StandardSectionHeader
            as="h1"
            title="제작 및 견적 문의"
            subtitle="가장 빠른 시일 내에 회신해 드리겠습니다."
            className="mb-10"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_0_60px_-15px_rgba(245,158,11,0.15)] relative overflow-hidden font-apple">
          {/* Animated Background Ambience for Importance & High Contrast */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[10000ms]" />
          <div className="absolute inset-0 hero-animated-grid opacity-25 pointer-events-none" />
          <div className="absolute inset-x-0 h-36 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none animate-scanbeam" />

          {/* Left Column: Direct Contact & Guarantees with p1 Headquarters Photo */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-7 font-apple relative z-10">
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-apple text-white tracking-tight leading-snug mb-3.5">
                프로젝트의 시작,<br />
                <span className="text-amber-400">아트판타지아</span>와 함께하세요.
              </h3>
              <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal font-apple">
                클라이언트의 비즈니스 목표를 정확히 이해하고<br />
                브랜드 가치를 가슴 깊이 느끼며<br /><br />
                감각적인 영상과 음악, 정밀한 마케팅을 제안해 드립니다.
              </p>
            </div>

            {/* ArtFantasia Content Production Center Building (Continuous R&D Research HUD) */}
            <div className="relative w-full h-[224px] sm:h-[256px] lg:h-[270px] rounded-2xl border border-zinc-700/80 bg-zinc-950/40 shadow-xl overflow-hidden group">
              {/* Image filling DIV completely with 75% opacity & Grayscale */}
              <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center">
                <img
                  src="https://raw.githubusercontent.com/artfantasia-web/new1/main/B1.png"
                  alt="아트판타지아 콘텐츠제작센터"
                  className="w-full h-full object-cover object-center opacity-75 grayscale"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Continuous Research & Innovation R&D HUD Overlay with Apple font */}
                <div className="absolute inset-0 pointer-events-none p-3 sm:p-3.5 flex flex-col justify-between opacity-80 font-apple">
                  {/* HUD Top Bar: Continuous R&D Telemetry */}
                  <div className="flex items-center justify-between font-apple text-[11px] tracking-wider z-10">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-950/60 backdrop-blur-sm border border-cyan-500/20 text-zinc-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                      <span className="text-cyan-300 font-semibold tracking-wide">R&D LAB</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-300">INNOVATION 24/7</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-950/40 text-[10.5px] text-zinc-300 font-apple border border-white/5">
                      <span className="text-amber-400/90 font-medium">ITERATION</span>
                      <span className="text-zinc-400">v4.2</span>
                    </div>
                  </div>

                  {/* HUD Center: Subtle Continuous Research Gyro / Orbital Dial */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-44 h-44 flex items-center justify-center opacity-65">
                      {/* Outer Rotating Research Ring */}
                      <div className="absolute w-40 h-40 rounded-full border border-dashed border-amber-400/25 animate-spin [animation-duration:30s]" />
                      {/* Inner Counter-Rotating Dotted Ring */}
                      <div className="absolute w-28 h-28 rounded-full border border-dotted border-cyan-400/30 animate-spin [animation-duration:20s] [animation-direction:reverse]" />
                      {/* Subtle Concentric Pulse Ring */}
                      <div className="absolute w-16 h-16 rounded-full border border-white/10 animate-pulse [animation-duration:4s]" />
                      {/* Center Research Node Pulse */}
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40 animate-ping [animation-duration:3s]" />
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                      {/* Subtle Crosshair Axis */}
                      <div className="absolute w-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="absolute h-10 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    </div>
                  </div>

                  {/* HUD 4 Corner Minimal Brackets */}
                  <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-amber-400/40 rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-amber-400/40 rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-amber-400/40 rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-amber-400/40 rounded-br-sm pointer-events-none" />

                  {/* HUD Bottom Status Bar (Above Title) */}
                  <div className="flex items-center justify-between font-apple text-[10.5px] text-zinc-300 px-2 mb-9 z-10">
                    <div className="flex items-center gap-1.5">
                      {/* Subtle Live Equalizer Wave */}
                      <div className="flex items-end gap-0.5 h-2.5 opacity-70">
                        <span className="w-0.5 h-1 bg-cyan-400 animate-pulse [animation-delay:0.1s]" />
                        <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse [animation-delay:0.3s]" />
                        <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse [animation-delay:0.2s]" />
                        <span className="w-0.5 h-2 bg-amber-400 animate-pulse [animation-delay:0.4s]" />
                      </div>
                      <span className="text-zinc-300 tracking-wider font-medium">CREATIVE RESEARCH</span>
                    </div>
                    <span className="text-zinc-400 font-semibold tracking-wider">ACTIVE NODE</span>
                  </div>
                </div>
              </div>

              {/* Title DIV displayed below the image (Clear & Readable) */}
              <div className="absolute bottom-2.5 sm:bottom-3 left-3 right-3 z-20 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 backdrop-blur-md border border-white/15 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-sm sm:text-base font-medium text-zinc-100 tracking-tight font-apple">
                    아트판타지아 콘텐츠제작센터
                  </span>
                </div>
              </div>
            </div>

            {/* NDA Guarantee */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3.5 font-apple shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm sm:text-base text-zinc-200 font-apple font-medium leading-relaxed">
                모든 접수된 기획서 및 아이디어는 철저한 NDA(비밀유지협약) 원칙 하에 안전하게 보호됩니다.
              </span>
            </div>

            {/* Direct Quick Contact Boxes */}
            <div className="space-y-3 pt-1 font-apple">
              <a
                href={`tel:${COMPANY_INFO.inquiryPhone}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 hover:text-white transition-all group cursor-pointer shadow-md hover:border-amber-400/50"
              >
                <Phone className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xl sm:text-2xl font-extrabold text-white font-apple tracking-tight">
                  {COMPANY_INFO.inquiryPhone}
                </span>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.contactEmail}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 hover:text-white transition-all group cursor-pointer shadow-md hover:border-amber-400/50"
              >
                <Mail className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-lg sm:text-xl font-bold text-white font-apple tracking-tight">
                  {COMPANY_INFO.contactEmail}
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero-identical Fast Inquiry Form */}
          <div className="lg:col-span-7 bg-zinc-900/95 p-5 sm:p-8 rounded-xl border border-zinc-700/80 shadow-xl backdrop-blur-md font-apple">
            {formSubmitted ? (
              <div className="py-10 sm:py-14 flex flex-col items-center text-center space-y-5 font-apple">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-apple">문의가 성공적으로 접수되었습니다</h4>
                <div className="px-5 py-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-base font-apple text-zinc-300">
                  접수 번호: <span className="text-amber-400 font-bold">{ticketNumber}</span>
                </div>
                <p className="text-base sm:text-lg text-zinc-200 max-w-md leading-relaxed font-apple">
                  작성해 주신 연락처({quickForm.phone})로 담당 디렉터가 빠른 시일 내에 기획서 및 가견적서를 회신해 드립니다.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    if (onClose) onClose();
                  }}
                  className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-black text-base font-extrabold rounded-lg shadow-md cursor-pointer font-apple transition-colors"
                >
                  추가 문의 작성하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-6 font-apple">
                {errorMessage && (
                  <div className="p-4 rounded-lg bg-red-950/80 border border-red-800 text-base text-red-200 font-apple">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-white mb-2 font-apple">
                      담당자명 / 직함 <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      placeholder="예: 홍길동 팀장"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-base sm:text-lg font-medium font-apple text-white placeholder-zinc-500 placeholder:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-white mb-2 font-apple">
                      기업명 / 브랜드명 <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quickForm.company}
                      onChange={(e) => setQuickForm({ ...quickForm, company: e.target.value })}
                      placeholder="예: 주식회사 아트판타지아"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-base sm:text-lg font-medium font-apple text-white placeholder-zinc-500 placeholder:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-white mb-2 font-apple">
                      연락처 (휴대전화) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={quickForm.phone}
                      onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                      placeholder="예: 010-1234-5678"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-base sm:text-lg font-medium font-apple text-white placeholder-zinc-500 placeholder:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-white mb-2 font-apple">
                      이메일 주소 <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={quickForm.email}
                      onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                      placeholder="예: client@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-base sm:text-lg font-medium font-apple text-white placeholder-zinc-500 placeholder:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
                    />
                  </div>
                </div>

                {/* Project Category Selection */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-white mb-2.5 font-apple">
                    프로젝트 유형 선택
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['영상제작', '음악·라디오', '마케팅', '협업 문의'].map((type) => {
                      const isSelected = quickForm.category === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setQuickForm({ ...quickForm, category: type })}
                          className={`py-3.5 px-3 rounded-xl text-base sm:text-lg font-bold font-apple transition-all text-center cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400 shadow-md font-extrabold'
                              : 'bg-zinc-950 text-zinc-200 border-zinc-700 hover:border-zinc-500 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Budget Range (High Contrast & Clear Hierarchy) */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-white mb-2.5 font-apple">
                    예상 예산 범위 선택
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        classKey: 'S',
                        title: 'S클래스 2억원 이상',
                        titleEn: 'S-Class: KRW 200M or more',
                        desc: '대규모 글로벌 캠페인 · 프리미엄 지상파 TVCF · 하이엔드 시네마틱',
                      },
                      {
                        classKey: 'A',
                        title: 'A클래스 2억원 ~ 1억원',
                        titleEn: 'A-Class: KRW 200M ~ 100M',
                        desc: '브랜드 메인 캠페인 · 메인 TVCF · 고사양 3D VFX · 대형 프로젝트',
                      },
                      {
                        classKey: 'B',
                        title: 'B클래스 1억원 ~ 5천만원',
                        titleEn: 'B-Class: KRW 100M ~ 50M',
                        desc: '기업 메인 필름 · 디지털 캠페인 · 오리지널 사운드트랙 제작',
                      },
                      {
                        classKey: 'C',
                        title: 'C클래스 5천만원 ~ 1천만원',
                        titleEn: 'C-Class: KRW 50M ~ 10M',
                        desc: '디지털 바이럴 영상 · 브랜드 필름 · 라디오 CM · 퍼포먼스 광고',
                      },
                      {
                        classKey: 'Custom',
                        title: '맞춤형 (저가형)',
                        titleEn: 'Custom (Budget-friendly)',
                        desc: '스타트업 및 실속형 맞춤 기획 · 실무 맞춤형 가성비 패키지',
                      },
                      {
                        classKey: 'Consult',
                        title: '협의 후 책정',
                        titleEn: 'Consultation & Negotiation',
                        desc: '프로젝트 규모 및 제작 범위 상담 후 상호 협의 결정',
                      },
                    ].map((budget) => {
                      const isSelected = quickForm.budget === budget.title;
                      return (
                        <button
                          type="button"
                          key={budget.title}
                          onClick={() => setQuickForm({ ...quickForm, budget: budget.title })}
                          className={`py-3.5 px-4 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border font-apple ${
                            isSelected
                              ? 'bg-amber-400/20 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-zinc-950 text-zinc-200 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900'
                          }`}
                        >
                          <span
                            className={`text-base sm:text-lg font-bold tracking-tight font-apple ${
                              isSelected ? 'text-amber-300 font-extrabold' : 'text-white'
                            }`}
                          >
                            {isTranslated ? (
                              <span className="notranslate" translate="no">{budget.titleEn}</span>
                            ) : (
                              <>
                                <span className="budget-lang-ko">{budget.title}</span>
                                <span className="budget-lang-en hidden notranslate" translate="no">{budget.titleEn}</span>
                              </>
                            )}
                          </span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-white mb-2 font-apple">
                    프로젝트 개요 및 요청 사항
                  </label>
                  <textarea
                    rows={3}
                    value={quickForm.details}
                    onChange={(e) => setQuickForm({ ...quickForm, details: e.target.value })}
                    placeholder="예상 일정, 희망 예산, 영상 레퍼런스 등을 적어주시면 더욱 정밀한 가견적서 작성이 가능합니다."
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-base sm:text-lg font-medium font-apple text-white placeholder-zinc-500 placeholder:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none shadow-inner"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-base sm:text-lg shadow-lg transition-transform hover:scale-[1.01] cursor-pointer font-apple"
                  >
                    <Send className="w-5 h-5" />
                    <span>신청</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
