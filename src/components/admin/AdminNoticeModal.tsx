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
  Columns2,
  Columns3,
  LayoutGrid,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

type EditorMode = 'compose' | 'html';
type HeadingLevel = 'p' | 'h1' | 'h2' | 'h3' | 'h4';
type ImageAlignOption = 'left' | 'center' | 'right' | 'float-left' | 'float-right';
type ImageLayoutMode = ImageAlignOption | 'grid-2' | 'grid-3';
type ImageAspectOption = 'auto' | '1/1' | '4/3' | '16/9';
type ImageGapOption = 6 | 12 | 18;

interface PendingImageSlot {
  id: string;
  src: string;
  alt: string;
}

interface SelectedImageState {
  widthPercent: number;
  align: ImageAlignOption;
  inGrid: boolean;
  gridCols: 2 | 3;
  aspect: ImageAspectOption;
  gap: ImageGapOption;
  slotIndex: number;
  totalInGrid: number;
  src: string;
  alt: string;
}

function createEmptyImageSlot(): PendingImageSlot {
  return {
    id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    src: '',
    alt: '',
  };
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSingleImageFigureStyle(widthPercent: number, align: ImageAlignOption): string {
  const w = Math.min(100, Math.max(15, Math.round(widthPercent)));
  if (align === 'left') {
    return `width: ${w}%; max-width: 100%; margin: 16px auto 16px 0; text-align: left;`;
  }
  if (align === 'right') {
    return `width: ${w}%; max-width: 100%; margin: 16px 0 16px auto; text-align: right;`;
  }
  if (align === 'float-left') {
    return `width: ${w}%; max-width: 100%; float: left; margin: 6px 20px 14px 0;`;
  }
  if (align === 'float-right') {
    return `width: ${w}%; max-width: 100%; float: right; margin: 6px 0 14px 20px;`;
  }
  return `width: ${w}%; max-width: 100%; margin: 16px auto; text-align: center;`;
}

function buildSingleImageHtml(
  src: string,
  alt: string,
  widthPercent: number,
  align: ImageAlignOption
): string {
  const w = Math.min(100, Math.max(15, Math.round(widthPercent)));
  const safeSrc = escapeHtmlAttr(src);
  const safeAlt = escapeHtmlAttr(alt);
  const figStyle = buildSingleImageFigureStyle(w, align);
  return `<figure data-image-block="single" data-align="${align}" data-width="${w}" style="${figStyle}"><img src="${safeSrc}" alt="${safeAlt}" style="width: 100%; height: auto; display: block; border-radius: 10px;" /></figure>`;
}

function buildImageGridStyle(
  cols: 2 | 3,
  widthPercent: number,
  gap: ImageGapOption,
  align: ImageAlignOption
): string {
  const w = Math.min(100, Math.max(30, Math.round(widthPercent)));
  const margin =
    align === 'left'
      ? 'margin: 16px auto 16px 0;'
      : align === 'right'
        ? 'margin: 16px 0 16px auto;'
        : 'margin: 16px auto;';
  return `display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: ${gap}px; width: ${w}%; max-width: 100%; ${margin}`;
}

function buildGridImgStyle(aspect: ImageAspectOption): string {
  if (aspect === 'auto') {
    return 'width: 100%; height: auto; display: block; border-radius: 10px;';
  }
  return `width: 100%; aspect-ratio: ${aspect}; object-fit: cover; display: block; border-radius: 10px;`;
}

function buildGridSlotFigureHtml(src: string, alt: string, aspect: ImageAspectOption): string {
  const safeSrc = escapeHtmlAttr(src);
  const safeAlt = escapeHtmlAttr(alt);
  return `<figure style="margin: 0; overflow: hidden; border-radius: 10px;"><img src="${safeSrc}" alt="${safeAlt}" style="${buildGridImgStyle(aspect)}" /></figure>`;
}

function buildImageGridHtml(
  items: { src: string; alt: string }[],
  cols: 2 | 3,
  widthPercent: number,
  aspect: ImageAspectOption,
  gap: ImageGapOption,
  fallbackAlt: string,
  align: ImageAlignOption = 'center'
): string {
  const w = Math.min(100, Math.max(30, Math.round(widthPercent)));
  const gridAlign: ImageAlignOption = align === 'left' || align === 'right' ? align : 'center';
  const gridStyle = buildImageGridStyle(cols, w, gap, gridAlign);
  const figures = items
    .map((item, idx) =>
      buildGridSlotFigureHtml(item.src, item.alt.trim() || `${fallbackAlt} ${idx + 1}`, aspect)
    )
    .join('');
  return `<div data-image-grid="${cols}" data-grid-width="${w}" data-aspect="${aspect}" data-gap="${gap}" data-align="${gridAlign}" style="${gridStyle}">${figures}</div>`;
}

async function readAndOptimizeImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('12MB 이하의 이미지 파일을 선택해 주세요.');
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('파일을 읽지 못했습니다.'));
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });

  // Preserve GIF animation, SVG vector, or already compact images
  if (
    file.type === 'image/gif' ||
    file.type === 'image/svg+xml' ||
    file.size <= 350 * 1024
  ) {
    return rawDataUrl;
  }

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('이미지 디코딩 실패'));
      el.src = rawDataUrl;
    });

    const maxDim = 1280;
    let targetW = img.naturalWidth || img.width;
    let targetH = img.naturalHeight || img.height;
    if (targetW > maxDim || targetH > maxDim) {
      const scale = Math.min(maxDim / targetW, maxDim / targetH);
      targetW = Math.max(1, Math.round(targetW * scale));
      targetH = Math.max(1, Math.round(targetH * scale));
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawDataUrl;

    ctx.drawImage(img, 0, 0, targetW, targetH);
    const preferredMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
    const compressed = canvas.toDataURL(preferredMime, 0.84);
    if (compressed && compressed.length < rawDataUrl.length) {
      return compressed;
    }
    return rawDataUrl;
  } catch {
    return rawDataUrl;
  }
}

function parsePercentValue(raw?: string | null, fallback = 100): number {
  if (!raw) return fallback;
  const match = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) return Math.min(100, Math.max(15, Math.round(Number(match[1]))));
  if (/^\d+$/.test(raw.trim())) {
    return Math.min(100, Math.max(15, Math.round(Number(raw.trim()))));
  }
  return fallback;
}

function extractSelectedImageState(imgEl: HTMLImageElement): SelectedImageState {
  const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;
  if (gridEl) {
    const rawCols = Number(gridEl.getAttribute('data-image-grid'));
    const gridCols: 2 | 3 = rawCols === 2 ? 2 : 3;
    const widthPercent = parsePercentValue(
      gridEl.getAttribute('data-grid-width') || gridEl.style.width,
      100
    );
    const rawAspect = gridEl.getAttribute('data-aspect') || imgEl.style.aspectRatio || 'auto';
    const aspect: ImageAspectOption =
      rawAspect === '1/1' || rawAspect === '4/3' || rawAspect === '16/9' ? rawAspect : 'auto';
    const rawGap = Number(gridEl.getAttribute('data-gap'));
    const gap: ImageGapOption = rawGap === 6 ? 6 : rawGap === 18 ? 18 : 12;
    const rawAlign = gridEl.getAttribute('data-align');
    const align: ImageAlignOption =
      rawAlign === 'left' || rawAlign === 'right' ? rawAlign : 'center';
    const gridImgs = Array.from(gridEl.querySelectorAll('img'));
    const slotIndex = Math.max(0, gridImgs.indexOf(imgEl));
    return {
      widthPercent,
      align,
      inGrid: true,
      gridCols,
      aspect,
      gap,
      slotIndex,
      totalInGrid: gridImgs.length,
      src: imgEl.getAttribute('src') || '',
      alt: imgEl.getAttribute('alt') || '',
    };
  }

  const figEl = imgEl.closest('figure') as HTMLElement | null;
  const widthPercent = parsePercentValue(
    figEl?.getAttribute('data-width') || figEl?.style.width || imgEl.style.width,
    100
  );
  const rawAlign = figEl?.getAttribute('data-align');
  let align: ImageAlignOption = 'center';
  if (
    rawAlign === 'left' ||
    rawAlign === 'center' ||
    rawAlign === 'right' ||
    rawAlign === 'float-left' ||
    rawAlign === 'float-right'
  ) {
    align = rawAlign;
  } else if (figEl) {
    if (figEl.style.cssFloat === 'left') align = 'float-left';
    else if (figEl.style.cssFloat === 'right') align = 'float-right';
    else if (figEl.style.textAlign === 'left') align = 'left';
    else if (figEl.style.textAlign === 'right') align = 'right';
  }

  return {
    widthPercent,
    align,
    inGrid: false,
    gridCols: 3,
    aspect: 'auto',
    gap: 12,
    slotIndex: 0,
    totalInGrid: 1,
    src: imgEl.getAttribute('src') || '',
    alt: imgEl.getAttribute('alt') || '',
  };
}

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
  const [imageLayoutMode, setImageLayoutMode] = useState<ImageLayoutMode>('center');
  const [imageWidthPercent, setImageWidthPercent] = useState<number>(100);
  const [imageAspect, setImageAspect] = useState<ImageAspectOption>('4/3');
  const [imageGap, setImageGap] = useState<ImageGapOption>(12);
  const [imageGridAlign, setImageGridAlign] = useState<'left' | 'center' | 'right'>('center');
  const [imageSlots, setImageSlots] = useState<PendingImageSlot[]>([createEmptyImageSlot()]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [showBulkUrlBox, setShowBulkUrlBox] = useState(false);
  const [bulkUrlInput, setBulkUrlInput] = useState('');
  const [imageError, setImageError] = useState('');
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Selected image inside Compose editor (contextual resize/position/grid bar)
  const [selectedImgState, setSelectedImgState] = useState<SelectedImageState | null>(null);

  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [videoError, setVideoError] = useState('');
  const [sidebarVideoInput, setSidebarVideoInput] = useState('');
  const [sidebarVideoError, setSidebarVideoError] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const slotUploadTargetIdxRef = useRef<number>(0);
  const selectedImgElRef = useRef<HTMLImageElement | null>(null);
  const appendGridTargetElRef = useRef<HTMLElement | null>(null);

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
    selectedImgElRef.current = null;
    setSelectedImgState(null);
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
    selectedImgElRef.current = null;
    setSelectedImgState(null);
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

  // Open Image Dialog (Supports single resize/align + 2/3-column row grid + upload/URL)
  const openImageModalWithConfig = (
    targetGridEl: HTMLElement | null = null,
    presetLayout: ImageLayoutMode = 'center'
  ) => {
    setOpenDropdown(null);
    saveSelection();
    appendGridTargetElRef.current = targetGridEl;

    if (targetGridEl) {
      const cols = Number(targetGridEl.getAttribute('data-image-grid')) === 2 ? 2 : 3;
      const existingWidth = parsePercentValue(
        targetGridEl.getAttribute('data-grid-width') || targetGridEl.style.width,
        100
      );
      const rawAspect = targetGridEl.getAttribute('data-aspect') || '4/3';
      const aspect: ImageAspectOption =
        rawAspect === '1/1' || rawAspect === '4/3' || rawAspect === '16/9' || rawAspect === 'auto'
          ? rawAspect
          : '4/3';
      const rawGap = Number(targetGridEl.getAttribute('data-gap'));
      const gap: ImageGapOption = rawGap === 6 ? 6 : rawGap === 18 ? 18 : 12;
      const existingCount = targetGridEl.querySelectorAll('img').length;
      const neededSlots = Math.max(1, cols - existingCount);

      setImageLayoutMode(cols === 2 ? 'grid-2' : 'grid-3');
      setImageWidthPercent(existingWidth);
      setImageAspect(aspect);
      setImageGap(gap);
      setImageGridAlign('center');
      setImageSlots(Array.from({ length: neededSlots }, () => createEmptyImageSlot()));
    } else {
      setImageLayoutMode(presetLayout);
      setImageWidthPercent(presetLayout === 'float-left' || presetLayout === 'float-right' ? 45 : 100);
      setImageAspect('4/3');
      setImageGap(12);
      setImageGridAlign('center');
      const slotCount = presetLayout === 'grid-3' ? 3 : presetLayout === 'grid-2' ? 2 : 1;
      setImageSlots(Array.from({ length: slotCount }, () => createEmptyImageSlot()));
    }

    setActiveSlotIndex(0);
    setShowBulkUrlBox(false);
    setBulkUrlInput('');
    setImageError('');
    setImageTab('upload');
    setShowImageDialog(true);
  };

  const handleOpenImageDialog = () => {
    openImageModalWithConfig(null, 'center');
  };

  const handleChangeImageLayoutMode = (nextMode: ImageLayoutMode) => {
    setImageLayoutMode(nextMode);
    setImageError('');
    if (nextMode === 'float-left' || nextMode === 'float-right') {
      if (imageWidthPercent > 75) setImageWidthPercent(45);
    }
    const minSlots = nextMode === 'grid-3' ? 3 : nextMode === 'grid-2' ? 2 : 1;
    setImageSlots((prev) => {
      if (prev.length >= minSlots) return prev;
      return [
        ...prev,
        ...Array.from({ length: minSlots - prev.length }, () => createEmptyImageSlot()),
      ];
    });
  };

  const handleMultipleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    setImageError('');
    setIsProcessingImages(true);
    try {
      const processed: { src: string; alt: string }[] = [];
      for (const file of files) {
        const dataUrl = await readAndOptimizeImageFile(file);
        const cleanName = file.name.replace(/\.[^.]+$/, '');
        processed.push({ src: dataUrl, alt: cleanName });
      }

      if (!appendGridTargetElRef.current) {
        if (processed.length === 2 && !imageLayoutMode.startsWith('grid-')) {
          setImageLayoutMode('grid-2');
        } else if (processed.length >= 3 && !imageLayoutMode.startsWith('grid-')) {
          setImageLayoutMode('grid-3');
        }
      }

      setImageSlots((prev) => {
        const next = [...prev];
        let cursor = 0;
        // Fill empty slots first
        for (let i = 0; i < next.length && cursor < processed.length; i++) {
          if (!next[i].src.trim()) {
            next[i] = {
              ...next[i],
              src: processed[cursor].src,
              alt: next[i].alt || processed[cursor].alt,
            };
            cursor++;
          }
        }
        // Append any extra files as new slots
        while (cursor < processed.length) {
          next.push({
            id: `slot-${Date.now()}-${cursor}-${Math.random().toString(36).slice(2, 6)}`,
            src: processed[cursor].src,
            alt: processed[cursor].alt,
          });
          cursor++;
        }
        return next;
      });
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleSingleSlotFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const targetIdx = slotUploadTargetIdxRef.current;
    setImageError('');
    setIsProcessingImages(true);
    try {
      const dataUrl = await readAndOptimizeImageFile(file);
      const cleanName = file.name.replace(/\.[^.]+$/, '');
      setImageSlots((prev) =>
        prev.map((slot, idx) =>
          idx === targetIdx
            ? { ...slot, src: dataUrl, alt: slot.alt || cleanName }
            : slot
        )
      );
      setActiveSlotIndex(targetIdx);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleApplyBulkUrls = () => {
    const urls = bulkUrlInput
      .split(/\n+/)
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//i.test(u) || u.startsWith('data:image/'));
    if (urls.length === 0) {
      setImageError('올바른 이미지 URL(https://...)을 한 줄에 하나씩 입력해주세요.');
      return;
    }
    setImageError('');

    if (!appendGridTargetElRef.current) {
      if (urls.length === 2 && !imageLayoutMode.startsWith('grid-')) {
        setImageLayoutMode('grid-2');
      } else if (urls.length >= 3 && !imageLayoutMode.startsWith('grid-')) {
        setImageLayoutMode('grid-3');
      }
    }

    setImageSlots((prev) => {
      const next = [...prev];
      let cursor = 0;
      for (let i = 0; i < next.length && cursor < urls.length; i++) {
        if (!next[i].src.trim()) {
          next[i] = { ...next[i], src: urls[cursor] };
          cursor++;
        }
      }
      while (cursor < urls.length) {
        next.push({
          id: `slot-${Date.now()}-${cursor}-${Math.random().toString(36).slice(2, 6)}`,
          src: urls[cursor],
          alt: '',
        });
        cursor++;
      }
      return next;
    });
    setBulkUrlInput('');
    setShowBulkUrlBox(false);
  };

  const handleMoveImageSlot = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    setImageSlots((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleConfirmImage = () => {
    const validItems = imageSlots
      .map((slot) => ({ src: slot.src.trim(), alt: slot.alt.trim() }))
      .filter((slot) => slot.src.length > 0);

    if (validItems.length === 0) {
      setImageError('최소 1개 이상의 이미지를 업로드하거나 URL을 입력해주세요.');
      return;
    }

    const fallbackAlt = formTitle.trim() || '공지 이미지';

    // Case A: Appending new images directly into an existing grid row in Compose editor
    if (
      appendGridTargetElRef.current &&
      editorRef.current &&
      editorRef.current.contains(appendGridTargetElRef.current)
    ) {
      const gridEl = appendGridTargetElRef.current;
      const rawAspect = gridEl.getAttribute('data-aspect') || imageAspect;
      const aspect: ImageAspectOption =
        rawAspect === '1/1' || rawAspect === '4/3' || rawAspect === '16/9' || rawAspect === 'auto'
          ? rawAspect
          : '4/3';
      const existingCount = gridEl.querySelectorAll('img').length;
      validItems.forEach((item, idx) => {
        const temp = document.createElement('div');
        temp.innerHTML = buildGridSlotFigureHtml(
          item.src,
          item.alt || `${fallbackAlt} ${existingCount + idx + 1}`,
          aspect
        );
        const newFig = temp.firstElementChild;
        if (newFig) gridEl.appendChild(newFig);
      });
      syncHtmlFromCompose();
      if (selectedImgElRef.current && gridEl.contains(selectedImgElRef.current)) {
        setSelectedImgState(extractSelectedImageState(selectedImgElRef.current));
      }
      appendGridTargetElRef.current = null;
      setShowImageDialog(false);
      return;
    }

    // Case B: Inserting fresh single or multi-column grid images
    let htmlToInsert = '';
    if (imageLayoutMode === 'grid-2' || imageLayoutMode === 'grid-3') {
      const cols: 2 | 3 = imageLayoutMode === 'grid-2' ? 2 : 3;
      htmlToInsert =
        buildImageGridHtml(
          validItems,
          cols,
          imageWidthPercent,
          imageAspect,
          imageGap,
          fallbackAlt,
          imageGridAlign
        ) + '<p><br></p>';
    } else if (validItems.length === 1) {
      htmlToInsert =
        buildSingleImageHtml(
          validItems[0].src,
          validItems[0].alt || fallbackAlt,
          imageWidthPercent,
          imageLayoutMode
        ) + '<p><br></p>';
    } else {
      // Multiple images provided while in single layout -> stack cleanly with chosen width & alignment
      htmlToInsert =
        validItems
          .map((item, idx) =>
            buildSingleImageHtml(
              item.src,
              item.alt || `${fallbackAlt} ${idx + 1}`,
              imageWidthPercent,
              imageLayoutMode
            )
          )
          .join('') + '<p><br></p>';
    }

    insertHtmlAtCursor(htmlToInsert);
    appendGridTargetElRef.current = null;
    setShowImageDialog(false);
  };

  // Interactive Compose Image Selection & Contextual Editing Handlers
  const handleComposeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.tagName === 'IMG') {
      const imgEl = target as HTMLImageElement;
      selectedImgElRef.current = imgEl;
      setSelectedImgState(extractSelectedImageState(imgEl));
      return;
    }
    if (selectedImgElRef.current) {
      selectedImgElRef.current = null;
      setSelectedImgState(null);
    }
  };

  const ensureWrappedSingleFigure = (imgEl: HTMLImageElement): HTMLElement => {
    const existingFig = imgEl.closest('figure') as HTMLElement | null;
    if (existingFig) {
      if (!existingFig.getAttribute('data-image-block')) {
        existingFig.setAttribute('data-image-block', 'single');
      }
      return existingFig;
    }
    const fig = document.createElement('figure');
    fig.setAttribute('data-image-block', 'single');
    fig.setAttribute('data-align', 'center');
    fig.setAttribute('data-width', '100');
    fig.setAttribute('style', buildSingleImageFigureStyle(100, 'center'));
    imgEl.parentNode?.insertBefore(fig, imgEl);
    fig.appendChild(imgEl);
    imgEl.style.width = '100%';
    imgEl.style.height = 'auto';
    imgEl.style.display = 'block';
    imgEl.style.borderRadius = '10px';
    return fig;
  };

  const applySelectedImageWidth = (nextWidth: number) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const w = Math.min(100, Math.max(15, Math.round(nextWidth)));
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;

    if (gridEl) {
      const cols: 2 | 3 = Number(gridEl.getAttribute('data-image-grid')) === 2 ? 2 : 3;
      const gap = Number(gridEl.getAttribute('data-gap')) === 6 ? 6 : Number(gridEl.getAttribute('data-gap')) === 18 ? 18 : 12;
      const rawAlign = gridEl.getAttribute('data-align');
      const align: ImageAlignOption = rawAlign === 'left' || rawAlign === 'right' ? rawAlign : 'center';
      gridEl.setAttribute('data-grid-width', String(w));
      gridEl.setAttribute('style', buildImageGridStyle(cols, w, gap as ImageGapOption, align));
    } else {
      const figEl = ensureWrappedSingleFigure(imgEl);
      const current = extractSelectedImageState(imgEl);
      figEl.setAttribute('data-width', String(w));
      figEl.setAttribute('data-align', current.align);
      figEl.setAttribute('style', buildSingleImageFigureStyle(w, current.align));
      imgEl.style.width = '100%';
      imgEl.style.height = 'auto';
      imgEl.style.display = 'block';
      imgEl.style.borderRadius = '10px';
    }

    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const applySelectedImageAlign = (nextAlign: ImageAlignOption) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;

    if (gridEl) {
      const gridAlign: ImageAlignOption =
        nextAlign === 'left' || nextAlign === 'right' ? nextAlign : 'center';
      const cols: 2 | 3 = Number(gridEl.getAttribute('data-image-grid')) === 2 ? 2 : 3;
      const w = parsePercentValue(gridEl.getAttribute('data-grid-width') || gridEl.style.width, 100);
      const rawGap = Number(gridEl.getAttribute('data-gap'));
      const gap: ImageGapOption = rawGap === 6 ? 6 : rawGap === 18 ? 18 : 12;
      gridEl.setAttribute('data-align', gridAlign);
      gridEl.setAttribute('style', buildImageGridStyle(cols, w, gap, gridAlign));
    } else {
      const figEl = ensureWrappedSingleFigure(imgEl);
      const current = extractSelectedImageState(imgEl);
      let nextW = current.widthPercent;
      if ((nextAlign === 'float-left' || nextAlign === 'float-right') && nextW >= 85) {
        nextW = 45;
      }
      figEl.setAttribute('data-align', nextAlign);
      figEl.setAttribute('data-width', String(nextW));
      figEl.setAttribute('style', buildSingleImageFigureStyle(nextW, nextAlign));
      imgEl.style.width = '100%';
      imgEl.style.height = 'auto';
      imgEl.style.display = 'block';
      imgEl.style.borderRadius = '10px';
    }

    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const convertSelectedImageLayout = (target: 'single' | 2 | 3) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const currentGrid = imgEl.closest('[data-image-grid]') as HTMLElement | null;

    if (target === 'single') {
      if (!currentGrid) return;
      const allFigures = Array.from(currentGrid.querySelectorAll('figure'));
      allFigures.forEach((fig) => {
        const innerImg = fig.querySelector('img') as HTMLImageElement | null;
        if (!innerImg) return;
        fig.setAttribute('data-image-block', 'single');
        fig.setAttribute('data-align', 'center');
        fig.setAttribute('data-width', '100');
        fig.setAttribute('style', buildSingleImageFigureStyle(100, 'center'));
        innerImg.style.width = '100%';
        innerImg.style.height = 'auto';
        innerImg.style.aspectRatio = '';
        innerImg.style.objectFit = '';
        innerImg.style.display = 'block';
        innerImg.style.borderRadius = '10px';
        currentGrid.parentNode?.insertBefore(fig, currentGrid);
      });
      currentGrid.remove();
      syncHtmlFromCompose();
      setSelectedImgState(extractSelectedImageState(imgEl));
      return;
    }

    if (currentGrid) {
      const w = parsePercentValue(
        currentGrid.getAttribute('data-grid-width') || currentGrid.style.width,
        100
      );
      const rawGap = Number(currentGrid.getAttribute('data-gap'));
      const gap: ImageGapOption = rawGap === 6 ? 6 : rawGap === 18 ? 18 : 12;
      const rawAlign = currentGrid.getAttribute('data-align');
      const align: ImageAlignOption =
        rawAlign === 'left' || rawAlign === 'right' ? rawAlign : 'center';
      currentGrid.setAttribute('data-image-grid', String(target));
      currentGrid.setAttribute('style', buildImageGridStyle(target, w, gap, align));
      syncHtmlFromCompose();
      setSelectedImgState(extractSelectedImageState(imgEl));
      return;
    }

    // Wrap single figure into a 2-col or 3-col grid and pull immediately adjacent standalone image figures if present
    const figEl = ensureWrappedSingleFigure(imgEl);
    const gridDiv = document.createElement('div');
    gridDiv.setAttribute('data-image-grid', String(target));
    gridDiv.setAttribute('data-grid-width', '100');
    gridDiv.setAttribute('data-aspect', '4/3');
    gridDiv.setAttribute('data-gap', '12');
    gridDiv.setAttribute('data-align', 'center');
    gridDiv.setAttribute('style', buildImageGridStyle(target, 100, 12, 'center'));

    const siblingsToMove: HTMLElement[] = [figEl];
    let probe = figEl.nextElementSibling as HTMLElement | null;
    while (probe && siblingsToMove.length < target) {
      if (probe.tagName === 'FIGURE' && probe.querySelector('img')) {
        siblingsToMove.push(probe);
        probe = probe.nextElementSibling as HTMLElement | null;
      } else {
        break;
      }
    }

    figEl.parentNode?.insertBefore(gridDiv, figEl);
    siblingsToMove.forEach((slotFig) => {
      slotFig.removeAttribute('data-image-block');
      slotFig.removeAttribute('data-align');
      slotFig.removeAttribute('data-width');
      slotFig.setAttribute('style', 'margin: 0; overflow: hidden; border-radius: 10px;');
      const slotImg = slotFig.querySelector('img') as HTMLImageElement | null;
      if (slotImg) {
        slotImg.setAttribute('style', buildGridImgStyle('4/3'));
      }
      gridDiv.appendChild(slotFig);
    });

    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const applySelectedGridAspect = (aspect: ImageAspectOption) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;
    if (!gridEl) return;
    gridEl.setAttribute('data-aspect', aspect);
    gridEl.querySelectorAll('img').forEach((childImg) => {
      (childImg as HTMLImageElement).setAttribute('style', buildGridImgStyle(aspect));
    });
    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const applySelectedGridGap = (gap: ImageGapOption) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;
    if (!gridEl) return;
    const cols: 2 | 3 = Number(gridEl.getAttribute('data-image-grid')) === 2 ? 2 : 3;
    const w = parsePercentValue(gridEl.getAttribute('data-grid-width') || gridEl.style.width, 100);
    const rawAlign = gridEl.getAttribute('data-align');
    const align: ImageAlignOption = rawAlign === 'left' || rawAlign === 'right' ? rawAlign : 'center';
    gridEl.setAttribute('data-gap', String(gap));
    gridEl.setAttribute('style', buildImageGridStyle(cols, w, gap, align));
    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const moveSelectedGridSlot = (delta: -1 | 1) => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;
    const slotFig = imgEl.closest('figure') as HTMLElement | null;
    if (!gridEl || !slotFig) return;

    if (delta === -1 && slotFig.previousElementSibling) {
      gridEl.insertBefore(slotFig, slotFig.previousElementSibling);
    } else if (delta === 1 && slotFig.nextElementSibling) {
      gridEl.insertBefore(slotFig.nextElementSibling, slotFig);
    }
    syncHtmlFromCompose();
    setSelectedImgState(extractSelectedImageState(imgEl));
  };

  const removeSelectedImage = () => {
    const imgEl = selectedImgElRef.current;
    if (!imgEl || !editorRef.current?.contains(imgEl)) return;
    const gridEl = imgEl.closest('[data-image-grid]') as HTMLElement | null;
    const figEl = imgEl.closest('figure') as HTMLElement | null;

    if (gridEl && figEl) {
      figEl.remove();
      if (gridEl.querySelectorAll('img').length === 0) {
        gridEl.remove();
      }
    } else if (figEl) {
      figEl.remove();
    } else {
      imgEl.remove();
    }

    selectedImgElRef.current = null;
    setSelectedImgState(null);
    syncHtmlFromCompose();
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
                        className="space-y-3 text-sm sm:text-base text-zinc-200 leading-relaxed after:content-[''] after:block after:clear-both [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h1,&_h2,&_h3,&_h4]:font-bold [&_h1,&_h2,&_h3,&_h4]:text-white [&_strong]:text-white [&_b]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-3 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:max-w-full [&_img]:rounded-lg [&_[data-image-block]]:max-w-full [&_[data-image-block]_img]:!my-0 [&_[data-image-block]_img]:w-full [&_[data-image-grid]]:max-w-full [&_[data-image-grid]_figure]:!m-0 [&_[data-image-grid]_img]:!my-0 [&_[data-image-grid]_img]:w-full [&_hr]:border-zinc-800 [&_hr]:my-4 [&_s]:line-through [&_iframe]:w-[80%] [&_iframe]:max-w-[720px] [&_iframe]:mx-auto [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-3 [&_[data-youtube-embed]]:!w-[80%] [&_[data-youtube-embed]]:!max-w-[720px] [&_[data-youtube-embed]]:!mx-auto [&_[data-youtube-embed]]:!h-auto [&_[data-youtube-embed]]:!pb-0 [&_[data-youtube-embed]]:aspect-video [&_[data-youtube-embed]_iframe]:!static [&_[data-youtube-embed]_iframe]:!w-full [&_[data-youtube-embed]_iframe]:!h-full [&_[data-youtube-embed]_iframe]:!my-0"
                      />
                    </div>
                  ) : editorMode === 'compose' ? (
                    /* Blogger Compose View (WYSIWYG Rich Text Sheet) */
                    <div className="max-w-3xl mx-auto space-y-3">
                      {/* Contextual Selected Image Toolbar */}
                      {selectedImgState && (
                        <div className="sticky top-0 z-20 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-amber-400/50 p-3 shadow-2xl space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={selectedImgState.src}
                                alt={selectedImgState.alt || '선택 이미지'}
                                className="w-8 h-8 rounded object-cover border border-zinc-700 shrink-0 bg-black"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    {selectedImgState.inGrid
                                      ? `한 줄 ${selectedImgState.gridCols}개 행 편집 (${selectedImgState.slotIndex + 1}/${selectedImgState.totalInGrid})`
                                      : '선택된 이미지 크기 · 위치 설정'}
                                  </span>
                                </div>
                                <div className="text-[10.5px] text-zinc-400">
                                  너비 {selectedImgState.widthPercent}% ·{' '}
                                  {selectedImgState.align === 'left'
                                    ? '왼쪽 정렬'
                                    : selectedImgState.align === 'right'
                                      ? '오른쪽 정렬'
                                      : selectedImgState.align === 'float-left'
                                        ? '글 왼쪽 감싸기'
                                        : selectedImgState.align === 'float-right'
                                          ? '글 오른쪽 감싸기'
                                          : '가운데 정렬'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {selectedImgState.inGrid && selectedImgElRef.current && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const gridEl = selectedImgElRef.current?.closest(
                                      '[data-image-grid]'
                                    ) as HTMLElement | null;
                                    if (gridEl) openImageModalWithConfig(gridEl);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>이 줄에 그림 추가</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={removeSelectedImage}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1 cursor-pointer"
                                title="이미지 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  selectedImgElRef.current = null;
                                  setSelectedImgState(null);
                                }}
                                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                                title="닫기"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Row 1: Size Controls + Position/Alignment */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-zinc-400 shrink-0">
                                크기
                              </span>
                              {[25, 50, 75, 100].map((pct) => (
                                <button
                                  key={pct}
                                  type="button"
                                  onClick={() => applySelectedImageWidth(pct)}
                                  className={`px-2 py-1 rounded-md font-mono text-[11px] font-semibold border cursor-pointer transition-colors ${
                                    selectedImgState.widthPercent === pct
                                      ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                  }`}
                                >
                                  {pct}%
                                </button>
                              ))}
                              <input
                                type="range"
                                min={selectedImgState.inGrid ? 30 : 15}
                                max={100}
                                step={5}
                                value={selectedImgState.widthPercent}
                                onChange={(e) => applySelectedImageWidth(Number(e.target.value))}
                                className="w-20 accent-amber-400 cursor-pointer"
                                title="세밀 크기 조절"
                              />
                            </div>

                            <div className="w-px h-4 bg-zinc-800 hidden sm:block" />

                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[11px] font-semibold text-zinc-400 mr-0.5">
                                위치
                              </span>
                              {(
                                [
                                  { id: 'left', label: '왼쪽' },
                                  { id: 'center', label: '가운데' },
                                  { id: 'right', label: '오른쪽' },
                                  ...(!selectedImgState.inGrid
                                    ? [
                                        { id: 'float-left', label: '글 좌측' },
                                        { id: 'float-right', label: '글 우측' },
                                      ]
                                    : []),
                                ] as { id: ImageAlignOption; label: string }[]
                              ).map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => applySelectedImageAlign(opt.id)}
                                  className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors ${
                                    selectedImgState.align === opt.id
                                      ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Row 2: Multi-Image Row Switcher + Aspect Ratio + Gap + Reorder */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-800/80">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-semibold text-zinc-400 mr-0.5">
                                한 줄 배치
                              </span>
                              <button
                                type="button"
                                onClick={() => convertSelectedImageLayout('single')}
                                className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer ${
                                  !selectedImgState.inGrid
                                    ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                }`}
                              >
                                단독
                              </button>
                              <button
                                type="button"
                                onClick={() => convertSelectedImageLayout(2)}
                                className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer flex items-center gap-1 ${
                                  selectedImgState.inGrid && selectedImgState.gridCols === 2
                                    ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                }`}
                              >
                                <Columns2 className="w-3 h-3" />
                                <span>한 줄 2개</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => convertSelectedImageLayout(3)}
                                className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer flex items-center gap-1 ${
                                  selectedImgState.inGrid && selectedImgState.gridCols === 3
                                    ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                }`}
                              >
                                <Columns3 className="w-3 h-3" />
                                <span>한 줄 3개</span>
                              </button>
                            </div>

                            {selectedImgState.inGrid && (
                              <>
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] font-semibold text-zinc-400 mr-0.5">
                                    비율
                                  </span>
                                  {(
                                    [
                                      { id: 'auto', label: '원본' },
                                      { id: '1/1', label: '1:1' },
                                      { id: '4/3', label: '4:3' },
                                      { id: '16/9', label: '16:9' },
                                    ] as { id: ImageAspectOption; label: string }[]
                                  ).map((r) => (
                                    <button
                                      key={r.id}
                                      type="button"
                                      onClick={() => applySelectedGridAspect(r.id)}
                                      className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer ${
                                        selectedImgState.aspect === r.id
                                          ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                      }`}
                                    >
                                      {r.label}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] font-semibold text-zinc-400 mr-0.5">
                                    간격
                                  </span>
                                  {([6, 12, 18] as ImageGapOption[]).map((g) => (
                                    <button
                                      key={g}
                                      type="button"
                                      onClick={() => applySelectedGridGap(g)}
                                      className={`px-1.5 py-1 rounded-md font-mono text-[10.5px] font-semibold border cursor-pointer ${
                                        selectedImgState.gap === g
                                          ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                      }`}
                                    >
                                      {g}px
                                    </button>
                                  ))}
                                </div>

                                {selectedImgState.totalInGrid > 1 && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-semibold text-zinc-400 mr-0.5">
                                      순서
                                    </span>
                                    <button
                                      type="button"
                                      disabled={selectedImgState.slotIndex === 0}
                                      onClick={() => moveSelectedGridSlot(-1)}
                                      className="p-1 rounded bg-zinc-950 border border-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white cursor-pointer"
                                      title="앞으로 이동"
                                    >
                                      <ArrowLeft className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={
                                        selectedImgState.slotIndex >=
                                        selectedImgState.totalInGrid - 1
                                      }
                                      onClick={() => moveSelectedGridSlot(1)}
                                      className="p-1 rounded bg-zinc-950 border border-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white cursor-pointer"
                                      title="뒤로 이동"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl bg-zinc-950 border border-zinc-800/90 shadow-lg min-h-[380px] p-5 sm:p-8">
                        <div
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          onClick={handleComposeClick}
                          onInput={syncHtmlFromCompose}
                          onPaste={handleComposePaste}
                          onKeyUp={refreshFormatState}
                          onMouseUp={refreshFormatState}
                          onBlur={saveSelection}
                          data-placeholder="여기에 내용을 입력하세요. 이미지를 클릭하면 크기 조절·위치 변경·한 줄 3개 배치를 바로 설정할 수 있습니다."
                          className="min-h-[320px] outline-none text-sm sm:text-base text-zinc-100 leading-relaxed font-sans space-y-3 after:content-[''] after:block after:clear-both empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-500 empty:before:pointer-events-none [&_a]:text-amber-400 [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h1,&_h2,&_h3,&_h4]:font-bold [&_h1,&_h2,&_h3,&_h4]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-3 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-zinc-300 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3 [&_img]:cursor-pointer hover:[&_img]:ring-2 hover:[&_img]:ring-amber-400/60 [&_[data-image-block]]:max-w-full [&_[data-image-block]_img]:!my-0 [&_[data-image-block]_img]:w-full [&_[data-image-grid]]:max-w-full [&_[data-image-grid]_figure]:!m-0 [&_[data-image-grid]_img]:!my-0 [&_[data-image-grid]_img]:w-full [&_hr]:border-zinc-700 [&_hr]:my-4 [&_s]:line-through [&_iframe]:w-[80%] [&_iframe]:max-w-[720px] [&_iframe]:mx-auto [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-3 [&_[data-youtube-embed]]:!w-[80%] [&_[data-youtube-embed]]:!max-w-[720px] [&_[data-youtube-embed]]:!mx-auto [&_[data-youtube-embed]]:!h-auto [&_[data-youtube-embed]]:!pb-0 [&_[data-youtube-embed]]:aspect-video [&_[data-youtube-embed]_iframe]:!static [&_[data-youtube-embed]_iframe]:!w-full [&_[data-youtube-embed]_iframe]:!h-full [&_[data-youtube-embed]_iframe]:!my-0"
                        />
                      </div>
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

      {/* Blogger Image Insert Dialog Modal (Size, Position, 1-3 Column Row Layout, Upload & URL) */}
      {showImageDialog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => {
            appendGridTargetElRef.current = null;
            setShowImageDialog(false);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl text-zinc-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-amber-400" />
                <span>
                  {appendGridTargetElRef.current
                    ? '현재 이미지 줄에 사진 추가'
                    : '이미지 삽입 · 크기 및 위치 배치'}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  appendGridTargetElRef.current = null;
                  setShowImageDialog(false);
                }}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {imageError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}

              {/* Step 1: Layout & Position Configuration (hidden only when appending into existing row) */}
              {!appendGridTargetElRef.current && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                      <span>1. 이미지 위치 및 한 줄 배치</span>
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {imageLayoutMode === 'grid-3'
                        ? '한 줄에 3개 나란히 배치'
                        : imageLayoutMode === 'grid-2'
                          ? '한 줄에 2개 나란히 배치'
                          : imageLayoutMode === 'float-left'
                            ? '왼쪽 배치 · 본문 글 감싸기'
                            : imageLayoutMode === 'float-right'
                              ? '오른쪽 배치 · 본문 글 감싸기'
                              : imageLayoutMode === 'left'
                                ? '단독 왼쪽 정렬'
                                : imageLayoutMode === 'right'
                                  ? '단독 오른쪽 정렬'
                                  : '단독 가운데 정렬'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: 'left', label: '왼쪽 정렬', Icon: AlignLeft },
                        { id: 'center', label: '가운데 정렬', Icon: AlignCenter },
                        { id: 'right', label: '오른쪽 정렬', Icon: AlignRight },
                        { id: 'float-left', label: '글 좌측 배치', Icon: AlignLeft },
                        { id: 'float-right', label: '글 우측 배치', Icon: AlignRight },
                        { id: 'grid-2', label: '한 줄에 2개', Icon: Columns2 },
                        { id: 'grid-3', label: '한 줄에 3개', Icon: Columns3 },
                      ] as { id: ImageLayoutMode; label: string; Icon: React.ElementType }[]
                    ).map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleChangeImageLayoutMode(id)}
                        className={`px-2.5 py-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          imageLayoutMode === id
                            ? id.startsWith('grid-')
                              ? 'bg-sky-400 text-zinc-950 border-sky-300 shadow-sm'
                              : 'bg-amber-400 text-zinc-950 border-amber-300 shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Size Slider & Presets */}
                  <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 font-semibold shrink-0">
                        {imageLayoutMode.startsWith('grid-') ? '행 전체 너비' : '그림 크기'}
                      </span>
                      {(imageLayoutMode.startsWith('grid-')
                        ? [60, 80, 90, 100]
                        : [25, 50, 75, 100]
                      ).map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setImageWidthPercent(pct)}
                          className={`px-2 py-1 rounded-md font-mono text-[11px] font-bold border cursor-pointer ${
                            imageWidthPercent === pct
                              ? 'bg-amber-400 text-zinc-950 border-amber-300'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                      <input
                        type="range"
                        min={imageLayoutMode.startsWith('grid-') ? 40 : 15}
                        max={100}
                        step={5}
                        value={imageWidthPercent}
                        onChange={(e) => setImageWidthPercent(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-amber-300 w-10 text-right">
                        {imageWidthPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Extra Row Settings for 2-Column / 3-Column Grids */}
                  {imageLayoutMode.startsWith('grid-') && (
                    <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 font-semibold">이미지 비율</span>
                        {(
                          [
                            { id: 'auto', label: '원본' },
                            { id: '1/1', label: '1:1' },
                            { id: '4/3', label: '4:3' },
                            { id: '16/9', label: '16:9' },
                          ] as { id: ImageAspectOption; label: string }[]
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setImageAspect(opt.id)}
                            className={`px-2 py-1 rounded-md font-semibold border cursor-pointer ${
                              imageAspect === opt.id
                                ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 font-semibold">간격</span>
                        {([6, 12, 18] as ImageGapOption[]).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setImageGap(g)}
                            className={`px-2 py-1 rounded-md font-mono font-semibold border cursor-pointer ${
                              imageGap === g
                                ? 'bg-sky-400 text-zinc-950 border-sky-300'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            {g === 6 ? '좁게' : g === 12 ? '보통' : '넓게'}
                          </button>
                        ))}
                      </div>

                      {imageWidthPercent < 100 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-400 font-semibold">행 위치</span>
                          {(
                            [
                              { id: 'left', label: '좌' },
                              { id: 'center', label: '중앙' },
                              { id: 'right', label: '우' },
                            ] as { id: 'left' | 'center' | 'right'; label: string }[]
                          ).map((al) => (
                            <button
                              key={al.id}
                              type="button"
                              onClick={() => setImageGridAlign(al.id)}
                              className={`px-2 py-1 rounded-md font-semibold border cursor-pointer ${
                                imageGridAlign === al.id
                                  ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                  : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                              }`}
                            >
                              {al.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Upload Multiple Files OR Paste URLs */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-colors ${
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
                      className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-colors ${
                        imageTab === 'url'
                          ? 'bg-amber-400 text-zinc-950'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      URL로 추가
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={slotFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSingleSlotFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isProcessingImages}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingImages ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>여러 파일 한 번에 선택</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkUrlBox((v) => !v)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
                    >
                      URL 일괄 입력
                    </button>
                  </div>
                </div>

                {showBulkUrlBox && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-400/40 space-y-2">
                    <label className="block text-[11px] font-semibold text-amber-300">
                      이미지 URL을 줄바꿈으로 여러 개 입력하세요 (예: 3개 입력 시 한 줄에 3개로 자동 채움)
                    </label>
                    <textarea
                      rows={3}
                      value={bulkUrlInput}
                      onChange={(e) => setBulkUrlInput(e.target.value)}
                      placeholder={`https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg\nhttps://example.com/photo3.jpg`}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowBulkUrlBox(false)}
                        className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-[11px] cursor-pointer"
                      >
                        닫기
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyBulkUrls}
                        className="px-3 py-1 rounded bg-amber-400 text-zinc-950 font-bold text-[11px] cursor-pointer"
                      >
                        슬롯에 채우기
                      </button>
                    </div>
                  </div>
                )}

                {/* Slot Cards */}
                <div className="space-y-2.5">
                  {imageSlots.map((slot, idx) => (
                    <div
                      key={slot.id}
                      onClick={() => setActiveSlotIndex(idx)}
                      className={`p-3 rounded-xl border transition-colors space-y-2.5 ${
                        activeSlotIndex === idx
                          ? 'bg-zinc-950 border-amber-400/60'
                          : 'bg-zinc-950/70 border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10.5px]">
                            #{idx + 1}
                          </span>
                          <span>이미지 {idx + 1}</span>
                          {slot.src && (
                            <span className="text-[10.5px] text-emerald-400 font-medium">
                              (준비됨)
                            </span>
                          )}
                        </span>

                        <div className="flex items-center gap-1">
                          {imageSlots.length > 1 && (
                            <>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImageSlot(idx, -1);
                                }}
                                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-35 text-zinc-300 hover:text-white cursor-pointer"
                                title="위로"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === imageSlots.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImageSlot(idx, 1);
                                }}
                                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-35 text-zinc-300 hover:text-white cursor-pointer"
                                title="아래로"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageSlots((prev) =>
                                    prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
                                  );
                                }}
                                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 cursor-pointer"
                                title="슬롯 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Thumbnail / Quick File Picker */}
                        <div className="w-full sm:w-28 shrink-0">
                          {slot.src ? (
                            <div className="relative group rounded-lg overflow-hidden border border-zinc-700 bg-black h-20 flex items-center justify-center">
                              <img
                                src={slot.src}
                                alt={`슬롯 ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageSlots((prev) =>
                                    prev.map((s, i) => (i === idx ? { ...s, src: '' } : s))
                                  );
                                }}
                                className="absolute top-1 right-1 p-1 rounded bg-black/75 text-zinc-200 hover:text-rose-400 cursor-pointer"
                                title="이미지 비우기"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                slotUploadTargetIdxRef.current = idx;
                                slotFileInputRef.current?.click();
                              }}
                              className="w-full h-20 rounded-lg border border-dashed border-zinc-700 hover:border-amber-400 bg-zinc-900/70 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                            >
                              <Upload className="w-4 h-4" />
                              <span className="text-[11px] font-semibold">파일 선택</span>
                            </button>
                          )}
                        </div>

                        {/* URL + Alt Inputs (Always accessible regardless of tab) */}
                        <div className="flex-1 w-full space-y-2">
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              value={slot.src.startsWith('data:image/') ? '' : slot.src}
                              onChange={(e) => {
                                const val = e.target.value;
                                setImageSlots((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, src: val } : s))
                                );
                              }}
                              placeholder={
                                slot.src.startsWith('data:image/')
                                  ? '업로드된 이미지 파일이 적용되었습니다 (교체하려면 새 URL 입력)'
                                  : '이미지 URL 입력 (https://example.com/image.jpg)'
                              }
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono text-[11.5px]"
                            />
                            {imageTab === 'upload' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  slotUploadTargetIdxRef.current = idx;
                                  slotFileInputRef.current?.click();
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold shrink-0 cursor-pointer"
                              >
                                파일
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={slot.alt}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImageSlots((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, alt: val } : s))
                              );
                            }}
                            placeholder="이미지 설명 (선택 - SEO alt 텍스트)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-[11.5px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setImageSlots((prev) => [...prev, createEmptyImageSlot()])}
                  className="w-full py-2 rounded-xl border border-dashed border-zinc-700 hover:border-amber-400/70 text-zinc-300 hover:text-amber-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>이미지 슬롯 추가</span>
                </button>
              </div>

              {/* Step 3: Live Layout Preview */}
              {!appendGridTargetElRef.current &&
                imageSlots.some((s) => s.src.trim().length > 0) && (
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="text-[11px] font-bold text-zinc-400">
                      삽입 형태 미리보기
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800/80 overflow-hidden">
                      {imageLayoutMode === 'grid-2' || imageLayoutMode === 'grid-3' ? (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${imageLayoutMode === 'grid-2' ? 2 : 3}, minmax(0, 1fr))`,
                            gap: `${imageGap}px`,
                            width: `${imageWidthPercent}%`,
                            margin:
                              imageGridAlign === 'left'
                                ? '0 auto 0 0'
                                : imageGridAlign === 'right'
                                  ? '0 0 0 auto'
                                  : '0 auto',
                          }}
                        >
                          {imageSlots
                            .filter((s) => s.src.trim())
                            .map((s) => (
                              <img
                                key={s.id}
                                src={s.src}
                                alt={s.alt || '미리보기'}
                                style={{
                                  width: '100%',
                                  aspectRatio: imageAspect === 'auto' ? undefined : imageAspect,
                                  objectFit: imageAspect === 'auto' ? undefined : 'cover',
                                  borderRadius: '8px',
                                  display: 'block',
                                }}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className="after:content-[''] after:block after:clear-both">
                          {imageSlots
                            .filter((s) => s.src.trim())
                            .slice(0, 1)
                            .map((s) => (
                              <div
                                key={s.id}
                                style={{
                                  width: `${imageWidthPercent}%`,
                                  float:
                                    imageLayoutMode === 'float-left'
                                      ? 'left'
                                      : imageLayoutMode === 'float-right'
                                        ? 'right'
                                        : 'none',
                                  margin:
                                    imageLayoutMode === 'left'
                                      ? '0 auto 0 0'
                                      : imageLayoutMode === 'right'
                                        ? '0 0 0 auto'
                                        : imageLayoutMode === 'float-left'
                                          ? '0 12px 8px 0'
                                          : imageLayoutMode === 'float-right'
                                            ? '0 0 8px 12px'
                                            : '0 auto',
                                }}
                              >
                                <img
                                  src={s.src}
                                  alt={s.alt || '미리보기'}
                                  className="w-full h-auto rounded-lg block"
                                />
                              </div>
                            ))}
                          {(imageLayoutMode === 'float-left' ||
                            imageLayoutMode === 'float-right') && (
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              글과 이미지가 나란히 자연스럽게 흐르도록 배치됩니다. 본문 내용이
                              이미지 옆 공간을 따라 이어서 표시됩니다.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Dialog Footer */}
            <div className="px-5 py-3.5 border-t border-zinc-800 flex items-center justify-between gap-2 shrink-0 bg-zinc-900">
              <span className="text-[11px] text-zinc-400">
                삽입 후 본문에서 그림을 클릭해도 크기·위치를 수정할 수 있습니다.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    appendGridTargetElRef.current = null;
                    setShowImageDialog(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={isProcessingImages}
                  onClick={handleConfirmImage}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 disabled:opacity-50 text-xs font-bold cursor-pointer"
                >
                  본문에 삽입
                </button>
              </div>
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
