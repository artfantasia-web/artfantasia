import React, { useState, useEffect, useRef } from 'react';
import { useNotices } from '../../context/NoticeContext';
import { NoticeItem, NoticeCategory } from '../../types';
import { formatNoticeContent } from '../../utils/formatNotice';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Bold,
  Underline,
  Link as LinkIcon,
  Sparkles,
  Pin,
  Calendar,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowLeft,
  Youtube,
  Minus
} from 'lucide-react';

export const AdminNoticeModal: React.FC = () => {
  const {
    notices,
    isAdmin,
    isAdminModalOpen,
    editingNotice,
    loginAdmin,
    logoutAdmin,
    closeAdminModal,
    setEditingNotice,
    addNotice,
    updateNotice,
    deleteNotice,
  } = useNotices();

  // Login form state
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Editor mode: 'list' | 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Notice form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<NoticeCategory>('소식');
  const [formDate, setFormDate] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [formYoutubeId, setFormYoutubeId] = useState('');
  const [formContent, setFormContent] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Link dialog prompt state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync editor with editingNotice or reset on open
  useEffect(() => {
    if (editingNotice) {
      setFormTitle(editingNotice.title || '');
      setFormCategory(editingNotice.category === '정보' ? '정보' : '소식');
      setFormDate(editingNotice.date || getTodayFormatted());
      setFormPinned(!!editingNotice.pinned);
      setFormYoutubeId(editingNotice.youtubeId || '');
      setFormContent(editingNotice.content ? editingNotice.content.join('\n\n') : '');
      setViewMode('editor');
    } else {
      resetForm();
      setViewMode('list');
    }
  }, [editingNotice, isAdminModalOpen]);

  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('소식');
    setFormDate(getTodayFormatted());
    setFormPinned(false);
    setFormYoutubeId('');
    setFormContent('');
    setSaveSuccess(false);
    setFormError('');
  };

  if (!isAdminModalOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(adminId, adminPw);
    if (success) {
      setAdminId('');
      setAdminPw('');
      setLoginError('');
      setViewMode('list');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // Helper to insert markdown tokens into textarea at cursor / selection
  const insertFormatting = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formContent.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const newContent =
      formContent.substring(0, start) + replacement + formContent.substring(end);

    setFormContent(newContent);

    // Reposition cursor inside or right after inserted tokens
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Toolbar actions
  const handleApplyBold = () => insertFormatting('**', '**', '굵은 텍스트');
  const handleApplyUnderline = () => insertFormatting('<u>', '</u>', '밑줄 텍스트');
  const handleApplyGold = () => insertFormatting('★', '★', '강조 텍스트');
  const handleApplyDivider = () => insertFormatting('\n\n---\n\n', '', '');

  const handleOpenLinkDialog = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const selected = formContent.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selected) {
        setLinkText(selected);
      } else {
        setLinkText('');
      }
    }
    setLinkUrl('https://');
    setShowLinkDialog(true);
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) return;
    const label = linkText.trim() || linkUrl.trim();
    const markdownLink = `[${label}](${linkUrl.trim()})`;
    insertFormatting(markdownLink, '', '');
    setShowLinkDialog(false);
  };

  // Save Notice Submit (Create or Update)
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('제목을 입력해주세요.');
      return;
    }
    setFormError('');

    // Split content by double newlines or single newlines into paragraphs
    const paragraphs = formContent
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    const noticePayload = {
      title: formTitle.trim(),
      category: formCategory,
      date: formDate.trim() || getTodayFormatted(),
      pinned: formPinned,
      youtubeId: formYoutubeId.trim() || undefined,
      content: paragraphs.length > 0 ? paragraphs : [formContent.trim() || '내용이 없습니다.'],
      author: '아트판타지아 관리자',
    };

    if (editingNotice) {
      updateNotice(editingNotice.id, noticePayload);
    } else {
      addNotice(noticePayload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingNotice(null);
      resetForm();
      setViewMode('list');
    }, 600);
  };

  const handleDeleteNotice = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden text-zinc-100">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {isAdmin ? '게시판 관리자 모드' : '게시판 관리자 로그인'}
                </h3>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    인증됨
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {isAdmin
                  ? '공지사항 및 소식 글을 직관적으로 작성·수정·관리합니다.'
                  : '관리자 권한 확인을 위해 로그인해주세요.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="관리자 로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeAdminModal}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isAdmin ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-8 sm:py-12">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-white">관리자 인증</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  부여받으신 관리자 아이디와 비밀번호를 입력해주세요.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    관리자 아이디
                  </label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      비밀번호
                    </label>
                    {adminPw.length > 0 && (
                      <span className="text-[10.5px] text-zinc-400 font-mono">
                        {adminPw.length}자
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPw}
                      onChange={(e) => setAdminPw(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                      title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-md shadow-amber-400/20 active:scale-[0.99] cursor-pointer"
                >
                  로그인하여 관리 시작
                </button>
              </form>
            </div>
          ) : viewMode === 'list' ? (
            /* Mode A: Notice List View */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">등록된 게시글</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-amber-400 font-bold">
                    {notices.length}개
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingNotice(null);
                    resetForm();
                    setViewMode('editor');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-amber-400/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 글 쓰기</span>
                </button>
              </div>

              {/* Table / List */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden">
                {notices.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    등록된 게시글이 없습니다. [새 글 쓰기]를 눌러 첫 글을 등록해보세요.
                  </div>
                ) : (
                  notices.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.pinned && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-400/30">
                              <Pin className="w-2.5 h-2.5 rotate-45" /> 상단고정
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.category === '정보'
                                ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                                : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {item.category === '정보' ? '정보' : '소식'}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-600" />
                            {item.date}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                            <Eye className="w-3 h-3 text-zinc-600" />
                            조회 {item.views}
                          </span>
                        </div>

                        <h5 className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </h5>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotice(item);
                            setViewMode('editor');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-300 text-xs font-medium transition-colors flex items-center gap-1 border border-zinc-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(item.id, item.title)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 text-xs font-medium transition-colors flex items-center gap-1 border border-zinc-800 hover:border-rose-500/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Mode B: Notice Editor (Write / Edit with Bold, Underline, Link, etc.) */
            <form onSubmit={handleSaveNotice} className="space-y-4">
              {/* Back to list & Editor Mode Tab */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('list');
                    setEditingNotice(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>글 목록으로</span>
                </button>

                {/* Write / Live Preview switch */}
                <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      editorTab === 'write'
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    에디터 작성
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      editorTab === 'preview'
                        ? 'bg-amber-400 text-zinc-950 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    실시간 미리보기
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>게시글이 성공적으로 저장되었습니다!</span>
                </div>
              )}

              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  글 제목 <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="공지 또는 소식 제목을 입력하세요"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                />
              </div>

              {/* Meta row: Category, Date, Pinned, Youtube */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    게시판 분류
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormCategory('소식')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        formCategory === '소식'
                          ? 'bg-amber-400 text-zinc-950 border-amber-300'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      소식
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormCategory('정보')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        formCategory === '정보'
                          ? 'bg-sky-400 text-zinc-950 border-sky-300'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      정보
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    등록일 (YYYY.MM.DD)
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="2026.10.30"
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* Pinned Checkbox */}
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 rounded accent-amber-400"
                    />
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-400 rotate-45" /> 상단 고정 (중요 공지)
                    </span>
                  </label>
                </div>
              </div>

              {/* Optional Youtube ID */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span>유튜브 영상 연동 (선택 사항)</span>
                </label>
                <input
                  type="text"
                  value={formYoutubeId}
                  onChange={(e) => setFormYoutubeId(e.target.value)}
                  placeholder="유튜브 영상 ID (예: gwL9BeqEzv4 또는 영상 주소)"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Content Editor Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-300">
                    본문 내용 <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    엔터(줄바꿈)로 문단을 나눌 수 있습니다.
                  </span>
                </div>

                {/* Intuitive Formatting Toolbar (링크, 글 굵게, 밑줄 등) */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 flex-wrap">
                  {/* Bold */}
                  <button
                    type="button"
                    onClick={handleApplyBold}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700 cursor-pointer"
                    title="선택한 텍스트를 굵게 만듭니다"
                  >
                    <Bold className="w-3.5 h-3.5 text-amber-400" />
                    <span>굵게 (B)</span>
                  </button>

                  {/* Underline */}
                  <button
                    type="button"
                    onClick={handleApplyUnderline}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700 cursor-pointer"
                    title="선택한 텍스트에 밑줄을 긋습니다"
                  >
                    <Underline className="w-3.5 h-3.5 text-amber-400" />
                    <span>밑줄 (U)</span>
                  </button>

                  {/* Link */}
                  <button
                    type="button"
                    onClick={handleOpenLinkDialog}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-300 text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700 cursor-pointer"
                    title="클릭 가능한 웹사이트 링크를 삽입합니다"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>링크 삽입</span>
                  </button>

                  {/* Gold Highlight */}
                  <button
                    type="button"
                    onClick={handleApplyGold}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-300 text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700 cursor-pointer"
                    title="황금색으로 강조합니다"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>골드 강조</span>
                  </button>

                  {/* Divider */}
                  <button
                    type="button"
                    onClick={handleApplyDivider}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700 cursor-pointer"
                    title="가로 구분선을 삽입합니다"
                  >
                    <Minus className="w-3.5 h-3.5 text-zinc-400" />
                    <span>구분선</span>
                  </button>
                </div>

                {/* Editor or Live Preview View */}
                {editorTab === 'write' ? (
                  <textarea
                    ref={textareaRef}
                    required
                    rows={12}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder={`내용을 입력하세요.\n\n위 툴바 버튼을 누르시면 [굵게], [밑줄], [링크] 서식이 바로 적용됩니다.\n\n예시:\n**굵은 텍스트는 이렇게 표시됩니다.**\n<u>밑줄 그어진 텍스트는 이렇게 표시됩니다.</u>\n[아트판타지아 공식 홈페이지 바로가기](https://artfantasia.co.kr)`}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans leading-relaxed"
                  />
                ) : (
                  /* Live Preview Box */
                  <div className="w-full min-h-[300px] max-h-[460px] overflow-y-auto px-5 py-4 rounded-xl bg-zinc-900/90 border border-zinc-700 text-sm text-zinc-200 leading-relaxed font-sans space-y-3">
                    <div className="pb-2 mb-2 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                        미리보기 화면 (실제 방문자에게 노출되는 형태)
                      </span>
                      <span className="text-xs text-zinc-400">{formDate}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-3">
                      {formTitle || '(제목 없음)'}
                    </h4>

                    {formContent ? (
                      formContent
                        .split(/\n{2,}/)
                        .map((p, idx) => (
                          <div
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: formatNoticeContent(p) }}
                            className="leading-relaxed [&_a]:text-amber-400 [&_a]:underline [&_strong]:text-white [&_b]:text-white"
                          />
                        ))
                    ) : (
                      <p className="text-zinc-500 italic">내용을 입력하시면 미리보기가 표시됩니다.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('list');
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  취소 및 목록으로
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-amber-400/20 active:scale-[0.99] cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingNotice ? '수정 완료' : '게시글 등록하기'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Link Dialog Modal */}
      {showLinkDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-amber-400" />
                <span>링크 삽입</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  표시할 링크 텍스트
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="예: 아트판타지아 공식 사이트"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  링크 URL 주소
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 text-xs font-bold"
              >
                링크 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Self-contained in iframe) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700/80 p-5 shadow-2xl text-center space-y-4">
            <div className="w-11 h-11 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">공지글 삭제 확인</h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed break-keep">
                &ldquo;<span className="text-white font-semibold">{deleteTarget.title}</span>&rdquo;<br />
                글을 삭제하시겠습니까?
              </p>
              <p className="text-[11px] text-rose-400 mt-1 font-medium">
                삭제된 글은 복구할 수 없습니다.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteNotice(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
