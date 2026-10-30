import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause,
  Download, 
  Check, 
  Award, 
  Video, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Clock, 
  ArrowUpRight, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { StandardSectionHeader } from './StandardSectionHeader';

interface AfanMusicSectionProps {
  onOpenInquiry?: () => void;
}

export interface AfanTrack {
  postNumber: string;
  id: string;
  title: string;
  artist: string;
  category: 'acoustic' | 'pop' | 'cinematic' | 'ambient';
  genre: string;
  mood: string;
  bpm: number;
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  audioUrl: string | null;
  postUrl: string;
  desc: string;
  tags: string[];
}

const AFAN_ORIGINAL_TRACKS: AfanTrack[] = [
  {
    postNumber: '269',
    id: 'afan-269',
    title: '붕어빵',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'acoustic',
    genre: '어쿠스틱 포크',
    mood: '따뜻함 · 일상 · 소소한 행복',
    bpm: 88,
    duration: '03:15',
    youtubeId: '-oYW4KvSios',
    thumbnailUrl: 'https://img.youtube.com/vi/-oYW4KvSios/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658952/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EB%B6%95%EC%96%B4%EB%B9%B5_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/269',
    desc: '추운 겨울날 김이 모락모락 피어오르는 붕어빵처럼, 평범한 일상의 따뜻한 온기를 잔잔한 기타와 휘슬 멜로디로 담아낸 대표 감성 트랙입니다.',
    tags: ['어쿠스틱', '포크', '브이로그', '힐링', '겨울감성']
  },
  {
    postNumber: '266',
    id: 'afan-266',
    title: '잘가요 로맨스 (Goodbye romance)',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'pop',
    genre: '시티팝 & 로맨스',
    mood: '레트로 · 세련됨 · 낭만',
    bpm: 110,
    duration: '03:36',
    youtubeId: 'o0mo17shi2g',
    thumbnailUrl: 'https://img.youtube.com/vi/o0mo17shi2g/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658945/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%9E%98%EA%B0%80%EC%9A%94.%EB%A1%9C%EB%A7%A8%EC%8A%A4_Goodbye_romance__%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/266',
    desc: '도시의 네온사인 아래 지나간 계절의 사랑을 쿨하고 경쾌한 그루브와 몽환적인 신스 사운드로 풀어낸 모던 시티팝 트랙입니다.',
    tags: ['시티팝', '신스웨이브', '레트로', '드라이브', '그루브']
  },
  {
    postNumber: '264',
    id: 'afan-264',
    title: '찬란, 봄',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'acoustic',
    genre: '피아노 연주곡 & 발라드',
    mood: '화사함 · 설렘 · 새출발',
    bpm: 84,
    duration: '02:58',
    youtubeId: 'bwiOLl9fnbU',
    thumbnailUrl: 'https://img.youtube.com/vi/bwiOLl9fnbU/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658943/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%B0%AC%EB%9E%80_%EB%B4%84_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/264',
    desc: '봄꽃이 피어나듯 맑고 영롱한 피아노 선율이 새로운 출발과 희망찬 설렘을 수채화처럼 수놓는 힐링 피아노 트랙입니다.',
    tags: ['피아노연주', '봄', '희망', '청춘', '새출발']
  },
  {
    postNumber: '268',
    id: 'afan-268',
    title: '우린 마치',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'pop',
    genre: '인디 감성 팝',
    mood: '서정적 · 풋풋함 · 여운',
    bpm: 96,
    duration: '03:42',
    youtubeId: 'HhFWUxpzGHo',
    thumbnailUrl: 'https://img.youtube.com/vi/HhFWUxpzGHo/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658946/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%9A%B0%EB%A6%B0_%EB%A7%88%EC%B9%98_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/268',
    desc: '서로를 조심스레 알아가는 순간의 떨림과 설렘을 어쿠스틱 피아노와 스트링의 감미로운 조화로 완성한 인디 감성 트랙입니다.',
    tags: ['인디팝', '피아노', '감성', '로맨스', '서정']
  },
  {
    postNumber: '267',
    id: 'afan-267',
    title: 'Rain is falling',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'ambient',
    genre: '재즈 & 감성 BGM',
    mood: '차분함 · 사색 · 비 오는 날',
    bpm: 76,
    duration: '03:28',
    youtubeId: 'WKm2cCDK3PA',
    thumbnailUrl: 'https://img.youtube.com/vi/WKm2cCDK3PA/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658953/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_Rain_is_falling_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/267',
    desc: '유리창을 토닥이는 빗소리와 함께 은은하게 울려 퍼지는 재즈 피아노 터치가 마음을 차분하게 정리해 주는 센티멘털 트랙입니다.',
    tags: ['재즈피아노', '로파이', '비오는날', '휴식', '카페']
  },
  {
    postNumber: '259',
    id: 'afan-259',
    title: '오래의 부탁',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'cinematic',
    genre: '시네마틱 오케스트라',
    mood: '웅장함 · 서사 · 감동',
    bpm: 72,
    duration: '04:12',
    youtubeId: 'fUA4-R2UPbE',
    thumbnailUrl: 'https://img.youtube.com/vi/fUA4-R2UPbE/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658949/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%98%A4%EB%9E%98%EC%9D%98_%EB%B6%80%ED%83%81_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/259',
    desc: '시간을 건너 전하는 진심 어린 이야기를 깊은 첼로 독주와 점진적으로 고조되는 오케스트라 스트링으로 형상화한 시네마틱 트랙입니다.',
    tags: ['영화음악', '오케스트라', '스트링', '감동', '드라마']
  },
  {
    postNumber: '260',
    id: 'afan-260',
    title: '조수간만의 차 (Song of a wave)',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'ambient',
    genre: '앰비언트 & 칠아웃',
    mood: '몽환적 · 고요함 · 바다',
    bpm: 68,
    duration: '04:05',
    youtubeId: 'wXagKs_qZTM',
    thumbnailUrl: 'https://img.youtube.com/vi/wXagKs_qZTM/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658958/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%A1%B0%EC%88%98%EA%B0%84%EB%A7%8C%EC%9D%98_%EC%B0%A8_Song_of_a_wave__%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/260',
    desc: '밀려왔다 밀려가는 파도의 호흡을 앰비언트 패드와 신비로운 공간계 사운드로 재현한 고품격 명상 힐링 음악입니다.',
    tags: ['앰비언트', '바다', '명상', '수면', '힐링사운드']
  },
  {
    postNumber: '258',
    id: 'afan-258',
    title: '바램 (멀리 가지 않아도)',
    artist: '지윤(노래) · 이진헌(작곡)',
    category: 'acoustic',
    genre: '어쿠스틱 발라드',
    mood: '위로 · 따뜻한 포옹 · 안식',
    bpm: 78,
    duration: '03:30',
    youtubeId: 'e0njles7ggI',
    thumbnailUrl: 'https://img.youtube.com/vi/e0njles7ggI/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658953/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EB%B0%94%EB%9E%A8_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/258',
    desc: '지친 하루 끝에 건네는 묵묵한 위로처럼, 담담한 어쿠스틱 기타 리프 위에 스며드는 현악의 따스한 온기를 전하는 필름에세이 테마곡입니다.',
    tags: ['위로', '발라드', '어쿠스틱', '감성', '휴식']
  },
  {
    postNumber: '256',
    id: 'afan-256',
    title: '블루포레스트 (Blue Forest)',
    artist: '지윤(노래) · 이진헌(작사·작곡)',
    category: 'cinematic',
    genre: 'CF & 시네마틱 BGM',
    mood: '자연의 신비 · 장엄함 · 에코',
    bpm: 104,
    duration: '03:18',
    youtubeId: 'DTWBQ2a-pIA',
    thumbnailUrl: 'https://img.youtube.com/vi/DTWBQ2a-pIA/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792667839/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81__%EB%B8%94%EB%A3%A8%ED%94%84%EB%A0%88%EC%8A%A4%ED%8A%B8_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/256',
    desc: '★ 삼성 The Sero 아프리카 4K 편 CF 공식 BGM. 대자연의 광활함과 생명력을 역동적으로 그려내 호평을 받은 명작 트랙입니다.',
    tags: ['삼성CF', '대자연', '다큐멘터리', '모던클래식', '영상미']
  },
  {
    postNumber: '239',
    id: 'afan-239',
    title: 'Remember (나를 꼭 기억해줘요)',
    artist: '지윤(노래) · 신정훈(작곡)',
    category: 'acoustic',
    genre: '감성 발라드 & 포크',
    mood: '기억 · 아련함 · 그리움',
    bpm: 82,
    duration: '03:40',
    youtubeId: 'x6KGGd7VU1M',
    thumbnailUrl: 'https://img.youtube.com/vi/x6KGGd7VU1M/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658949/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_Remember_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/239',
    desc: '지나간 인연과 소중했던 순간들을 마음 깊이 간직하는 애틋한 그리움을 맑은 보컬과 어쿠스틱 선율로 풀어낸 곡입니다.',
    tags: ['기억', '발라드', '어쿠스틱', '감성', '추억']
  },
  {
    postNumber: '232',
    id: 'afan-232',
    title: '냉장고',
    artist: '이진헌(노래·작사·작곡)',
    category: 'pop',
    genre: 'B급 감성 코믹 팝',
    mood: '유머 · 현실공감 · 자취생의 애환',
    bpm: 116,
    duration: '03:20',
    youtubeId: 'vvQqrYM74zA',
    thumbnailUrl: 'https://img.youtube.com/vi/vvQqrYM74zA/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792668627/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EB%83%89%EC%9E%A5%EA%B3%A0_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/232',
    desc: '자취인들의 언제나 비어있는 냉장고의 애환과 지름신 경고를 B급 유머와 중독성 넘치는 멜로디로 재치 있게 담아낸 유쾌한 곡입니다.',
    tags: ['코믹', 'B급감성', '자취생', '유머', '현실공감']
  },
  {
    postNumber: '222',
    id: 'afan-222',
    title: '에라 모르겠다',
    artist: '지윤(노래) · 이진헌(작사·작곡) · 신정훈(편곡)',
    category: 'pop',
    genre: '신스팝 & 댄스',
    mood: '통쾌함 · 신나는 · 스트레스 해소',
    bpm: 124,
    duration: '03:15',
    youtubeId: 'nTMYna50ZhU',
    thumbnailUrl: 'https://img.youtube.com/vi/nTMYna50ZhU/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658953/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%97%90%EB%9D%BC%EB%AA%A8%EB%A5%B4%EA%B2%A0%EB%8B%A4_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/222',
    desc: '복잡한 고민은 잠시 접어두고 신나게 질주하는 유쾌한 에너지와 중독성 강한 후렴구로 스트레스를 날려주는 신스팝 댄스 트랙입니다.',
    tags: ['신스팝', '댄스', '신나는', '에너지', '스트레스해소']
  },
  {
    postNumber: '224',
    id: 'afan-224',
    title: '첫사랑',
    artist: '지윤(노래) · 이진헌(작사·작곡)',
    category: 'acoustic',
    genre: '어쿠스틱 포크 발라드',
    mood: '순수함 · 첫사랑의 설렘 · 아련함',
    bpm: 86,
    duration: '03:32',
    youtubeId: 'm98Ad-Cw08w',
    thumbnailUrl: 'https://img.youtube.com/vi/m98Ad-Cw08w/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658955/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%B2%AB%EC%82%AC%EB%9E%91_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/224',
    desc: '누구에게나 가슴 한구석에 남아있는 첫사랑의 서툴렀지만 순수했던 고백의 순간을 맑은 기타 아르페지오로 노래한 곡입니다.',
    tags: ['어쿠스틱', '첫사랑', '순수', '발라드', '설렘']
  },
  {
    postNumber: '198',
    id: 'afan-198',
    title: 'We got summer',
    artist: '지윤(노래) · 신정훈(작곡)',
    category: 'pop',
    genre: '서머 팝 & 에너지',
    mood: '청량함 · 여름 바다 · 드라이브',
    bpm: 120,
    duration: '03:25',
    youtubeId: '_otrtgL6C48',
    thumbnailUrl: 'https://img.youtube.com/vi/_otrtgL6C48/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658943/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_We_got_summer_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/198',
    desc: '아트판타지아 공식 서머 테마곡으로 제작된 시원하고 청량한 서머 팝. 크리에이터들의 여름 영상 BGM으로 전면 무료 전환된 선물 같은 트랙입니다.',
    tags: ['여름', '서머팝', '청량', '드라이브', '바다']
  },
  {
    postNumber: '167',
    id: 'afan-167',
    title: '새벽항해',
    artist: '박지윤(노래) · 신정훈(작곡)',
    category: 'acoustic',
    genre: '핑거스타일 어쿠스틱',
    mood: '새벽 감성 · 고요한 도전 · 출항',
    bpm: 90,
    duration: '03:10',
    youtubeId: 'aNbEBDuCbCY',
    thumbnailUrl: 'https://img.youtube.com/vi/aNbEBDuCbCY/hqdefault.jpg',
    audioUrl: 'https://res.cloudinary.com/iwcoiohr/video/upload/fl_attachment/v1792658957/%EC%95%84%ED%8C%90%EB%AE%A4%EC%A7%81_%EC%83%88%EB%B2%BD%ED%95%AD%ED%95%B4_%EC%95%84%ED%8A%B8%ED%8C%90%ED%83%80%EC%A7%80%EC%95%84_ArtFantasia.mp3',
    postUrl: 'https://artfantasia.co.kr/167',
    desc: '모두가 잠든 고요한 새벽, 나만의 꿈을 향해 닻을 올리는 첫 발걸음을 핑거스타일 기타 테크닉으로 맑고 정갈하게 연주한 트랙입니다.',
    tags: ['핑거스타일', '기타', '새벽', '꿈', '출항']
  }
];

export const AfanMusicSection: React.FC<AfanMusicSectionProps> = ({ onOpenInquiry }) => {
  const [activeTrack, setActiveTrack] = useState<AfanTrack | null>(null);
  const [copiedTrackId, setCopiedTrackId] = useState<string | null>(null);
  const filteredTracks = AFAN_ORIGINAL_TRACKS;

  const handleOpenTrackModal = (track: AfanTrack) => {
    setActiveTrack(track);
    window.location.hash = `afanmusic-${track.id}`;
  };

  const handleCloseTrackModal = () => {
    setActiveTrack(null);
    if (window.location.hash && window.location.hash.startsWith('#afanmusic-')) {
      history.pushState(null, '', '#afanmusic');
    }
  };

  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#afanmusic-')) {
        const targetId = hash.replace(/^#afanmusic-/, '').trim();
        const found = AFAN_ORIGINAL_TRACKS.find(
          (t) => t.id === targetId || t.postNumber === targetId
        );
        if (found) {
          setActiveTrack(found);
        }
      } else if (activeTrack) {
        setActiveTrack(null);
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [activeTrack]);

  const copyTrackLink = (track: AfanTrack, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/#afanmusic-${track.id}`;
    navigator.clipboard.writeText(shareUrl);
    window.location.hash = `afanmusic-${track.id}`;
    setCopiedTrackId(track.id);
    setTimeout(() => setCopiedTrackId(null), 2000);
  };

  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const handleCopyCitation = () => {
    navigator.clipboard.writeText('BGM: 아트판타지아 아판뮤직 (artfantasia.co.kr)');
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleDownloadTrack = async (track: AfanTrack, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const targetUrl = track.audioUrl || track.postUrl;
    if (!targetUrl) return;

    const downloadUrl = targetUrl.includes('cloudinary.com') && !targetUrl.includes('fl_attachment')
      ? targetUrl.replace('/upload/', '/upload/fl_attachment/')
      : targetUrl;

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = `[아판뮤직] ${track.title}_아트판타지아(ArtFantasia).mp3`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct browser fallback with attachment flag
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.setAttribute('download', `[아판뮤직] ${track.title}_아트판타지아(ArtFantasia).mp3`);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  };

  // Cinema Video Showcase player states (Moving Forward)
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);
  const showcaseContainerRef = useRef<HTMLDivElement | null>(null);
  const [isShowcasePlaying, setIsShowcasePlaying] = useState<boolean>(false);
  const [isShowcaseMuted, setIsShowcaseMuted] = useState<boolean>(false);
  const [showcaseVolume, setShowcaseVolume] = useState<number>(0.85);
  const [showcaseProgress, setShowcaseProgress] = useState<number>(0);
  const [showcaseTime, setShowcaseTime] = useState<number>(0);
  const [showcaseDuration, setShowcaseDuration] = useState<number>(33);
  const [showcaseFullscreen, setShowcaseFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.muted = false;
    }
    const handleFsChange = () => {
      setShowcaseFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === showcaseContainerRef.current));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const formatShowcaseTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShowcaseTimeUpdate = () => {
    const v = showcaseVideoRef.current;
    if (!v) return;
    setShowcaseTime(v.currentTime);
    const dur = v.duration || 33;
    setShowcaseDuration(dur);
    if (dur > 0) {
      setShowcaseProgress((v.currentTime / dur) * 100);
    }
  };

  const toggleShowcasePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    if (isShowcasePlaying) {
      v.pause();
      setIsShowcasePlaying(false);
    } else {
      v.muted = isShowcaseMuted;
      v.play().then(() => setIsShowcasePlaying(true)).catch(() => {});
    }
  };

  const toggleShowcaseMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    const nextMuted = !isShowcaseMuted;
    v.muted = nextMuted;
    setIsShowcaseMuted(nextMuted);
    if (!nextMuted) {
      if (showcaseVolume === 0) {
        setShowcaseVolume(0.85);
        v.volume = 0.85;
      } else {
        v.volume = showcaseVolume;
      }
    }
  };

  const handleShowcaseVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setShowcaseVolume(val);
    const v = showcaseVideoRef.current;
    if (v) {
      v.volume = val;
      if (val === 0) {
        v.muted = true;
        setIsShowcaseMuted(true);
      } else if (isShowcaseMuted) {
        v.muted = false;
        setIsShowcaseMuted(false);
      }
    }
  };

  const handleShowcaseScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = showcaseVideoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = v.duration && !isNaN(v.duration) && v.duration > 0 ? v.duration : (showcaseDuration || 33);
    const targetTime = ratio * dur;
    v.currentTime = targetTime;
    setShowcaseTime(targetTime);
  };

  const handleShowcaseFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showcaseContainerRef.current) return;
    if (!document.fullscreenElement) {
      showcaseContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleShowcaseMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isShowcasePlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleScreenInteraction = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isShowcasePlaying) {
      if (!showControls) {
        if (e) e.stopPropagation();
        handleShowcaseMouseMove();
      } else {
        toggleShowcasePlay(e as React.MouseEvent);
      }
    } else {
      toggleShowcasePlay(e as React.MouseEvent);
    }
  };

  return (
    <section className="pt-6 sm:pt-8 pb-16 sm:pb-24 border-b border-zinc-800 bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header Section */}
        <StandardSectionHeader
          title="아판뮤직"
          subtitle={
            <>
              모든 창작자의{' '}
              <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">
                빛나는 꿈
              </span>
              을 응원합니다.
            </>
          }
          className="mb-6 sm:mb-8"
        />

        {/* Cinema Video Showcase: Moving Forward // 00:33 - Matching AudioPortfolio position & design */}
        <div className="w-full max-w-5xl mx-auto my-10 sm:my-12 relative group">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-amber-500/[0.04] blur-2xl pointer-events-none" />

          {/* Interactive Cinema Video Container */}
          <div
            ref={showcaseContainerRef}
            onMouseMove={handleShowcaseMouseMove}
            onMouseEnter={handleShowcaseMouseMove}
            onTouchStart={handleShowcaseMouseMove}
            onTouchMove={handleShowcaseMouseMove}
            onMouseLeave={() => isShowcasePlaying && setShowControls(false)}
            className="relative rounded-lg border border-zinc-700/80 bg-zinc-950 overflow-hidden shadow-2xl select-none"
          >
            {/* Top Panel Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#343a42] via-[#21262d] to-[#14171b] border-b border-[#3b434e] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.9)] text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.8)]" />
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-zinc-400 font-medium tracking-wider notranslate" translate="no">CODEC: H.264 / PRORES</span>
                <span className="text-zinc-100 font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  00:{formatShowcaseTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:00:33:00</span>
                </span>
              </div>
            </div>

            {/* Video Player Screen */}
            <div
              onTouchStart={handleShowcaseMouseMove}
              onTouchMove={handleShowcaseMouseMove}
              className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group"
            >
              <video
                ref={showcaseVideoRef}
                src="https://res.cloudinary.com/iwcoiohr/video/upload/v1792397402/Moving_Forward_1.mp4"
                poster="/assets/aistudio/234_14390242.jpg"
                playsInline
                muted={isShowcaseMuted}
                preload="metadata"
                onClick={handleScreenInteraction}
                className="w-full h-full object-cover block cursor-pointer"
                onPlay={() => {
                  setIsShowcasePlaying(true);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                  controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
                }}
                onPause={() => {
                  setIsShowcasePlaying(false);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                }}
                onTimeUpdate={handleShowcaseTimeUpdate}
                onLoadedMetadata={() => {
                  if (showcaseVideoRef.current?.duration) {
                    setShowcaseDuration(showcaseVideoRef.current.duration);
                  }
                }}
                onEnded={() => {
                  setIsShowcasePlaying(false);
                  setShowControls(true);
                  if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                }}
              />

              {/* Custom Poster Thumbnail 234 (Moving Forward) */}
              {!isShowcasePlaying && showcaseTime === 0 && (
                <img
                  src="/assets/aistudio/234_14390242.jpg"
                  alt="Moving Forward 커스텀 썸네일"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Cinematic Center Overlay & Play Button */}
              {!isShowcasePlaying && (
                <div
                  onClick={handleScreenInteraction}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer z-15 bg-black/15 hover:bg-black/25 transition-colors group/overlay"
                >
                  <span
                    className="notranslate text-xs sm:text-sm font-mono tracking-wider font-bold text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    translate="no"
                  >
                    Brand Film · Moving Forward · Inspiration
                  </span>
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-6 font-apple">
                    세상을 영상과 음악으로 표현합니다.
                  </h3>

                  {/* Standard 111 Gradient Play Button */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#F15A29] via-[#E9422F] to-[#DD2426] text-white flex items-center justify-center shadow-[0_0_35px_rgba(233,66,47,0.6)] group-hover/overlay:scale-110 group-hover/overlay:shadow-[0_0_50px_rgba(233,66,47,0.85)] transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                  </div>

                  {/* Standard Play Description */}
                  <span className="text-xs sm:text-sm text-zinc-200 mt-4 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    재생 버튼 또는 화면을 클릭하시면 영상을 감상하실 수 있습니다
                  </span>
                </div>
              )}

              {/* Player Controls Overlay */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between gap-4 py-2 px-3.5 bg-gradient-to-b from-[#343a42]/95 via-[#21262d]/95 to-[#14171b]/95 backdrop-blur-md rounded border border-[#3b434e] ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.9)] z-20 transition-opacity duration-300 ${
                  showControls || !isShowcasePlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleShowcasePlay}
                    className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                    aria-label={isShowcasePlaying ? '일시 정지' : '재생'}
                  >
                    {isShowcasePlaying ? (
                      <Pause className="w-4 h-4 fill-zinc-200" />
                    ) : (
                      <Play className="w-4 h-4 fill-zinc-200" />
                    )}
                  </button>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={toggleShowcaseMute}
                      className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
                      aria-label={isShowcaseMuted || showcaseVolume === 0 ? '음소거 해제' : '음소거'}
                    >
                      {isShowcaseMuted || showcaseVolume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                      <span className="text-[11px] font-mono text-zinc-300 font-semibold hidden sm:inline">
                        {isShowcaseMuted || showcaseVolume === 0 ? 'MUTE' : 'AUDIO ON'}
                      </span>
                    </button>

                    {/* Volume Slider right after AUDIO ON */}
                    <div className="flex items-center gap-1.5 pl-0.5">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isShowcaseMuted ? 0 : showcaseVolume}
                        onChange={handleShowcaseVolumeChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-14 sm:w-20 h-1.5 bg-[#0d0f12] rounded-lg cursor-pointer accent-zinc-200 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                        title={`볼륨: ${Math.round((isShowcaseMuted ? 0 : showcaseVolume) * 100)}%`}
                      />
                      <span className="text-[10px] font-mono text-zinc-300 font-bold w-6 sm:w-7 text-right tabular-nums hidden xs:inline">
                        {isShowcaseMuted ? '0%' : `${Math.round(showcaseVolume * 100)}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Time Scrubber */}
                <div className="flex-1 mx-2 flex items-center gap-3">
                  <div
                    className="flex-1 h-1.5 bg-[#0d0f12] rounded overflow-hidden cursor-pointer relative border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
                    onClick={handleShowcaseScrub}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-75"
                      style={{ width: `${showcaseProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-200 font-semibold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    00:{formatShowcaseTime(showcaseTime)} <span className="text-zinc-500 font-normal">/ 00:00:33:00</span>
                  </span>
                </div>

                <button
                  onClick={handleShowcaseFullscreenToggle}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer"
                  aria-label={showcaseFullscreen ? '전체화면 종료' : '전체화면'}
                >
                  {showcaseFullscreen ? <Minimize className="w-4 h-4 text-zinc-300" /> : <Maximize className="w-4 h-4 text-zinc-300" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Afan Music Brand Narrative & Usage Guide - Styled after Radio Ad Production Pipeline */}
        <div className="w-full my-8 sm:my-10 pt-6 border-t border-zinc-800/80 font-google">
          {/* Narrative Headline */}
          <div className="mb-6 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              따뜻한 음악 공간. 아판뮤직
            </h3>
            <p className="mt-2.5 text-sm sm:text-base font-medium text-white font-google text-center max-w-4xl leading-relaxed">
              <span className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-amber-400 font-bold shrink-0">◉</span>
                <span>음원 판매의 상업적 목적이 아닌, 비상업적 용도(개인 소장, 공모전 출품, 유튜브 영상 BGM)로</span>
              </span>
              <br />
              <span className="inline-block mt-0.5 sm:mt-1">
                <span className="font-bold text-white underline decoration-white/60 underline-offset-4">누구나 자유롭게 활용</span>하실 수 있도록 열려 있는 따뜻한 음악 공간입니다.
              </span>
            </p>
          </div>

          {/* Guide Section Header */}
          <div className="my-6 font-google">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-[15px] sm:text-[17.5px] font-bold font-google text-zinc-100 tracking-normal">
                무료 음악 사용 & 저작권 가이드라인
              </span>
            </div>

            {/* 4 Core Pillars styled with vivid blue accents matching Radio page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {/* Guide 01: 공모전 출품작 전면 무료 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.22)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-sm shadow-sm">
                      GUIDE 01
                    </span>
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    공모전 출품작 전면 무료
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    공모전 상금 여부와 관계없이 자유롭게 사용 가능합니다.
                    <span className="block text-blue-300/90 font-medium mt-1">
                      "더 나은 미래를 준비하시는 그 올바름은 당연히 응원받으셔야죠."
                    </span>
                  </p>
                </div>
              </div>

              {/* Guide 02: 개인 유튜브 수익창출 허용 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.22)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-sm shadow-sm">
                      GUIDE 02
                    </span>
                    <Video className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    개인 유튜브 수익창출 허용
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    소속사/기업형 채널이 아닌 개인 유튜브 채널이라면, <strong className="text-white">광고 수익이 창출되는 채널이라도 언제든 자유롭게</strong> BGM으로 사용하실 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Guide 03: 비상업적 용도 완전 개방 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.22)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-sm shadow-sm">
                      GUIDE 03
                    </span>
                    <Heart className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                  </div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    비상업적 용도 완전 개방
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    개인 소장, 학생 영상 과제, 포트폴리오, 독립 창작물 등 음원 자체를 재판매하는 행위가 아니라면 누구나 무료로 이용할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Guide 04: 상업적 판매 및 납품 제한 */}
              <div className="relative rounded-xl bg-zinc-950/85 border border-zinc-800/80 hover:border-blue-400/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.22)] flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block text-[11px] font-google font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-sm shadow-sm">
                      GUIDE 04
                    </span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug font-google">
                    상업적 판매 및 납품 제한
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal font-google">
                    음원 파일 자체의 유료 재판매, 특정 제작비를 수령한 방송/외주 납품, 원곡자 미표기 상업 공연은 사전 협의 및 정식 라이선스가 필요합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Citation Info Bar - Redesigned Minimalist White Edition */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 font-google transition-all duration-200">
              <div className="flex items-center gap-3.5 text-center md:text-left flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 font-google">
                    권장 출처 표기 양식
                  </h5>
                  <p className="text-[12.5px] sm:text-[13px] text-zinc-600 font-google mt-0.5 leading-relaxed">
                    더보기란이나 본문 자막에 아래의 양식을 간편하게 기재해 주시면 감사하겠습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-center flex-wrap sm:flex-nowrap">
                <code className="text-xs sm:text-[13px] font-mono font-semibold text-zinc-900 bg-zinc-100/90 border border-zinc-300/80 px-3.5 py-2 rounded-xl select-all shadow-inner tracking-tight">
                  BGM: 아트판타지아 아판뮤직 (artfantasia.co.kr)
                </code>
                <button
                  onClick={handleCopyCitation}
                  className="px-3.5 py-2 text-xs font-bold font-google rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer bg-zinc-900 hover:bg-blue-600 text-white"
                  title="출처 표기 양식 복사"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>양식 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Showcase Header & Category Tabs (Matching VideoPortfolio Form & Design) */}
        <div className="w-full my-8 sm:my-10 pt-6 border-t border-zinc-800/80">
          {/* Subtitle & Description Header */}
          <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-google text-center">
              아판뮤직 공식 음원 라이브러리
            </h3>
            <p className="mt-2 text-sm sm:text-base font-medium text-amber-400 flex items-center justify-center gap-2 flex-wrap font-google text-center">
              <span className="text-amber-400 font-bold shrink-0 text-sm sm:text-base">◉</span>
              <span className="text-amber-400 font-semibold text-sm sm:text-base">
                기획,작사,작곡,보컬,편곡,믹싱 등 <span className="font-black text-amber-300 underline decoration-amber-400/60 underline-offset-4">100% 자체 제작</span> 무료 공개 음원입니다.
              </span>
            </p>
          </div>

        </div>

        {/* Modular Grid of Cards with Black Background & White Cards (No Borders - Matching VideoPortfolio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-8 p-5 sm:p-7 md:p-8 rounded-2xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-google">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleOpenTrackModal(track)}
              className="group cursor-pointer rounded-xl bg-white transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] shadow-md"
            >
              {/* Media Card Thumbnail Container (16:9) */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={track.thumbnailUrl}
                  alt={track.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:from-black/40 transition-colors" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{track.genre}</span>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-zinc-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-300" />
                    <span>{track.duration}</span>
                  </div>
                </div>

                {/* Center Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Body - Crisp White Lower Description Area */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs mb-2.5 flex-wrap">
                    <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded text-[11px]">
                      {track.artist}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1 tracking-tight leading-snug mt-2.5">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                    {track.desc}
                  </p>
                </div>

                {/* Roles and Action */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 truncate max-w-[62%] font-medium">
                    {track.mood}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium text-xs group-hover:bg-amber-500 group-hover:text-black transition-all shadow-sm">
                    <span>영상 재생 / 감상</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Reel Modal / Screening Popup (Matching VideoPortfolio Modal) */}
        {activeTrack && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={handleCloseTrackModal}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-zinc-900 border-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 bg-white sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2.5 truncate mr-4">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-[11px] font-mono text-amber-700 uppercase font-bold shrink-0">
                    SCREENING
                  </span>
                  <span className="text-xs font-mono text-zinc-500 shrink-0">아판뮤직</span>
                  <span className="text-zinc-300 shrink-0">|</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">{activeTrack.title}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => copyTrackLink(activeTrack, e)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    title={copiedTrackId === activeTrack.id ? "링크 복사 완료!" : "공유하기"}
                    aria-label="공유하기"
                  >
                    {copiedTrackId === activeTrack.id ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseTrackModal}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                    aria-label="닫기"
                    title="닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Player Modal Content */}
              <div className="p-4 sm:p-6 space-y-6">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeTrack.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Track Actions & Metadata Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                        {activeTrack.genre}
                      </span>
                      <span className="text-xs text-zinc-300">·</span>
                      <span className="text-xs text-zinc-500 font-medium">{activeTrack.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900">
                        {activeTrack.title}
                      </h4>
                      <span className="text-xs text-zinc-300">·</span>
                      <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                        아티스트: {activeTrack.artist}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - MP3 Download on the right end */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <a
                      href={activeTrack.audioUrl
                        ? (activeTrack.audioUrl.includes('cloudinary.com') && !activeTrack.audioUrl.includes('fl_attachment')
                            ? activeTrack.audioUrl.replace('/upload/', '/upload/fl_attachment/')
                            : activeTrack.audioUrl)
                        : activeTrack.postUrl}
                      onClick={(e) => handleDownloadTrack(activeTrack, e)}
                      download={`[아판뮤직] ${activeTrack.title}_아트판타지아(ArtFantasia).mp3`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>MP3 다운로드</span>
                    </a>
                  </div>
                </div>

                {/* Description & Notice */}
                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">무료 음원 이용 안내:</strong> 본 음악은 비상업적 용도(소장, 개인적 사용, 개인 유튜브 BGM)로 자유롭게 사용하실 수 있습니다. 영상 업로드 시 아판뮤직 출처(artfantasia.co.kr)를 기재해 주시기 바랍니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Music Production Inquiry Banner & Gateway - Minimalist White Edition (Matching VideoPortfolio) */}
        <div
          onClick={onOpenInquiry}
          className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md my-6 cursor-pointer font-google transition-all duration-200"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-center lg:text-left">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                <span>맞춤 음악 제작 & 오리지널 음원 견적 상담</span>
              </div>
              
              <h4 className="text-base sm:text-lg lg:text-[20px] font-bold text-zinc-900 tracking-tight leading-snug">
                아판뮤직 <span className="font-extrabold text-zinc-950">콜라보레이션 & 오리지널 음악</span>이 필요하신가요?
              </h4>
              
              <p className="text-xs sm:text-[13.5px] text-zinc-500 leading-relaxed font-normal">
                대중가요, 로고송, 영상 BGM, 영화/드라마 OST, 마스터링까지 <strong className="font-semibold text-zinc-800">100% 책임 진행</strong>해 드립니다.
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenInquiry) onOpenInquiry();
                }}
                className="px-6 py-3.5 text-sm font-bold text-white bg-zinc-950 hover:bg-amber-500 hover:text-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group-hover:scale-105 cursor-pointer font-google whitespace-nowrap"
              >
                <span>음악 제작 문의 / 협업 문의</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
