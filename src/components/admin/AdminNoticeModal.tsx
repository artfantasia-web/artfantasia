import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotices } from '../../context/NoticeContext';
import { NoticeCategory } from '../../types';
import {
  formatNoticeContent,
  extractYoutubeVideoId,
  buildYoutubeEmbedHtml,
  extractEmbeddedYoutubeIds,
} from '../../utils/formatNotice';
import { formatNoticeSlug } from '../../utils/seo';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Pin,
  Calendar,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowLeft,
  Youtube,
  Minus,
  Loader2,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  ImagePlus,
  Video,
  Pencil,
  Code2,
  ChevronDown,
  ChevronRight,
  PanelRight,
  Send,
  Search,
  Tag,
  Link as PermalinkIcon,
  Settings2,
  Highlighter,
  Palette,
  Upload,
} from 'lucide-react';

type EditorMode = 'compose' | 'html';
type HeadingLevel = 'p' | 'h1' | 'h2' | 'h3' | 'h4';

const TEXT_COLOR_SWATCHES = [
  { label: '기본 흰색', value: '#f4f4f5' },
  { label: '순백색', value: '#ffffff' },
  { label: '골드 앰버', value: '#fbbf24' },
  { label: '라이트 골드', value: '#fde68a' },
  { label: '오렌지', value: '#fb923c' },
  { label: '로즈 레드', value: '#fb7185' },
  { label: '스카이 블루', value: '#38bdf8' },
  { label: '에메랄드', value: '#34d399' },
  { label: '바이올렛', value: '#a78bfa' },
  { label: '회색', value: '#a1a1aa' },
];

const HIGHLIGHT_SWATCHES = [
  { label: '없음', value: 'transparent' },
  { label: '앰버 강조', value: 'rgba(251, 191, 36, 0.28)' },
  { label: '스카이 강조', value: 'rgba(56, 189, 248, 0.25)' },
  { label: '로즈 강조', value: 'rgba(251, 113, 133, 0.25)' },
  { label: '에메랄드 강조', value: 'rgba(52, 211, 153, 0.25)' },
  { label: '다크 박스', value: '#27272a' },
];

const FONT_FAMILIES = [
  { label: '기본 글꼴', value: 'Pretendard, Noto Sans KR, sans-serif' },
  { label: 'Noto Sans KR', value: 'Noto Sans KR, sans-serif' },
  { label: '명조체 (Serif)', value: 'Georgia, Noto Serif KR, serif' },
  { label: '고정폭 (Mono)', value: 'JetBrains Mono, monospace' },
];

const FONT_SIZES = [
  { label: '매우 작게', value: '1' },
  { label: '작게', value: '2' },
  { label: '보통', value: '3' },
  { label: '약간 크게', value: '4' },
  { label: '크게', value: '5' },
  { label: '매우 크게', value: '6' },
];

const HEADING_OPTIONS: { label: string; tag: HeadingLevel }[] = [
  { label: '일반 텍스트', tag: 'p' },
  { label: '주제목', tag: 'h1' },
  { label: '제목', tag: 'h2' },
  { label: '부제목', tag: 'h3' },
  { label: '소제목', tag: 'h4' },
];

function noticeParagraphsToHtml(paragraphs: string[]): string {
  if (!paragraphs || paragraphs.length === 0) return '';
  const joined = paragraphs.join('\n\n').trim();
  if (!joined) return '';

  if (
    /<(p|div|h[1-6]|blockquote|ul|ol|table|section|figure|img|hr|iframe)[\s>/]/i.test(
      joined
    )
  ) {
    return joined;
  }

  return paragraphs
    .map((p) => {
      const html = formatNoticeContent(p);
      if (/<(p|div|h[1-6]|blockquote|ul|ol|hr)[\s>/]/i.test(html)) {
        return html;
      }
      return `<p>${html}</p>`;
    })
    .join('');
}

function parseMultipleYoutubeInputs(raw: string): string[] {
  const tokens = raw
    .split(/[\n,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const ids: string[] = [];
  for (const token of tokens) {
    const id = extractYoutubeVideoId(token);
    if (id && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

export const AdminNoticeModal: React.FC = () => {
  const {
    notices,
    isLoading,
    error: noticesError,
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

  // Dashboard mode: 'list' | 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [listSearch, setListSearch] = useState('');
  const [listCategory, setListCategory] = useState<'all' | '소식' | '정보'>('all');

  // Blogger Editor view state: Compose ('compose') vs HTML ('html') + Preview overlay
  const [editorMode, setEditorMode] = useState<EditorMode>('compose');
  const [showPreview, setShowPreview] = useState(false);
  const [showSettingsSidebar, setShowSettingsSidebar] = useState(true);

  // Blogger toolbar dropdown/popover states
  const [openDropdown, setOpenDropdown] = useState<
    null | 'mode' | 'font' | 'size' | 'heading' | 'textColor' | 'bgColor' | 'align'
  >(null);

  // Accordion state inside right "게시물 설정" panel
  const [openSettingSections, setOpenSettingSections] = useState({
    labels: true,
    published: true,
    permalink: true,
    youtube: true,
    options: true,
  });

  // Active formatting states for Compose view toolbar highlights
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    ul: false,
    ol: false,
    heading: 'p' as HeadingLevel,
    align: 'left' as 'left' | 'center' | 'right' | 'justify',
  });

  // Notice form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<NoticeCategory>('소식');
  const [formDate, setFormDate] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [formHtmlContent, setFormHtmlContent] = useState('');
  const [composeSeedVersion, setComposeSeedVersion] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Blogger-style insert dialogs
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageError, setImageError] = useState('');

  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [videoError, setVideoError] = useState('');
  const [sidebarVideoInput, setSidebarVideoInput] = useState('');
  const [sidebarVideoError, setSidebarVideoError] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const resetForm = useCallback(() => {
    setFormTitle('');
    setFormCategory('소식');
    setFormDate(getTodayFormatted());
    setFormPinned(false);
    setFormHtmlContent('');
    setSaveSuccess(false);
    setFormError('');
    setShowPreview(false);
    setEditorMode('compose');
    setOpenDropdown(null);
    setComposeSeedVersion((v) => v + 1);
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  }, []);

  // Sync editor with editingNotice or reset on open
  useEffect(() => {
    if (!isAdminModalOpen) return;

    if (editingNotice) {
      let initialHtml = noticeParagraphsToHtml(editingNotice.content || []);
      // Migrate legacy single featured youtubeId into inline body embed if not already in content
      if (editingNotice.youtubeId && !initialHtml.includes(editingNotice.youtubeId)) {
        const legacyId = extractYoutubeVideoId(editingNotice.youtubeId);
        if (legacyId) {
          initialHtml = `${buildYoutubeEmbedHtml(legacyId)}${initialHtml}`;
        }
      }
      setFormTitle(editingNotice.title || '');
      setFormCategory(editingNotice.category === '정보' ? '정보' : '소식');
      setFormDate(editingNotice.date || getTodayFormatted());
      setFormPinned(!!editingNotice.pinned);
      setFormHtmlContent(initialHtml);
      setSaveSuccess(false);
      setFormError('');
      setShowPreview(false);
      setEditorMode('compose');
      setViewMode('editor');
      setComposeSeedVersion((v) => v + 1);
    } else {
      resetForm();
      setViewMode('list');
    }
  }, [editingNotice, isAdminModalOpen, resetForm]);

  // Populate contentEditable DOM whenever seeded, switching back from HTML/Preview, or opening editor
  useEffect(() => {
    if (viewMode === 'editor' && editorMode === 'compose' && !showPreview && editorRef.current) {
      if (editorRef.current.innerHTML !== formHtmlContent) {
        editorRef.current.innerHTML = formHtmlContent;
      }
    }
  }, [composeSeedVersion, viewMode, editorMode, showPreview]);

  // Close dropdowns on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  const refreshFormatState = useCallback(() => {
    saveSelection();
    try {
      const block = String(document.queryCommandValue('formatBlock') || 'p')
        .replace(/[<>]/g, '')
        .toLowerCase();
      const heading: HeadingLevel =
        block === 'h1' || block === 'h2' || block === 'h3' || block === 'h4' ? block : 'p';

      let align: 'left' | 'center' | 'right' | 'justify' = 'left';
      if (document.queryCommandState('justifyCenter')) align = 'center';
      else if (document.queryCommandState('justifyRight')) align = 'right';
      else if (document.queryCommandState('justifyFull')) align = 'justify';

      setFormatState({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
        heading,
        align,
      });
    } catch {
      // Ignore queryCommandState errors outside editable focus
    }
  }, [saveSelection]);

  const syncHtmlFromCompose = useCallback(() => {
    if (editorRef.current) {
      setFormHtmlContent(editorRef.current.innerHTML);
    }
  }, []);

  const execComposeCommand = (command: string, value?: string) => {
    if (editorMode !== 'compose') return;
    restoreSelection();
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {}
    document.execCommand(command, false, value);
    syncHtmlFromCompose();
    refreshFormatState();
  };

  const insertHtmlAtCursor = (html: string) => {
    if (editorMode === 'html') {
      const textarea = htmlTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const next =
          formHtmlContent.substring(0, start) + html + formHtmlContent.substring(end);
        setFormHtmlContent(next);
        setTimeout(() => {
          textarea.focus();
          const pos = start + html.length;
          textarea.setSelectionRange(pos, pos);
        }, 30);
      } else {
        setFormHtmlContent((prev) => `${prev}\n${html}`);
      }
      return;
    }

    restoreSelection();
    const ok = document.execCommand('insertHTML', false, html);
    if (!ok && editorRef.current) {
      editorRef.current.innerHTML += html;
    }
    syncHtmlFromCompose();
    refreshFormatState();
  };

  const handleSwitchEditorMode = (nextMode: EditorMode) => {
    setOpenDropdown(null);
    if (nextMode === editorMode) return;
    if (editorMode === 'compose' && editorRef.current) {
      setFormHtmlContent(editorRef.current.innerHTML);
    }
    setEditorMode(nextMode);
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

  // Open Link Dialog (Blogger style)
  const handleOpenLinkDialog = () => {
    setOpenDropdown(null);
    saveSelection();
    let selected = '';
    if (editorMode === 'compose') {
      const sel = window.getSelection();
      selected = sel ? sel.toString() : '';
    } else if (htmlTextareaRef.current) {
      const ta = htmlTextareaRef.current;
      selected = formHtmlContent.substring(ta.selectionStart, ta.selectionEnd);
    }
    setLinkText(selected);
    setLinkUrl('https://');
    setLinkNewTab(true);
    setShowLinkDialog(true);
  };

  const handleConfirmLink = () => {
    const cleanUrl = linkUrl.trim();
    if (!cleanUrl || cleanUrl === 'https://') return;

    // If pasting a YouTube link without custom link text, embed as playable video directly in post
    const ytId = extractYoutubeVideoId(cleanUrl);
    if (ytId && !linkText.trim()) {
      insertHtmlAtCursor(`${buildYoutubeEmbedHtml(ytId)}<p><br></p>`);
      setShowLinkDialog(false);
      return;
    }

    const label = (linkText.trim() || cleanUrl)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const safeHref = cleanUrl.replace(/"/g, '&quot;');
    const targetAttrs = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    insertHtmlAtCursor(`<a href="${safeHref}"${targetAttrs}>${label}</a>`);
    setShowLinkDialog(false);
  };

  // Open Image Dialog (Blogger style: upload from PC or URL)
  const handleOpenImageDialog = () => {
    setOpenDropdown(null);
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setImageError('');
    setImageTab('upload');
    setShowImageDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError('1.5MB 이하의 이미지를 선택하거나 이미지 URL을 입력해 주세요.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = () => {
    const cleanSrc = imageUrl.trim();
    if (!cleanSrc) {
      setImageError('이미지를 선택하거나 URL을 입력해주세요.');
      return;
    }
    const safeAlt = (imageAlt.trim() || formTitle.trim() || '공지 이미지').replace(/"/g, '&quot;');
    const safeSrc = cleanSrc.replace(/"/g, '&quot;');
    insertHtmlAtCursor(
      `<figure style="margin: 16px 0; text-align: center;"><img src="${safeSrc}" alt="${safeAlt}" style="max-width: 100%; border-radius: 10px;" /></figure><p><br></p>`
    );
    setShowImageDialog(false);
  };

  // Open Video Dialog (Toolbar button: multi-YouTube embed into post body)
  const handleOpenVideoDialog = () => {
    setOpenDropdown(null);
    saveSelection();
    setVideoInput('');
    setVideoError('');
    setShowVideoDialog(true);
  };

  const insertYoutubeVideosIntoBody = (rawInput: string, onClear?: () => void, onErr?: (msg: string) => void) => {
    const ids = parseMultipleYoutubeInputs(rawInput);
    if (ids.length === 0) {
      onErr?.('올바른 유튜브 링크(예: https://youtu.be/...) 또는 영상 ID를 입력해주세요.');
      return false;
    }
    const html = ids.map((id) => buildYoutubeEmbedHtml(id)).join('') + '<p><br></p>';
    insertHtmlAtCursor(html);
    onErr?.('');
    onClear?.();
    return true;
  };

  const handleConfirmVideo = () => {
    const ok = insertYoutubeVideosIntoBody(
      videoInput,
      () => setVideoInput(''),
      (msg) => setVideoError(msg)
    );
    if (ok) {
      setShowVideoDialog(false);
    }
  };

  const handleRemoveEmbeddedVideo = (videoIdToRemove: string) => {
    const currentHtml =
      editorMode === 'compose' && editorRef.current
        ? editorRef.current.innerHTML
        : formHtmlContent;

    const parser = new DOMParser();
    const doc = parser.parseFromString(currentHtml, 'text/html');
    doc.querySelectorAll(`[data-youtube-embed="${videoIdToRemove}"]`).forEach((el) => el.remove());
    doc.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.getAttribute('src') || '';
      if (src.includes(`youtube.com/embed/${videoIdToRemove}`)) {
        const parent = iframe.parentElement;
        if (parent && parent !== doc.body && parent.children.length === 1) {
          parent.remove();
        } else {
          iframe.remove();
        }
      }
    });

    const nextHtml = doc.body.innerHTML;
    setFormHtmlContent(nextHtml);
    setComposeSeedVersion((v) => v + 1);
    if (editorMode === 'compose' && editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
    }
  };

  const handleComposePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData('text/plain')?.trim();
    if (!pastedText) return;
    const lines = pastedText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    const allYoutube = lines.every(
      (line) => /^https?:\/\//i.test(line) && extractYoutubeVideoId(line) !== null
    );
    if (allYoutube) {
      e.preventDefault();
      const ids = parseMultipleYoutubeInputs(lines.join('\n'));
      if (ids.length > 0) {
        const html = ids.map((id) => buildYoutubeEmbedHtml(id)).join('') + '<p><br></p>';
        document.execCommand('insertHTML', false, html);
        syncHtmlFromCompose();
        refreshFormatState();
      }
    }
  };

  // Save Notice Submit (Publish / Update)
  const handleSaveNotice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!formTitle.trim()) {
      setFormError('게시물 제목을 입력해주세요.');
      return;
    }

    const latestHtml =
      editorMode === 'compose' && editorRef.current
        ? editorRef.current.innerHTML
        : formHtmlContent;

    const plainTextCheck = latestHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
    const hasMedia = /<(img|iframe)[\s>]/i.test(latestHtml);

    if (!plainTextCheck && !hasMedia) {
      setFormError('본문 내용을 입력해주세요.');
      return;
    }

    setFormError('');
    setSaveSuccess(false);
    setIsSubmitting(true);

    const cleanedHtml = latestHtml.trim();
    const noticePayload = {
      title: formTitle.trim(),
      category: formCategory,
      date: formDate.trim() || getTodayFormatted(),
      pinned: formPinned,
      youtubeId: undefined,
      content: [cleanedHtml || '내용이 없습니다.'],
      author: '아트판타지아 관리자',
    };

    try {
      const result = editingNotice
        ? await updateNotice(editingNotice.id, noticePayload)
        : await addNotice(noticePayload);

      if (!result.success) {
        setFormError(result.error || '게시글 저장 중 오류가 발생했습니다.');
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingNotice(null);
        resetForm();
        setViewMode('list');
      }, 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotice = (id: string, title: string) => {
    setDeleteError('');
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const result = await deleteNotice(deleteTarget.id);
      if (!result.success) {
        setDeleteError(result.error || '게시글 삭제에 실패했습니다.');
        return;
      }
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAdminNotices = notices.filter((item) => {
    const itemCat = item.category === '정보' ? '정보' : '소식';
    const matchCat = listCategory === 'all' || itemCat === listCategory;
    const matchQ =
      !listSearch.trim() ||
      item.title.toLowerCase().includes(listSearch.toLowerCase()) ||
      formatNoticeSlug(item.id).includes(listSearch.trim());
    return matchCat && matchQ;
  });

  const currentHeadingLabel =
    HEADING_OPTIONS.find((h) => h.tag === formatState.heading)?.label || '일반 텍스트';

  const currentPermalinkPreview = editingNotice
    ? `/notice/${formatNoticeSlug(editingNotice.id)}`
    : '/notice/0001 (게시 시 자동 부여)';

  const liveHtmlForPreview =
    editorMode === 'compose' && editorRef.current
      ? editorRef.current.innerHTML
      : formHtmlContent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setOpenDropdown(null)}
    >
      <div
        className={`relative w-full flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_10px_50px_rgba(0,0,0,0.85)] overflow-hidden text-zinc-100 transition-all duration-200 ${
          isAdmin && viewMode === 'editor'
            ? 'max-w-6xl h-[93vh]'
            : 'max-w-4xl max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CSS selector 1: Modal Top Header (Blogger-style action bar when editing) */}
        <div className="px-4 sm:px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between gap-2 shrink-0">
          {isAdmin && viewMode === 'editor' ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('list');
                    setEditingNotice(null);
                    setShowPreview(false);
                  }}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="글 목록으로 돌아가기"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">글 목록</span>
                </button>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <h3 className="text-sm font-bold text-white truncate">
                    {editingNotice ? '게시물 수정' : '새 게시물 작성'}
                  </h3>
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-zinc-800 text-[10.5px] font-mono text-zinc-300 border border-zinc-700">
                    {editorMode === 'compose' ? '작성 보기' : 'HTML 보기'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Blogger Preview toggle button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!showPreview && editorMode === 'compose' && editorRef.current) {
                      setFormHtmlContent(editorRef.current.innerHTML);
                    }
                    setShowPreview((v) => !v);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showPreview
                      ? 'bg-zinc-100 text-zinc-950 border-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? '에디터로 돌아가기' : '미리보기'}</span>
                </button>

                {/* Blogger Publish / Update button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveNotice()}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 text-xs font-extrabold transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isSubmitting ? '저장 중...' : editingNotice ? '업데이트' : '게시'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSettingsSidebar((v) => !v)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    showSettingsSidebar
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                  }`}
                  title="게시물 설정 패널 열기/닫기"
                >
                  <PanelRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeAdminModal}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
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
                      ? '구글 블로그 스타일의 직관적 에디터로 공지사항을 작성·관리합니다.'
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
            </>
          )}
        </div>

        {/* CSS selector 2: Modal Body */}
        <div
          className={`flex-1 min-h-0 flex flex-col ${
            isAdmin && viewMode === 'editor' ? 'overflow-hidden' : 'overflow-y-auto p-4 sm:p-6'
          }`}
        >
          {!isAdmin ? (
            /* Login Form */
            <div className="max-w-md mx-auto w-full py-8 sm:py-12">
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
                    <label className="block text-xs font-semibold text-zinc-300">비밀번호</label>
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            /* Mode A: Blogger Dashboard Post List View */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">게시물 관리</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-amber-400 font-bold">
                    {notices.length}개
                  </span>

                  <div className="flex items-center gap-1 ml-1">
                    {(['all', '소식', '정보'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setListCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          listCategory === cat
                            ? 'bg-zinc-200 text-zinc-950'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {cat === 'all' ? '전체' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={listSearch}
                      onChange={(e) => setListSearch(e.target.value)}
                      placeholder="게시물 검색..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingNotice(null);
                      resetForm();
                      setViewMode('editor');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-amber-400/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 글 작성</span>
                  </button>
                </div>
              </div>

              {noticesError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{noticesError}</span>
                </div>
              )}

              {/* Table / List */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden">
                {isLoading && notices.length === 0 ? (
                  <div className="p-8 flex items-center justify-center gap-2 text-zinc-400 text-xs">
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>게시글 목록을 불러오는 중입니다...</span>
                  </div>
                ) : filteredAdminNotices.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    {notices.length === 0
                      ? '등록된 게시글이 없습니다. [새 글 작성]을 눌러 첫 글을 등록해보세요.'
                      : '검색 조건에 일치하는 게시물이 없습니다.'}
                  </div>
                ) : (
                  filteredAdminNotices.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setEditingNotice(item);
                        setViewMode('editor');
                      }}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/35 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                            /notice/{formatNoticeSlug(item.id)}
                          </span>
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
                      <div
                        className="flex items-center gap-1.5 self-end sm:self-center shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotice(item);
                            setViewMode('editor');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-300 text-xs font-medium transition-colors flex items-center gap-1 border border-zinc-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>편집</span>
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
            /* Mode B: Google Blogger Post Editor Clone */
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Status Banners */}
              {(saveSuccess || formError) && (
                <div className="px-4 sm:px-6 pt-3 shrink-0 space-y-2">
                  {saveSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>게시글이 성공적으로 저장되었습니다!</span>
                    </div>
                  )}
                  {formError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Blogger Title Row */}
              <div className="px-4 sm:px-6 pt-3 pb-2 shrink-0 border-b border-zinc-800/80">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="제목"
                  className="w-full bg-transparent text-lg sm:text-xl font-bold text-white placeholder-zinc-500 focus:outline-none py-1 border-b border-transparent focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Blogger Formatting Toolbar Menu Bar */}
              {!showPreview && (
                <div
                  className="px-3 sm:px-5 py-2 border-b border-zinc-800 bg-zinc-900/70 flex items-center gap-1 flex-wrap shrink-0 select-none relative z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 1. Compose View / HTML View Switcher (Blogger's leftmost dropdown) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'mode' ? null : 'mode')
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                      title="작성 보기 / HTML 보기 전환"
                    >
                      {editorMode === 'compose' ? (
                        <Pencil className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Code2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span className="hidden sm:inline">
                        {editorMode === 'compose' ? '작성 보기' : 'HTML 보기'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {openDropdown === 'mode' && (
                      <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30">
                        <button
                          type="button"
                          onClick={() => handleSwitchEditorMode('compose')}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-zinc-800 cursor-pointer ${
                            editorMode === 'compose'
                              ? 'text-amber-300 font-bold bg-zinc-800/60'
                              : 'text-zinc-200'
                          }`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>작성 보기</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchEditorMode('html')}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-zinc-800 cursor-pointer ${
                            editorMode === 'html'
                              ? 'text-amber-300 font-bold bg-zinc-800/60'
                              : 'text-zinc-200'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>HTML 보기</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="w-px h-5 bg-zinc-800 mx-1" />

                  {/* 2. Undo / Redo */}
                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('undo')}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="실행 취소 (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('redo')}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="다시 실행 (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-zinc-800 mx-1" />

                  {/* 3. Font Family Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'font' ? null : 'font')
                      }
                      className="px-2 py-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-200 flex items-center gap-1 cursor-pointer"
                      title="글꼴"
                    >
                      <span className="max-w-[72px] truncate">글꼴</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {openDropdown === 'font' && (
                      <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30">
                        {FONT_FAMILIES.map((f) => (
                          <button
                            key={f.label}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              execComposeCommand('fontName', f.value);
                              setOpenDropdown(null);
                            }}
                            style={{ fontFamily: f.value }}
                            className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 hover:text-amber-300 cursor-pointer"
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Font Size Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'size' ? null : 'size')
                      }
                      className="px-2 py-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-200 flex items-center gap-1 cursor-pointer"
                      title="글자 크기"
                    >
                      <span>크기</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {openDropdown === 'size' && (
                      <div className="absolute left-0 top-full mt-1 w-36 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30">
                        {FONT_SIZES.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              execComposeCommand('fontSize', s.value);
                              setOpenDropdown(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:bg-zinc-800 hover:text-amber-300 cursor-pointer"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. Paragraph / Heading Format Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'heading' ? null : 'heading')
                      }
                      className="px-2 py-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-xs font-medium text-zinc-200 flex items-center gap-1 border border-zinc-800 cursor-pointer"
                      title="단락 스타일"
                    >
                      <span>{currentHeadingLabel}</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {openDropdown === 'heading' && (
                      <div className="absolute left-0 top-full mt-1 w-40 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30">
                        {HEADING_OPTIONS.map((opt) => (
                          <button
                            key={opt.tag}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              execComposeCommand('formatBlock', `<${opt.tag}>`);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-zinc-800 cursor-pointer ${
                              formatState.heading === opt.tag
                                ? 'text-amber-300 font-bold bg-zinc-800/60'
                                : 'text-zinc-200'
                            } ${
                              opt.tag === 'h1'
                                ? 'text-base font-extrabold'
                                : opt.tag === 'h2'
                                  ? 'text-sm font-bold'
                                  : opt.tag === 'h3'
                                    ? 'text-xs font-bold'
                                    : 'text-xs'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-px h-5 bg-zinc-800 mx-1" />

                  {/* 6. Inline Formatting: Bold, Italic, Underline, Strikethrough */}
                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('bold')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.bold
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="굵게 (B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('italic')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.italic
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="기울임꼴 (I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('underline')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.underline
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="밑줄 (U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('strikeThrough')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.strike
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="취소선"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>

                  {/* Text Color */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'textColor' ? null : 'textColor')
                      }
                      className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white cursor-pointer"
                      title="텍스트 색상"
                    >
                      <Palette className="w-4 h-4 text-amber-400" />
                    </button>

                    {openDropdown === 'textColor' && (
                      <div className="absolute left-0 top-full mt-1 w-48 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-2.5 z-30">
                        <div className="text-[10.5px] font-semibold text-zinc-400 mb-2">
                          텍스트 색상
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {TEXT_COLOR_SWATCHES.map((swatch) => (
                            <button
                              key={swatch.value}
                              type="button"
                              title={swatch.label}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                execComposeCommand('foreColor', swatch.value);
                                setOpenDropdown(null);
                              }}
                              className="w-7 h-7 rounded-md border border-zinc-700 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: swatch.value }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Highlight Color */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'bgColor' ? null : 'bgColor')
                      }
                      className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white cursor-pointer"
                      title="텍스트 배경색 (형광펜)"
                    >
                      <Highlighter className="w-4 h-4" />
                    </button>

                    {openDropdown === 'bgColor' && (
                      <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-2.5 z-30">
                        <div className="text-[10.5px] font-semibold text-zinc-400 mb-2">
                          텍스트 배경색
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {HIGHLIGHT_SWATCHES.map((swatch) => (
                            <button
                              key={swatch.label}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                execComposeCommand('hiliteColor', swatch.value);
                                setOpenDropdown(null);
                              }}
                              className="px-2 py-1 rounded text-[10.5px] text-zinc-200 border border-zinc-700 hover:border-amber-400 cursor-pointer truncate"
                              style={{ backgroundColor: swatch.value }}
                            >
                              {swatch.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-px h-5 bg-zinc-800 mx-1" />

                  {/* 7. Insert Link, Image, Video (Works in both Compose & HTML mode) */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      saveSelection();
                    }}
                    onClick={handleOpenLinkDialog}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
                    title="링크 삽입 또는 수정"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      saveSelection();
                    }}
                    onClick={handleOpenImageDialog}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
                    title="이미지 삽입"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      saveSelection();
                    }}
                    onClick={handleOpenVideoDialog}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
                    title="동영상 삽입 (유튜브)"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-zinc-800 mx-1" />

                  {/* 8. Alignment Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={editorMode !== 'compose'}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === 'align' ? null : 'align')
                      }
                      className="px-2 py-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      title="정렬"
                    >
                      {formatState.align === 'center' ? (
                        <AlignCenter className="w-4 h-4" />
                      ) : formatState.align === 'right' ? (
                        <AlignRight className="w-4 h-4" />
                      ) : formatState.align === 'justify' ? (
                        <AlignJustify className="w-4 h-4" />
                      ) : (
                        <AlignLeft className="w-4 h-4" />
                      )}
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {openDropdown === 'align' && (
                      <div className="absolute left-0 top-full mt-1 w-32 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30">
                        {[
                          { label: '왼쪽 맞춤', cmd: 'justifyLeft', Icon: AlignLeft },
                          { label: '가운데 맞춤', cmd: 'justifyCenter', Icon: AlignCenter },
                          { label: '오른쪽 맞춤', cmd: 'justifyRight', Icon: AlignRight },
                          { label: '양쪽 맞춤', cmd: 'justifyFull', Icon: AlignJustify },
                        ].map(({ label, cmd, Icon }) => (
                          <button
                            key={cmd}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              execComposeCommand(cmd);
                              setOpenDropdown(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:bg-zinc-800 hover:text-amber-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 9. Lists, Blockquote, Divider, Clear Formatting */}
                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('insertUnorderedList')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.ul
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="글머리 기호 목록"
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('insertOrderedList')}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                      formatState.ol
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="번호 매기기 목록"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('formatBlock', '<blockquote>')}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="텍스트 인용"
                  >
                    <Quote className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      saveSelection();
                    }}
                    onClick={() => insertHtmlAtCursor('<hr /><p><br></p>')}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="가로 구분선 삽입"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={editorMode !== 'compose'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execComposeCommand('removeFormat')}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="서식 지우기"
                  >
                    <RemoveFormatting className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Split Workspace: Main Canvas + Right Blogger Settings Panel */}
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                {/* Main Writing / HTML / Preview Canvas */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0b0b0e]">
                  {showPreview ? (
                    /* Reader Preview View */
                    <div className="max-w-3xl mx-auto rounded-xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-5 shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              formCategory === '정보'
                                ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                                : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            }`}
                          >
                            {formCategory}
                          </span>
                          {formPinned && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-400 text-zinc-950 flex items-center gap-1">
                              <Pin className="w-3 h-3 rotate-45" /> 상단 고정
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-zinc-400">{formDate}</span>
                      </div>

                      <h1 className="text-2xl font-extrabold text-white">
                        {formTitle || '(제목 없음)'}
                      </h1>

                      <article
                        dangerouslySetInnerHTML={{
                          __html: formatNoticeContent(liveHtmlForPreview),
                        }}
                        className="space-y-3 text-sm sm:text-base text-zinc-200 leading-relaxed [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h1,&_h2,&_h3,&_h4]:font-bold [&_h1,&_h2,&_h3,&_h4]:text-white [&_strong]:text-white [&_b]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-3 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:max-w-full [&_img]:rounded-lg [&_hr]:border-zinc-800 [&_hr]:my-4 [&_s]:line-through [&_iframe]:w-[80%] [&_iframe]:max-w-[720px] [&_iframe]:mx-auto [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-3 [&_[data-youtube-embed]]:!w-[80%] [&_[data-youtube-embed]]:!max-w-[720px] [&_[data-youtube-embed]]:!mx-auto [&_[data-youtube-embed]]:!h-auto [&_[data-youtube-embed]]:!pb-0 [&_[data-youtube-embed]]:aspect-video [&_[data-youtube-embed]_iframe]:!static [&_[data-youtube-embed]_iframe]:!w-full [&_[data-youtube-embed]_iframe]:!h-full [&_[data-youtube-embed]_iframe]:!my-0"
                      />
                    </div>
                  ) : editorMode === 'compose' ? (
                    /* Blogger Compose View (WYSIWYG Rich Text Sheet) */
                    <div className="max-w-3xl mx-auto rounded-xl bg-zinc-950 border border-zinc-800/90 shadow-lg min-h-[380px] p-5 sm:p-8">
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={syncHtmlFromCompose}
                        onPaste={handleComposePaste}
                        onKeyUp={refreshFormatState}
                        onMouseUp={refreshFormatState}
                        onBlur={saveSelection}
                        data-placeholder="여기에 내용을 입력하세요. 유튜브 링크를 붙여넣거나 위 동영상 버튼으로 여러 개의 유튜브 영상을 바로 삽입할 수 있습니다."
                        className="min-h-[320px] outline-none text-sm sm:text-base text-zinc-100 leading-relaxed font-sans space-y-3 empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-500 empty:before:pointer-events-none [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h1,&_h2,&_h3,&_h4]:font-bold [&_h1,&_h2,&_h3,&_h4]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-3 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-zinc-300 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3 [&_hr]:border-zinc-700 [&_hr]:my-4 [&_s]:line-through [&_iframe]:w-[80%] [&_iframe]:max-w-[720px] [&_iframe]:mx-auto [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-3 [&_[data-youtube-embed]]:!w-[80%] [&_[data-youtube-embed]]:!max-w-[720px] [&_[data-youtube-embed]]:!mx-auto [&_[data-youtube-embed]]:!h-auto [&_[data-youtube-embed]]:!pb-0 [&_[data-youtube-embed]]:aspect-video [&_[data-youtube-embed]_iframe]:!static [&_[data-youtube-embed]_iframe]:!w-full [&_[data-youtube-embed]_iframe]:!h-full [&_[data-youtube-embed]_iframe]:!my-0"
                      />
                    </div>
                  ) : (
                    /* Blogger HTML View */
                    <div className="max-w-3xl mx-auto h-full flex flex-col">
                      <textarea
                        ref={htmlTextareaRef}
                        value={formHtmlContent}
                        onChange={(e) => setFormHtmlContent(e.target.value)}
                        placeholder="<p>HTML 코드를 직접 입력하거나 수정할 수 있습니다.</p>"
                        className="w-full min-h-[380px] flex-1 p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-amber-100 placeholder-zinc-500 font-mono leading-relaxed focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  )}
                </div>

                {/* Right Blogger "게시물 설정" Sidebar */}
                {showSettingsSidebar && (
                  <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-950 overflow-y-auto shrink-0 divide-y divide-zinc-800/80 max-h-64 lg:max-h-none">
                    <div className="px-4 py-3 flex items-center gap-2 bg-zinc-900/50">
                      <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-zinc-200 tracking-tight">
                        게시물 설정
                      </span>
                    </div>

                    {/* 1. 라벨 (분류) */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSettingSections((s) => ({ ...s, labels: !s.labels }))
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-zinc-400" />
                          <span>라벨 (분류)</span>
                        </span>
                        {openSettingSections.labels ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>

                      {openSettingSections.labels && (
                        <div className="mt-2.5 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormCategory('소식')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
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
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              formCategory === '정보'
                                ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                            }`}
                          >
                            정보
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. 게시일 */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSettingSections((s) => ({ ...s, published: !s.published }))
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>게시일</span>
                        </span>
                        {openSettingSections.published ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>

                      {openSettingSections.published && (
                        <div className="mt-2.5 space-y-2">
                          <input
                            type="text"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            placeholder="2026.11.15"
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setFormDate(getTodayFormatted())}
                            className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                          >
                            오늘 날짜로 설정
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. 고유 링크 (Permalink) */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSettingSections((s) => ({ ...s, permalink: !s.permalink }))
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <PermalinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                          <span>고유 링크 (SEO)</span>
                        </span>
                        {openSettingSections.permalink ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>

                      {openSettingSections.permalink && (
                        <div className="mt-2 px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 break-all">
                          {currentPermalinkPreview}
                        </div>
                      )}
                    </div>

                    {/* 4. 유튜브 영상 삽입 (여러 개 추가 가능) — aside > div:nth-of-type(5) */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSettingSections((s) => ({ ...s, youtube: !s.youtube }))
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Youtube className="w-3.5 h-3.5 text-red-400" />
                          <span>유튜브 영상 삽입 (여러 개)</span>
                        </span>
                        {openSettingSections.youtube ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>

                      {openSettingSections.youtube && (
                        <div className="mt-2.5 space-y-2.5">
                          <textarea
                            rows={2}
                            value={sidebarVideoInput}
                            onChange={(e) => {
                              setSidebarVideoInput(e.target.value);
                              if (sidebarVideoError) setSidebarVideoError('');
                            }}
                            placeholder="유튜브 링크를 붙여넣으세요 (줄바꿈으로 여러 개 가능)"
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono resize-none"
                          />
                          {sidebarVideoError && (
                            <p className="text-[11px] text-rose-400">{sidebarVideoError}</p>
                          )}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              insertYoutubeVideosIntoBody(
                                sidebarVideoInput,
                                () => setSidebarVideoInput(''),
                                (msg) => setSidebarVideoError(msg)
                              )
                            }
                            className="w-full py-1.5 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>본문에 영상 추가</span>
                          </button>

                          {(() => {
                            const embeddedIds = extractEmbeddedYoutubeIds([liveHtmlForPreview]);
                            if (embeddedIds.length === 0) return null;
                            return (
                              <div className="pt-1 space-y-1.5">
                                <div className="text-[10.5px] font-semibold text-zinc-400">
                                  본문에 삽입된 영상 ({embeddedIds.length}개)
                                </div>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                  {embeddedIds.map((vid, idx) => (
                                    <div
                                      key={vid}
                                      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <img
                                          src={`https://img.youtube.com/vi/${vid}/default.jpg`}
                                          alt={`YouTube ${vid}`}
                                          className="w-8 h-6 rounded object-cover shrink-0 bg-black"
                                        />
                                        <span className="font-mono text-zinc-300 truncate">
                                          #{idx + 1} {vid}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveEmbeddedVideo(vid)}
                                        className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer shrink-0"
                                        title="본문에서 이 영상 제거"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* 5. 옵션 (상단 고정) */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSettingSections((s) => ({ ...s, options: !s.options }))
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Pin className="w-3.5 h-3.5 text-amber-400" />
                          <span>옵션</span>
                        </span>
                        {openSettingSections.options ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>

                      {openSettingSections.options && (
                        <label className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formPinned}
                            onChange={(e) => setFormPinned(e.target.checked)}
                            className="w-4 h-4 rounded accent-amber-400"
                          />
                          <span className="text-xs font-semibold text-zinc-200">
                            상단 고정 (중요 공지)
                          </span>
                        </label>
                      )}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blogger Link Dialog Modal */}
      {showLinkDialog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setShowLinkDialog(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl space-y-4 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-amber-400" />
                <span>링크 삽입 또는 수정</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">표시할 텍스트</label>
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
                  붙여넣기하거나 링크를 검색하세요
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <span>새 창에서 이 링크 열기</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 text-xs font-bold cursor-pointer"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogger Image Insert Dialog Modal */}
      {showImageDialog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setShowImageDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl space-y-4 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ImagePlus className="w-4 h-4 text-amber-400" />
                <span>이미지 삽입</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`py-1.5 rounded-md font-bold cursor-pointer transition-colors ${
                  imageTab === 'upload'
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                컴퓨터에서 업로드
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`py-1.5 rounded-md font-bold cursor-pointer transition-colors ${
                  imageTab === 'url'
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                URL로 추가
              </button>
            </div>

            {imageError && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              {imageTab === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 rounded-xl border border-dashed border-zinc-700 hover:border-amber-400 bg-zinc-950 flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-semibold">파일 선택 (최대 1.5MB)</span>
                  </button>
                  {imageUrl && (
                    <div className="mt-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                      <img
                        src={imageUrl}
                        alt="미리보기"
                        className="max-h-32 mx-auto rounded object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">이미지 URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  이미지 설명 (선택 - SEO alt 텍스트)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="이미지를 설명하는 문구"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmImage}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 text-xs font-bold cursor-pointer"
              >
                선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogger Video Insert Dialog Modal (Supports Multiple YouTube Videos) */}
      {showVideoDialog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setShowVideoDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl space-y-4 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-400" />
                <span>유튜브 동영상 삽입 (여러 개 가능)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowVideoDialog(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {videoError && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">
                  유튜브 링크 또는 ID (줄바꿈으로 여러 개 한 번에 삽입 가능)
                </label>
                <textarea
                  rows={4}
                  value={videoInput}
                  onChange={(e) => {
                    setVideoInput(e.target.value);
                    if (videoError) setVideoError('');
                  }}
                  placeholder={`https://www.youtube.com/watch?v=...\nhttps://youtu.be/...`}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                />
              </div>

              {(() => {
                const detected = parseMultipleYoutubeInputs(videoInput);
                if (detected.length === 0) return null;
                return (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold text-emerald-400">
                      감지된 유튜브 영상 {detected.length}개 (글 본문에 바로 재생 플레이어로 삽입됩니다)
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                      {detected.map((vid) => (
                        <div
                          key={vid}
                          className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center gap-2 p-1.5"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
                            alt={vid}
                            className="w-12 h-8 rounded object-cover shrink-0 bg-black"
                          />
                          <span className="font-mono text-[10.5px] text-zinc-300 truncate">
                            {vid}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVideoDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmVideo}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 text-xs font-bold cursor-pointer"
              >
                본문에 삽입
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
                &ldquo;<span className="text-white font-semibold">{deleteTarget.title}</span>&rdquo;
                <br />
                글을 삭제하시겠습니까?
              </p>
              <p className="text-[11px] text-rose-400 mt-1 font-medium">
                삭제된 글은 복구할 수 없습니다.
              </p>
              {deleteError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left mt-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError('');
                }}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? '삭제 중...' : '삭제하기'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
