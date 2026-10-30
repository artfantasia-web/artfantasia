import React, { createContext, useContext, useState, useEffect } from 'react';
import { NoticeItem } from '../types';
import { NOTICES } from '../data/content';

interface NoticeContextType {
  notices: NoticeItem[];
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  editingNotice: NoticeItem | null;
  loginAdmin: (id: string, pw: string) => boolean;
  logoutAdmin: () => void;
  openAdminModal: (itemToEdit?: NoticeItem | null) => void;
  closeAdminModal: () => void;
  setEditingNotice: (item: NoticeItem | null) => void;
  addNotice: (item: Omit<NoticeItem, 'id' | 'views'>) => NoticeItem;
  updateNotice: (id: string, updated: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  incrementViews: (id: string) => void;
}

const STORAGE_KEY = 'artfantasia_notices_data_v1';
const ADMIN_SESSION_KEY = 'artfantasia_admin_logged_in';

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load notices from localStorage, using default:', e);
    }
    return NOTICES;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);

  // Sync notices to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.warn('Failed to save notices to localStorage:', e);
    }
  }, [notices]);

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

  const addNotice = (item: Omit<NoticeItem, 'id' | 'views'>): NoticeItem => {
    const newNotice: NoticeItem = {
      ...item,
      id: `notice-custom-${Date.now()}`,
      views: 1,
    };

    setNotices((prev) => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    setNotices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementViews = (id: string) => {
    setNotices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
      )
    );
  };

  return (
    <NoticeContext.Provider
      value={{
        notices,
        isAdmin,
        isAdminModalOpen,
        editingNotice,
        loginAdmin,
        logoutAdmin,
        openAdminModal,
        closeAdminModal,
        setEditingNotice,
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
