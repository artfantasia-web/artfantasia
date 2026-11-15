import React, { useState, useEffect, useMemo } from 'react';
import { useNotices } from '../context/NoticeContext';
import { NoticeItem } from '../types';
import { Pin, Search, Eye, Calendar, Share2, Check, ArrowLeft, Youtube, Image as ImageIcon, Plus, Edit2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';
import { formatNoticeContent, extractEmbeddedYoutubeIds } from '../utils/formatNotice';
import { applyNoticeDetailSeo, formatNoticeSlug } from '../utils/seo';

interface NoticeSectionProps {
  noticeId?: string | null;
  onSelectNotice?: (id: string | null) => void;
}

function matchesNoticeId(itemId: string, targetId: string): boolean {
  if (itemId === targetId) return true;
  if (/^\d+$/.test(itemId) && /^\d+$/.test(targetId)) {
    return Number(itemId) === Number(targetId);
  }
  return false;
}

export const NoticeSection: React.FC<NoticeSectionProps> = ({
  noticeId: controlledNoticeId,
  onSelectNotice,
}) => {
  const {
    notices,
    isLoading,
    error,
    refreshNotices,
    fetchNoticeById,
    isAdmin,
    openAdminModal,
    incrementViews,
  } = useNotices();
  const [selectedCategory, setSelectedCategory] = useState<'all' | '소식' | '정보'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNoticeId, setInternalNoticeId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const pathMatch = window.location.pathname.match(/^\/notice\/([^/]+)\/?$/i);
    if (pathMatch && pathMatch[1]) return decodeURIComponent(pathMatch[1]).trim() || null;
    const hashMatch = window.location.hash.match(/^#\/?notice-(.+)$/i);
    if (hashMatch && hashMatch[1]) return decodeURIComponent(hashMatch[1]).trim() || null;
    return null;
  });
  const activeNoticeId =
    controlledNoticeId !== undefined ? controlledNoticeId : internalNoticeId;

  const [directNotice, setDirectNotice] = useState<NoticeItem | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastCountedIdRef = React.useRef<string | null>(null);

  const listMatch = useMemo(
    () =>
      activeNoticeId
        ? notices.find((n) => matchesNoticeId(n.id, activeNoticeId)) || null
        : null,
    [notices, activeNoticeId]
  );

  // Fetch directly from Supabase when visiting /notice/:id directly
  useEffect(() => {
    if (!activeNoticeId) {
      setDirectNotice(null);
      setIsFetchingDetail(false);
      return;
    }

    if (listMatch) {
      setDirectNotice(null);
      setIsFetchingDetail(false);
      return;
    }

    let cancelled = false;
    setIsFetchingDetail(true);

    fetchNoticeById(activeNoticeId)
      .then((fetched) => {
        if (!cancelled) {
          setDirectNotice(fetched);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetchingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeNoticeId, listMatch, fetchNoticeById]);

  const activeNotice = activeNoticeId ? listMatch || directNotice : null;

  // Dynamically update document.title, description, og:title, og:description, og:url on detail view
  // and normalize non-padded direct paths (e.g., /notice/1 -> /notice/0001)
  useEffect(() => {
    if (activeNotice) {
      applyNoticeDetailSeo(activeNotice);
      const canonicalPath = `/notice/${encodeURIComponent(formatNoticeSlug(activeNotice.id))}`;
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.toLowerCase().startsWith('/notice/') &&
        window.location.pathname !== canonicalPath
      ) {
        window.history.replaceState(null, '', canonicalPath);
      }
    }
  }, [activeNotice]);

  const filteredNotices = notices.filter((item) => {
    const itemCat = item.category === '정보' ? '정보' : '소식';
    const matchesCategory = selectedCategory === 'all' || itemCat === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sync internal fallback state if NoticeSection is mounted without controlled prop
  useEffect(() => {
    if (controlledNoticeId !== undefined) return;
    const handleRouteSync = () => {
      const pathMatch = window.location.pathname.match(/^\/notice\/([^/]+)\/?$/i);
      if (pathMatch && pathMatch[1]) {
        setInternalNoticeId(decodeURIComponent(pathMatch[1]).trim() || null);
        return;
      }
      const hashMatch = window.location.hash.match(/^#\/?notice-(.+)$/i);
      if (hashMatch && hashMatch[1]) {
        setInternalNoticeId(decodeURIComponent(hashMatch[1]).trim() || null);
        return;
      }
      setInternalNoticeId(null);
    };

    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, [controlledNoticeId]);

  // Increment view count safely at most once per browser session when viewing a notice (skip when admin is managing)
  useEffect(() => {
    if (!activeNotice) {
      if (!activeNoticeId) {
        lastCountedIdRef.current = null;
      }
      return;
    }

    if (isAdmin) return;
    if (lastCountedIdRef.current === activeNotice.id) return;

    lastCountedIdRef.current = activeNotice.id;

    try {
      const viewedKey = `artfantasia_viewed_${activeNotice.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, '1');
        incrementViews(activeNotice.id);
      }
    } catch {
      incrementViews(activeNotice.id);
    }
  }, [activeNotice, activeNoticeId, isAdmin, incrementViews]);

  const handleOpenNotice = (item: NoticeItem) => {
    const slug = formatNoticeSlug(item.id);
    if (onSelectNotice) {
      onSelectNotice(slug);
      return;
    }
    setInternalNoticeId(slug);
    window.history.pushState(null, '', `/notice/${encodeURIComponent(slug)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseNotice = () => {
    if (onSelectNotice) {
      onSelectNotice(null);
      return;
    }
    setInternalNoticeId(null);
    window.history.pushState(null, '', '/notice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (item: NoticeItem) => {
    const targetPath = `/notice/${encodeURIComponent(formatNoticeSlug(item.id))}`;
    const shareUrl = `${window.location.origin}${targetPath}`;
    navigator.clipboard.writeText(shareUrl);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="notice" className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header (uses h2 when viewing a detail article so the article's h1 is primary) */}
        <StandardSectionHeader
          as={activeNoticeId ? 'h2' : 'h1'}
          title="소식 & 공지사항"
          subtitle={
            <>
              다양한{' '}
              <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                소식과 정보
              </span>
              를 말씀드리겠습니다.
            </>
          }
        />

        {/* Category Filter Buttons & Search (Always visible at top of section) */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          {/* Category Buttons: 전체, 소식, 정보 */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                if (activeNotice) handleCloseNotice();
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all' && !activeNotice
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm ring-1 ring-white/60'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>전체</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === 'all' && !activeNotice
                    ? 'bg-zinc-300 text-zinc-950 font-extrabold'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {notices.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('소식');
                if (activeNotice) handleCloseNotice();
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === '소식' && !activeNotice
                  ? 'bg-amber-400 text-zinc-950 shadow-sm ring-1 ring-amber-300'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedCategory === '소식' && !activeNotice ? 'bg-zinc-950' : 'bg-amber-400'
                }`}
              />
              <span>소식</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === '소식' && !activeNotice
                    ? 'bg-amber-300 text-zinc-950 font-extrabold'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {notices.filter((n) => n.category !== '정보').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('정보');
                if (activeNotice) handleCloseNotice();
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === '정보' && !activeNotice
                  ? 'bg-sky-400 text-zinc-950 shadow-sm ring-1 ring-sky-300'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-sky-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedCategory === '정보' && !activeNotice ? 'bg-zinc-950' : 'bg-sky-400'
                }`}
              />
              <span>정보</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === '정보' && !activeNotice
                    ? 'bg-sky-300 text-zinc-950 font-extrabold'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {notices.filter((n) => n.category === '정보').length}
              </span>
            </button>

            {/* Admin Quick Write Button (Visible when logged in) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => openAdminModal()}
                className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm shadow-amber-400/20 ml-1"
                title="새 글 쓰기 & 게시판 관리"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>관리자 글쓰기</span>
              </button>
            )}

            {/* Quick 'Back to List' button when viewing article */}
            {activeNotice && (
              <button
                type="button"
                onClick={handleCloseNotice}
                className="px-3 py-2 rounded-lg text-xs font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
                title="글 목록으로 돌아가기"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>목록 보기</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="소식 및 정보 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeNotice && e.target.value.trim().length > 0) {
                  handleCloseNotice();
                }
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {activeNoticeId && !activeNotice ? (
          /* Direct /notice/:id loading or not-found state */
          <div className="mt-6">
            <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-10 sm:p-14 text-center space-y-4">
              {isLoading || isFetchingDetail ? (
                <div className="flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <span>공지사항을 불러오는 중입니다...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 text-zinc-300 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>요청하신 공지사항을 찾을 수 없습니다.</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    삭제되었거나 잘못된 경로일 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseNotice}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-amber-400" />
                    <span>공지사항 목록으로</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : activeNotice ? (
          /* In-Page Article Detail View (Directly Below Category & Search Bar) */
          <div className="mt-6 space-y-6">
            {/* Semantic Article Content Card */}
            <article
              itemScope
              itemType="https://schema.org/Article"
              className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-6 sm:p-10 shadow-2xl space-y-6"
            >
              <header className="space-y-4">
                {/* Category & Meta Information */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        activeNotice.category === '정보'
                          ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      }`}
                    >
                      {activeNotice.category === '정보' ? '정보' : '소식'}
                    </span>
                    {activeNotice.pinned && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-400 text-zinc-950 flex items-center gap-1">
                        <Pin className="w-3 h-3 rotate-45" /> 상단 고정
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <time
                      dateTime={activeNotice.date.replace(/\./g, '-')}
                      itemProp="datePublished"
                      className="flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {activeNotice.date}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      조회 {activeNotice.views}
                    </span>
                  </div>
                </div>

                {/* Title (Semantic <h1> for search indexing) */}
                <div>
                  <h1
                    itemProp="headline"
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight font-sans"
                  >
                    {activeNotice.title}
                  </h1>
                </div>
              </header>

              {/* Embedded YouTube Video if present */}
              {activeNotice.youtubeId && (
                <div className="my-6">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeNotice.youtubeId}`}
                      title={activeNotice.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Images Gallery if present */}
              {activeNotice.images && activeNotice.images.length > 0 && (
                <div className="my-6 space-y-4">
                  {activeNotice.images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-zinc-800/90 bg-zinc-900/60 shadow-lg flex items-center justify-center p-2"
                    >
                      <img
                        src={imgSrc}
                        alt={`${activeNotice.title} - 이미지 ${idx + 1}`}
                        className="w-full max-h-[640px] object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Main Content Paragraphs (Supports Text & HTML) */}
              <div
                itemProp="articleBody"
                className="py-4 space-y-4 text-sm sm:text-base text-zinc-200 leading-relaxed font-sans"
              >
                {activeNotice.content.map((paragraph, idx) => (
                  <div
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: formatNoticeContent(paragraph) }}
                    className="space-y-3 leading-relaxed font-['Pretendard','Noto_Sans_KR',sans-serif] [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h1,&_h2,&_h3,&_h4]:font-bold [&_h1,&_h2,&_h3,&_h4]:text-white [&_strong]:text-white [&_b]:text-white [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-3 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-zinc-300 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_hr]:border-zinc-800 [&_hr]:my-6 [&_s]:line-through [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-4"
                  />
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={handleCloseNotice}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>목록으로</span>
                </button>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => openAdminModal(activeNotice)}
                      className="px-4 py-2.5 text-xs font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>이 글 수정</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleShare(activeNotice)}
                    className="px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? '링크 복사됨' : '공유하기'}</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        ) : (
          /* Notice List View */
          <>

            {/* Notice List Table */}
            <div className="mt-6 rounded-lg bg-zinc-950 border border-zinc-800/80 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <div className="col-span-9">제목</div>
                <div className="col-span-2 text-right">등록일</div>
                <div className="col-span-1 text-right">조회</div>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {isLoading && notices.length === 0 ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    <span>공지사항을 불러오는 중입니다...</span>
                  </div>
                ) : error && notices.length === 0 ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs">
                    <div className="flex items-center gap-2 text-rose-300">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshNotices()}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>다시 불러오기</span>
                    </button>
                  </div>
                ) : filteredNotices.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs font-mono">
                    선택하신 조건에 일치하는 게시물이 없습니다.
                  </div>
                ) : (
                  filteredNotices.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenNotice(item)}
                      className="group cursor-pointer p-4 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Title & Pin & Category Badge & Attachments */}
                      <div className="sm:col-span-9 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {item.pinned && (
                          <span className="p-1 rounded bg-amber-400/10 text-amber-400 shrink-0">
                            <Pin className="w-3 h-3 rotate-45" />
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 border ${
                            item.category === '정보'
                              ? 'bg-sky-400/15 text-sky-300 border-sky-400/30'
                              : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                          }`}
                        >
                          {item.category === '정보' ? '정보' : '소식'}
                        </span>
                        <a
                          href={`/notice/${encodeURIComponent(formatNoticeSlug(item.id))}`}
                          onClick={(e) => {
                            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenNotice(item);
                            } else {
                              e.stopPropagation();
                            }
                          }}
                          className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </a>
                        {(() => {
                          const embeddedIds = extractEmbeddedYoutubeIds(item.content);
                          const totalVideos =
                            embeddedIds.length +
                            (item.youtubeId && !embeddedIds.includes(item.youtubeId) ? 1 : 0);
                          if (totalVideos === 0) return null;
                          return (
                            <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <Youtube className="w-2.5 h-2.5" />
                              <span>{totalVideos > 1 ? `영상 ${totalVideos}` : '영상'}</span>
                            </span>
                          );
                        })()}
                        {item.images && item.images.length > 0 && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>{item.images.length}</span>
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAdminModal(item);
                            }}
                            className="p-1 px-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[10px] font-bold border border-zinc-700 flex items-center gap-1 shrink-0 ml-1.5 transition-colors"
                            title="이 글 수정 (관리자)"
                          >
                            <Edit2 className="w-2.5 h-2.5 text-amber-400" />
                            <span>수정</span>
                          </button>
                        )}
                      </div>

                      {/* Date */}
                      <div className="sm:col-span-2 sm:text-right text-xs font-mono text-zinc-500 flex items-center sm:justify-end gap-1">
                        <Calendar className="w-3 h-3 text-zinc-600 sm:hidden" />
                        <span>{item.date}</span>
                      </div>

                      {/* Views */}
                      <div className="sm:col-span-1 sm:text-right text-xs font-mono text-zinc-500 flex items-center sm:justify-end gap-1">
                        <Eye className="w-3 h-3 text-zinc-600 sm:hidden" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
