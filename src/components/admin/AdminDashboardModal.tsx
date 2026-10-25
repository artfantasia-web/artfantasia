import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Youtube,
  Pin,
  Eye,
  Calendar,
  LogOut,
  Upload,
  RotateCcw,
  Sparkles,
  Code,
  Check,
  AlertCircle,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAdminData, extractYouTubeId, compressImageFile } from '../../context/AdminDataContext';
import { NoticeItem, InternationalLogoItem } from '../../types';
import { getBrandLogoSvg } from '../../data/brandLogosSvg';
import { formatNoticeContent } from '../../utils/formatNotice';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    saveAllNotices,
    lastSavedNoticeTime,
    logos,
    addLogo,
    updateLogo,
    deleteLogo,
    resetLogosToDefault,
    saveAllLogos,
    lastSavedLogoTime,
    saveAllData,
    logoutAdmin,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'logos' | 'notices'>('logos');

  // Notice Form State
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('아트판타지아');
  const [noticeCategory, setNoticeCategory] = useState<'소식' | '정보'>('소식');
  const [noticeDate, setNoticeDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  });
  const [noticePinned, setNoticePinned] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeContentMode, setNoticeContentMode] = useState<'text' | 'html' | 'preview'>('text');
  const [noticeImages, setNoticeImages] = useState<string[]>([]);
  const [noticeImageUrlInput, setNoticeImageUrlInput] = useState('');
  const [noticeYoutubeUrl, setNoticeYoutubeUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Logo Form State
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploadingLogoImage, setIsUploadingLogoImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Final Save Loading States & Handlers
  const [isSavingLogos, setIsSavingLogos] = useState(false);
  const [isSavingNotices, setIsSavingNotices] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  // 로고 최종 저장: 모든 로고 상태를 localStorage에 영구 보존 및 비로그인 사용자 화면에도 즉시 반영
  const handleFinalSaveLogos = () => {
    setIsSavingLogos(true);
    try {
      const ok = saveAllLogos();
      setTimeout(() => {
        setIsSavingLogos(false);
        if (ok) {
          showToast(`[최종 저장 완료] 무한롤링티커 로고 (${logos.length}개)가 영구 저장되었습니다. 관리자 로그인이 되지 않아도 일반 방문자에게 즉시 표시됩니다.`, 'success');
        } else {
          showToast('로고 최종 저장 중 오류가 발생했습니다.', 'error');
        }
      }, 300);
    } catch {
      setIsSavingLogos(false);
      showToast('로고 최종 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  // 공지사항 최종 저장: 모든 소식 상태를 localStorage에 영구 보존 및 비로그인 사용자 화면에도 즉시 반영
  const handleFinalSaveNotices = () => {
    setIsSavingNotices(true);
    try {
      const ok = saveAllNotices();
      setTimeout(() => {
        setIsSavingNotices(false);
        if (ok) {
          showToast(`[최종 저장 완료] 공지사항 (${notices.length}개)이 영구 저장되었습니다. 관리자 로그인이 되지 않아도 일반 방문자에게 즉시 표시됩니다.`, 'success');
        } else {
          showToast('공지사항 최종 저장 중 오류가 발생했습니다.', 'error');
        }
      }, 300);
    } catch {
      setIsSavingNotices(false);
      showToast('공지사항 최종 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  // 전체 최종 저장 (로고 + 공지사항 모두 한 번에 영구 저장)
  const handleFinalSaveAll = () => {
    setIsSavingAll(true);
    try {
      const ok = saveAllData();
      setTimeout(() => {
        setIsSavingAll(false);
        if (ok) {
          showToast(`[전체 최종 저장 완료] 로고 (${logos.length}개) 및 공지사항 (${notices.length}개) 전체가 영구 저장되었습니다. 비로그인 일반 방문자에게도 즉시 반영됩니다.`, 'success');
        } else {
          showToast('전체 최종 저장 중 오류가 발생했습니다.', 'error');
        }
      }, 350);
    } catch {
      setIsSavingAll(false);
      showToast('전체 최종 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const noticeFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  // Text Mode Formatting Helper (mirrors HTML mode capabilities)
  const handleFormatText = (type: 'bold' | 'gold' | 'heading' | 'paragraph' | 'br' | 'link' | 'quote' | 'divider' | 'bullet' | 'number') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = noticeContent.substring(start, end);

    let prefix = '';
    let suffix = '';
    let defaultText = '';

    switch (type) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        defaultText = '굵은 텍스트';
        break;
      case 'gold':
        prefix = '★';
        suffix = '★';
        defaultText = '골드 강조';
        break;
      case 'heading':
        prefix = '\n■ ';
        suffix = '\n';
        defaultText = '소제목 입력';
        break;
      case 'paragraph':
        prefix = '\n\n';
        suffix = '';
        defaultText = '';
        break;
      case 'br':
        prefix = '\n';
        suffix = '';
        defaultText = '';
        break;
      case 'link':
        if (selected) {
          prefix = `[${selected}](https://`;
          suffix = ')';
          defaultText = '';
        } else {
          prefix = '[';
          suffix = '](https://artfantasia.co.kr)';
          defaultText = '링크 제목';
        }
        break;
      case 'quote':
        prefix = '\n> ';
        suffix = '\n';
        defaultText = '인용할 문구 입력';
        break;
      case 'divider':
        prefix = '\n────────────────────────────\n';
        suffix = '';
        defaultText = '';
        break;
      case 'bullet':
        prefix = '\n• ';
        suffix = '';
        defaultText = '항목 내용';
        break;
      case 'number':
        prefix = '\n1. ';
        suffix = '';
        defaultText = '첫 번째 항목';
        break;
    }

    const insertBody = selected || defaultText;
    const replacement = `${prefix}${insertBody}${suffix}`;
    const newContent = noticeContent.substring(0, start) + replacement + noticeContent.substring(end);
    setNoticeContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + insertBody.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }, 40);
  };

  // Insert HTML tag helper
  const handleInsertHtmlTag = (openTag: string, closeTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setNoticeContent((prev) => `${prev}${openTag}${closeTag}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = noticeContent.substring(start, end);
    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newContent = noticeContent.substring(0, start) + replacement + noticeContent.substring(end);
    setNoticeContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 40);
  };

  // Notice form helpers
  const resetNoticeForm = () => {
    setIsEditingNotice(false);
    setEditingNoticeId(null);
    setNoticeTitle('');
    setNoticeAuthor('아트판타지아');
    setNoticeCategory('소식');
    const d = new Date();
    setNoticeDate(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`);
    setNoticePinned(false);
    setNoticeContent('');
    setNoticeContentMode('text');
    setNoticeImages([]);
    setNoticeImageUrlInput('');
    setNoticeYoutubeUrl('');
  };

  const handleStartEditNotice = (item: NoticeItem) => {
    setIsEditingNotice(true);
    setEditingNoticeId(item.id);
    setNoticeTitle(item.title);
    setNoticeAuthor(item.author || '아트판타지아');
    setNoticeCategory(item.category === '정보' ? '정보' : '소식');
    setNoticeDate(item.date);
    setNoticePinned(!!item.pinned);
    const joinedContent = item.content.join('\n\n');
    setNoticeContent(joinedContent);
    // Auto-detect if content contains HTML or is plain text
    const hasHtml = /<[a-z][\s\S]*>/i.test(joinedContent);
    setNoticeContentMode(hasHtml ? 'html' : 'text');
    setNoticeImages(item.images || []);
    setNoticeYoutubeUrl(item.youtubeUrl || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : ''));
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) {
      showToast('소식 제목을 입력해주세요.', 'error');
      return;
    }

    const paragraphs = noticeContent
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const parsedYtId = noticeYoutubeUrl ? extractYouTubeId(noticeYoutubeUrl) : undefined;
    const isHtml = noticeContentMode === 'html' || /<[a-z][\s\S]*>/i.test(noticeContent);
    const finalContent = isHtml
      ? [noticeContent]
      : (paragraphs.length > 0 ? paragraphs : [noticeTitle]);

    if (isEditingNotice && editingNoticeId) {
      updateNotice(editingNoticeId, {
        title: noticeTitle.trim(),
        author: noticeAuthor.trim() || '아트판타지아',
        category: noticeCategory,
        date: noticeDate,
        pinned: noticePinned,
        content: finalContent,
        images: noticeImages,
        youtubeUrl: noticeYoutubeUrl.trim() || undefined,
        youtubeId: parsedYtId || undefined,
      });
      showToast('소식이 성공적으로 수정되었습니다.', 'success');
    } else {
      addNotice({
        title: noticeTitle.trim(),
        author: noticeAuthor.trim() || '아트판타지아',
        category: noticeCategory,
        date: noticeDate,
        pinned: noticePinned,
        content: finalContent,
        images: noticeImages,
        youtubeUrl: noticeYoutubeUrl.trim() || undefined,
        youtubeId: parsedYtId || undefined,
        views: 1,
      });
      showToast('새 소식이 성공적으로 등록되었습니다.', 'success');
    }

    resetNoticeForm();
  };

  const handleNoticeImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBase64 = await compressImageFile(file, 1000, 0.8);
        newImages.push(compressedBase64);
      }
      setNoticeImages((prev) => [...prev, ...newImages]);
      showToast(`${files.length}개의 이미지가 첨부되었습니다.`, 'success');
    } catch {
      showToast('이미지 업로드 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsUploadingImage(false);
      if (noticeFileInputRef.current) {
        noticeFileInputRef.current.value = '';
      }
    }
  };

  const handleAddImageUrl = () => {
    if (!noticeImageUrlInput.trim()) return;
    setNoticeImages((prev) => [...prev, noticeImageUrlInput.trim()]);
    setNoticeImageUrlInput('');
  };

  const handleRemoveNoticeImage = (indexToRemove: number) => {
    setNoticeImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Logo form helpers
  const resetLogoForm = () => {
    setIsEditingLogo(false);
    setEditingLogoId(null);
    setLogoName('');
    setLogoUrl('');
  };

  const handleStartEditLogo = (logo: InternationalLogoItem) => {
    setIsEditingLogo(true);
    setEditingLogoId(logo.id);
    setLogoName(logo.name);
    setLogoUrl(logo.logoUrl || '');
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrl.trim()) {
      showToast('무한롤링티커에 삽입할 로고 이미지를 등록해주세요.', 'error');
      return;
    }

    const assignedName = logoName.trim() || `TICKER-LOGO-${Date.now().toString().slice(-4)}`;

    if (isEditingLogo && editingLogoId) {
      updateLogo(editingLogoId, {
        name: assignedName,
        country: 'GLOBAL',
        category: 'TICKER LOGO',
        logoUrl: logoUrl.trim(),
        websiteUrl: '',
      });
      showToast('무한롤링티커 로고가 수정되었습니다.', 'success');
    } else {
      addLogo({
        name: assignedName,
        country: 'GLOBAL',
        category: 'TICKER LOGO',
        logoUrl: logoUrl.trim(),
        websiteUrl: '',
        active: true,
      });
      showToast('새 로고가 무한롤링티커 구역에 삽입되었습니다.', 'success');
    }

    resetLogoForm();
  };

  const handleLogoImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogoImage(true);
    try {
      // If SVG file, read raw text and store as clean vector SVG Data URI
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        const text = await file.text();
        const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
        setLogoUrl(svgDataUrl);
        showToast('고화질 SVG 벡터 로고가 등록되었습니다.', 'success');
      } else if (file.size < 600 * 1024) {
        // Read directly as high-res data URL to avoid quality loss
        const reader = new FileReader();
        reader.onload = (ev) => {
          setLogoUrl(ev.target?.result as string);
          showToast('고화질 무손실 로고 이미지가 등록되었습니다.', 'success');
        };
        reader.readAsDataURL(file);
      } else {
        const compressedBase64 = await compressImageFile(file, 1200, 0.95);
        setLogoUrl(compressedBase64);
        showToast('고화질 로고 이미지가 등록되었습니다.', 'success');
      }
    } catch {
      showToast('로고 이미지 업로드 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsUploadingLogoImage(false);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const previewYoutubeId = noticeYoutubeUrl ? extractYouTubeId(noticeYoutubeUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[94vh] rounded-2xl bg-zinc-950 border border-amber-400/50 shadow-2xl flex flex-col overflow-hidden text-zinc-100 font-sans">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
              AF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  ADMIN CONSOLE
                </span>
                <span className="text-xs text-zinc-400">artfantasia 관리자 모드</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                아트판타지아 공식 관리자 시스템
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFinalSaveAll}
              disabled={isSavingAll}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer"
              title="로고 및 공지사항 전체를 즉시 영구 저장합니다 (비로그인 방문자에게도 즉시 반영)"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingAll ? '전체 저장 중...' : '전체 최종 저장'}</span>
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="로그아웃"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 pt-3 shrink-0 gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('logos')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'logos'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>무한롤링티커 로고 관리 ({logos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'notices'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>소식 & 공지사항 관리 ({notices.length})</span>
            </button>
          </div>

          <div className="pb-2 hidden sm:flex items-center gap-2">
            {activeTab === 'logos' ? (
              <button
                type="button"
                onClick={handleFinalSaveLogos}
                disabled={isSavingLogos}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                title="무한롤링티커 로고 전체를 최종 저장합니다"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingLogos ? '로고 저장 중...' : '로고 최종 저장'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSaveNotices}
                disabled={isSavingNotices}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                title="공지사항 전체를 최종 저장합니다"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingNotices ? '공지사항 저장 중...' : '공지사항 최종 저장'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Toast Notification Banner */}
          {toast && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-lg transition-all animate-fade-in ${
                toast.type === 'error'
                  ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  : toast.type === 'info'
                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-200'
                  : 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : toast.type === 'info' ? (
                  <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 hover:opacity-75 text-zinc-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: NOTICES MANAGEMENT */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              {/* Notice Final Save Control Banner */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-400/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      소식 & 공지사항 관리
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      비로그인 일반 방문자에게도 즉시 공개됨
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    현재 등록된 공지사항: <strong className="text-white">{notices.length}개</strong> | 최종 저장 버튼을 누르면 모든 내용이 영구 보존되며 방문자에게 즉시 공개됩니다.
                  </p>
                  {lastSavedNoticeTime && (
                    <p className="text-[11px] font-mono text-zinc-400">
                      마지막 최종 저장 일시: <span className="text-amber-300 font-bold">{lastSavedNoticeTime}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFinalSaveNotices}
                  disabled={isSavingNotices}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingNotices ? '공지사항 저장 중...' : '공지사항 최종 저장'}</span>
                </button>
              </div>

              {/* Notice Form (Create or Edit) */}
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 sm:p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-400/10 text-amber-400">
                      {isEditingNotice ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isEditingNotice ? '소식 글 수정' : '새 소식 작성하기'}
                    </h3>
                  </div>
                  {isEditingNotice && (
                    <button
                      type="button"
                      onClick={resetNoticeForm}
                      className="text-xs text-zinc-400 hover:text-amber-400 underline cursor-pointer"
                    >
                      새 글 작성 모드로 전환
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveNotice} className="space-y-4">
                  {/* Row 1: Title */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      소식 제목 <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="공지 또는 소식 제목을 입력하세요"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans"
                    />
                  </div>

                  {/* Row 2: 종류 (소식, 정보 2개만 지원), 작성자, 등록일, 상단고정 */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* 종류: 소식, 정보 */}
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        종류 <span className="text-amber-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 h-[38px] p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setNoticeCategory('소식')}
                          className={`rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            noticeCategory === '소식'
                              ? 'bg-amber-400 text-zinc-950 shadow-sm'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${noticeCategory === '소식' ? 'bg-zinc-950' : 'bg-amber-400'}`} />
                          <span>소식</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeCategory('정보')}
                          className={`rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            noticeCategory === '정보'
                              ? 'bg-sky-400 text-zinc-950 shadow-sm'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${noticeCategory === '정보' ? 'bg-zinc-950' : 'bg-sky-400'}`} />
                          <span>정보</span>
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        작성자
                      </label>
                      <input
                        type="text"
                        value={noticeAuthor}
                        onChange={(e) => setNoticeAuthor(e.target.value)}
                        className="w-full h-[38px] px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        등록일
                      </label>
                      <input
                        type="text"
                        value={noticeDate}
                        onChange={(e) => setNoticeDate(e.target.value)}
                        placeholder="2025.01.01"
                        className="w-full h-[38px] px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center pt-2 sm:pt-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={noticePinned}
                          onChange={(e) => setNoticePinned(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-zinc-950 border-zinc-700"
                        />
                        <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                          <Pin className="w-3.5 h-3.5 text-amber-400 rotate-45" /> 상단 고정
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Row 3: Content (Text Mode, HTML Mode & Live Preview) */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-zinc-300">
                        본문 내용{' '}
                        <span className="text-[11px] font-normal text-amber-400/90">
                          {noticeContentMode === 'text'
                            ? '(일반 텍스트 작성 중 · 줄바꿈 자동 반영)'
                            : noticeContentMode === 'html'
                            ? '(HTML 코드 작성 중)'
                            : '(실시간 미리보기 화면)'}
                        </span>
                      </label>

                      {/* Text / HTML / Live Preview 3-Tab Switcher */}
                      <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                        <button
                          type="button"
                          onClick={() => setNoticeContentMode('text')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            noticeContentMode === 'text'
                              ? 'bg-amber-400 text-zinc-950 shadow-xs font-bold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>일반 텍스트 모드</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeContentMode('html')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            noticeContentMode === 'html'
                              ? 'bg-amber-400 text-zinc-950 shadow-xs font-bold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>HTML 코드 모드</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeContentMode('preview')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            noticeContentMode === 'preview'
                              ? 'bg-amber-400 text-zinc-950 shadow-xs font-bold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>실시간 미리보기</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Plain Text Toolbar (Identical structure to HTML mode toolbar) */}
                    {noticeContentMode === 'text' && (
                      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px]">
                        <span className="text-zinc-400 font-mono text-[10px] mr-1">텍스트 빠른 서식:</span>
                        <button
                          type="button"
                          onClick={() => handleFormatText('bold')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold cursor-pointer"
                          title="선택한 텍스트 굵게 (**굵은 텍스트**)"
                        >
                          &lt;b&gt;굵게&lt;/b&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('gold')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold cursor-pointer"
                          title="선택한 텍스트 골드 강조 (★골드 강조★)"
                        >
                          골드강조
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('heading')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                          title="소제목 삽입 (■ 소제목)"
                        >
                          &lt;h3&gt;소제목
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('paragraph')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                          title="문단 나눔 (빈 줄 추가)"
                        >
                          &lt;p&gt;문단
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('br')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono cursor-pointer"
                          title="줄바꿈 삽입"
                        >
                          &lt;br /&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('link')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 cursor-pointer"
                          title="하이퍼링크 삽입 [제목](URL)"
                        >
                          &lt;a&gt;링크
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('quote')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="인용구 삽입 (> 인용구)"
                        >
                          인용구
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('divider')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="구분선 삽입"
                        >
                          &lt;hr /&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('bullet')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="글머리 기호 삽입 (• 항목)"
                        >
                          • 글머리
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('number')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="번호 매기기 삽입 (1. 항목)"
                        >
                          1. 번호
                        </button>
                      </div>
                    )}

                    {/* Quick HTML Insertion Toolbar (visible in html mode) */}
                    {noticeContentMode === 'html' && (
                      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px]">
                        <span className="text-zinc-400 font-mono text-[10px] mr-1">HTML 빠른 태그:</span>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<strong>', '</strong>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold cursor-pointer"
                          title="진하게 태그 삽입"
                        >
                          &lt;b&gt;굵게&lt;/b&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<span style="color: #fbbf24; font-weight: bold;">', '</span>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold cursor-pointer"
                          title="골드 강조 태그 삽입"
                        >
                          골드강조
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 16px 0 8px 0;">', '</h3>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                          title="소제목 태그 삽입"
                        >
                          &lt;h3&gt;소제목
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<p style="line-height: 1.8; margin-bottom: 12px;">', '</p>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                          title="문단 태그 삽입"
                        >
                          &lt;p&gt;문단
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<br />')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono cursor-pointer"
                          title="줄바꿈 태그 삽입"
                        >
                          &lt;br /&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<a href="https://" target="_blank" style="color: #fbbf24; text-decoration: underline;">', '</a>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 cursor-pointer"
                          title="하이퍼링크 태그 삽입"
                        >
                          &lt;a&gt;링크
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<blockquote style="border-left: 3px solid #fbbf24; padding-left: 12px; margin: 12px 0; color: #a1a1aa; font-style: italic;">', '</blockquote>')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="인용구 삽입"
                        >
                          인용구
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertHtmlTag('<hr style="border: 0; border-top: 1px solid #3f3f46; margin: 20px 0;" />')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title="구분선 삽입"
                        >
                          &lt;hr /&gt;
                        </button>
                      </div>
                    )}

                    {/* Textarea or HTML Live Preview */}
                    {noticeContentMode === 'preview' ? (
                      <div className="w-full min-h-[190px] max-h-[380px] overflow-y-auto p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-sans leading-relaxed">
                        {noticeContent.trim() ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: formatNoticeContent(noticeContent) }}
                            className="space-y-3 leading-relaxed font-sans text-sm text-zinc-100 [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h1,&_h2,&_h3]:font-bold [&_h1,&_h2,&_h3]:text-white [&_strong]:text-white [&_b]:text-white [&_p]:leading-relaxed"
                          />
                        ) : (
                          <div className="text-zinc-500 text-xs py-10 text-center flex flex-col items-center justify-center gap-1.5">
                            <FileText className="w-5 h-5 text-zinc-600" />
                            <span>작성된 내용이 없습니다. '일반 텍스트 모드' 또는 'HTML 코드 모드'에서 내용을 입력하세요.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        ref={textareaRef}
                        rows={8}
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        placeholder={
                          noticeContentMode === 'text'
                            ? "소식 본문 내용을 자유롭게 입력하세요. 줄바꿈과 띄어쓰기가 작성하신 그대로 자연스럽게 반영됩니다."
                            : "HTML 태그(<p>, <b>, <span>, <a>, <h3>, <hr> 등)를 포함하여 자유롭게 작성할 수 있습니다."
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans leading-relaxed"
                      />
                    )}
                  </div>

                  {/* Row 4: YouTube URL insertion */}
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>유튜브 영상 삽입 (선택)</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noticeYoutubeUrl}
                        onChange={(e) => setNoticeYoutubeUrl(e.target.value)}
                        placeholder="예: https://www.youtube.com/watch?v=gwL9BeqEzv4 또는 영상 ID"
                        className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {/* YouTube Live Preview */}
                    {previewYoutubeId && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-400 mb-1.5 block">
                          유튜브 영상 미리보기 (Video ID: {previewYoutubeId})
                        </span>
                        <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden bg-black border border-zinc-800">
                          <iframe
                            src={`https://www.youtube.com/embed/${previewYoutubeId}`}
                            title="YouTube Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 5: Images Upload / URL insertion */}
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>이미지 첨부 및 업로드 ({noticeImages.length}개)</span>
                      </div>
                      <input
                        ref={noticeFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNoticeImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => noticeFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? '업로드 압축 중...' : 'PC에서 이미지 선택'}</span>
                      </button>
                    </div>

                    {/* Image URL Direct Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noticeImageUrlInput}
                        onChange={(e) => setNoticeImageUrlInput(e.target.value)}
                        placeholder="또는 이미지 웹 URL 직접 입력 (https://...)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                      >
                        추가
                      </button>
                    </div>

                    {/* Uploaded Images Thumbnails */}
                    {noticeImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {noticeImages.map((imgSrc, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video flex items-center justify-center"
                          >
                            <img
                              src={imgSrc}
                              alt={`첨부 이미지 ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNoticeImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="이미지 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form Submit Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isEditingNotice && (
                      <button
                        type="button"
                        onClick={resetNoticeForm}
                        className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isEditingNotice ? '소식 글 변경사항 저장' : '새 소식 등록하기'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Notice List Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    등록된 소식 목록 ({notices.length}개)
                  </h4>
                  <button
                    type="button"
                    onClick={handleFinalSaveNotices}
                    disabled={isSavingNotices}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer hover:scale-[1.02]"
                    title="현재 공지사항 목록을 최종 저장합니다"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNotices ? '저장 중...' : '공지사항 최종 저장'}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                  {notices.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {item.pinned && (
                          <span className="p-1 rounded bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
                            <Pin className="w-3.5 h-3.5 rotate-45" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                item.category === '정보'
                                  ? 'bg-sky-400/10 text-sky-300 border-sky-400/30'
                                  : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                              }`}
                            >
                              {item.category === '정보' ? '정보' : '소식'}
                            </span>
                            <span className="text-xs font-semibold text-white truncate max-w-[400px]">
                              {item.title}
                            </span>
                            {item.youtubeId && (
                              <span className="text-[10px] text-red-400 bg-red-400/10 px-1 py-0.2 rounded flex items-center gap-0.5">
                                <Youtube className="w-2.5 h-2.5" /> 영상
                              </span>
                            )}
                            {item.images && item.images.length > 0 && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1 py-0.2 rounded flex items-center gap-0.5">
                                <ImageIcon className="w-2.5 h-2.5" /> {item.images.length}장
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              {item.date}
                            </span>
                            <span>작성자: {item.author || '아트판타지아'}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-zinc-500" />
                              조회 {item.views}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleStartEditNotice(item)}
                          className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-400" />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotice(item.id);
                            if (editingNoticeId === item.id) {
                              resetNoticeForm();
                            }
                            showToast(`'${item.title}' 소식이 삭제되었습니다.`, 'info');
                          }}
                          className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-rose-950 text-rose-400 hover:text-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INFINITE ROLLING TICKER LOGOS ONLY */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              {/* Logo Final Save Control Banner */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-400/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      무한롤링티커 로고 관리
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      비로그인 일반 방문자에게도 즉시 무한롤링티커 노출됨
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    현재 등록된 파트너 로고: <strong className="text-white">{logos.length}개</strong> (4줄 무한 롤링) | 최종 저장 버튼을 누르면 모든 내용이 영구 보존되며 메인 화면에 즉시 노출됩니다.
                  </p>
                  {lastSavedLogoTime && (
                    <p className="text-[11px] font-mono text-zinc-400">
                      마지막 최종 저장 일시: <span className="text-amber-300 font-bold">{lastSavedLogoTime}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFinalSaveLogos}
                  disabled={isSavingLogos}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingLogos ? '로고 저장 중...' : '로고 최종 저장'}</span>
                </button>
              </div>

              {/* Informational Banner */}
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
                <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white text-sm mb-0.5">
                    무한롤링티커 구역 로고 관리
                  </span>
                  이곳에서 등록하거나 수정한 로고는 메인 히어로 구역의 <strong>무한롤링티커 구역</strong>에 즉시 삽입되어 관리자 로그인 없이도 일반 방문자에게 실시간으로 반영됩니다.
                </div>
              </div>

              {/* Logo Form: Logo image only (brand name & website URL removed) */}
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 sm:p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-400/10 text-amber-400">
                      {isEditingLogo ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isEditingLogo ? '무한롤링티커 로고 수정' : '무한롤링티커 구역 로고 삽입하기'}
                    </h3>
                  </div>
                  {isEditingLogo && (
                    <button
                      type="button"
                      onClick={resetLogoForm}
                      className="text-xs text-zinc-400 hover:text-amber-400 underline cursor-pointer"
                    >
                      새 로고 등록 모드로 전환
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveLogo} className="space-y-4">
                  {/* Logo Image Upload / SVG Link / SVG Code */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-3.5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          무한롤링티커 로고 이미지 선택 또는 링크 입력
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          SVG 벡터 파일, PNG 투명 로고, JPG 이미지 또는 SVG 웹 링크 URL을 등록할 수 있습니다.
                        </p>
                      </div>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp"
                        onChange={handleLogoImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        disabled={isUploadingLogoImage}
                        className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingLogoImage ? '처리 중...' : 'PC에서 로고 파일 선택'}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-zinc-300">
                        로고 이미지 URL 또는 &lt;svg&gt; 코드 직접 입력
                      </label>
                      <input
                        type="text"
                        value={logoUrl.startsWith('data:image/svg+xml;utf8,') ? decodeURIComponent(logoUrl.replace('data:image/svg+xml;utf8,', '')) : logoUrl}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (val.startsWith('<svg') && val.endsWith('</svg>')) {
                            setLogoUrl(`data:image/svg+xml;utf8,${encodeURIComponent(val)}`);
                          } else {
                            setLogoUrl(e.target.value);
                          }
                        }}
                        placeholder="예: https://example.com/logo.svg 또는 <svg ...>...</svg> 코드 붙여넣기"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {/* Logo Live Preview */}
                    {logoUrl && (
                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-400">실시간 미리보기:</span>
                        <div className="h-14 px-5 rounded-lg bg-zinc-900/90 border border-zinc-700 flex items-center justify-center">
                          <img
                            src={logoUrl.startsWith('<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(logoUrl)}` : logoUrl}
                            alt="Logo Preview"
                            className="max-h-9 max-w-[150px] object-contain"
                          />
                        </div>
                        <div className="h-14 px-5 rounded-lg bg-white/95 border border-zinc-300 flex items-center justify-center">
                          <img
                            src={logoUrl.startsWith('<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(logoUrl)}` : logoUrl}
                            alt="Logo Preview (Light)"
                            className="max-h-9 max-w-[150px] object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer ml-auto"
                        >
                          로고 지우기
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    {isEditingLogo && editingLogoId ? (
                      <button
                        type="button"
                        onClick={() => {
                          deleteLogo(editingLogoId);
                          resetLogoForm();
                          showToast('선택한 로고가 성공적으로 삭제되었습니다.', 'info');
                        }}
                        className="px-3.5 py-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="이 로고 삭제하기"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>이 로고 삭제</span>
                      </button>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                      {isEditingLogo && (
                        <button
                          type="button"
                          onClick={resetLogoForm}
                          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                        >
                          취소
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isEditingLogo ? '무한롤링티커 로고 저장' : '무한롤링티커 구역에 로고 삽입하기'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Logo List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    등록된 무한롤링티커 로고 목록 ({logos.length}개)
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleFinalSaveLogos}
                      disabled={isSavingLogos}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer hover:scale-[1.02]"
                      title="현재 무한롤링티커 로고 목록을 최종 저장합니다"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingLogos ? '저장 중...' : '로고 최종 저장'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetLogosToDefault();
                        resetLogoForm();
                        showToast('기본 로고 목록으로 복원되었습니다. [로고 최종 저장]을 누르면 영구 보존됩니다.', 'success');
                      }}
                      className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 목록으로 복원</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {logos.map((logo, idx) => (
                    <div
                      key={logo.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between gap-2.5 group transition-all"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-full h-14 rounded-lg bg-white border border-zinc-300 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                          {(() => {
                            const rawUrl = logo.logoUrl || getBrandLogoSvg(logo.id, logo.name);
                            const imgSrc = rawUrl.startsWith('<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(rawUrl)}` : rawUrl;
                            return (
                              <img
                                src={imgSrc}
                                alt={`Logo ${idx + 1}`}
                                className="max-h-8 max-w-[90%] object-contain transition-transform duration-200 group-hover:scale-105"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                              />
                            );
                          })()}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 mt-1">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t border-zinc-800/80">
                        <button
                          type="button"
                          onClick={() => handleStartEditLogo(logo)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="로고 교체 / 수정"
                        >
                          <Edit2 className="w-3 h-3 text-amber-400" />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLogo(logo.id);
                            if (editingLogoId === logo.id) {
                              resetLogoForm();
                            }
                            showToast(`로고 #${idx + 1}이(가) 삭제되었습니다.`, 'info');
                          }}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-rose-900 text-rose-400 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="로고 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
