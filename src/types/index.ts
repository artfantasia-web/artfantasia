export type NavCategory = 'home' | 'about' | 'video' | 'audio' | 'afanmusic' | 'marketing' | 'notice' | 'inquiry';

export type VideoCategory = 'all' | 'commercial' | 'corporate' | 'viral';

export interface VideoProject {
  id: string;
  artfantasiaPostId?: string;
  title: string;
  client: string;
  category: VideoCategory;
  categoryLabel: string;
  year: string;
  duration?: string;
  role: string[];
  youtubeId?: string;
  thumbnailUrl?: string;
  thumbnailGradient?: string;
  badge?: string;
  description: string;
  directors?: { role: string; name: string }[];
  keyHighlights: string[];
  stillColors?: string[];
  postUrl?: string;
}

export type AudioCategory = 'all' | 'radio_cm' | 'logo_song' | 'public_cm' | 'lifestyle';

export interface AudioTrack {
  id: string;
  artfantasiaPostId?: string;
  postUrl?: string;
  youtubeId?: string;
  title: string;
  client: string;
  category: AudioCategory;
  categoryLabel: string;
  duration: string;
  durationSeconds: number;
  broadcastChannel?: string;
  mood: string;
  bpm: number;
  year: string;
  scriptSnippet?: string;
  fullScript?: string;
  description: string;
  audioUrl?: string;
  badge?: string;
  keyHighlights?: string[];
  synthTheme: 'jingle' | 'corporate' | 'cinematic' | 'acoustic' | 'ambient';
}

export interface MarketingCase {
  id: string;
  title: string;
  client: string;
  pillar: 'imc' | 'performance' | 'viral' | 'creator';
  pillarLabel: string;
  metricHighlight: string;
  metricLabel: string;
  period: string;
  summary: string;
  strategies: string[];
  tags: string[];
}

export type NoticeCategory = '소식' | '정보';

export interface NoticeItem {
  id: string;
  title: string;
  category: NoticeCategory | string;
  date: string;
  views: number;
  pinned?: boolean;
  content: string[];
  author: string;
  images?: string[];
  youtubeUrl?: string;
  youtubeId?: string;
}

export interface InternationalLogoItem {
  id?: string;
  name?: string;
  country?: string;
  countryKo?: string;
  logoUrl?: string;
  websiteUrl?: string;
  category?: string;
  active?: boolean;
  createdAt?: string;
}

export interface InquiryFormData {
  category: string;
  clientName: string;
  company: string;
  contact: string;
  email: string;
  budget: string;
  schedule: string;
  description: string;
}
