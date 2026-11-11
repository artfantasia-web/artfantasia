import { VideoProject, AudioTrack, MarketingCase, NoticeItem } from '../types';

export const COMPANY_INFO = {
  brandName: '아트판타지아',
  brandNameEn: 'ArtFantasia',
  nameKo: '아트판타지아',
  nameEn: 'ArtFantasia',
  title: '아트판타지아 | ArtFantasia - 홍보영상 · 광고영상 · AI영상제작 · 미디어파사드 · 음악라디오 · 종합마케팅',
  businessDescription: '크리에이티브 프로덕션, 광고영상제작, AI 영상제작, 공공기관·기업·교육기관 홍보영상제작, 여성기업 영상제작사, 브랜드필름, 미디어파사드, 음악·라디오제작, 데이터 기반 마케팅',
  maritimeExpertise: {
    title: '해양·조선·바다 특화 영상제작 기술',
    summary: '선박 시운전, 대형 조선소 중공업 공정, 해양플랜트, 해양환경, 해상 드론 및 특수촬영 특화 역량',
    references: ['DSEC 조선·해양 종합 엔지니어링 홍보영상', 'KOEM 해양환경공단 표준 예선작업절차 안전영상', '한국해양마이스터고등학교 실습선 4K 영상', 'K-water 한국수자원공사 프로젝트'],
    techHighlights: [
      '염분·강풍·거친 해상 파도에 대응하는 방수·내염 시네마 특수 촬영 장비 운용',
      '원거리 해상 선박 및 플랜트 추적 항공 드론 촬영 기술',
      '선박 정밀 3D 구조 시각화(VFX) 및 생성형 AI 해양 비주얼라이제이션',
      '선박 예선작업 및 해양 안전 절차 표준 매뉴얼 영상화 노하우'
    ]
  },
  legalName: '아트판타지아',
  legalNameKo: '아트판타지아',
  ceo: '배정아',
  isFemaleEnterprise: true,
  femaleEnterpriseLabel: '중소벤처기업부 여성기업 확인',
  established: '2015',
  establishedDetail: '2015년 12월 법인 설립',
  headquarters: '대구광역시 북구 학정로 132-1 아트판타지아 빌딩',
  seoulOffice: '서울특별시 관악구 관악로 943 (이전 준비 中)',
  contentCenter: '대구광역시 북구 학정로 132-1 아트판타지아 빌딩',
  address: '대구광역시 북구 학정로 132-1 아트판타지아 빌딩 / 서울 제작편집사무소: 관악구 관악로 943',
  website: 'artfantasia.co.kr',
  contactEmail: 'af@artfantasia.co.kr',
  inquiryPhone: '1661-5680',
  studioPhone: '1661-5680',
  businessNumber: '837-87-03564',
  femaleEnterpriseCert: '제 0113-2025-34993 호 (중소벤처기업부 여성기업확인)',
  videoProductionReg: '170-11-10974635',
  directProductionCert: '제 2025-0495-01414 호',
  slogan: '세상을 영상과 음악으로 표현합니다',
  subSlogan: '우리에게 최고의 브랜드는 당신입니다',
  missionSlogan: '당신의 이야기가 세상에 울려 퍼지도록',
  responsibilityPrinciple: '* 하도급 없는 책임 제작',
  tagline: '세상을 영상과 음악으로 표현합니다',
  subTagline: 'WE EXPRESS THE WORLD WITH IMAGES AND MUSIC // CHANGE THE GAME',
  mission: '외주 재하청 없는 100% 책임 제작 원칙으로, 15년 이상 경력의 감독진과 자체 녹음실·서버 인프라를 통해 영상과 음악의 최상위 시너지를 완성합니다.',
  stats: [
    { label: '글로벌 파트너 국가', value: '20+', unit: '개국' },
    { label: '해외 네트워크 영상', value: '3,000,000+', unit: 'ea' },
    { label: '고객사 만족 책임제작', value: '100%', unit: '하도급 없음' },
    { label: '자체 서버 보관', value: '1', unit: '년 원칙' }
  ],
  equipment: [
    { category: '시네마 & 방송 카메라', items: 'ARRI, RED, Blackmagicdesign, SONY, CANON, NIKON, DJI' },
    { category: '사운드 & 음악 제작 스위트', items: '자체 녹음실, CUBASE, Audition, Logic PRO, 7.1.4 공간음향, 16개국 글로벌 성우진' },
    { category: 'AI & 3D 테크놀로지', items: 'Midjourney, Gemini, KLING, Luma, Blender, Unreal Engine, AI 음원 연구' },
    { category: '후반 편집 & 마스터링', items: 'Premiere, AfterEffect, Animater, Cinema 4D, Photoshop, Illustrator, Final Cut PRO (DI, CG, 3D)' }
  ],
  clients: [
    '대한민국 정부', '삼성전자', '현대자동차', 'K-WATER 한국수자원공사', 'E1',
    '기획재정부', 'KOTRA', 'KDI 한국개발연구원', '신용보증기금', 'KOEM 해양환경공단',
    '사행산업통합감독위원회', '교촌 F&B', '한화', '국방기술품질원', '창업진흥원'
  ],
  // 공식 A/S 규정
  asPolicy: {
    storage: '촬영 원본, 녹음 원본, PROJECT는 자체 안전 서버실 1년 보관 원칙',
    video: [
      '글자 수정 1년 3회 무상 (3D, CG텍스트 제외)',
      '영상, 사진 변경 3개월 이내 2회 무상 (촬영 본 내에서 변경)',
      '성우 수정녹음 1회 무상 (최종시사 후 10일 이내)',
      '음원 변경 1개월 내 무상 (저작권 등록 음원 제외)'
    ],
    audio: [
      '음원파일 변형 15일 이내 무상',
      '로고송 제작 시 MR 별도 제공'
    ]
  },
  // 공식 연혁
  history: [
    { year: '2025', desc: 'AI 혁신 시스템 고도화 및 프로덕션 체질 개선 (여성기업확인 획득)' },
    { year: '2024.10', desc: '글로벌 프로덕션 브랜드 체계 개편' },
    { year: '2019.06', desc: '영화상영등급필증 획득 (전체관람가)' },
    { year: '2019.05', desc: 'SBS미디어크리에이트 방송광고거래 계약 체결' },
    { year: '2018.08', desc: '한국무역협회 회원 등록' },
    { year: '2017.09', desc: '인도네시아 대통령 VIP VIEW / 해외현지 촬영(미국, 일본, 체코, 중국, 싱가포르) / 한국방송광고진흥공사 지원사업' },
    { year: '2016.08', desc: '한국방송광고진흥공사(KOBACO) 방송광고거래 계약 체결' },
    { year: '2016.06', desc: '자체 편집실, 녹음실, 설비실 구축' },
    { year: '2016.05', desc: '대구 북구 학정로 아트판타지아 콘텐츠 제작센터 완공' },
    { year: '2015.12', desc: '법인 설립' }
  ]
};

export const VIDEO_PROJECTS: VideoProject[] = [
  {
    "id": "vid-380",
    "artfantasiaPostId": "380",
    "title": "우리에게 AI녀석은 멋진 도구_Change the Game",
    "client": "아트판타지아 (ArtFantasia)",
    "category": "viral",
    "categoryLabel": "캠페인 / 바이럴 (AI)",
    "year": "2025",
    "duration": "01:30",
    "youtubeId": "gwL9BeqEzv4",
    "postUrl": "https://artfantasia.co.kr/380",
    "thumbnailUrl": "https://img.youtube.com/vi/gwL9BeqEzv4/hqdefault.jpg",
    "badge": "2025 AI 영상·음악 자체제작",
    "role": [
      "AI 영상 생성 (클링/런웨이)",
      "AI 작사·작곡",
      "총괄 디렉션",
      "사운드 마스터링"
    ],
    "description": "영상과 음악 모두 생성형 AI 기술을 접목하여 100% 자체 제작된 아트판타지아의 혁신 브랜드 필름. \"우리에게 AI녀석은 아주 멋진 도구지!\" 끊임없는 도전과 트렌드 창조의 메시지를 감각적인 비트와 비주얼로 표현했습니다.",
    "keyHighlights": [
      "영상 및 음악 100% 생성형 AI 테크놀로지 접목",
      "Change the Game 오리지널 음원 자체 작곡",
      "아트판타지아 공식 유튜브 메인 쇼릴"
    ],
    "stillColors": [
      "#1e1b4b",
      "#312e81",
      "#4338ca",
      "#09090b"
    ]
  },
  {
    "id": "vid-338",
    "artfantasiaPostId": "338",
    "title": "디섹(dsec) - Total Engineering Solution",
    "client": "DSEC",
    "category": "corporate",
    "categoryLabel": "조선·해양 기업홍보",
    "year": "2023",
    "duration": "03:45",
    "youtubeId": "jsrCwnvL-zE",
    "postUrl": "https://artfantasia.co.kr/338",
    "thumbnailUrl": "https://img.youtube.com/vi/jsrCwnvL-zE/hqdefault.jpg",
    "badge": "글로벌 엔지니어링",
    "role": [
      "기업홍보 기획",
      "조선소 현장 촬영",
      "3D CG 그래픽",
      "다국어 나레이션"
    ],
    "description": "\"우리의 꿈은 바다에 있습니다.\" 세계적인 조선·해양 종합 엔지니어링 기업 DSEC의 선박 설계, 자재 공급, 품질 관리 역량을 웅장한 사운드와 비주얼로 표현한 메인 기업 홍보영상입니다.",
    "keyHighlights": [
      "대형 조선소 및 해양 플랜트 현장 촬영",
      "정밀 3D 선박 구조 시각화",
      "글로벌 바이어 맞춤 영문판 제작"
    ],
    "stillColors": [
      "#0f172a",
      "#1e293b",
      "#0369a1",
      "#082f49"
    ]
  },
  {
    "id": "vid-386",
    "artfantasiaPostId": "386",
    "title": "사이버위협 능동대응 시스템",
    "client": "ETRI · 방위사업청 · 국방기술진흥연구소",
    "category": "corporate",
    "categoryLabel": "국방 & 공공 R&D",
    "year": "2025",
    "duration": "04:20",
    "youtubeId": "G7OHKzLHTFk",
    "postUrl": "https://artfantasia.co.kr/386",
    "thumbnailUrl": "https://img.youtube.com/vi/G7OHKzLHTFk/hqdefault.jpg",
    "badge": "AI 기술 적용 국방 영상",
    "role": [
      "시나리오 기획",
      "AI 영상 연출",
      "모션 인포그래픽",
      "사운드 디자인"
    ],
    "description": "가상의 해커부대가 국방정보통신망을 공격하는 시나리오와 신뢰 기반 동적 경계망(TAD) 대시보드 시연을 교차 편집해 국방 사이버 위협 능동대응 기술의 작동 원리와 신뢰성을 직관적으로 전달합니다.",
    "keyHighlights": [
      "드라마틱 긴장감과 실제 시스템 시연의 결합",
      "AI 비주얼 테크놀로지 적용",
      "국방 핵심 사이버 보안 기술 시각화"
    ],
    "stillColors": [
      "#1c1917",
      "#292524",
      "#44403c",
      "#0c0a09"
    ]
  },
  {
    "id": "vid-348",
    "artfantasiaPostId": "348",
    "title": "현대자동차그룹 메타플랜트 아메리카(HMGMA)",
    "client": "현대자동차그룹 (HYUNDAI)",
    "category": "corporate",
    "categoryLabel": "글로벌 기업 홍보",
    "year": "2024",
    "duration": "03:10",
    "youtubeId": "WMVRwmhsm9I",
    "postUrl": "https://artfantasia.co.kr/348",
    "thumbnailUrl": "https://img.youtube.com/vi/WMVRwmhsm9I/hqdefault.jpg",
    "badge": "미국 현지 로케이션 촬영",
    "role": [
      "현지 취재/촬영",
      "기획/연출",
      "항공 드론",
      "종합 후반편집"
    ],
    "description": "미국 알라바마 & 조지아 주에서 건설 중인 현대자동차그룹 전기차 전용 신공장(HMGMA)의 광활한 스케일과 미래 전동화 생태계 현장을 생생한 영상으로 담아낸 글로벌 건설 현장 홍보영상입니다.",
    "keyHighlights": [
      "미국 알라바마/조지아 현지 로케이션 촬영",
      "4K 시네마틱 드론 항공 촬영",
      "현대자동차그룹 글로벌 프로젝트"
    ],
    "stillColors": [
      "#0d2229",
      "#142a33",
      "#0a1317",
      "#1a333d"
    ]
  },
  {
    "id": "vid-369",
    "artfantasiaPostId": "369",
    "title": "\"배달쑤맨\" - [대구로]로 대구를 지키는 영웅",
    "client": "대구광역시 · 대구테크노파크 · 인성데이타",
    "category": "commercial",
    "categoryLabel": "TVCF / 광고영상",
    "year": "2024",
    "duration": "01:50",
    "youtubeId": "TfPQOdqqDXw",
    "postUrl": "https://artfantasia.co.kr/369",
    "thumbnailUrl": "https://img.youtube.com/vi/TfPQOdqqDXw/hqdefault.jpg",
    "badge": "원태인 선수 특별 출연",
    "role": [
      "총괄 연출 (슈퍼고양이)",
      "촬영/조명",
      "의상/미술",
      "특수효과 및 사운드"
    ],
    "description": "대구 공공 배달앱 \"대구로\"의 지역 상생 철학을 슈퍼히어로 콘셉트로 유쾌하게 연출. 삼성라이온즈 에이스 원태인 투수와 이수진 치어리더의 유쾌한 열연이 돋보이는 바이럴 광고입니다.",
    "keyHighlights": [
      "삼성라이온즈 원태인 선수 & 이수진 치어리더 출연",
      "특수 의상 및 히어로 액션 연출",
      "유튜브 및 SNS 폭발적 반응"
    ],
    "stillColors": [
      "#1e3a8a",
      "#172554",
      "#1d4ed8",
      "#020617"
    ]
  },
  {
    "id": "vid-385",
    "artfantasiaPostId": "385",
    "title": "한국농어촌공사 홍수예경보시스템",
    "client": "한국농어촌공사",
    "category": "corporate",
    "categoryLabel": "공공 시스템 홍보",
    "year": "2025",
    "duration": "03:20",
    "youtubeId": "t4sfQydzol0",
    "postUrl": "https://artfantasia.co.kr/385",
    "thumbnailUrl": "https://img.youtube.com/vi/t4sfQydzol0/hqdefault.jpg",
    "badge": "재난안전 공공영상",
    "role": [
      "시스템 시나리오",
      "상황실 현장 촬영",
      "인포그래픽 CG",
      "사운드 믹싱"
    ],
    "description": "빅데이터와 AI를 활용해 저수지 수위와 강우량을 실시간 계측하고 최대 6시간 전 위험을 사전 예측하는 한국농어촌공사의 첨단 홍수예경보시스템을 체감도 높게 연출한 안전 홍보영상입니다.",
    "keyHighlights": [
      "실제 재난안전 종합상황실 로케이션",
      "데이터 플로우 2D/3D 모션그래픽",
      "대국민 신뢰도 제고 홍보영상"
    ],
    "stillColors": [
      "#064e3b",
      "#022c22",
      "#047857",
      "#020617"
    ]
  },
  {
    "id": "vid-360",
    "artfantasiaPostId": "360",
    "title": "청소년 불법도박 근절 공익광고",
    "client": "사행산업통합감독위원회",
    "category": "viral",
    "categoryLabel": "캠페인 / 바이럴",
    "year": "2024",
    "duration": "00:45",
    "youtubeId": "sWfT7h45BQI",
    "postUrl": "https://artfantasia.co.kr/360",
    "thumbnailUrl": "https://img.youtube.com/vi/sWfT7h45BQI/hqdefault.jpg",
    "badge": "정부 공익 캠페인",
    "role": [
      "스토리텔링",
      "드라마 연출",
      "사운드 믹싱",
      "지상파/케이블 송출"
    ],
    "description": "청소년들의 일상 속에 스며든 불법 온라인 도박의 유혹과 위험성을 경고하고, 건강한 성장을 지키기 위한 국무총리 소속 사행산업통합감독위원회의 방송 공익광고입니다.",
    "keyHighlights": [
      "강렬한 메시지와 몰입형 드라마 연출",
      "전국 미디어 및 옥외 전광판 송출",
      "공공기관 우수 평가"
    ],
    "stillColors": [
      "#2e1065",
      "#3b0764",
      "#581c87",
      "#030712"
    ]
  },
  {
    "id": "vid-368",
    "artfantasiaPostId": "368",
    "title": "대한민국 정부 \"행복의 미래로 달려가!\"",
    "client": "대한민국 정부",
    "category": "commercial",
    "categoryLabel": "정부 정책 홍보",
    "year": "2024",
    "duration": "01:00",
    "youtubeId": "2q_9bWn-plA",
    "postUrl": "https://artfantasia.co.kr/368",
    "thumbnailUrl": "https://img.youtube.com/vi/2q_9bWn-plA/hqdefault.jpg",
    "badge": "대한민국 정부 공식",
    "role": [
      "정책 캠페인 기획",
      "전국 로케이션 촬영",
      "오리지널 음원 작곡",
      "마스터링"
    ],
    "description": "희망찬 미래로 나아가는 국민들의 역동적인 모습과 국가 정책의 혜택을 따뜻하고 활기찬 리듬감으로 엮어낸 대한민국 정부 공식 정책 홍보영상입니다.",
    "keyHighlights": [
      "전국 단위 시민 참여 로케이션",
      "경쾌하고 희망찬 비트의 자체 제작 음악",
      "정부 전 부처 배포"
    ],
    "stillColors": [
      "#1e1b4b",
      "#2e1065",
      "#4338ca",
      "#09090b"
    ]
  },
  {
    "id": "vid-381",
    "artfantasiaPostId": "381",
    "title": "내 꿈을 향한 빠른 길 찾기 - \"직업계고\" TVCF",
    "client": "교육부 · 한국직업능력연구원",
    "category": "commercial",
    "categoryLabel": "TVCF / 광고영상",
    "year": "2024",
    "duration": "00:40",
    "youtubeId": "F_BXp6ZRGCM",
    "postUrl": "https://artfantasia.co.kr/381",
    "thumbnailUrl": "https://img.youtube.com/vi/F_BXp6ZRGCM/hqdefault.jpg",
    "badge": "지상파 TV 온에어",
    "role": [
      "방송광고 기획",
      "캐스팅",
      "현장 연출",
      "KOBACO 심의 원스톱"
    ],
    "description": "꿈을 향해 실력으로 도전하는 청소년들의 실제 교육 현장과 역동적인 미래 비전을 담은 지상파 공중파 방송 TVCF 광고. 심의부터 송출까지 원스톱으로 완성했습니다.",
    "keyHighlights": [
      "지상파 TV 온에어 방송광고",
      "학생 참여 리얼리티 시네마 연출",
      "KOBACO 방송광고 심의 통과"
    ],
    "stillColors": [
      "#1e293b",
      "#334155",
      "#475569",
      "#0f172a"
    ]
  },
  {
    "id": "vid-244",
    "artfantasiaPostId": "244",
    "title": "삼성 더세로(The Sero)TV \"유럽 4K\"",
    "client": "삼성전자 (SAMSUNG)",
    "category": "commercial",
    "categoryLabel": "TVCF / 제품 프로모션",
    "year": "2022",
    "duration": "00:45",
    "youtubeId": "Tqsz8nwsGU4",
    "postUrl": "https://artfantasia.co.kr/244",
    "thumbnailUrl": "https://img.youtube.com/vi/Tqsz8nwsGU4/hqdefault.jpg",
    "badge": "글로벌 4K 시네마틱",
    "role": [
      "시네마토그래피",
      "유럽 로케이션",
      "컬러 그레이딩",
      "사운드 믹싱"
    ],
    "description": "세로형과 가로형 스크린의 전환 혁신을 제시한 삼성전자 The Sero TV의 유럽 4K 비주얼 프로모션 필름. 공간의 미학과 모바일 네이티브 세대의 라이프스타일을 담아낸 감각적인 영상입니다.",
    "keyHighlights": [
      "유럽 현지 4K 초고화질 로케이션 영상",
      "공간과 라이프스타일 시네마토그래피",
      "삼성전자 글로벌 프로모션"
    ],
    "stillColors": [
      "#3b2d1d",
      "#1a1917",
      "#42372c",
      "#11100e"
    ]
  },
  {
    "id": "vid-383",
    "artfantasiaPostId": "383",
    "title": "USG공유대학 2.0 홍보영상",
    "client": "울산·경남지역혁신플랫폼",
    "category": "corporate",
    "categoryLabel": "기업 & 공공홍보 (교육플랫폼)",
    "year": "2024",
    "duration": "02:30",
    "youtubeId": "pAaj0LhN29E",
    "postUrl": "https://artfantasia.co.kr/383",
    "thumbnailUrl": "https://img.youtube.com/vi/pAaj0LhN29E/hqdefault.jpg",
    "badge": "대학 혁신 플랫폼",
    "role": [
      "캠퍼스 로케이션",
      "학생 모델 인터뷰",
      "모션 타이포그래피",
      "종합 편집"
    ],
    "description": "울산·경남 지역 대학과 기업이 함께 손잡고 미래 신산업 분야 맞춤 인재를 양성하는 USG공유대학 2.0의 혁신적인 교육 생태계와 학생 지원 혜택을 소개합니다.",
    "keyHighlights": [
      "스마트 제조·미래 모빌리티 교육 현장 취재",
      "트렌디한 인포그래픽 디자인",
      "대학생 공감형 비주얼"
    ],
    "stillColors": [
      "#1e3a8a",
      "#172554",
      "#0284c7",
      "#0b0f19"
    ]
  },
  {
    "id": "vid-382",
    "artfantasiaPostId": "382",
    "title": "화인코왁 2025 ADEX 행사용 홍보영상",
    "client": "화인코왁 (FINE KOWAC)",
    "category": "corporate",
    "categoryLabel": "방산 & 글로벌 전시",
    "year": "2025",
    "duration": "02:40",
    "youtubeId": "2kNCFf1dMf4",
    "postUrl": "https://artfantasia.co.kr/382",
    "thumbnailUrl": "https://img.youtube.com/vi/2kNCFf1dMf4/hqdefault.jpg",
    "badge": "2025 ADEX 부스 상영",
    "role": [
      "방산 부스 영상 기획",
      "정밀 제조 라인 촬영",
      "3D CG 그래픽",
      "영문 나레이션"
    ],
    "description": "서울 ADEX 2025 항공우주 및 방위산업전시회 부스 메인 상영용 영상. 항공/방위산업 핵심 정밀 부품 가공 기술과 글로벌 품질 경쟁력을 해외 바이어들에게 각인시키는 고화질 프로모션입니다.",
    "keyHighlights": [
      "초정밀 제조 공정 매크로 4K 촬영",
      "글로벌 방산 바이어 대상 영문 나레이션",
      "ADEX 전시장 대형 스크린 최적화"
    ],
    "stillColors": [
      "#1e293b",
      "#0f172a",
      "#334155",
      "#020617"
    ]
  },
  {
    "id": "vid-216-beijing",
    "artfantasiaPostId": "216",
    "title": "대한민국 고딩들의 좌충우돌 해외여행기 (중국 북경 편)",
    "client": "우송대학교 (Woosong University)",
    "category": "viral",
    "categoryLabel": "글로벌 로드버라이어티 / 웹예능",
    "year": "2019",
    "duration": "08:30",
    "youtubeId": "j3XMuAQrP9w",
    "postUrl": "https://artfantasia.co.kr/216",
    "thumbnailUrl": "https://i.ytimg.com/vi/j3XMuAQrP9w/hqdefault.jpg",
    "badge": "우송대 글로벌 프로젝트",
    "role": [
      "해외 로케이션 연출",
      "글로벌 대학 탐방 기획",
      "고교생 원정대 밀착 촬영",
      "BGM 및 사운드 디자인"
    ],
    "description": "진짜 글로벌 대학 우송대학교와 함께하는 '대한민국 고딩들의 좌충우돌 해외여행기' 북경 편! 고등학생 원정대(화성반월고 최주희, 대전둔산여고 서혜인, 인천원당고 전지현)가 중국 최고 명문 북경대학교와 북경외국어대학교를 직접 탐방하며 펼치는 생생하고 유쾌한 글로벌 견문록입니다.",
    "keyHighlights": [
      "중국 최고 명문 북경대학교 · 북경외국어대학교 현지 탐방",
      "출연: 화성반월고 최주희, 대전둔산여고 서혜인, 인천원당고 전지현",
      "우송대학교와 함께하는 청소년 글로벌 도전기"
    ],
    "stillColors": [
      "#b91c1c",
      "#7f1d1d",
      "#450a0a",
      "#18181b"
    ]
  },
  {
    "id": "vid-216-singapore",
    "artfantasiaPostId": "216",
    "title": "대한민국 고딩들의 좌충우돌 해외여행기 (싱가포르 편)",
    "client": "우송대학교 (Woosong University)",
    "category": "viral",
    "categoryLabel": "글로벌 로드버라이어티 / 웹예능",
    "year": "2019",
    "duration": "08:15",
    "youtubeId": "Yryd3WOO_Jg",
    "postUrl": "https://artfantasia.co.kr/216",
    "thumbnailUrl": "https://i.ytimg.com/vi/Yryd3WOO_Jg/hqdefault.jpg",
    "badge": "우송대 글로벌 프로젝트",
    "role": [
      "싱가포르 현지 로케이션",
      "난양공대(NTU) 캠퍼스 투어 기획",
      "모션 그래픽 & 자막 연출",
      "사운드 믹싱 & 마스터링"
    ],
    "description": "진짜 글로벌 대학 우송대학교와 함께하는 '대한민국 고딩들의 좌충우돌 해외여행기' 싱가포르 편! 고교생 원정대(충남여고 김시은, 충주대원고 김기영, 아산고 임준범)가 아시아 명문 난양공과대학교(NTU)를 방문하고 싱가포르를 누비며 글로벌 시야를 넓혀가는 활기찬 여정을 그렸습니다.",
    "keyHighlights": [
      "아시아 최고 공과대학 싱가포르 난양공대(NTU) 장소협찬",
      "출연: 충남여고 김시은, 충주대원고 김기영, 아산고 임준범",
      "진짜 글로벌 대학 우송대학교 제작 지원"
    ],
    "stillColors": [
      "#0284c7",
      "#0369a1",
      "#075985",
      "#0f172a"
    ]
  },
  {
    "id": "vid-216-usa",
    "artfantasiaPostId": "216",
    "title": "대한민국 고딩들의 좌충우돌 해외여행기 (미국 시카고 편)",
    "client": "우송대학교 (Woosong University)",
    "category": "viral",
    "categoryLabel": "글로벌 로드버라이어티 / 웹예능",
    "year": "2019",
    "duration": "09:00",
    "youtubeId": "diJQJXodfrA",
    "postUrl": "https://artfantasia.co.kr/216",
    "thumbnailUrl": "https://i.ytimg.com/vi/diJQJXodfrA/hqdefault.jpg",
    "badge": "우송대 글로벌 프로젝트",
    "role": [
      "미국 시카고 로케이션 기획",
      "노스웨스턴대 & 퍼포믹스 취재",
      "스토리텔링 & 감성 편집",
      "음악 작곡 및 오디오 연출"
    ],
    "description": "진짜 글로벌 대학 우송대학교와 함께하는 '대한민국 고딩들의 좌충우돌 해외여행기' 미국 시카고 편! 호수돈여고 김주연, 길원여고 김인영 양이 미국 명문 노스웨스턴 대학교와 글로벌 기업 퍼포믹스를 탐방하며 드넓은 세계를 직접 경험하는 도전과 성장의 순간을 생생하게 담았습니다.",
    "keyHighlights": [
      "미국 명문 노스웨스턴 대학교 · 퍼포믹스(Performix) 장소협찬",
      "출연: 호수돈여자고등학교 김주연, 길원여자고등학교 김인영",
      "우송대학교와 함께하는 고교생 글로벌 견문록"
    ],
    "stillColors": [
      "#1d4ed8",
      "#1e40af",
      "#172554",
      "#09090b"
    ]
  },
  {
    "id": "vid-387",
    "artfantasiaPostId": "387",
    "title": "대전산업단지 스마트 물류플랫폼",
    "client": "한국산업단지공단 · 대전산업단지",
    "category": "corporate",
    "categoryLabel": "스마트 물류·산단",
    "year": "2025",
    "duration": "03:00",
    "youtubeId": "51zFUX6d6xQ",
    "postUrl": "https://artfantasia.co.kr/387",
    "thumbnailUrl": "https://img.youtube.com/vi/51zFUX6d6xQ/hqdefault.jpg",
    "badge": "스마트그린산단 사업",
    "role": [
      "물류 플랫폼 기획",
      "산업 현장 4K 촬영",
      "3D 데이터 시각화",
      "내레이션 녹음"
    ],
    "description": "디지털 물류 자동화와 공동 물류 체계 구축을 통해 입주 기업의 물류비를 절감하고 경쟁력을 높이는 대전스마트그린산단의 미래형 물류 플랫폼 홍보영상입니다.",
    "keyHighlights": [
      "스마트 물류센터 현장 4K 촬영",
      "공동물류 데이터 인터페이스 CG",
      "산업단지 혁신 비전 전달"
    ],
    "stillColors": [
      "#1e293b",
      "#0f172a",
      "#334155",
      "#020617"
    ]
  },
  {
    "id": "vid-372",
    "artfantasiaPostId": "372",
    "title": "국방품질기술원 방위산업기술보호센터",
    "client": "국방기술품질원 (DTaQ)",
    "category": "corporate",
    "categoryLabel": "국방 보안 홍보",
    "year": "2025",
    "postUrl": "https://artfantasia.co.kr/372",
    "thumbnailUrl": "/assets/projects/vid-372.png",
    "badge": "보안 관리 비공개",
    "role": [
      "영상 기획",
      "방산 기술 연출",
      "인포그래픽",
      "음향 마스터링"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "국가 방위산업 핵심 기술 보호 체계",
      "방산기술보호센터 지원 및 예방 솔루션",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#1e1b4b",
      "#312e81",
      "#3730a3",
      "#09090b"
    ]
  },
  {
    "id": "vid-373",
    "artfantasiaPostId": "373",
    "title": "한국중부발전 신보령발전본부",
    "client": "한국중부발전 (KOMIPO)",
    "category": "corporate",
    "categoryLabel": "발전 및 국가기반시설",
    "year": "2025",
    "postUrl": "https://artfantasia.co.kr/373",
    "thumbnailUrl": "/assets/projects/vid-373.png",
    "badge": "보안 관리 비공개",
    "role": [
      "영상 기획",
      "시설 현장 연출",
      "3D 그래픽",
      "사운드 디자인"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "한국중부발전 초초임계압 신보령발전본부",
      "국가 에너지 인프라 최첨단 친환경 발전 설비",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#14532d",
      "#166534",
      "#15803d",
      "#09090b"
    ]
  },
  {
    "id": "vid-374",
    "artfantasiaPostId": "374",
    "title": "K-water 디지털보안처",
    "client": "K-water 한국수자원공사",
    "category": "corporate",
    "categoryLabel": "공공 보안 홍보",
    "year": "2025",
    "postUrl": "https://artfantasia.co.kr/374",
    "thumbnailUrl": "/assets/projects/vid-374.png",
    "badge": "보안 관리 비공개",
    "role": [
      "영상 기획",
      "시스템 시각화",
      "모션 인포그래픽",
      "사운드 믹싱"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "K-water 국가 핵심 수자원 시설 디지털 보안",
      "스마트 물관리 인프라 사이버 방호 역량",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#0c4a6e",
      "#075985",
      "#0369a1",
      "#09090b"
    ]
  },
  {
    "id": "vid-361",
    "artfantasiaPostId": "361",
    "title": "육군 제1공병여단 부대소개 영화",
    "client": "대한민국 육군 제1공병여단",
    "category": "corporate",
    "categoryLabel": "군 부대소개 영화",
    "year": "2024",
    "postUrl": "https://artfantasia.co.kr/361",
    "thumbnailUrl": "/assets/projects/vid-361.png",
    "badge": "보안 관리 비공개",
    "role": [
      "시나리오 구성",
      "작전 및 훈련 촬영",
      "영화적 연출",
      "오리지널 스코어"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "육군 제1공병여단 공병작전 및 기동지원 역량",
      "시네마틱 부대소개 영화 연출",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#1c1917",
      "#292524",
      "#44403c",
      "#09090b"
    ]
  },
  {
    "id": "vid-375",
    "artfantasiaPostId": "375",
    "title": "경남교육통합보안관제센터",
    "client": "경상남도교육청",
    "category": "corporate",
    "categoryLabel": "기관 보안관제 홍보",
    "year": "2025",
    "postUrl": "https://artfantasia.co.kr/375",
    "thumbnailUrl": "/assets/projects/vid-375.png",
    "badge": "보안 관리 비공개",
    "role": [
      "영상 기획",
      "관제시스템 연출",
      "모션 그래픽",
      "사운드 디자인"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "경남교육통합보안관제센터 시스템 홍보",
      "교육 정보보호 및 사이버 위협 관제 대응 체계",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#0f172a",
      "#1e293b",
      "#334155",
      "#09090b"
    ]
  },
  {
    "id": "vid-310",
    "artfantasiaPostId": "310",
    "title": "GP(Global Partnership) - KOTRA",
    "client": "KOTRA (대한무역투자진흥공사)",
    "category": "corporate",
    "categoryLabel": "글로벌 무역 프로모션",
    "year": "2023",
    "duration": "03:15",
    "youtubeId": "iv00xa1OZK4",
    "postUrl": "https://artfantasia.co.kr/310",
    "thumbnailUrl": "https://img.youtube.com/vi/iv00xa1OZK4/hqdefault.jpg",
    "badge": "글로벌 비즈니스",
    "role": [
      "영문 기획",
      "글로벌 네트워크 협업",
      "모션그래픽",
      "영문 전문 성우"
    ],
    "description": "세계 무대로 뻗어나가는 국내 유망 소부장 기업과 글로벌 바이어를 연결하는 KOTRA의 전략 사업 GP(Global Partnership)의 성과와 비전을 담은 글로벌 비즈니스 홍보영상입니다.",
    "keyHighlights": [
      "글로벌 바이어 대상 영문 고품격 제작",
      "KOTRA 글로벌 네트워크 시각화",
      "국제 상담회 및 전시회 메인 상영"
    ],
    "stillColors": [
      "#0369a1",
      "#075985",
      "#0c4a6e",
      "#030712"
    ]
  },
  {
    "id": "vid-366",
    "artfantasiaPostId": "366",
    "title": "해양환경공단 \"표준 예선작업 절차\"",
    "client": "KOEM 해양환경공단",
    "category": "corporate",
    "categoryLabel": "해양 안전·매뉴얼",
    "year": "2024",
    "duration": "04:10",
    "youtubeId": "AcSb6Ohdu_o",
    "postUrl": "https://artfantasia.co.kr/366",
    "thumbnailUrl": "https://img.youtube.com/vi/AcSb6Ohdu_o/hqdefault.jpg",
    "badge": "해양 안전 표준화",
    "role": [
      "예선선박 해상 촬영",
      "안전 절차 매뉴얼화",
      "3D 그래픽",
      "전문 성우 녹음"
    ],
    "description": "\"표준 예선작업 절차\" 해양환경공단 예선작업절차 안전홍보영상. 작업준비, 정계지 이안, 예선작업, 정계지 복귀에 이르는 전 과정을 실제 해상 현장에서 촬영하여 안전보건 최우선 경영 가치를 실현한 안전 교육·홍보영상입니다.",
    "keyHighlights": [
      "실제 거친 해상 현장 로케이션 촬영",
      "표준 작업 절차 단계별 3D 해설",
      "해양안전 표준 매뉴얼 영상"
    ],
    "stillColors": [
      "#0f766e",
      "#115e59",
      "#134e4a",
      "#042f2e"
    ]
  },
  {
    "id": "vid-379",
    "artfantasiaPostId": "379",
    "title": "메타리치 \"GA의 길\"",
    "client": "메타리치 (METARICH)",
    "category": "commercial",
    "categoryLabel": "TVCF / 광고영상",
    "year": "2024",
    "duration": "02:00",
    "youtubeId": "iod78fbA6xo",
    "postUrl": "https://artfantasia.co.kr/379",
    "thumbnailUrl": "https://img.youtube.com/vi/iod78fbA6xo/hqdefault.jpg",
    "badge": "시네마틱 브랜드",
    "role": [
      "스토리텔링",
      "시네마 카메라 촬영",
      "오리지널 배경음악",
      "DI 컬러그레이딩"
    ],
    "description": "고객의 인생 모든 순간에 함께 걷는 든든한 동반자 메타리치. 전문 금융 설계사의 열정과 진정성을 감성적인 시네마토그래피와 아트판타지아 자체 제작 음악으로 담아낸 브랜드 필름입니다.",
    "keyHighlights": [
      "감성적 미장센과 시네마틱 렌즈 연출",
      "아트판타지아 사운드랩 오리지널 스코어링",
      "기업 브랜딩 극대화"
    ],
    "stillColors": [
      "#78350f",
      "#451a03",
      "#92400e",
      "#1c1917"
    ]
  },
  {
    "id": "vid-350",
    "artfantasiaPostId": "350",
    "title": "금융보안원 | FISCON 2023",
    "client": "금융보안원 (FSI)",
    "category": "corporate",
    "categoryLabel": "컨퍼런스 오프닝 필름",
    "year": "2023",
    "duration": "02:10",
    "youtubeId": "vrXDH2osZwA",
    "postUrl": "https://artfantasia.co.kr/350",
    "thumbnailUrl": "https://img.youtube.com/vi/vrXDH2osZwA/hqdefault.jpg",
    "badge": "금융 정보보호 컨퍼런스",
    "role": [
      "오프닝 콘셉트 기획",
      "3D 모션 그래픽",
      "사운드 이펙트",
      "LED 대형 스크린 마스터링"
    ],
    "description": "국내 최대 금융보안 컨퍼런스 FISCON 2023의 서막을 여는 메인 오프닝 필름. 디지털 금융 혁신 속 안전한 사이버 방파제의 역할을 웅장한 사운드와 화려한 3D 비주얼로 표현했습니다.",
    "keyHighlights": [
      "대형 컨벤션 현장 압도하는 웅장한 사운드",
      "미래 금융보안 3D 모션 비주얼",
      "오프닝 상영작"
    ],
    "stillColors": [
      "#1e1b4b",
      "#1e293b",
      "#3b82f6",
      "#020617"
    ]
  },
  {
    "id": "vid-358",
    "artfantasiaPostId": "358",
    "title": "도전! K스타트업 | \"작은 시작, 위대한 변화\"",
    "client": "중소벤처기업부 · 창업진흥원",
    "category": "commercial",
    "categoryLabel": "정부 창업 캠페인",
    "year": "2023",
    "duration": "01:15",
    "youtubeId": "cwaFNAE5LEs",
    "postUrl": "https://artfantasia.co.kr/358",
    "thumbnailUrl": "https://img.youtube.com/vi/cwaFNAE5LEs/hqdefault.jpg",
    "badge": "범부처 창업경진대회",
    "role": [
      "스타트업 인터뷰",
      "스토리텔링",
      "모션그래픽",
      "사운드 디자인"
    ],
    "description": "대한민국 창업가들의 빛나는 열정과 도전 정신을 응원하는 범부처 합동 창업경진대회 도전! K-스타트업의 역동적인 도전 스토리를 감동적으로 연출한 대표 홍보영상입니다.",
    "keyHighlights": [
      "청년 창업가 리얼 인터뷰",
      "도전과 성장의 모션 연출",
      "범부처 대표 홍보영상"
    ],
    "stillColors": [
      "#1e3a8a",
      "#1e1b4b",
      "#2563eb",
      "#020617"
    ]
  },
  {
    "id": "vid-367",
    "artfantasiaPostId": "367",
    "title": "팔공산 프로젝트(대구 동구청)",
    "client": "대구광역시 동구청",
    "category": "corporate",
    "categoryLabel": "관광 & 도시브랜드",
    "year": "2024",
    "duration": "02:50",
    "youtubeId": "LU1dH6LkxvE",
    "postUrl": "https://artfantasia.co.kr/367",
    "thumbnailUrl": "https://img.youtube.com/vi/LU1dH6LkxvE/hqdefault.jpg",
    "badge": "국립공원 승격 기념 홍보영상",
    "role": [
      "기획총괄/연출",
      "항공 드론 촬영",
      "현장 취재",
      "음악 및 사운드 디자인"
    ],
    "description": "놓치지 말아야 할 \"인생여행지\" \"팔공산\" - 대한민국 23번째 국립공원 승격 기념 공식 홍보영상. \"내일이 기대되는 동구의 아침, 팔공산처럼 빛나는 가치!\" 브라질 유튜버 Thalita, 래퍼 탐쓴, 청소년 댄스팀 유노이아, 지역 소방관·경찰관과 함께 역동적이고 감각적인 영상으로 완성했습니다.",
    "keyHighlights": [
      "팔공산 국립공원 승격 기념 공식 홍보영상",
      "글로벌 유튜버 & 로컬 아티스트 콜라보",
      "4K 시네마토그래피 항공 및 자연 로케이션"
    ],
    "stillColors": [
      "#14532d",
      "#166534",
      "#15803d",
      "#052e16"
    ]
  },
  {
    "id": "vid-293",
    "artfantasiaPostId": "293",
    "title": "불법도박 공익광고 - \"어떤 선택을 하시겠습니까?\"",
    "client": "사행산업통합감독위원회 (국무총리 소속)",
    "category": "commercial",
    "categoryLabel": "TVCF / 방송 공익광고",
    "year": "2022",
    "duration": "00:40",
    "youtubeId": "_F-k7_EfYUo",
    "postUrl": "https://artfantasia.co.kr/293",
    "thumbnailUrl": "https://img.youtube.com/vi/_F-k7_EfYUo/hqdefault.jpg",
    "badge": "정부 공익광고 온에어",
    "role": [
      "시나리오/콘티",
      "배우 캐스팅 및 연출",
      "세트 촬영/조명",
      "KOBACO 심의 완료"
    ],
    "description": "\"어떤 선택을 하시겠습니까?\" 국무총리 소속 사행산업통합감독위원회 불법도박 근절 방송 공익광고. 잘못된 선택이 불러오는 파탄의 위기와 합법적이고 건강한 일상으로의 선택을 강렬한 미장센과 드라마로 대비시켜 전달하는 지상파 방송 캠페인입니다.",
    "keyHighlights": [
      "국무총리 소속 사감위 공식 방송 공익광고",
      "지상파 및 케이블 TV 방영",
      "몰입도 높은 드라마틱 스토리텔링"
    ],
    "stillColors": [
      "#3b0764",
      "#581c87",
      "#2e1065",
      "#030712"
    ]
  },
  {
    "id": "vid-359",
    "artfantasiaPostId": "359",
    "title": "융진 30주년 기념 홍보영상",
    "client": "융진",
    "category": "corporate",
    "categoryLabel": "기업 30주년 홍보영상",
    "year": "2024",
    "duration": "03:30",
    "youtubeId": "5fqYXcBlXMM",
    "postUrl": "https://artfantasia.co.kr/359",
    "thumbnailUrl": "https://img.youtube.com/vi/5fqYXcBlXMM/hqdefault.jpg",
    "badge": "30주년 기념작",
    "role": [
      "기획/시나리오",
      "산업 현장 4K 촬영",
      "사운드 디자인",
      "종합 후반편집"
    ],
    "description": "30년 역사를 넘어 백년 기업을 향해 나아가는 융진의 도전과 성장 스토리. \"누구나 갈 수 있지만 아무도 가지 않은 길, 우리가 만들어 갑니다.\" 첨단 정밀 기술과 장인정신을 감각적인 영상미로 완성했습니다.",
    "keyHighlights": [
      "융진 30주년 공식 기념 홍보영상",
      "정밀 생산라인 4K 시네마토그래피",
      "글로벌 비전 시각화"
    ],
    "stillColors": [
      "#1e293b",
      "#0f172a",
      "#3b82f6",
      "#020617"
    ]
  },
  {
    "id": "vid-357",
    "artfantasiaPostId": "357",
    "title": "한국해양마이스터고등학교 홍보영상",
    "client": "한국해양마이스터고등학교",
    "category": "corporate",
    "categoryLabel": "교육 & 해양인재 육성",
    "year": "2024",
    "duration": "03:15",
    "youtubeId": "ogRGAESm4qw",
    "postUrl": "https://artfantasia.co.kr/357",
    "thumbnailUrl": "https://img.youtube.com/vi/ogRGAESm4qw/hqdefault.jpg",
    "badge": "해양 마이스터 공식",
    "role": [
      "교육영상 기획",
      "실습선 해상 촬영",
      "드론 항공 촬영",
      "내레이션/BGM"
    ],
    "description": "\"바다로, 세계로, 미래로! 지구의 70% 바다에 너의 무한한 가능성을 펼쳐라!\" 미래 해양 산업의 핵심 마이스터를 육성하는 한국해양마이스터고의 역동적인 교육 현장과 비전을 전합니다.",
    "keyHighlights": [
      "실습선 및 해양 훈련 현장 4K 촬영",
      "학생 공감형 시네마틱 내레이션",
      "해양수산 마이스터 교육 혁신"
    ],
    "stillColors": [
      "#0369a1",
      "#0284c7",
      "#075985",
      "#082f49"
    ]
  },
  {
    "id": "vid-356",
    "artfantasiaPostId": "356",
    "title": "New Tomorrow(대구 동구청)",
    "client": "대구광역시 동구청",
    "category": "corporate",
    "categoryLabel": "지자체 공식 홍보영상",
    "year": "2024",
    "duration": "03:00",
    "youtubeId": "Ylm6RNrvnU4",
    "postUrl": "https://artfantasia.co.kr/356",
    "thumbnailUrl": "https://img.youtube.com/vi/Ylm6RNrvnU4/hqdefault.jpg",
    "badge": "대구 동구청 2024 메인",
    "role": [
      "도시 브랜드 기획",
      "지자체 전역 4K 촬영",
      "드론 항공 촬영",
      "오리지널 BGM"
    ],
    "description": "대구 동구청 2024 대표 홍보영상 \"New Tomorrow\". 우리를 표현한다면요? 새로운 내일이 있는 곳! 따뜻한 행복이 가득하고 청정 자연과 첨단 미래산업이 공존하는 새로움 가득한 도시, 내일이 더 기대되는 동구의 눈부신 비전을 시네마틱하게 담아냈습니다.",
    "keyHighlights": [
      "대구 동구청 2024 공식 대표 홍보영상",
      "첨단 신산업 및 자연 생태계 시네마틱 촬영",
      "감각적인 비트와 모션 그래픽 연출"
    ],
    "stillColors": [
      "#1e3a8a",
      "#0369a1",
      "#0284c7",
      "#082f49"
    ]
  },
  {
    "id": "vid-346",
    "artfantasiaPostId": "346",
    "title": "사행산업통합감독위원회 오균 위원장 정책 홍보영상",
    "client": "사행산업통합감독위원회 (국무총리 소속)",
    "category": "viral",
    "categoryLabel": "캠페인 / 바이럴 (공공정책)",
    "year": "2023",
    "duration": "02:45",
    "youtubeId": "XVhwW5QpUtc",
    "postUrl": "https://artfantasia.co.kr/346",
    "thumbnailUrl": "https://img.youtube.com/vi/XVhwW5QpUtc/hqdefault.jpg",
    "badge": "오균 위원장 직접 출연",
    "role": [
      "정책 홍보 기획",
      "위원장 인터뷰 연출",
      "인포그래픽 CG",
      "사운드 마스터링"
    ],
    "description": "\"365일 건전한 사행산업, 36.5℃ 건강한 우리 사회!\" 국무총리 소속 사행산업통합감독위원회 오균 위원장이 직접 출연하여 불법 사행산업 근절과 건전한 여가 문화 조성을 위한 정책 비전을 신뢰감 있게 전달합니다.",
    "keyHighlights": [
      "국무총리 소속 사감위 위원장 직접 출연",
      "공공기관 신뢰도 중심의 미장센",
      "정책 비전 모션그래픽"
    ],
    "stillColors": [
      "#1e1b4b",
      "#312e81",
      "#1e293b",
      "#030712"
    ]
  },
  {
    "id": "vid-340",
    "artfantasiaPostId": "340",
    "title": "신용보증기금 사이버보안관제센터",
    "client": "신용보증기금 (KODIT)",
    "category": "corporate",
    "categoryLabel": "금융 보안 홍보",
    "year": "2023",
    "postUrl": "https://artfantasia.co.kr/340",
    "thumbnailUrl": "/assets/projects/vid-340.png",
    "badge": "보안 관리 비공개",
    "role": [
      "영상 기획",
      "관제센터 촬영",
      "모션 그래픽",
      "사운드 믹싱"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "신용보증기금 금융 데이터 및 사이버 관제망",
      "24시간 무중단 보안관제 체계",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#0f172a",
      "#1e293b",
      "#334155",
      "#09090b"
    ]
  },
  {
    "id": "vid-317",
    "artfantasiaPostId": "317",
    "title": "제5군수지원사령부 부대소개 영화",
    "client": "대한민국 육군 제5군수지원사령부",
    "category": "corporate",
    "categoryLabel": "군 부대소개 영화",
    "year": "2022",
    "postUrl": "https://artfantasia.co.kr/317",
    "thumbnailUrl": "/assets/projects/vid-317.png",
    "badge": "보안 관리 비공개",
    "role": [
      "시나리오 구성",
      "군수지원 기동 촬영",
      "영화적 편집",
      "음향 디자인"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "육군 제5군수지원사령부 전시 및 평시 군수지원",
      "스마트 군수물류 및 정비 보급 역량 시각화",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#1c1917",
      "#292524",
      "#44403c",
      "#09090b"
    ]
  },
  {
    "id": "vid-330",
    "artfantasiaPostId": "330",
    "title": "도전! K-스타트업 2023 웹드라마형 참가모집 홍보영상",
    "client": "중소벤처기업부 · 창업진흥원",
    "category": "viral",
    "categoryLabel": "웹드라마 / 바이럴 홍보",
    "year": "2023",
    "duration": "03:30",
    "youtubeId": "3HoBWsCsrMU",
    "postUrl": "https://artfantasia.co.kr/330",
    "thumbnailUrl": "https://img.youtube.com/vi/3HoBWsCsrMU/hqdefault.jpg",
    "badge": "웹드라마 컬래버레이션",
    "role": [
      "웹드라마 극본/연출",
      "배우 캐스팅",
      "사운드트랙 작곡",
      "콘텐츠몬스터 파트너십"
    ],
    "description": "대한민국 최대 규모 창업경진대회 도전! K-스타트업 2023 참가모집 영상. 2022년 대상 수상자의 감동적인 실화를 바탕으로 탄탄한 웹드라마 형식으로 재구성하여 예비 창업가들의 뜨거운 공감을 이끌어냈습니다.",
    "keyHighlights": [
      "실화 바탕 웹드라마 스토리텔링",
      "콘텐츠몬스터 파트너십 공동제작",
      "전국 스타트업 참가 유도"
    ],
    "stillColors": [
      "#047857",
      "#065f46",
      "#064e3b",
      "#022c22"
    ]
  },
  {
    "id": "vid-327",
    "artfantasiaPostId": "327",
    "title": "경산수학체험센터 공식 홍보영상",
    "client": "경산수학체험센터 · 경상북도교육청",
    "category": "corporate",
    "categoryLabel": "교육·체험관 공식 영상",
    "year": "2023",
    "duration": "03:10",
    "youtubeId": "z_idGIvtTEo",
    "postUrl": "https://artfantasia.co.kr/327",
    "thumbnailUrl": "https://img.youtube.com/vi/z_idGIvtTEo/hqdefault.jpg",
    "badge": "체험형 에듀테크",
    "role": [
      "판타지 프롤로그 연출",
      "체험관 취재 촬영",
      "3D 수학 기하학 CG",
      "음악 작곡"
    ],
    "description": "\"아주 오래된 전설... 그것을 얻게 되면 창의력과 예술을 표현할 수 있는 힘을 얻는다!\" 수학의 위대한 힘과 상상 이상의 재미를 신비로운 스토리텔링과 생생한 체험 장면으로 담아낸 교육 홍보영상입니다.",
    "keyHighlights": [
      "판타지 영화 스타일 오프닝 프롤로그",
      "수학 체험관 전관 시네마틱 4K 촬영",
      "아이들의 호기심을 자극하는 비주얼"
    ],
    "stillColors": [
      "#1e3a8a",
      "#1d4ed8",
      "#2563eb",
      "#0f172a"
    ]
  },
  {
    "id": "vid-299",
    "artfantasiaPostId": "299",
    "title": "국립춘천박물관 20주년 특별기획 \"오래의 부탁\"",
    "client": "국립춘천박물관",
    "category": "viral",
    "categoryLabel": "박물관 20주년 기념 뮤직비디오",
    "year": "2022",
    "duration": "04:10",
    "youtubeId": "R6hFBdJPivc",
    "postUrl": "https://artfantasia.co.kr/299",
    "thumbnailUrl": "https://img.youtube.com/vi/R6hFBdJPivc/hqdefault.jpg",
    "badge": "콜라보레이션 음원 & MV",
    "role": [
      "뮤직비디오 기획/연출",
      "박물관 전시관 4K 촬영",
      "보컬 음원 프로듀싱",
      "색보정/마스터링"
    ],
    "description": "국립춘천박물관 개관 20주년 특별기획 뮤직비디오 \"오래의 부탁\". 가수 지윤과의 감성 컬래버레이션을 통해 오랜 세월을 품어온 문화유산의 숨결과 따뜻한 위로의 메시지를 아름다운 멜로디와 영상미로 선보였습니다.",
    "keyHighlights": [
      "국립춘천박물관 & 아티스트 지윤 콜라보",
      "문화유산 4K 감성 시네마토그래피",
      "오리지널 음원 자체 제작 및 송출"
    ],
    "stillColors": [
      "#1e1b4b",
      "#3730a3",
      "#4338ca",
      "#09090b"
    ]
  },
  {
    "id": "vid-120",
    "artfantasiaPostId": "120",
    "title": "\"인도네시아의 꿈\" Tidfore(中國) - 인도네시아 대통령 VIP View",
    "client": "태부그룹 (Tidfore Group, 中國)",
    "category": "corporate",
    "categoryLabel": "대통령 VIP View / 글로벌 프로젝트",
    "year": "2017",
    "duration": "04:30",
    "youtubeId": "DyAu6LB94wU",
    "postUrl": "https://artfantasia.co.kr/120",
    "thumbnailUrl": "https://img.youtube.com/vi/DyAu6LB94wU/hqdefault.jpg",
    "badge": "인도네시아 대통령 VIP View",
    "role": [
      "해외 현지 로케이션",
      "VIP 시사회 연출",
      "다국어 성우 녹음",
      "시네마토그래피"
    ],
    "description": "중국 태부그룹(Tidfore)의 의뢰로 인도네시아 조코 위도도(Jokowi) 대통령 VIP 시사회(VIP View)를 목적으로 제작된 초대형 글로벌 프로젝트. 다양한 문화와 천혜의 자연, 무한한 자원을 품은 인도네시아의 미래 꿈과 인프라 혁신을 웅장하게 그려냈습니다.",
    "keyHighlights": [
      "인도네시아 대통령 VIP 시사회 단독 상영작",
      "중국 태부그룹 의뢰 글로벌 인프라 프로젝트",
      "해외 현지 로케이션 및 다국어 마스터링"
    ],
    "stillColors": [
      "#78350f",
      "#854d0e",
      "#713f12",
      "#1c1917"
    ]
  },
  {
    "id": "vid-251",
    "artfantasiaPostId": "251",
    "title": "buyKOREA (바이코리아) 글로벌 프로모션",
    "client": "KOTRA (대한무역투자진흥공사)",
    "category": "corporate",
    "categoryLabel": "국가 B2B 전자무역 플랫폼",
    "year": "2020",
    "duration": "02:30",
    "youtubeId": "UZ5awK_Uqv0",
    "postUrl": "https://artfantasia.co.kr/251",
    "thumbnailUrl": "https://img.youtube.com/vi/UZ5awK_Uqv0/hqdefault.jpg",
    "badge": "KOTRA 글로벌 플랫폼",
    "role": [
      "영문 카피라이팅",
      "모션 UI 그래픽",
      "글로벌 사운드트랙",
      "영문 전문 성우"
    ],
    "description": "\"200,000 Korean products at your fingertips!\" 시공간을 초월하여 전 세계 바이어와 대한민국 우수 상품을 잇는 KOTRA 대표 B2B 전자무역 플랫폼 buyKOREA의 글로벌 영문 홍보영상입니다.",
    "keyHighlights": [
      "KOTRA 공식 글로벌 B2B 영문 프로모션",
      "디지털 플랫폼 UI 모션그래픽",
      "국제 무역 박람회 메인 스크린 상영"
    ],
    "stillColors": [
      "#0369a1",
      "#0284c7",
      "#082f49",
      "#020617"
    ]
  },
  {
    "id": "vid-311",
    "artfantasiaPostId": "311",
    "title": "AI Sharing Platform (UB Platform) 모션그래픽",
    "client": "UB Platform",
    "category": "viral",
    "categoryLabel": "AI 플랫폼 / 모션그래픽",
    "year": "2022",
    "duration": "02:00",
    "youtubeId": "1HKIP3vCjXU",
    "postUrl": "https://artfantasia.co.kr/311",
    "thumbnailUrl": "https://img.youtube.com/vi/1HKIP3vCjXU/hqdefault.jpg",
    "badge": "차세대 AI 모션그래픽",
    "role": [
      "AI 플랫폼 기획",
      "2D/3D 모션그래픽",
      "테크 사운드 FX",
      "성우 녹음"
    ],
    "description": "\"데이터 공유가 아니라 AI 공유다!\" 새로운 패러다임을 여는 사용자 중심 AI 공유 플랫폼 UB플랫폼의 혁신 알고리즘과 인터페이스를 직관적인 모션그래픽으로 표현했습니다.",
    "keyHighlights": [
      "인공지능 네트워크 시각화 모션그래픽",
      "사이버네틱 비주얼과 세련된 사운드",
      "테크 스타트업 IR 최적화"
    ],
    "stillColors": [
      "#4c1d95",
      "#5b21b6",
      "#6d28d9",
      "#020617"
    ]
  },
  {
    "id": "vid-245",
    "artfantasiaPostId": "245",
    "title": "삼성 더세로(The Sero)TV \"아프리카 4K\"",
    "client": "삼성전자 (SAMSUNG)",
    "category": "commercial",
    "categoryLabel": "글로벌 4K 시네마틱 / TVCF",
    "year": "2020",
    "duration": "01:00",
    "youtubeId": "LkL4heH8Tgw",
    "postUrl": "https://artfantasia.co.kr/245",
    "thumbnailUrl": "https://img.youtube.com/vi/LkL4heH8Tgw/hqdefault.jpg",
    "badge": "삼성 공식 후원작",
    "role": [
      "시네마토그래피",
      "음악 작곡 (Blue Forest)",
      "가수 박지윤 보컬",
      "DI 컬러그레이딩"
    ],
    "description": "삼성전자 The Sero TV 글로벌 4K 비주얼 프로모션 \"아프리카 편\". \"세로로 세상을 표현하다.\" 가수 박지윤의 감미로운 음색과 이진헌 작곡의 \"Blue Forest\" 음악 위에 아프리카 대자연의 경이로움을 4K 시네마틱으로 담아냈습니다.",
    "keyHighlights": [
      "삼성전자 공식 디지털플라자 및 유튜브 채널 상영",
      "가수 박지윤 노래 & 이진헌 작곡 오리지널 사운드트랙",
      "세로형 스크린 4K 비주얼 혁신"
    ],
    "stillColors": [
      "#92400e",
      "#78350f",
      "#451a03",
      "#1c1917"
    ]
  },
  {
    "id": "vid-161",
    "artfantasiaPostId": "161",
    "title": "E1 컨테이너터미널(Container Terminal) 홍보영상",
    "client": "E1 컨테이너터미널 (인천항)",
    "category": "corporate",
    "categoryLabel": "항만 물류 & 글로벌 해운",
    "year": "2018",
    "duration": "03:40",
    "youtubeId": "1YO31Rc_NOU",
    "postUrl": "https://artfantasia.co.kr/161",
    "thumbnailUrl": "https://img.youtube.com/vi/1YO31Rc_NOU/hqdefault.jpg",
    "badge": "인천항 대표 물류",
    "role": [
      "물류 시나리오",
      "항만 크레인 4K 촬영",
      "드론 항공 촬영",
      "웅장한 오케스트레이션"
    ],
    "description": "\"컨테이너, 이것은 단순히 철로 만든 상자가 아닙니다. 많은 땀과 노력, 수많은 사연과 대한민국과 지구촌의 빛과 희망을 담고 있습니다.\" 인천항을 넘어 세계로 도약하는 E1 컨테이너터미널의 웅장한 여정을 담았습니다.",
    "keyHighlights": [
      "초대형 컨테이너선 및 갠트리 크레인 역동적 촬영",
      "인천항 현장 4K 드론 항공 영상",
      "글로벌 물류 허브 비전 표현"
    ],
    "stillColors": [
      "#0f172a",
      "#1e293b",
      "#0369a1",
      "#082f49"
    ]
  },
  {
    "id": "vid-292",
    "artfantasiaPostId": "292",
    "title": "대구시민안전테마파크 공식 홍보영상",
    "client": "대구소방안전본부 · 대구시민안전테마파크",
    "category": "corporate",
    "categoryLabel": "재난안전 체험 홍보",
    "year": "2021",
    "duration": "03:25",
    "youtubeId": "CgMdTcXzsac",
    "postUrl": "https://artfantasia.co.kr/292",
    "thumbnailUrl": "https://img.youtube.com/vi/CgMdTcXzsac/hqdefault.jpg",
    "badge": "현직 소방관 출연",
    "role": [
      "재난안전 시나리오",
      "소방관 합동 연출",
      "체험관 4K 촬영",
      "사운드 디자인"
    ],
    "description": "각종 사고와 재난 속에서 스스로와 사랑하는 가족, 이웃을 지키는 따뜻한 체험형 안전교육의 산실. 현직 늠름한 소방관분들과 함께하여 안전의 소중함을 생생하게 각인시키는 감동의 안전교육 홍보영상입니다.",
    "keyHighlights": [
      "현직 소방관 참여 리얼리티 연출",
      "지하철·지진·산불 재난안전 체험 시뮬레이션",
      "가족 중심 체험 공감대"
    ],
    "stillColors": [
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
      "#450a0a"
    ]
  },
  {
    "id": "vid-319",
    "artfantasiaPostId": "319",
    "title": "대구광역시유아교육진흥원 홍보영상",
    "client": "대구광역시교육청 · 대구광역시유아교육진흥원",
    "category": "corporate",
    "categoryLabel": "유아교육 & 공공기관",
    "year": "2023",
    "duration": "03:00",
    "youtubeId": "A3i8JGq-SQY",
    "postUrl": "https://artfantasia.co.kr/319",
    "thumbnailUrl": "https://img.youtube.com/vi/A3i8JGq-SQY/hqdefault.jpg",
    "badge": "유아 행복 교육",
    "role": [
      "어린이 중심 기획",
      "체험 현장 촬영",
      "밝고 따뜻한 컬러그레이딩",
      "오리지널 BGM"
    ],
    "description": "\"유아의 바른 성장을 생각합니다.\" 대구광역시유아교육진흥원의 다채로운 체험 영역과 놀이 중심 교육 환경을 아이들의 해맑은 미소와 함께 따뜻하게 담아냈습니다.",
    "keyHighlights": [
      "놀이 중심 유아 체험공간 시네마틱 촬영",
      "밝고 따뜻한 감성 톤앤매너",
      "학부모·교원 공감대 형성"
    ],
    "stillColors": [
      "#b45309",
      "#d97706",
      "#f59e0b",
      "#78350f"
    ]
  },
  {
    "id": "vid-288",
    "artfantasiaPostId": "288",
    "title": "신용보증재단중앙회 홍보영상",
    "client": "신용보증재단중앙회",
    "category": "corporate",
    "categoryLabel": "공공 금융 / 서민경제 동반자",
    "year": "2021",
    "duration": "03:00",
    "youtubeId": "k9FXs3-XU6Q",
    "postUrl": "https://artfantasia.co.kr/288",
    "thumbnailUrl": "https://img.youtube.com/vi/k9FXs3-XU6Q/hqdefault.jpg",
    "badge": "서민 금융 비전",
    "role": [
      "공공 홍보 기획",
      "소상공인 스토리텔링",
      "모션 그래픽",
      "전문 성우 녹음"
    ],
    "description": "대한민국 서민과 소상공인, 자영업자의 든든한 금융 버팀목 신용보증재단중앙회의 보증 제도와 따뜻한 금융 지원의 가치를 전하는 공식 기업 홍보영상입니다.",
    "keyHighlights": [
      "소상공인 일상과 금융 지원의 유기적 결합",
      "공공기관 신뢰도 높은 내레이션",
      "전국 지역신보 네트워크 시각화"
    ],
    "stillColors": [
      "#0f766e",
      "#115e59",
      "#134e4a",
      "#042f2e"
    ]
  },
  {
    "id": "vid-290",
    "artfantasiaPostId": "290",
    "title": "대구형 공공배달앱 \"대구로\" 런칭 TVCF",
    "client": "대구광역시 · 대구테크노파크 · 인성데이타",
    "category": "commercial",
    "categoryLabel": "지상파 TVCF / 공공앱 런칭",
    "year": "2021",
    "duration": "00:30",
    "youtubeId": "oXz_IuMkKC4",
    "postUrl": "https://artfantasia.co.kr/290",
    "thumbnailUrl": "https://img.youtube.com/vi/oXz_IuMkKC4/hqdefault.jpg",
    "badge": "지상파 TVCF 런칭 광고",
    "role": [
      "TVCF 콘티/기획",
      "배우 캐스팅",
      "음악 작곡 & 사운드",
      "지상파 심의 및 송출"
    ],
    "description": "\"착한 수수료 신나는 대구로! 대구 맛집 다 있으니까 즐거운 대구로! 주문은 대구로, 배달은 댁으로!\" 지역 소상공인과 상생하는 대구 공공 배달앱 \"대구로\"의 성공적인 지상파 TVCF 런칭 광고입니다.",
    "keyHighlights": [
      "공중파 지상파 온에어 TVCF",
      "중독성 높은 오리지널 징글 & 비트",
      "대구 시민과 소상공인 상생 캠페인"
    ],
    "stillColors": [
      "#1e40af",
      "#1d4ed8",
      "#1e3a8a",
      "#030712"
    ]
  },
  {
    "id": "vid-295",
    "artfantasiaPostId": "295",
    "title": "대구창조경제혁신센터 2021Ver 홍보영상",
    "client": "대구창조경제혁신센터",
    "category": "corporate",
    "categoryLabel": "창업 생태계 & 유니콘 육성",
    "year": "2021",
    "duration": "03:10",
    "youtubeId": "XdVxHDg11o8",
    "postUrl": "https://artfantasia.co.kr/295",
    "thumbnailUrl": "https://img.youtube.com/vi/XdVxHDg11o8/hqdefault.jpg",
    "badge": "대구 스타트업 허브",
    "role": [
      "창업 생태계 기획",
      "스타트업 현장 4K 촬영",
      "모션 인포그래픽",
      "사운드 믹싱"
    ],
    "description": "\"세상에 하찮은 아이디어는 없습니다. 스타트업에서 K-유니콘으로의 스케일업!\" 창의적인 창업도시 대구의 성장 엔진이자 청년 창업가들의 든든한 파트너인 대구창조경제혁신센터의 대표 홍보영상입니다.",
    "keyHighlights": [
      "청년 창업가 육성 프로그램 현장 스케치",
      "K-유니콘 성장 로드맵 인포그래픽",
      "혁신 창업 도시 비전 전달"
    ],
    "stillColors": [
      "#15803d",
      "#166534",
      "#14532d",
      "#052e16"
    ]
  },
  {
    "id": "vid-131",
    "artfantasiaPostId": "131",
    "title": "제2작전사령부 부대소개 영화",
    "client": "대한민국 육군 제2작전사령부",
    "category": "corporate",
    "categoryLabel": "군 부대소개 영화",
    "year": "2017",
    "postUrl": "https://artfantasia.co.kr/131",
    "thumbnailUrl": "/assets/projects/vid-131.png",
    "badge": "보안 관리 비공개",
    "role": [
      "시나리오 기획",
      "작전사령부 연출",
      "영화 편집",
      "사운드 믹싱"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "대한민국 육군 제2작전사령부 부대소개 영화",
      "후방지역 작전총괄 및 합동작전 역량",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#1e293b",
      "#334155",
      "#475569",
      "#09090b"
    ]
  },
  {
    "id": "vid-243",
    "artfantasiaPostId": "243",
    "title": "육군 제50보병사단 부대소개 영화",
    "client": "대한민국 육군 제50보병사단",
    "category": "corporate",
    "categoryLabel": "군 부대소개 영화",
    "year": "2020",
    "postUrl": "https://artfantasia.co.kr/243",
    "thumbnailUrl": "/assets/projects/vid-243.png",
    "badge": "보안 관리 비공개",
    "role": [
      "시나리오 기획",
      "작전 지역 현장 촬영",
      "군 소개 영상 연출",
      "사운드 마스터링"
    ],
    "description": "본 영상은 기관의 특수성 상 보안사항에 해당되므로 영상의 전체공개는 하지 않습니다.",
    "keyHighlights": [
      "육군 제50보병사단(강철사단) 지역방위 역량",
      "민·관·군·경 통합방위 및 작전 태세 소개",
      "기관 보안 규정에 따른 비공개 관리 영상"
    ],
    "stillColors": [
      "#14532d",
      "#166534",
      "#15803d",
      "#09090b"
    ]
  },
  {
    "id": "vid-281",
    "artfantasiaPostId": "281",
    "title": "국립낙동강생물자원관 공식 홍보영상",
    "client": "환경부 · 국립낙동강생물자원관",
    "category": "corporate",
    "categoryLabel": "생물주권 & 환경 R&D",
    "year": "2021",
    "duration": "03:20",
    "youtubeId": "-90pNgSp1gI",
    "postUrl": "https://artfantasia.co.kr/281",
    "thumbnailUrl": "https://img.youtube.com/vi/-90pNgSp1gI/hqdefault.jpg",
    "badge": "환경부 산하 기관",
    "role": [
      "자연 다큐 기획",
      "초접사 매크로 4K 촬영",
      "담수생물 CG",
      "사운드 디자인"
    ],
    "description": "담수생물 다양성의 보전과 생물자원의 미래 가치를 연구하는 국립낙동강생물자원관의 첨단 연구 시설과 전시관을 초고화질 매크로 렌즈와 자연 다큐멘터리 기법으로 완성했습니다.",
    "keyHighlights": [
      "담수생물 미세 표본 초접사 시네마 촬영",
      "국가 생물주권 확립 연구 시설 취재",
      "자연친화적 영상미와 사운드스케이프"
    ],
    "stillColors": [
      "#15803d",
      "#14532d",
      "#052e16",
      "#022c22"
    ]
  },
  {
    "id": "vid-154",
    "artfantasiaPostId": "154",
    "title": "솔브릿지(SolBridge) 국제경영대학 글로벌 홍보영상",
    "client": "우송학원 · 솔브릿지 국제경영대학",
    "category": "corporate",
    "categoryLabel": "글로벌 명문 교육 / 영문판",
    "year": "2018",
    "duration": "03:30",
    "youtubeId": "LFavy-esLLs",
    "postUrl": "https://artfantasia.co.kr/154",
    "thumbnailUrl": "https://img.youtube.com/vi/LFavy-esLLs/hqdefault.jpg",
    "badge": "글로벌 AACSB 인증",
    "role": [
      "글로벌 영문 기획",
      "다국적 학생 인터뷰",
      "감성 시네마토그래피",
      "영문 오리지널 BGM"
    ],
    "description": "\"Here at SolBridge, we see students from different nationalities, languages, and cultures studying together as one.\" 전 세계 60여 개국 인재들이 모여 글로벌 리더로 성장하는 AACSB 인증 솔브릿지 국제경영대학의 글로벌 필름입니다.",
    "keyHighlights": [
      "다국적 학생 참여 글로벌 시네마틱 연출",
      "감성적인 영문 스토리텔링",
      "세계 무대를 향한 청춘의 열정"
    ],
    "stillColors": [
      "#831843",
      "#9d174d",
      "#be185d",
      "#500724"
    ]
  },
  {
    "id": "vid-143",
    "artfantasiaPostId": "143",
    "title": "판교경기문화창조허브 공식 홍보영상",
    "client": "경기도 · 경기콘텐츠진흥원",
    "category": "corporate",
    "categoryLabel": "문화콘텐츠 창업 생태계",
    "year": "2018",
    "duration": "03:00",
    "youtubeId": "AxnHOmNWoBo",
    "postUrl": "https://artfantasia.co.kr/143",
    "thumbnailUrl": "https://img.youtube.com/vi/AxnHOmNWoBo/hqdefault.jpg",
    "badge": "판교 테크노밸리 창업",
    "role": [
      "창업 허브 기획",
      "스타트업 공간 촬영",
      "모션 그래픽",
      "전문 성우 내레이션"
    ],
    "description": "아이디어 보유자와 기업을 연결하고 맞춤형 창업 자금과 전문가 네트워크를 지원하는 판교경기문화창조허브. 대한민국 문화콘텐츠 스타트업의 산실인 판교 허브의 입체적인 지원 생태계를 조명합니다.",
    "keyHighlights": [
      "판교 테크노밸리 스타트업 열기 현장 취재",
      "창업 전주기 맞춤형 지원 로드맵 모션그래픽",
      "경기콘텐츠진흥원 대표 영상"
    ],
    "stillColors": [
      "#0f766e",
      "#0d9488",
      "#115e59",
      "#042f2e"
    ]
  },
  {
    "id": "vid-276",
    "artfantasiaPostId": "276",
    "title": "DONG-A ENG 글로벌 홍보영상 (영어·일본어)",
    "client": "동아엔지니어링 · 경기도경제과학진흥원",
    "category": "corporate",
    "categoryLabel": "글로벌 엔지니어링 / 해외판",
    "year": "2021",
    "duration": "03:15",
    "youtubeId": "l45HYuhhiM0",
    "postUrl": "https://artfantasia.co.kr/276",
    "thumbnailUrl": "https://img.youtube.com/vi/l45HYuhhiM0/hqdefault.jpg",
    "badge": "글로벌 영·일문판",
    "role": [
      "글로벌 기획",
      "생산 공장 현장 촬영",
      "영어/일본어 원어민 성우",
      "해외 전시 마스터링"
    ],
    "description": "경기도경제과학진흥원 지원사업으로 제작된 동아엔지니어링(DONG-A ENG)의 해외 시장 진출용 영문/일문 글로벌 기업 홍보영상. 정밀 제조 역량과 기술력을 해외 바이어들에게 신뢰감 있게 브리핑합니다.",
    "keyHighlights": [
      "영어/일본어 2개 국어 완벽 마스터링",
      "초정밀 제조 공정 테크니컬 촬영",
      "글로벌 전시회 바이어 상담용 영상"
    ],
    "stillColors": [
      "#1e293b",
      "#0f172a",
      "#334155",
      "#020617"
    ]
  },
  {
    "id": "vid-171",
    "artfantasiaPostId": "171",
    "title": "숙성72 브랜드 필름 (교촌F&B)",
    "client": "교촌 F&B (KYOCHON)",
    "category": "commercial",
    "categoryLabel": "프리미엄 푸드 / 브랜드 필름",
    "year": "2018",
    "duration": "01:30",
    "youtubeId": "cUEfbAPJLdg",
    "postUrl": "https://artfantasia.co.kr/171",
    "thumbnailUrl": "https://img.youtube.com/vi/cUEfbAPJLdg/hqdefault.jpg",
    "badge": "교촌 F&B 프리미엄",
    "role": [
      "미식 시네마토그래피",
      "푸드 스타일링 촬영",
      "컬러 그레이딩",
      "감성 사운드 디자인"
    ],
    "description": "\"자연이 알려준 가장 맛있는 방법, 72시간의 누룩숙성. 숙성이 되면 깊어진다. 맛도 사람도 기다림의 가치를 아는 사람들이 만듭니다.\" 대한민국 치킨 명가 교촌F&B의 숙성72 프리미엄 브랜드 필름입니다.",
    "keyHighlights": [
      "72시간 숙성 미학의 감각적 슬로우모션",
      "자연의 숨결을 담은 푸드 시네마토그래피",
      "기다림의 철학을 담은 내레이션"
    ],
    "stillColors": [
      "#78350f",
      "#451a03",
      "#92400e",
      "#1c1917"
    ]
  },
  {
    "id": "vid-187",
    "artfantasiaPostId": "187",
    "title": "대구과학대학교 링크플러스(LINC+) 사업단 홍보영상",
    "client": "대구과학대학교 · 교육부",
    "category": "corporate",
    "categoryLabel": "산학협력 & 취업 혁신",
    "year": "2019",
    "duration": "03:10",
    "postUrl": "https://artfantasia.co.kr/187",
    "thumbnailUrl": "/assets/projects/vid-187.png",
    "badge": "교육부 LINC+ 사업",
    "role": [
      "산학협력 기획",
      "캠퍼스 실습 현장 촬영",
      "학생 인터뷰",
      "음악 및 사운드"
    ],
    "description": "\"취업이라는 험난한 길을 든든하게 함께합니다.\" 현장 맞춤형 인재 양성과 지역 산업체와의 유기적인 산학협력을 이끄는 대구과학대학교 링크플러스(LINC+) 사업단의 비전을 전달합니다.",
    "keyHighlights": [
      "첨단 의료·간호·보건 실습 현장 4K 촬영",
      "교육부 산학협력 고도화 사업 홍보",
      "학생 중심 취업 역량 시각화"
    ],
    "stillColors": [
      "#1e3a8a",
      "#1e293b",
      "#0284c7",
      "#0b0f19"
    ]
  },
  {
    "id": "vid-196",
    "artfantasiaPostId": "196",
    "title": "뮤지컬 청춘 & 시간속의 그녀 & ONE FINE DAY TVCF SPOT (제13회 DIMF 공식초청작)",
    "client": "대구국제뮤지컬페스티벌 (DIMF)",
    "category": "commercial",
    "categoryLabel": "뮤지컬 페스티벌 TVCF SPOT",
    "year": "2019",
    "duration": "00:30",
    "youtubeId": "JFvUifnphUE",
    "postUrl": "https://artfantasia.co.kr/196",
    "thumbnailUrl": "https://i.ytimg.com/vi/JFvUifnphUE/hqdefault.jpg",
    "badge": "제13회 DIMF 공식초청작 TVCF",
    "role": [
      "TVCF 기획 및 연출",
      "모션그래픽 & 타이포",
      "사운드 믹싱 & 마스터링",
      "방송 심의 규격 준수"
    ],
    "description": "제13회 대구국제뮤지컬페스티벌(DIMF) 중국·중화권 공식초청작 '뮤지컬 청춘', '시간속의 그녀', 대만 뮤지컬 'ONE FINE DAY'의 TVCF SPOT 영상입니다. 감각적인 무대 하이라이트 편집과 역동적인 모션 타이포그래피로 글로벌 명작 뮤지컬의 열정과 감동을 방송 스팟으로 담아냈습니다.",
    "keyHighlights": [
      "제13회 대구국제뮤지컬페스티벌(DIMF) 중국·대만 공식초청작 TVCF",
      "뮤지컬 청춘 · 시간속의 그녀 · ONE FINE DAY 무대 하이라이트",
      "역동적 모션 그래픽과 극장 사운드 마스터링"
    ],
    "stillColors": [
      "#dc2626",
      "#991b1b",
      "#450a0a",
      "#18181b"
    ]
  },
  {
    "id": "vid-73",
    "artfantasiaPostId": "73",
    "title": "\"간장의 미스테리\" 더담 백간장·흑간장 TVCF (베트남/글로벌)",
    "client": "더담 (THE DAM)",
    "category": "commercial",
    "categoryLabel": "TVCF / 해외 광고영상",
    "year": "2016",
    "duration": "00:30",
    "postUrl": "https://artfantasia.co.kr/73",
    "thumbnailUrl": "/assets/projects/vid-73.png",
    "badge": "베트남 온에어 TVCF",
    "role": [
      "TVCF 기획",
      "특수 조명 & 푸드 촬영",
      "오리지널 음악",
      "해외 방송 송출"
    ],
    "description": "\"과연 간장은 무조건 검은색이어야만 하는가?\" 대한민국 더담이 선사하는 간장의 미스테리. 맑은 투명함으로 요리의 본색을 살리는 백간장과 깊은 풍미의 흑간장의 차별화된 매력을 미스터리 콘셉트의 감각적인 TVCF로 담아냈습니다.",
    "keyHighlights": [
      "베트남 현지 온에어 방송광고",
      "간장의 고정관념을 깨는 미스터리 콘셉트",
      "아트판타지아 초창기 대표 TVCF"
    ],
    "stillColors": [
      "#1c1917",
      "#292524",
      "#44403c",
      "#0c0a09"
    ]
  }
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'aud-jobkorea',
    title: '김대리, 오늘도 야근이야? 다시 깔자 잡코리아',
    client: '잡코리아 (JOBKOREA)',
    category: 'radio_cm',
    categoryLabel: '30초',
    duration: '00:30',
    durationSeconds: 30,
    broadcastChannel: '출퇴근길 전국 지상파 라디오 프라임타임 송출',
    mood: '직장인의 현실 공감 생활밀착형 드라마와 임팩트 있는 카피',
    bpm: 110,
    year: '2023',
    badge: '출퇴근길 직장인 타깃 대표 CM',
    scriptSnippet: '"김대리 오늘도 야근이야? 고민만 하지 말고 다시 깔자 잡코리아! 끝이 다른 시작, 잡코리아."',
    fullScript: '"(선배) 김대리, 오늘도 야근이야? (김대리) 아... 워라밸이 좋던가, 연봉이라도 높던가. 그런 데는 없겠지? (성우) 왜 없어! 고민만 하지 말고 다시 깔자 잡코리아! 연봉, 워라밸, 나에게 딱 맞는 기업을 완벽 추천! (김대리) 이걸 내가 왜 지웠지? (성우) 다시 깔자 잡코리아, 지금 바로 다운로드! 잡코리아 아직 안 깔았어? (나레이션) 끝이 다른 시작, 잡코리아."',
    description: '야근에 지친 직장인의 리얼한 대화로 시작하여 앱 재설치를 유도하는 강력한 콜투액션(CTA)과 "끝이 다른 시작" 슬로건을 각인시킨 고효율 라디오 드라마 광고.',
    keyHighlights: ['현실 직장인 페이소스 공감 연출', '다시 깔자 잡코리아 강력한 행동 유도 CTA', '연봉·워라밸 맞춤 추천 USP 부각'],
    synthTheme: 'corporate',
    audioUrl: '/audio/radio/jobkorea.mp3'
  },
  {
    id: 'aud-ngcc',
    title: '불법 도박 안 돼! 정직한 사람이 되어줘',
    client: '국무총리실 사행산업통합감독위원회',
    category: 'public_cm',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '지상파 3사 전국 라디오 동시 공익 캠페인 송출',
    mood: '애절하면서도 진심 어린 호소의 멜로디와 엄정한 공익 나레이션',
    bpm: 78,
    year: '2021',
    badge: '정부기관 전국 동시 송출 공익광고',
    scriptSnippet: '"(노래) 불법 도박 안 돼 안 돼! 도박은 이제 안 돼! 정직한 사람이 되어줘. 신고번호 1855-0112"',
    fullScript: '"(감성 보컬) 불법 도박 안 돼 안 돼! 도박은 이제 안 돼! 정직한 사람이 되어줘. 너에게 힘이 될게. 언제나 함께 할게. (나레이션) 신고번호 1855-0112, 사행산업통합감독위원회."',
    description: '불법 도박의 폐해로부터 가족과 사회의 행복을 지키기 위해, 따뜻하지만 단호한 호소의 노래와 공익 신고 번호(1855-0112)를 직관적으로 전달한 국무총리실 산하 공익 캠페인.',
    keyHighlights: ['서정적이면서도 경각심을 주는 멜로디', '신고번호 1855-0112 암기성 극대화', '정부부처 전국 지상파 라디오 동시 송출'],
    synthTheme: 'cinematic',
    audioUrl: '/audio/radio/ngcc.mp3'
  },
  {
    id: 'aud-massgoo',
    artfantasiaPostId: '170',
    postUrl: 'https://artfantasia.co.kr/170',
    youtubeId: '423wZCv5uuI',
    title: '고반발 드라이버',
    client: '마쓰구 골프 (MASSGOO)',
    category: 'radio_cm',
    categoryLabel: '40초',
    duration: '00:40',
    durationSeconds: 40,
    broadcastChannel: '대한민국 대표 팟캐스트 "팟빵" / 지상파 라디오',
    mood: '필드 현장감 넘치는 티샷 타구음과 위트 있는 보이스 드라마',
    bpm: 118,
    year: '2022',
    badge: '팟빵 골프 부문 1위 라디오 CM',
    scriptSnippet: '"(타구음: 깡!) 굿샷! 미사일 같은 샷! 고반발 드라이버의 끝판왕 마쓰구! 골프의 자신감을 되찾으세요."',
    fullScript: '"(티샷 타구음: 깡!) 굿샷! (여성) 어머, 이 미사일 같은 샷! 선생님 오늘 컨디션 좋으신가 봐요? 너무 똑바른 공이네요. 어쩜 이렇죠? (남성) 하하, 마쓰구 드라이버를 모르시나요? 하하. (합창) 압도적인 비거리 진짜 똑바로 가는 마쓰구! 고반발 드라이버의 끝판왕 마쓰구! (남성 성우) 고품질 소재로 환상적인 비거리, 방향성, 타감을 드리는 드라이버는 마쓰구! 고반발 드라이버, 마쓰구를 검색하세요. 부탁해요~ (여성) 골프의 자신감을 되찾으세요."',
    description: '시원한 드라이버 타구음(깡!)과 동반자의 감탄을 담은 필드 라운딩 드라마. "미사일 같은 샷, 똑바로 가는 비거리"를 강력하게 각인시켜 골퍼들의 검색과 구매를 이끌어낸 40초 팟캐스트/라디오 광고.\n\n* 본 CM은 대한민국 대표 팟캐스트 "팟빵"에서도 송출되고 있습니다.',
    keyHighlights: ['리얼 골프장 드라이버 타구음 ASMR 사운드', '비거리 고민 골퍼 심리 정조준', '라디오 & 팟빵 누적 1,000만 회 이상 청취'],
    synthTheme: 'corporate',
    audioUrl: '/audio/radio/massgoo.mp3'
  },
  {
    id: 'aud-intake',
    artfantasiaPostId: '142',
    postUrl: 'https://artfantasia.co.kr/142',
    youtubeId: 'My1BAkSAG8g',
    title: '모닝죽',
    client: '인테이크 (모닝죽 / INTAKE)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: 'KOBACO 중소기업 방송광고 지원 / 공중파 라디오',
    mood: '상쾌하고 활기찬 아침의 팝 CM송 & 발랄한 모닝콜',
    bpm: 126,
    year: '2021',
    badge: 'KOBACO 방송광고 지원 선정작',
    scriptSnippet: '"(CM송) 아침 먹었어요? 오빠 아침 먹었어요? 모닝죽! 바쁜 아침엔 간편한 모닝죽!"',
    fullScript: '"(상큼한 모닝 비트) 아침 먹었어요? 오빠 아침 먹었어요? 모닝죽! 언니 아침 먹었나요? 모닝죽! 아빠 아침 드셨어요? 모닝죽! 인테이크 모닝죽! 바쁜 아침엔 간편한 모닝죽! (나레이션) 식사를 연구하다, 인테이크."',
    description: '한국방송광고진흥공사(KOBACO) 중소기업 방송광고 활성화 지원 선정작. "아침 먹었어요?"라는 친근한 모닝콜 형태의 질문 반복과 통통 튀는 멜로디로 바쁜 직장인·학생들의 아침 필수품으로 자리매김한 징글.\n\n* 본 라디오광고는 한국방송광고진흥공사의 중소기업 방송광고 활성화 지원으로 제작되었습니다.',
    keyHighlights: ['오빠·언니·아빠 부르는 중독적 모닝콜 훅', '짜먹는 모닝죽의 간편성 전달', 'KOBACO 우수 방송광고 선정'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/intake.mp3'
  },
  {
    id: 'aud-missbe',
    artfantasiaPostId: '190',
    postUrl: 'https://artfantasia.co.kr/190',
    youtubeId: 'U4k4_LYBc_w',
    title: '빵순이·고기대장을 위한 다이어트, 굶지 말고 컷!',
    client: '미스비 (missbe)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '대한민국 대표 팟캐스트 "팟빵" / 라디오 송출',
    mood: '코믹하고 리듬감 넘치는 중독성 다이어트 챈트 CM송',
    bpm: 120,
    year: '2022',
    badge: '팟빵 & 라디오 화제의 다이어트 CM',
    scriptSnippet: '"이제 굶지 말고 똑똑하게 컷 하자! 빵순아~ 빵빵순순 빵순이 고기대장 먹으면서 다이어트 미스비!"',
    fullScript: '"(다이어트 훅) 이제 굶지 말고 똑똑하게 컷 하자! 빵순아~ 빵빵순순 빵순이 고기고기 고기대장 먹으면서 건강한 다이어트 미스비! 하! 빵빵순순 빵순이 고기고기 고기대장 빵순이 고기대장을 위한 다이어트 미스비! 하! (나레이션) 이 제품은 건강기능식품입니다."',
    description: '탄수화물과 육류를 사랑하는 현대인을 위해 "빵순이, 고기대장"이라는 직관적인 페르소나를 유쾌한 리듬과 빠른 챈트로 녹여내어 폭발적인 구매 전환을 기록한 히트 CM송.',
    keyHighlights: ['중독적인 빵순이·고기대장 챈트 멜로디', '건강기능식품 심의 규격 준수', '팟캐스트 팟빵 광고 송출 효과 극대화'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/missbe.mp3'
  },
  {
    id: 'aud-ohgrae',
    title: '칼로리 걱정 노! 바삭함 업! 1일 1퐁 통귀리 스낵',
    client: '오그래 (Oh-Grae)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '출근시간 및 청소년 라디오 채널 송출',
    mood: '중독성 있는 빠른 비트와 발랄한 챈트 랩 CM송',
    bpm: 128,
    year: '2022',
    badge: '전국 편의점 & 대형마트 입점 스낵',
    scriptSnippet: '"(CM송) 칼로리 걱정 노노노! 바삭함은 업업업! 오그래 오그래 퐁퐁퐁! 오늘부터 1일 1퐁 스타트!"',
    fullScript: '"(빠른 팝 댄스 비트) 칼로리 걱정 노노노! 바삭함은 업업업! 오그래 오그래 퐁퐁퐁! 오그래 오그래 오그래퐁! (발랄한 여성) 아직도 1일 1퐁 안 한다고? 통귀리 간식 오그래퐁으로 오늘부터 1일 1퐁 스타트! 오그래퐁!"',
    description: '"1일 1퐁"이라는 중독성 있는 시그니처 훅과 빠른 챈트 리듬으로 통귀리 스낵의 바삭함과 건강한 저칼로리 간식의 매력을 극대화한 젊은 감각의 라디오 CM송.',
    keyHighlights: ['초당 비트감 넘치는 챈트 랩 징글', 'MZ세대 타깃 1일 1퐁 챌린지 카피', '건강한 통귀리 스낵 특장점 압축 전달'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/ohgrae.mp3'
  },
  {
    id: 'aud-millstudio',
    title: '매일매일 바뀌는 당신의 스타일',
    client: '밀스튜디오 (MILL STUDIO)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '공중파 라디오 트렌드 프로그램 스팟',
    mood: '감각적이고 트렌디한 어반 R&B 팝 CM송',
    bpm: 114,
    year: '2022',
    badge: '전국 백화점 & 로드숍 브랜드',
    scriptSnippet: '"(CM송) 밀스튜디오 오오 여기, 밀스튜디오 오오 널 찾아봐, 매일매일 바뀌는 당신의 스타일 밀스튜디오."',
    fullScript: '"(감각적인 R&B 비트) 밀스튜디오 오오 여기~ 밀스튜디오 오오 널 찾아봐~ 밀스튜디오 오오 지금, 내 새로운 스타일 만들어봐. (나레이션) 매일매일 바뀌는 당신의 스타일, 밀스튜디오."',
    description: '어반 라이프스타일 패션 브랜드 밀스튜디오의 모던하고 스타일리시한 아이덴티티를 세련된 트렌디 R&B 팝 멜로디와 매력적인 여성 보컬로 완성한 브랜드 로고송.',
    keyHighlights: ['트렌디 어반 R&B 비트 작곡', '매혹적인 여성 보컬 멜로디 라인', '매일 새로운 스타일링 브랜드 이미지 전달'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/millstudio.mp3'
  },
  {
    id: 'aud-cafedocheon',
    title: '한 모금, 책 한 장, 자연 한 폭 (숲속 북카페)',
    client: '카페 도천 (홍시)',
    category: 'lifestyle',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: 'MBC FM4U / SBS 파워FM / 대구MBC / TBC',
    mood: '서정적이고 아늑한 숲속 힐링 내레이션 & 어쿠스틱 피아노',
    bpm: 76,
    year: '2023',
    badge: '지상파 라디오 방송 심의 완료',
    scriptSnippet: '"커피 한 모금, 책 한 장, 자연 한 폭. 이 모든 게 하나가 되는 공간, 카페 도천."',
    fullScript: '"커피 한 모금, 책 한 장, 자연 한 폭. 이 모든 게 하나가 되는 공간, 카페 도천. 도천 숲을 거닐며 자연을 느끼고 책을 읽으며 휴식과 힐링의 시간을 가져보세요. 카페, 서점, 북스테이. 책이 있는 숲속 카페, 카페 도천."',
    description: '자연과 책, 커피가 하나로 어우러진 복합 문화공간 카페 도천의 감성 라디오 스팟. 편안한 어쿠스틱 피아노 선율과 따뜻한 보이스로 청취자에게 깊은 쉼의 메시지를 전합니다.',
    keyHighlights: ['어쿠스틱 피아노 & 앰비언스 사운드', '감성 북카페 공간 브랜딩', '지상파 라디오 프라임 타임 송출'],
    synthTheme: 'acoustic',
    audioUrl: '/audio/radio/cafedocheon.mp3'
  },
  {
    id: 'aud-justdraw',
    title: '뿌리고 쏘며 스트레스 해소 (액션 페인팅)',
    client: '저스트 드로우 (JUST DRAW)',
    category: 'lifestyle',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: 'FM 음악방송 / 공중파 라디오 프라임 타임',
    mood: '경쾌하고 유쾌한 액티브 비트 & 톡톡 튀는 키즈 톤',
    bpm: 124,
    year: '2023',
    badge: '체험형 문화공간 라디오 캠페인',
    scriptSnippet: '"이제 붓으로만 그리는 그림은 노! 물감을 뿌리고 쏘며 상상력은 업! 스트레스는 다운!"',
    fullScript: '"이제 붓으로만 그리는 그림은 노! 캔버스에 물감을 뿌리고 쏘며 자유롭게 그려봐요. 액션 페인팅 저스트 드로우! 신나게 그리다 보면 상상력은 업! 스트레스는 다운! 아티스트 친구들, 레디~ 액션! 액션 페인팅 저스트 드로우."',
    description: '캔버스에 물감을 던지고 뿌리며 자유를 만끽하는 액션 페인팅 스튜디오의 매력을 통통 튀는 보이스와 생동감 넘치는 사운드 이펙트로 담아낸 20초 라디오 광고.',
    keyHighlights: ['물감 스프레이 & 액션 페인팅 효과음', '아이와 청년층 타깃 상상력 고취 카피', '생생한 몰입감의 사운드 디자인'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/justdraw.mp3'
  },
  {
    id: 'aud-hahoedoma',
    title: '통통통 맛있는 요리의 시작 (명품 수제 도마)',
    client: '안동 하회도마',
    category: 'radio_cm',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: 'TBC 라디오 / 대구MBC / 공중파 라디오',
    mood: '따뜻하고 정겨운 가족 주방 내레이션 & 도마 칼질 ASMR',
    bpm: 80,
    year: '2023',
    badge: '전통 장인 수제 도마 브랜드',
    scriptSnippet: '"어? 벌써 애들 올 시간이 다 돼 가네? 통통통 소리가 들리면 맛있는 요리가 시작됩니다."',
    fullScript: '"어? 벌써 애들 올 시간이 다 돼 가네? (도마 칼질 소리: 통통통) 통통통 소리가 들리면 맛있는 요리가 시작됩니다. 하나뿐이라 더 소중한 우리 가족을 위한 맛있는 소리. 우리 가족만의 수제 도마, 통통통 하회도마."',
    description: '엄마의 따뜻한 주방 풍경과 칼이 도마에 닿는 명쾌한 "통통통" ASMR 사운드를 결합하여, 가족을 위한 수제 명품 도마의 정성과 가치를 생생하게 전달한 감성 라디오 스팟.',
    keyHighlights: ['리얼 주방 도마 칼질 ASMR 효과음', '친근한 엄마의 독백 생활 연출', '안동 전통 목공예 프리미엄 브랜드화'],
    synthTheme: 'acoustic',
    audioUrl: '/audio/radio/hahoedoma.mp3'
  },
  {
    id: 'aud-wangpicheon',
    title: '왕들이 피난했던 청정 울진 자연 쉼터',
    client: '사회적기업 왕피천힐링팜',
    category: 'public_cm',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '경북권 공중파 라디오 / 전국 힐링 테마 스팟',
    mood: '익살스러운 왕의 사극 톤과 청량한 힐링 송의 반전 조화',
    bpm: 72,
    year: '2023',
    badge: '사회적기업 생태 관광 활성화',
    scriptSnippet: '"예부터 왕들이 피난했다던 왕피천. 피로와 스트레스를 피해 왕피천에 가면 왕인 게지! 내가 왕이 될 상인가?"',
    fullScript: '"(근엄한 사극 톤) 예부터 왕들이 피난했다던 왕피천. 왕이 별 건가? 피로와 스트레스를 피해 왕피천에 가면 왕인 게지! 하하하. (경쾌한 징글) 떠나요 왕피천 힐링팜으로~ (사극) 내가 왕이 될 상인가? 네이버에서 왕피천 힐링팜을 검색하시게. 서둘러 예약하게나."',
    description: '역사적 유래가 깃든 울진 왕피천의 자연을 익살스럽고 호탕한 사극 왕의 캐릭터 연기로 재해석하여, 청취자들의 뇌리에 단숨에 각인시킨 화제의 힐링 여행 라디오 광고.',
    keyHighlights: ['호탕한 사극 톤 성우 열연 & 위트 있는 스토리텔링', '대중적 유행어 패러디로 강렬한 인지도 확보', '네이버 검색 유도 콜투액션(CTA) 최적화'],
    synthTheme: 'ambient',
    audioUrl: '/audio/radio/wangpicheon.mp3'
  },
  {
    id: 'aud-dogdo',
    title: '강아지도 독도, 고양이도 독도! 황태 비타민 음료',
    client: '독도 (DogDo)',
    category: 'lifestyle',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '주말 라디오 및 동물 애호 프로그램 연계 송출',
    mood: '아기자기하고 사랑스러운 키즈·반려동물 가족 CM송',
    bpm: 90,
    year: '2023',
    badge: '반려동물 전용 건강 음료',
    scriptSnippet: '"(CM송) 강아지도 독도, 고양이도 독도, 그리고 나도 함께 건강하게 몸을 챙겨요. 너도 나도 독도!"',
    fullScript: '"(귀여운 멜로디) 강아지도 (독도!) 고양이도 (독도!) 그리고 나도 함께 건강하게 몸을 챙겨요~ (나레이션) 맛있게, 건강하게, 안전하게! 몸에 좋은 황태 비타민 믹스 가득! 이제 우리 아이 건강은 황태 비타민 음료 독도로 챙겨요. (노래) 너도 나도 독도!"',
    description: '반려견과 반려묘를 위한 황태 비타민 영양 음료. 아이의 맑은 음색과 경쾌한 리듬으로 반려동물의 수분 보충과 건강 관리를 친근하게 전달한 펫케어 대표 라디오 광고.',
    keyHighlights: ['동심을 자극하는 사랑스러운 아동 보컬', '황태 비타민 믹스 핵심 성분 강조', '반려견·반려묘 보호자 직관 타깃팅'],
    synthTheme: 'acoustic',
    audioUrl: '/audio/radio/dogdo.mp3'
  },
  {
    id: 'aud-withus',
    title: '가깝고 빠르게, 믿음직한 파트너 (전국 500개 대리점)',
    client: '위더스컴퓨터 (Withus Computer)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: 'KOBACO 중소기업 방송광고 지원 / 공중파 라디오',
    mood: '밝고 희망찬 에너제틱 팝 CM송 & 친근한 챈트',
    bpm: 120,
    year: '2022',
    badge: 'KOBACO 방송광고 지원 선정',
    scriptSnippet: '"(CM송) 기분 좋은 컴퓨터, 위더스 컴퓨터! 위! 위! 가깝고 빠르게! 전국 500개 대리점!"',
    fullScript: '"(CM송) 기분 좋은 컴퓨터, 위더스 컴퓨터! 위! 위! 가깝고 빠르게! 전~국 500개 대리점! 위! 위! 믿음이 중요해! 위! 위! 두 번을 보증해! 본사! 대리점 함께 해! 기분 좋은 컴퓨터, 예! 위! 위! 위더스 컴퓨터! (나레이션) 컴퓨터는, 위더스 컴퓨터."',
    description: '한국방송광고진흥공사(KOBACO) 중소기업 방송광고 지원 선정작. 귀에 쏙 들어오는 중독성 강한 멜로디의 오리지널 CM송과 "위!위!" 챈트로 전국적인 브랜드 인지도를 폭발시켰습니다.',
    keyHighlights: ['KOBACO 방송광고 활성화 지원 선정작', '중독성 있는 보컬 챈트 & 브라스 편곡', '전국 500개 대리점 네트워크 신뢰도 강화'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/withus.mp3'
  },
  {
    id: 'aud-daeguro',
    title: '첫 주문 5천원 할인! 소상공인과 함께하는 착한 배달앱',
    client: '대구광역시 · 인성데이타 (대구로)',
    category: 'public_cm',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '대구·경북 전역 라디오 채널 (MBC, TBC, CBS)',
    mood: '활기차고 친근한 혜택 중심의 알찬 정보 전달',
    bpm: 126,
    year: '2022',
    badge: '대구광역시 공공 배달앱 공식 CM',
    scriptSnippet: '"대구형 배달앱 대구로, 아시죠? 첫 주문 5천원 할인, 주문할 때마다 2천원 쿠폰! 오늘은 대구로로 치킨 파티다!"',
    fullScript: '"대구형 배달앱 대구로, 아시죠? 대구로 첫 주문 시 5천원 할인! 주문할 때마다 2천원 쿠폰! 행복페이 온라인 결제 가능한 유일한 앱으로 5% 추가 할인까지! 지금 대구로로 주문하고 지역경제도 살리고, 오늘은 대구로로 치킨 파티다! 주문은 대구로, 배달은 대구로!"',
    description: '대구광역시 공공 배달 플랫폼 대구로의 강력한 시민 할인 혜택과 지역 소상공인 상생 가치를 빠르고 명확한 템포의 보이스와 징글 사운드로 알린 대표 방송 광고.',
    keyHighlights: ['첫 주문 5천원 & 2천원 쿠폰 혜택 직관 전달', '행복페이 5% 추가 할인 소구', '대구·경북 전역 라디오 프라임타임 송출'],
    synthTheme: 'corporate',
    audioUrl: '/audio/radio/daeguro.mp3'
  },
  {
    id: 'aud-bbale',
    title: '착한 세제, 착한 가격에 배달까지 (스마트 세탁소)',
    client: '빨래장이 (전화 1899-2407)',
    category: 'logo_song',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '라디오 주부 청취율 1위 낮 프로그램 송출',
    mood: '밝고 아기자기한 동요풍 멜로디 & 상쾌한 세탁 징글',
    bpm: 122,
    year: '2022',
    badge: '전화 1899-2407 대표 CM송',
    scriptSnippet: '"(CM송) 착한 세제 빨래장이, 빨래장이! 착한 가격에 배달까지, 빨래장이! 전화문의는 1899-2407"',
    fullScript: '"(상큼한 멜로디) 착한 세제 빨래장이~ (빨래장이!) 착한 가격에 배달까지~ (빨래장이!) 우리 가족 세탁소는 빨래장이로 가요. 상쾌한 하루를 위해 빨래장이로 가요. (나레이션) 전화 문의는 1899-2407."',
    description: '단 20초 만에 남녀노소 누구나 쉽게 따라 부를 수 있는 귀여운 코러스와 운율로 "착한 세제, 착한 가격, 수거 배달 서비스"의 3대 강점을 완벽하게 전달한 CM송.',
    keyHighlights: ['콜앤리스폰스(Call & Response) 합창 구조', '귀에 쏙 박히는 대표번호 1899-2407 징글', '가족 친화적 친환경 세탁 브랜드 확립'],
    synthTheme: 'jingle',
    audioUrl: '/audio/radio/bbale.mp3'
  },
  {
    id: 'aud-galilee',
    title: '얼굴인식·체온측정·마스크착용 원스톱 (안심 방역 솔루션)',
    client: '사회적기업 갈릴리 (Galilee)',
    category: 'radio_cm',
    categoryLabel: '20초',
    duration: '00:20',
    durationSeconds: 20,
    broadcastChannel: '전국 교통방송 및 라디오 뉴스 전후 스팟',
    mood: '신뢰감 있는 남녀 듀엣 대화형 톤과 스마트한 방역 솔루션',
    bpm: 108,
    year: '2021',
    badge: 'KC 인증 & 착한 사회적기업',
    scriptSnippet: '"코로나로 예민한 시기에 믿을 만한 체온측정기 없을까? KC 인증 갈릴리 자동체온측정기가 있잖아!"',
    fullScript: '"(여성) 코로나로 요즘처럼 예민한 시기에 믿을 만한 체온측정기가 없을까? (남성) 왜 없어~ KC 인증 갈릴리 자동체온측정기가 있잖아! 얼굴인식, 체온측정, 마스크 착용여부를 한번에! (여성) KC 인증이라면 믿고 안심할 수 있겠어. (남성) 착한 가격에 믿을 수 있는 인증 사회적기업, 갈릴리."',
    description: '정확한 KC 인증과 사회적기업의 신뢰를 바탕으로 얼굴인식, 체온 측정, 마스크 착용 감지를 3 in 1으로 처리하는 스마트 방역 솔루션을 알기 쉬운 대화체로 연출한 라디오 스팟.',
    keyHighlights: ['공감대를 형성하는 일상 남녀 대화형 구성', '얼굴인식·체온·마스크 3중 기능 원스톱 소구', 'KC인증 및 공공 사회적기업 신뢰도 부각'],
    synthTheme: 'corporate',
    audioUrl: '/audio/radio/galilee.mp3'
  }
];

export const MARKETING_CASES: MarketingCase[] = [
  {
    id: 'mkt-1',
    title: '패션 플랫폼 A사 2025 F/W 통합 브랜딩 & 퍼포먼스 캠페인',
    client: '글로벌 온라인 패션 편집숍',
    pillar: 'imc',
    pillarLabel: '통합 디지털 캠페인 (IMC)',
    metricHighlight: '+380%',
    metricLabel: '전년 동기 대비 신규 가입자 증가율',
    period: '2025.09 - 2025.12 (3개월)',
    summary: '영상 제작(유튜브 브랜드 필름), 라디오 CM(퇴근길 직장인 타깃 송출), 인스타그램 숏폼 챌린지 및 메타/구글 SA/DA 퍼포먼스 광고를 결합한 풀퍼널 캠페인.',
    strategies: [
      '2030 직장인 출퇴근 시간대 MBC FM4U 및 멜론 오디오 타깃 광고 집중 배포',
      '패션 인플루언서 25인과 협업한 룩북 숏폼 콘텐츠 릴리즈',
      '고효율 소재 A/B 테스트 기반 퍼포먼스 ROAS 420% 달성'
    ],
    tags: ['IMC', '풀퍼널 마케팅', '오디오+영상 시너지', 'ROAS 극대화']
  },
  {
    id: 'mkt-2',
    title: '식음료 프랜차이즈 B사 중독성 징글 기반 틱톡·릴스 챌린지',
    client: '전국 450개 매장 식음료 브랜드',
    pillar: 'viral',
    pillarLabel: '바이럴 숏폼 & 챌린지',
    metricHighlight: '14,800,000+',
    metricLabel: 'SNS 누적 오가닉 조회수',
    period: '2025.06 - 2025.08',
    summary: '아트판타지아 사운드랩이 작곡한 15초 훅(Hook) 송과 재치 있는 캐릭터 모션 그래픽을 결합하여 자발적 UGC 참여 1,200건을 이끌어낸 바이럴 캠페인.',
    strategies: [
      '입에 착 달라붙는 3음계 중독성 후크송 작곡 및 음원 등록',
      '안무가 매칭을 통한 쉬운 챌린지 댄스 기획 및 틱톡 크리에이터 시딩',
      '전국 매장 오프라인 영수증 인증 프로모션 연계로 실매출 28% 상승'
    ],
    tags: ['바이럴 마케팅', 'UGC 확산', '숏폼 챌린지', '사운드 마케팅']
  },
  {
    id: 'mkt-3',
    title: 'B2B 클라우드 솔루션 C사 테크 리드제너레이션 캠페인',
    client: '엔터프라이즈 SaaS 솔루션 기업',
    pillar: 'performance',
    pillarLabel: '퍼포먼스 & B2B 전환',
    metricHighlight: '-46%',
    metricLabel: '양질 리드 획득당 비용(CPA) 절감',
    period: '2025.10 - 2026.02',
    summary: '복잡한 테크 기술을 60초 3D 인포그래픽 영상으로 알기 쉽게 재구성하고, 링크드인 및 직장인 커뮤니티 타깃 정밀 광고를 집행하여 엔터프라이즈 미팅 84건 수주.',
    strategies: [
      'CTO/개발자 타깃 맞춤형 전문 테크 백서 및 3D 시각화 영상 제작',
      'LinkedIn Sponsored Content 및 리타깃팅 퍼널 설계',
      '상담 신청 전환율(CVR) 6.2% 기록'
    ],
    tags: ['B2B 마케팅', '리드제너레이션', '인포그래픽', '데이터 기반 타깃팅']
  },
  {
    id: 'mkt-4',
    title: '뷰티 브랜드 D사 톱 크리에이터 브랜디드 엔터테인먼트',
    client: 'K-뷰티 스킨케어 브랜드',
    pillar: 'creator',
    pillarLabel: '인플루언서 & 크리에이터 파트너십',
    metricHighlight: '4.8x',
    metricLabel: '브랜드 네이버 검색량 급증',
    period: '2025.11 - 2026.01',
    summary: '단순 PPL 노출을 탈피하고 브랜드 철학을 녹여낸 15분 웹 예능형 브랜디드 다큐멘터리를 자체 기획·제작하여 크리에이터 채널 동시 릴리즈.',
    strategies: [
      '유튜브 구독자 120만 테크/라이프스타일 크리에이터 매칭',
      '아트판타지아 시네마 제작팀이 직접 크리에이터 스튜디오 출장 촬영 및 편집',
      '올리브영 단독 기획전 연계로 오픈 당일 초도 물량 완판'
    ],
    tags: ['브랜디드 엔터테인먼트', '인플루언서 콜라보', '완판 기록', '고감도 영상미']
  }
];

export const NOTICES: NoticeItem[] = [
  {
    id: "notice-1",
    title: "SBS M&C CREAM 2026년 11월호",
    author: "아트판타지아",
    category: "정보",
    date: "2026.10.24",
    pinned: false,
    views: 7,
    content: [
      "<span style=\"color: #fbbf24; font-weight: bold;\"><strong>아래의 사항을 확인하실 수 있습니다</strong></span>.<br />\n<br />\nSBS : TV,라디오 패키지 광고상품, 편성표 광고단가<br />\n<br />\n<a href=\"https://z.methodia.co.kr/portal/main/index.do#6thpage\" target=\"_blank\" style=\"color: #fbbf24; text-decoration: underline;\">바로보기</a>"
    ],
    images: []
  },
  {
    id: "notice-2",
    title: "한국방송광고공사 광고1번지 2026년 11월호",
    author: "아트판타지아",
    category: "정보",
    date: "2026.10.24",
    pinned: false,
    views: 7,
    content: [
      "<span style=\"color: #fbbf24; font-weight: bold;\"><strong>아래의 사항을 확인하실 수 있습니다</strong></span>.<br />\n<br />\nMBC,KBS : TV,라디오 패키지 광고상품, 편성표 광고단가<br />\n외 라디오광고 : 편성표 및 광고단가<br />\n<br />\n<a href=\"http://aii.co.kr/hosting/company/e-book/ecatalog5.php?Dir=103\" target=\"_blank\" style=\"color: #fbbf24; text-decoration: underline;\">바로보기</a>"
    ],
    images: []
  },
  {
    id: "notice-3",
    title: "아트판타지아 홈페이지 리뉴얼 및 서버 증축",
    author: "아트판타지아",
    category: "소식",
    date: "2026.10.24",
    pinned: false,
    views: 13,
    content: [
      "AI시대에 맞는 현명한 대처와 발전되어가는 저희를 소개 드리고자 합니다.",
      "앞으로도 최선을 다하겠습니다."
    ],
    images: []
  }
];
