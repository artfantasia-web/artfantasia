import React, { createContext, useContext, useState, useEffect } from 'react';
import { NoticeItem, InternationalLogoItem } from '../types';
import { NOTICES } from '../data/content';
import defaultPersistedData from '../data/persisted_admin_data.json';

// Default initial 48 partner and client logos for the Hero infinite rolling ticker & portfolio
export const DEFAULT_INTERNATIONAL_LOGOS: InternationalLogoItem[] = [
  // 1-12: Global & Major Conglomerates
  { id: 'logo-hyundai', name: 'HYUNDAI HMGMA', country: 'USA', countryKo: '미국', logoUrl: '', category: 'GLOBAL AUTOMOTIVE', active: true },
  { id: 'logo-northwestern', name: 'NORTHWESTERN UNIV.', country: 'USA', countryKo: '미국', logoUrl: '', category: 'GLOBAL UNIVERSITY', active: true },
  { id: 'logo-kotra', name: 'KOTRA', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'TRADE AGENCY', active: true },
  { id: 'logo-keyvalve', name: 'KEYVALVE', country: 'SWEDEN', countryKo: '스웨덴', logoUrl: '', category: 'INDUSTRIAL', active: true },
  { id: 'logo-donga', name: 'DONGA ENG', country: 'CZECH', countryKo: '체코', logoUrl: '', category: 'MANUFACTURING', active: true },
  { id: 'logo-tidfore', name: 'TIDFORE', country: 'CHINA', countryKo: '중국', logoUrl: '', category: 'HEAVY INDUSTRY', active: true },
  { id: 'logo-peking', name: 'PEKING UNIV.', country: 'CHINA', countryKo: '중국', logoUrl: '', category: 'GLOBAL UNIVERSITY', active: true },
  { id: 'logo-ntu', name: 'NTU SINGAPORE', country: 'SINGAPORE', countryKo: '싱가포르', logoUrl: '', category: 'TECHNOLOGY', active: true },
  { id: 'logo-dsec', name: 'DSEC', country: 'GLOBAL', countryKo: '조선해양', logoUrl: '', category: 'SHIPBUILDING', active: true },
  { id: 'logo-samsung', name: 'SAMSUNG ELECTRONICS', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'ELECTRONICS', active: true },
  { id: 'logo-e1', name: 'E1', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'ENERGY', active: true },
  { id: 'logo-kwater', name: 'K-WATER', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'PUBLIC UTILITY', active: true },

  // 13-24: Broadcasters, Trade, Tech & Conglomerates
  { id: 'logo-sbs', name: 'SBS MEDIA CREATE', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'BROADCAST MEDIA', active: true },
  { id: 'logo-kita', name: 'KITA 한국무역협회', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'GLOBAL TRADE', active: true },
  { id: 'logo-gbsa', name: 'GBSA 경기도경제과학진흥원', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'SCIENCE & TECH', active: true },
  { id: 'logo-kobaco', name: 'KOBACO 한국방송광고진흥공사', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'BROADCAST AD', active: true },
  { id: 'logo-ebs', name: 'EBS 한국교육방송', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'BROADCASTING', active: true },
  { id: 'logo-kbs', name: 'KBS 한국방송', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'BROADCASTING', active: true },
  { id: 'logo-cjenm', name: 'CJ ENM', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'ENTERTAINMENT', active: true },
  { id: 'logo-skt', name: 'SK TELECOM', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'TELECOMMUNICATIONS', active: true },
  { id: 'logo-lg', name: 'LG ELECTRONICS', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'TECH & ELECTRONICS', active: true },
  { id: 'logo-posco', name: 'POSCO 포스코', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'STEEL & MATERIALS', active: true },
  { id: 'logo-lotte', name: 'LOTTE 그룹', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'RETAIL & CHEMICAL', active: true },
  { id: 'logo-hanwha', name: 'HANWHA 한화', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'AEROSPACE & ENERGY', active: true },

  // 25-36: Public Institutions, Government Ministries & IT Giants
  { id: 'logo-seoul', name: '서울특별시 SEOUL', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'METROPOLITAN GOV', active: true },
  { id: 'logo-busan', name: '부산광역시 BUSAN', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'METROPOLITAN GOV', active: true },
  { id: 'logo-iiac', name: '인천국제공항공사 IIAC', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'AVIATION & TRANSIT', active: true },
  { id: 'logo-kto', name: 'KTO 한국관광공사', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'TOURISM & CULTURE', active: true },
  { id: 'logo-mcst', name: '문화체육관광부 MCST', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'MINISTRY', active: true },
  { id: 'logo-mss', name: '중소벤처기업부 MSS', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'MINISTRY', active: true },
  { id: 'logo-msit', name: '과학기술정보통신부 MSIT', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'MINISTRY', active: true },
  { id: 'logo-kocca', name: 'KOCCA 한국콘텐츠진흥원', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'CREATIVE CONTENT', active: true },
  { id: 'logo-gscaltex', name: 'GS CALTEX GS칼텍스', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'ENERGY & PETRO', active: true },
  { id: 'logo-kt', name: 'KT 케이티', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'TELECOM & AI', active: true },
  { id: 'logo-kakao', name: '카카오 KAKAO', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'DIGITAL PLATFORM', active: true },
  { id: 'logo-naver', name: '네이버 NAVER', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'TECH & AI', active: true },

  // 37-48: Infrastructure, Prestigious Universities & Humanitarian Orgs
  { id: 'logo-kepco', name: 'KEPCO 한국전력공사', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'ELECTRIC POWER', active: true },
  { id: 'logo-ex', name: '한국도로공사 EX', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'INFRASTRUCTURE', active: true },
  { id: 'logo-korail', name: '코레일 KORAIL', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'TRANSPORTATION', active: true },
  { id: 'logo-inha', name: '인하대학교 INHA UNIV.', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'UNIVERSITY', active: true },
  { id: 'logo-yonsei', name: '연세대학교 YONSEI UNIV.', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'UNIVERSITY', active: true },
  { id: 'logo-korea-univ', name: '고려대학교 KOREA UNIV.', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'UNIVERSITY', active: true },
  { id: 'logo-kaist', name: 'KAIST 한국과학기술원', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'SCIENCE & TECH', active: true },
  { id: 'logo-snu', name: '서울대학교 SEOUL NATL UNIV.', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'UNIVERSITY', active: true },
  { id: 'logo-unicef', name: 'UNICEF 유니세프한국위원회', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'GLOBAL NGO', active: true },
  { id: 'logo-redcross', name: '대한적십자사 RED CROSS', country: 'GLOBAL', countryKo: '글로벌', logoUrl: '', category: 'HUMANITARIAN', active: true },
  { id: 'logo-kead', name: '한국장애인고용공단 KEAD', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'PUBLIC WELFARE', active: true },
  { id: 'logo-nhis', name: '국민건강보험공단 NHIS', country: 'KOREA', countryKo: '대한민국', logoUrl: '', category: 'PUBLIC HEALTHCARE', active: true },
];

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

  // Notices state: initialize from localStorage first, then from bundled persisted JSON, then fallback to NOTICES
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const stored = localStorage.getItem('af_custom_notices');
      if (stored) {
        const parsed = JSON.parse(stored) as NoticeItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            category: item.category === '정보' ? '정보' : '소식',
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load stored notices:', err);
    }
    if (defaultPersistedData && Array.isArray((defaultPersistedData as any).notices)) {
      return (defaultPersistedData as any).notices;
    }
    return NOTICES;
  });

  // Logos state: initialize from localStorage first, then bundled persisted JSON, then fallback to DEFAULT_INTERNATIONAL_LOGOS
  const [logos, setLogos] = useState<InternationalLogoItem[]>(() => {
    try {
      const stored = localStorage.getItem('af_international_logos');
      if (stored) {
        const parsed = JSON.parse(stored) as InternationalLogoItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load stored logos:', err);
    }
    if (defaultPersistedData && Array.isArray((defaultPersistedData as any).logos)) {
      return (defaultPersistedData as any).logos;
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

  // Initial synchronization:
  // If browser has localStorage, auto-sync it to the server so disk files are immediately up-to-date!
  // If browser does NOT have localStorage, fetch /admin_data.json to get the latest server data.
  useEffect(() => {
    try {
      const localNotices = localStorage.getItem('af_custom_notices');
      const localLogos = localStorage.getItem('af_international_logos');
      if (localNotices || localLogos) {
        const parsedN = localNotices ? JSON.parse(localNotices) : notices;
        const parsedL = localLogos ? JSON.parse(localLogos) : logos;
        syncToServer(parsedN, parsedL);
      } else {
        fetch(`/admin_data.json?t=${Date.now()}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              if (Array.isArray(data.notices) && data.notices.length > 0) {
                setNotices(data.notices);
                localStorage.setItem('af_custom_notices', JSON.stringify(data.notices));
              }
              if (Array.isArray(data.logos) && data.logos.length > 0) {
                setLogos(data.logos);
                localStorage.setItem('af_international_logos', JSON.stringify(data.logos));
              }
              if (data.lastSaved) {
                setLastSavedNoticeTime(data.lastSaved);
                setLastSavedLogoTime(data.lastSaved);
              }
            }
          })
          .catch(() => {});
      }
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
