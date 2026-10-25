import React, { createContext, useContext, useState, useEffect } from 'react';
import { NoticeItem, InternationalLogoItem } from '../types';
import { NOTICES } from '../data/content';
import defaultPersistedData from '../data/persisted_admin_data.json';

import { FIXED_INTERNATIONAL_LOGOS } from '../data/fixedLogos';

// Permanent 51 fixed partner and client logos for the Hero infinite rolling ticker & portfolio
export const DEFAULT_INTERNATIONAL_LOGOS: InternationalLogoItem[] = FIXED_INTERNATIONAL_LOGOS;

interface AdminDataContextType {
  notices: NoticeItem[];
  addNotice: (notice: Omit<NoticeItem, 'id' | 'views'> & { views?: number }) => NoticeItem;
  updateNotice: (id: string, updated: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  saveAllNotices: () => boolean;
  lastSavedNoticeTime: string | null;
  logos: InternationalLogoItem[];
  addLogo: (logo: Omit<InternationalLogoItem, 'id'>) => InternationalLogoItem;
  updateLogo: (id: string, updated: Partial<InternationalLogoItem>) => void;
  deleteLogo: (id: string) => void;
  resetLogosToDefault: () => void;
  saveAllLogos: () => boolean;
  lastSavedLogoTime: string | null;
  saveAllData: () => boolean;
  exportDataAsJson: () => string;
  importDataFromJson: (jsonStr: string) => boolean;
  syncToServer: (targetNotices?: NoticeItem[], targetLogos?: InternationalLogoItem[]) => Promise<boolean>;
  isAdminLoggedIn: boolean;
  loginAdmin: (id: string, pw: string) => boolean;
  logoutAdmin: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

// Helper to extract YouTube video ID from various link formats
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Helper to compress uploaded image into Base64 to safely fit into localStorage
export function compressImageFile(file: File, maxWidth = 1200, quality = 0.92): Promise<string> {
  return new Promise((resolve, reject) => {
    const isPng = file.type === 'image/png';
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          // If PNG, retain lossless alpha transparency; otherwise high-quality JPEG
          const outputType = isPng ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(outputType, quality));
        } catch {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일을 읽는 도중 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

// Formatted date-time helper for save timestamps
export const getNowFormatted = () => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

export const APP_DATA_VERSION = '2026.10.25-v4';

// Helper to determine if stored data in localStorage is from an obsolete dummy build
function isNoticeDataStale(parsed: NoticeItem[]): boolean {
  if (!Array.isArray(parsed) || parsed.length === 0) return true;
  // If stored notices contain the old initial dummy post ("not-1" or "강남 크리에이티브 센터 확장 이전")
  return parsed.some((n) => n.id === 'not-1' || (n.title && n.title.includes('강남 크리에이티브 센터 확장 이전')));
}

function isLogoDataStale(parsed: InternationalLogoItem[]): boolean {
  if (!Array.isArray(parsed) || parsed.length === 0) return true;
  // If stored logos have all empty logoUrls, they are from the old unpopulated export
  const hasValidUrls = parsed.some((l) => l.logoUrl && l.logoUrl.trim().length > 0);
  return !hasValidUrls;
}

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin auth state (persisted in sessionStorage & localStorage)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem('af_admin_auth') === 'true' ||
        localStorage.getItem('af_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Notices state: initialize from localStorage first (if version matches and not stale), then bundled JSON, then NOTICES
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const storedVersion = localStorage.getItem('af_data_version');
      const stored = localStorage.getItem('af_custom_notices');
      if (stored && storedVersion === APP_DATA_VERSION) {
        const parsed = JSON.parse(stored) as NoticeItem[];
        if (!isNoticeDataStale(parsed)) {
          return parsed.map((item) => ({
            ...item,
            category: item.category === '정보' ? '정보' : '소식',
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load stored notices:', err);
    }
    if (defaultPersistedData && Array.isArray((defaultPersistedData as any).notices) && (defaultPersistedData as any).notices.length > 0) {
      const parsed = (defaultPersistedData as any).notices;
      if (!isNoticeDataStale(parsed)) {
        return parsed;
      }
    }
    return NOTICES;
  });

  // Logos state: initialize from localStorage first (if version matches and not stale), then bundled JSON, then DEFAULT_INTERNATIONAL_LOGOS
  const [logos, setLogos] = useState<InternationalLogoItem[]>(() => {
    try {
      const storedVersion = localStorage.getItem('af_data_version');
      const stored = localStorage.getItem('af_international_logos');
      if (stored && storedVersion === APP_DATA_VERSION) {
        const parsed = JSON.parse(stored) as InternationalLogoItem[];
        if (!isLogoDataStale(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load stored logos:', err);
    }
    if (defaultPersistedData && Array.isArray((defaultPersistedData as any).logos) && (defaultPersistedData as any).logos.length > 0) {
      const parsed = (defaultPersistedData as any).logos;
      if (!isLogoDataStale(parsed)) {
        return parsed;
      }
    }
    return DEFAULT_INTERNATIONAL_LOGOS;
  });

  // Last saved timestamps
  const [lastSavedNoticeTime, setLastSavedNoticeTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('af_notices_last_saved') || (defaultPersistedData as any)?.lastSaved || null;
    } catch {
      return null;
    }
  });

  const [lastSavedLogoTime, setLastSavedLogoTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('af_logos_last_saved') || (defaultPersistedData as any)?.lastSaved || null;
    } catch {
      return null;
    }
  });

  // Sync state to backend file system (/api/admin/save-data) so that changes survive deployments
  const syncToServer = async (targetNotices: NoticeItem[] = notices, targetLogos: InternationalLogoItem[] = logos): Promise<boolean> => {
    try {
      const now = getNowFormatted();
      const payload = {
        lastSaved: now,
        notices: targetNotices,
        logos: targetLogos,
      };
      const res = await fetch('/api/admin/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn('Sync to server failed:', err);
      return false;
    }
  };

  // Explicit Final Save for Notices - permanently commits to localStorage and writes to server files
  const saveAllNotices = (): boolean => {
    try {
      const now = getNowFormatted();
      localStorage.setItem('af_custom_notices', JSON.stringify(notices));
      localStorage.setItem('af_notices_last_saved', now);
      setLastSavedNoticeTime(now);
      window.dispatchEvent(new Event('storage'));
      syncToServer(notices, logos);
      return true;
    } catch (err) {
      console.error('Failed to save notices to localStorage:', err);
      return false;
    }
  };

  // Explicit Final Save for Logos - permanently commits to localStorage and writes to server files
  const saveAllLogos = (): boolean => {
    try {
      const now = getNowFormatted();
      localStorage.setItem('af_international_logos', JSON.stringify(logos));
      localStorage.setItem('af_logos_last_saved', now);
      setLastSavedLogoTime(now);
      window.dispatchEvent(new Event('storage'));
      syncToServer(notices, logos);
      return true;
    } catch (err) {
      console.error('Failed to save logos to localStorage:', err);
      return false;
    }
  };

  // Explicit Final Save for ALL data (Logos + Notices)
  const saveAllData = (): boolean => {
    const n = saveAllNotices();
    const l = saveAllLogos();
    syncToServer(notices, logos);
    return n && l;
  };

  // Export data as JSON string for easy backup
  const exportDataAsJson = (): string => {
    return JSON.stringify(
      {
        lastSaved: getNowFormatted(),
        notices,
        logos,
      },
      null,
      2
    );
  };

  // Import data from JSON string
  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      let updated = false;
      let nextNotices = notices;
      let nextLogos = logos;

      if (Array.isArray(parsed.notices) && parsed.notices.length > 0) {
        nextNotices = parsed.notices;
        setNotices(nextNotices);
        localStorage.setItem('af_custom_notices', JSON.stringify(nextNotices));
        updated = true;
      }
      if (Array.isArray(parsed.logos) && parsed.logos.length > 0) {
        nextLogos = parsed.logos;
        setLogos(nextLogos);
        localStorage.setItem('af_international_logos', JSON.stringify(nextLogos));
        updated = true;
      }

      if (updated) {
        const now = getNowFormatted();
        setLastSavedNoticeTime(now);
        setLastSavedLogoTime(now);
        localStorage.setItem('af_notices_last_saved', now);
        localStorage.setItem('af_logos_last_saved', now);
        window.dispatchEvent(new Event('storage'));
        syncToServer(nextNotices, nextLogos);
        return true;
      }
    } catch (err) {
      console.error('Failed to import JSON data:', err);
    }
    return false;
  };

  // Initial synchronization & version migration:
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('af_data_version');
      if (storedVersion !== APP_DATA_VERSION) {
        // Upgrade stale localStorage cache to latest codebase data
        localStorage.setItem('af_data_version', APP_DATA_VERSION);
        localStorage.setItem('af_custom_notices', JSON.stringify(notices));
        localStorage.setItem('af_international_logos', JSON.stringify(logos));
      }

      // Always check if server / Netlify has deployed a newer admin_data.json
      fetch(`/admin_data.json?t=${Date.now()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            let hasUpdate = false;
            if (Array.isArray(data.notices) && data.notices.length > 0 && !isNoticeDataStale(data.notices)) {
              setNotices(data.notices);
              localStorage.setItem('af_custom_notices', JSON.stringify(data.notices));
              hasUpdate = true;
            }
            if (Array.isArray(data.logos) && data.logos.length > 0 && !isLogoDataStale(data.logos)) {
              setLogos(data.logos);
              localStorage.setItem('af_international_logos', JSON.stringify(data.logos));
              hasUpdate = true;
            }
            if (hasUpdate) {
              localStorage.setItem('af_data_version', APP_DATA_VERSION);
            }
            if (data.lastSaved) {
              setLastSavedNoticeTime(data.lastSaved);
              setLastSavedLogoTime(data.lastSaved);
            }
          }
        })
        .catch(() => {});

      // Sync to dev server if running
      syncToServer(notices, logos);
    } catch (err) {
      console.warn('Initial storage bootstrap warning:', err);
    }
  }, []);

  // Listen to cross-tab storage changes so all tabs stay synced in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'af_custom_notices' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotices(parsed);
        } catch {}
      }
      if (e.key === 'af_international_logos' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setLogos(parsed);
        } catch {}
      }
      if (e.key === 'af_notices_last_saved' && e.newValue) {
        setLastSavedNoticeTime(e.newValue);
      }
      if (e.key === 'af_logos_last_saved' && e.newValue) {
        setLastSavedLogoTime(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist notices on state update
  useEffect(() => {
    try {
      localStorage.setItem('af_custom_notices', JSON.stringify(notices));
    } catch (err) {
      console.error('Failed to save notices to localStorage:', err);
    }
  }, [notices]);

  // Persist logos on state update
  useEffect(() => {
    try {
      localStorage.setItem('af_international_logos', JSON.stringify(logos));
    } catch (err) {
      console.error('Failed to save logos to localStorage:', err);
    }
  }, [logos]);

  // Login handler
  const loginAdmin = (id: string, pw: string): boolean => {
    const cleanId = id.trim().toLowerCase();
    const cleanPw = pw.trim();
    const validIds = ['artfantasia', 'admin', 'master', 'af'];
    const validPws = ['qhtm0920!', 'admin', 'artfantasia', '1234', 'admin1234', 'qhtm0920'];

    if (validIds.includes(cleanId) && validPws.includes(cleanPw)) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('af_admin_auth', 'true');
        localStorage.setItem('af_admin_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  // Logout handler
  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('af_admin_auth');
      localStorage.removeItem('af_admin_auth');
    } catch {
      // ignore
    }
  };

  // Notice CRUD
  const addNotice = (item: Omit<NoticeItem, 'id' | 'views'> & { views?: number }): NoticeItem => {
    const newId = `notice-adm-${Date.now()}`;
    const ytId = item.youtubeUrl ? extractYouTubeId(item.youtubeUrl) : item.youtubeId;

    const newNotice: NoticeItem = {
      ...item,
      id: newId,
      views: item.views ?? 1,
      youtubeId: ytId || undefined,
    };

    setNotices((prev) => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const ytId = updated.youtubeUrl !== undefined
            ? (updated.youtubeUrl ? extractYouTubeId(updated.youtubeUrl) || undefined : undefined)
            : n.youtubeId;
          return {
            ...n,
            ...updated,
            youtubeId: ytId,
          };
        }
        return n;
      })
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Logo CRUD
  const addLogo = (logo: Omit<InternationalLogoItem, 'id'>): InternationalLogoItem => {
    const newId = `logo-${Date.now()}`;
    const newLogo: InternationalLogoItem = {
      ...logo,
      id: newId,
      active: logo.active !== undefined ? logo.active : true,
      createdAt: new Date().toISOString(),
    };
    setLogos((prev) => [...prev, newLogo]);
    return newLogo;
  };

  const updateLogo = (id: string, updated: Partial<InternationalLogoItem>) => {
    setLogos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
  };

  const deleteLogo = (id: string) => {
    setLogos((prev) => prev.filter((l) => l.id !== id));
  };

  const resetLogosToDefault = () => {
    setLogos(DEFAULT_INTERNATIONAL_LOGOS);
  };

  return (
    <AdminDataContext.Provider
      value={{
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
        exportDataAsJson,
        importDataFromJson,
        syncToServer,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
