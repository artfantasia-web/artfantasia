import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { NoticeItem } from '../types';
import { supabase, isSupabaseConfigured, NoticeRow } from '../lib/supabase';

export interface NoticeMutationResult {
  success: boolean;
  data?: NoticeItem | null;
  error?: string;
}

interface NoticeContextType {
  notices: NoticeItem[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  editingNotice: NoticeItem | null;
  loginAdmin: (id: string, pw: string) => boolean;
  logoutAdmin: () => void;
  openAdminModal: (itemToEdit?: NoticeItem | null) => void;
  closeAdminModal: () => void;
  setEditingNotice: (item: NoticeItem | null) => void;
  refreshNotices: () => Promise<void>;
  addNotice: (item: Omit<NoticeItem, 'id' | 'views'>) => Promise<NoticeMutationResult>;
  updateNotice: (id: string, updated: Partial<NoticeItem>) => Promise<NoticeMutationResult>;
  deleteNotice: (id: string) => Promise<NoticeMutationResult>;
  incrementViews: (id: string) => void;
}

const ADMIN_SESSION_KEY = 'artfantasia_admin_logged_in';
const META_COMMENT_REGEX = /\n*<!--af-meta:([\s\S]*?)-->\s*$/;

interface EmbeddedNoticeMeta {
  category?: string;
  youtubeId?: string;
  date?: string;
}

function formatCreatedAtDate(isoString?: string | null): string {
  const dateObj = isoString ? new Date(isoString) : new Date();
  const validDate = Number.isNaN(dateObj.getTime()) ? new Date() : dateObj;
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(validDate);
    const yyyy = parts.find((p) => p.type === 'year')?.value ?? String(validDate.getFullYear());
    const mm = parts.find((p) => p.type === 'month')?.value ?? String(validDate.getMonth() + 1).padStart(2, '0');
    const dd = parts.find((p) => p.type === 'day')?.value ?? String(validDate.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  } catch {
    const yyyy = validDate.getFullYear();
    const mm = String(validDate.getMonth() + 1).padStart(2, '0');
    const dd = String(validDate.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  }
}

function extractYoutubeId(raw?: string): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : trimmed;
}

function serializeNoticeContent(
  paragraphs: string[],
  meta: { category?: string; youtubeId?: string; date?: string }
): string {
  const body = paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .join('\n\n');

  const metaPayload: EmbeddedNoticeMeta = {};
  if (meta.category === '정보') {
    metaPayload.category = '정보';
  }
  const cleanYoutubeId = extractYoutubeId(meta.youtubeId);
  if (cleanYoutubeId) {
    metaPayload.youtubeId = cleanYoutubeId;
  }
  if (meta.date && meta.date.trim()) {
    metaPayload.date = meta.date.trim();
  }

  if (Object.keys(metaPayload).length === 0) {
    return body;
  }

  return `${body}\n\n<!--af-meta:${JSON.stringify(metaPayload)}-->`;
}

function mapRowToNoticeItem(row: NoticeRow, sessionViewBonus: number = 0): NoticeItem {
  const rawContent = row.content ?? '';
  let meta: EmbeddedNoticeMeta = {};
  let cleanBody = rawContent;

  const metaMatch = rawContent.match(META_COMMENT_REGEX);
  if (metaMatch) {
    cleanBody = rawContent.replace(META_COMMENT_REGEX, '');
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (parsed && typeof parsed === 'object') {
        meta = parsed as EmbeddedNoticeMeta;
      }
    } catch {
      // Ignore malformed metadata comment and render raw content safely
    }
  }

  const paragraphs = cleanBody
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    id: String(row.id),
    title: row.title ?? '',
    category: meta.category === '정보' ? '정보' : '소식',
    date: meta.date || formatCreatedAtDate(row.created_at),
    views: sessionViewBonus,
    pinned: Boolean(row.is_pinned),
    content: paragraphs.length > 0 ? paragraphs : [cleanBody.trim() || ''],
    author: '아트판타지아 관리자',
    youtubeId: meta.youtubeId || undefined,
  };
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sessionViewsRef = useRef<Record<string, number>>({});

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);

  const refreshNotices = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setNotices([]);
      setError('데이터베이스 연결 설정(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)이 완료되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notices')
        .select('id, title, content, is_pinned, created_at')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Failed to fetch notices from Supabase:', fetchError);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        return;
      }

      const mapped = ((data as NoticeRow[]) ?? []).map((row) =>
        mapRowToNoticeItem(row, sessionViewsRef.current[String(row.id)] ?? 0)
      );
      setNotices(mapped);
    } catch (err) {
      console.error('Unexpected error fetching notices:', err);
      setError('공지사항을 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotices();
  }, [refreshNotices]);

  const loginAdmin = (id: string, pw: string): boolean => {
    // Exact requested credentials: id = admin, pw = qhtm0920!
    if (id.trim() === 'admin' && pw === 'qhtm0920!') {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
  };

  const openAdminModal = (itemToEdit?: NoticeItem | null) => {
    if (itemToEdit) {
      setEditingNotice(itemToEdit);
    }
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setEditingNotice(null);
  };

  const addNotice = async (item: Omit<NoticeItem, 'id' | 'views'>): Promise<NoticeMutationResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase 환경 변수가 설정되지 않아 게시글을 저장할 수 없습니다.',
      };
    }

    const serializedContent = serializeNoticeContent(item.content, {
      category: item.category,
      youtubeId: item.youtubeId,
      date: item.date,
    });

    try {
      const { data, error: insertError } = await supabase
        .from('notices')
        .insert({
          title: item.title.trim(),
          content: serializedContent,
          is_pinned: Boolean(item.pinned),
        })
        .select('id, title, content, is_pinned, created_at')
        .single();

      if (insertError) {
        console.error('Failed to insert notice:', insertError);
        return {
          success: false,
          error: `게시글 등록에 실패했습니다. (${insertError.message})`,
        };
      }

      await refreshNotices();
      return {
        success: true,
        data: data ? mapRowToNoticeItem(data as NoticeRow) : null,
      };
    } catch (err) {
      console.error('Unexpected error inserting notice:', err);
      return {
        success: false,
        error: '게시글 등록 중 네트워크 오류가 발생했습니다.',
      };
    }
  };

  const updateNotice = async (
    id: string,
    updated: Partial<NoticeItem>
  ): Promise<NoticeMutationResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase 환경 변수가 설정되지 않아 게시글을 수정할 수 없습니다.',
      };
    }

    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return {
        success: false,
        error: '유효하지 않은 게시글 ID입니다.',
      };
    }

    const existing = notices.find((n) => n.id === id);
    const mergedTitle = (updated.title ?? existing?.title ?? '').trim();
    const mergedContent = updated.content ?? existing?.content ?? [];
    const mergedCategory = updated.category ?? existing?.category ?? '소식';
    const mergedYoutubeId =
      updated.youtubeId !== undefined ? updated.youtubeId : existing?.youtubeId;
    const mergedDate = updated.date !== undefined ? updated.date : existing?.date;
    const mergedPinned =
      updated.pinned !== undefined ? Boolean(updated.pinned) : Boolean(existing?.pinned);

    const serializedContent = serializeNoticeContent(mergedContent, {
      category: mergedCategory,
      youtubeId: mergedYoutubeId,
      date: mergedDate,
    });

    try {
      const { data, error: updateError } = await supabase
        .from('notices')
        .update({
          title: mergedTitle,
          content: serializedContent,
          is_pinned: mergedPinned,
        })
        .eq('id', numericId)
        .select('id, title, content, is_pinned, created_at')
        .single();

      if (updateError) {
        console.error('Failed to update notice:', updateError);
        return {
          success: false,
          error: `게시글 수정에 실패했습니다. (${updateError.message})`,
        };
      }

      await refreshNotices();
      return {
        success: true,
        data: data ? mapRowToNoticeItem(data as NoticeRow) : null,
      };
    } catch (err) {
      console.error('Unexpected error updating notice:', err);
      return {
        success: false,
        error: '게시글 수정 중 네트워크 오류가 발생했습니다.',
      };
    }
  };

  const deleteNotice = async (id: string): Promise<NoticeMutationResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase 환경 변수가 설정되지 않아 게시글을 삭제할 수 없습니다.',
      };
    }

    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return {
        success: false,
        error: '유효하지 않은 게시글 ID입니다.',
      };
    }

    try {
      const { error: deleteError } = await supabase
        .from('notices')
        .delete()
        .eq('id', numericId);

      if (deleteError) {
        console.error('Failed to delete notice:', deleteError);
        return {
          success: false,
          error: `게시글 삭제에 실패했습니다. (${deleteError.message})`,
        };
      }

      await refreshNotices();
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting notice:', err);
      return {
        success: false,
        error: '게시글 삭제 중 네트워크 오류가 발생했습니다.',
      };
    }
  };

  const incrementViews = useCallback((id: string) => {
    sessionViewsRef.current[id] = (sessionViewsRef.current[id] ?? 0) + 1;
    setNotices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
      )
    );
  }, []);

  return (
    <NoticeContext.Provider
      value={{
        notices,
        isLoading,
        error,
        isAdmin,
        isAdminModalOpen,
        editingNotice,
        loginAdmin,
        logoutAdmin,
        openAdminModal,
        closeAdminModal,
        setEditingNotice,
        refreshNotices,
        addNotice,
        updateNotice,
        deleteNotice,
        incrementViews,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = (): NoticeContextType => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
};
