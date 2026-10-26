import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('public/assets/logos');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 51 Logos in exact user numerical sequence
const logos = [
  // 1. Samsung
  {
    filename: '1.png',
    name: '삼성전자',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" width="420" height="130">
        <g transform="matrix(0.966 0 -0.15 0.989 20 5)">
          <ellipse cx="200" cy="60" rx="190" ry="54" fill="#0C2340"/>
          <text x="200" y="74" fill="#FFFFFF" font-family="'Arial Black', Impact, 'Segoe UI', sans-serif" font-weight="900" font-size="44" letter-spacing="4" text-anchor="middle">SAMSUNG</text>
        </g>
      </svg>
    `
  },
  // 2. Hyundai Motor
  {
    filename: '2.png',
    name: '현대자동차',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 130" width="480" height="130">
        <g fill="#002C6C">
          <ellipse cx="140" cy="65" rx="72" ry="46" fill="none" stroke="#002C6C" stroke-width="11"/>
          <path d="M110 98 C120 75 125 55 128 35 C132 35 142 35 146 35 C141 55 137 75 130 98 Z" />
          <path d="M152 98 C158 75 163 55 166 35 C170 35 180 35 184 35 C177 55 172 75 164 98 Z" />
          <path d="M124 67 C138 67 155 67 170 67 C168 76 150 76 136 76 C130 76 126 71 124 67 Z" />
          <text x="245" y="78" font-family="'Arial Black', 'Noto Sans KR', sans-serif" font-weight="900" font-size="34" letter-spacing="3" fill="#002C6C">HYUNDAI</text>
        </g>
      </svg>
    `
  },
  // 3. Hyundai E&C
  {
    filename: '3.png',
    name: '현대건설',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(10, 15)">
          <polygon points="40,90 85,15 130,90" fill="#009639"/>
          <polygon points="40,90 85,15 55,90" fill="#F39200"/>
          <text x="145" y="58" font-family="'Arial Black', sans-serif" font-weight="900" font-size="36" fill="#003876" letter-spacing="1">HYUNDAI</text>
          <text x="145" y="88" font-family="'Segoe UI', 'Noto Sans KR', sans-serif" font-weight="800" font-size="16" fill="#003876" letter-spacing="3">ENGINEERING &amp; CONSTRUCTION</text>
        </g>
      </svg>
    `
  },
  // 4. E1
  {
    filename: '4.png',
    name: 'E1',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 130" width="320" height="130">
        <rect x="20" y="15" width="280" height="100" rx="24" fill="#F37021" stroke="#FFFFFF" stroke-width="4"/>
        <text x="110" y="88" fill="#FFFFFF" font-family="'Arial Black', sans-serif" font-weight="900" font-size="76">E</text>
        <g fill="#FFFFFF">
          <polygon points="175,40 195,25 210,25 210,35 185,45" />
          <rect x="185" y="47" width="28" height="6"/>
          <rect x="185" y="56" width="28" height="6"/>
          <rect x="185" y="65" width="28" height="6"/>
          <rect x="185" y="74" width="28" height="6"/>
          <rect x="185" y="83" width="28" height="6"/>
        </g>
      </svg>
    `
  },
  // 5. DSEC
  {
    filename: '5.png',
    name: '디섹 (DSEC)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 130" width="380" height="130">
        <text x="190" y="75" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#004A99" letter-spacing="4" text-anchor="middle">dsec</text>
        <text x="190" y="102" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#555555" letter-spacing="2" text-anchor="middle">TOTAL ENGINEERING SOLUTION</text>
      </svg>
    `
  },
  // 6. Kyochon
  {
    filename: '6.png',
    name: '교촌',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 130" width="400" height="130">
        <text x="200" y="82" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="64" fill="#1C1815" letter-spacing="2" text-anchor="middle">KYOCHON</text>
      </svg>
    `
  },
  // 7. Daeguro
  {
    filename: '7.png',
    name: '대구로',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 130" width="380" height="130">
        <path d="M40 38 L190 12 L340 38" fill="none" stroke="#2EB5E5" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="190" y="104" font-family="'Noto Sans KR', 'Malgun Gothic', sans-serif" font-weight="900" font-size="64" fill="#2EB5E5" letter-spacing="6" text-anchor="middle">대구로</text>
      </svg>
    `
  },
  // 8. Nongshim
  {
    filename: '8.png',
    name: '농심',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" width="420" height="130">
        <ellipse cx="85" cy="65" rx="55" ry="46" fill="#ED1C24" />
        <ellipse cx="85" cy="54" rx="17" ry="24" fill="#FFFFFF" />
        <text x="165" y="82" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="52" fill="#222222" letter-spacing="3">농심</text>
      </svg>
    `
  },
  // 9. Shinhan Financial Group
  {
    filename: '9.png',
    name: '신한금융그룹',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 130" width="460" height="130">
        <circle cx="68" cy="65" r="42" fill="#0046FF"/>
        <path d="M52 75 C52 50 84 50 84 75 C84 86 52 86 52 75" fill="none" stroke="#DDA835" stroke-width="8" stroke-linecap="round"/>
        <path d="M68 45 L73 53 L63 53 Z" fill="#DDA835"/>
        <text x="135" y="80" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#4B4B4B" letter-spacing="2">신한금융그룹</text>
      </svg>
    `
  },
  // 10. Republic of Korea Government
  {
    filename: '10.png',
    name: '대한민국정부',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 130" width="480" height="130">
        <circle cx="70" cy="65" r="44" fill="#003478"/>
        <path d="M70 21 A44 44 0 0 1 114 65 C114 89.3 94.3 89.3 70 65 C45.7 40.7 26 40.7 26 65 A44 44 0 0 1 70 21 Z" fill="#CD1041"/>
        <text x="138" y="82" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#4B4B4B" letter-spacing="3">대한민국정부</text>
      </svg>
    `
  },
  // 11. Igloo Corporation
  {
    filename: '11.png',
    name: '이글루',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 130" width="400" height="130">
        <rect x="60" y="30" width="22" height="35" fill="#000000"/>
        <rect x="82" y="30" width="110" height="18" fill="#000000"/>
        <rect x="170" y="48" width="22" height="18" fill="#000000"/>
        <text x="60" y="105" font-family="'Arial Black', sans-serif" font-weight="900" font-size="48" fill="#000000" letter-spacing="6">IGLOO</text>
      </svg>
    `
  },
  // 12. DAPA (방위사업청)
  {
    filename: '12.png',
    name: '방위사업청',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 130" width="460" height="130">
        <circle cx="70" cy="65" r="44" fill="#003478"/>
        <path d="M70 21 A44 44 0 0 1 114 65 C114 89.3 94.3 89.3 70 65 C45.7 40.7 26 40.7 26 65 A44 44 0 0 1 70 21 Z" fill="#CD1041"/>
        <text x="140" y="82" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#4B4B4B" letter-spacing="2">방위사업청</text>
      </svg>
    `
  },
  // 13. Ministry of Finance & Economy (재정경제부)
  {
    filename: '13.png',
    name: '재정경제부',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 130" width="460" height="130">
        <circle cx="70" cy="65" r="44" fill="#003478"/>
        <path d="M70 21 A44 44 0 0 1 114 65 C114 89.3 94.3 89.3 70 65 C45.7 40.7 26 40.7 26 65 A44 44 0 0 1 70 21 Z" fill="#CD1041"/>
        <text x="140" y="82" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#4B4B4B" letter-spacing="3">재정경제부</text>
      </svg>
    `
  },
  // 14. NGCC (사행산업통합감독위원회)
  {
    filename: '14.png',
    name: '사행산업통합감독위원회',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="65" r="40" fill="#003478"/>
        <path d="M65 25 A40 40 0 0 1 105 65 C105 87 87 87 65 65 C43 43 25 43 25 65 A40 40 0 0 1 65 25 Z" fill="#CD1041"/>
        <text x="125" y="68" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="34" fill="#4B4B4B">사행산업통합감독위원회</text>
        <text x="125" y="96" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="16" fill="#777777" letter-spacing="1">National Gambling Control Commission</text>
      </svg>
    `
  },
  // 15. Chuncheon National Museum (국립춘천박물관)
  {
    filename: '15.png',
    name: '국립춘천박물관',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="65" r="40" fill="#003478"/>
        <path d="M65 25 A40 40 0 0 1 105 65 C105 87 87 87 65 65 C43 43 25 43 25 65 A40 40 0 0 1 65 25 Z" fill="#CD1041"/>
        <text x="125" y="68" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="36" fill="#3B3B3B">국립춘천박물관</text>
        <text x="125" y="96" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="18" fill="#777777">Chuncheon National Museum</text>
      </svg>
    `
  },
  // 16. Nakdonggang National Institute of Biological Resources (국립낙동강생물자원관)
  {
    filename: '16.png',
    name: '국립낙동강생물자원관',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 130" width="560" height="130">
        <g transform="translate(10, 8)">
          <path d="M20 40 C70 15 150 45 220 20 L220 50 C150 75 70 45 20 70 Z" fill="#F49A24"/>
          <path d="M120 28 C170 38 230 18 290 35 L290 65 C230 48 170 68 120 58 Z" fill="#72BF44"/>
          <path d="M250 28 C300 15 360 40 420 22 L420 52 C360 70 300 45 250 58 Z" fill="#009FE3"/>
        </g>
        <text x="20" y="92" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="34" fill="#4B4B4B">국립낙동강생물자원관</text>
        <text x="20" y="116" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="15" fill="#777777">Nakdonggang National Institute of Biological Resources</text>
      </svg>
    `
  },
  // 17. Daegu National Science Museum (국립대구과학관)
  {
    filename: '17.png',
    name: '국립대구과학관',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(20, 15)">
          <path d="M35 15 C55 10 75 25 75 45 C75 65 50 85 25 85 C10 85 5 70 15 55 C25 40 40 45 45 60" fill="none" stroke="#99CC33" stroke-width="8" stroke-linecap="round"/>
          <path d="M55 35 C65 45 55 70 35 75" fill="none" stroke="#99CC33" stroke-width="6" stroke-linecap="round"/>
        </g>
        <text x="120" y="58" font-family="'Arial Rounded MT Bold', sans-serif" font-weight="900" font-size="44" fill="#606060">ScienTry</text>
        <text x="120" y="80" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="#777777" letter-spacing="1">DAEGU NATIONAL SCIENCE MUSEUM</text>
        <text x="120" y="110" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="28" fill="#333333">국립대구과학관</text>
      </svg>
    `
  },
  // 18. KISED (창업진흥원)
  {
    filename: '18.png',
    name: '창업진흥원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 130" width="480" height="130">
        <g transform="translate(20, 20)">
          <path d="M15 45 Q15 25 35 25 L65 25 Q85 25 85 45 Q85 65 65 65 L45 65 Q25 65 25 85 L85 85" fill="none" stroke="#ED1C24" stroke-width="12" stroke-linecap="round"/>
          <line x1="50" y1="10" x2="50" y2="75" stroke="#F7941D" stroke-width="10" stroke-linecap="round"/>
          <path d="M75 35 C95 35 110 50 110 75" fill="none" stroke="#00AEEF" stroke-width="10" stroke-linecap="round"/>
        </g>
        <text x="155" y="68" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#003580">창업진흥원</text>
        <text x="158" y="96" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#003580" letter-spacing="4">KOREA STARTUP</text>
      </svg>
    `
  },
  // 19. CCEI (창조경제혁신센터)
  {
    filename: '19.png',
    name: '창조경제혁신센터',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 130" width="460" height="130">
        <circle cx="65" cy="65" r="38" fill="none" stroke="#005BA6" stroke-width="10"/>
        <path d="M65 35 A30 30 0 0 1 95 65 L65 65 Z" fill="#E60026"/>
        <path d="M65 65 L95 65 A30 30 0 0 1 65 95 Z" fill="#00A0E2"/>
        <text x="125" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="36" fill="#222222">창조경제혁신센터</text>
      </svg>
    `
  },
  // 20. DASH (대구창업플랫폼)
  {
    filename: '20.png',
    name: '대쉬 (DASH)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 130" width="400" height="130">
        <text x="200" y="74" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#0072CE" letter-spacing="4" text-anchor="middle">DASH</text>
        <text x="200" y="104" font-family="'Noto Sans KR', sans-serif" font-weight="800" font-size="18" fill="#555555" letter-spacing="2" text-anchor="middle">대구창업플랫폼</text>
      </svg>
    `
  },
  // 21. GCA (경기콘텐츠진흥원)
  {
    filename: '21.png',
    name: '경기콘텐츠진흥원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(10, 20)">
          <circle cx="45" cy="45" r="32" fill="none" stroke="#E5007E" stroke-width="12"/>
          <path d="M45 45 C75 15 105 75 135 45 C165 15 135 45 105 75" fill="none" stroke="#E5007E" stroke-width="12" stroke-linecap="round"/>
        </g>
        <text x="175" y="60" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="36" fill="#333333">경기콘텐츠진흥원</text>
        <text x="175" y="88" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="18" fill="#666666">Gyeonggi Content Agency</text>
      </svg>
    `
  },
  // 22. GBSA (경기도경제과학진흥원)
  {
    filename: '22.png',
    name: '경기도경제과학진흥원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(20, 20)">
          <text x="0" y="55" font-family="'Arial Black', sans-serif" font-style="italic" font-weight="900" font-size="52" fill="#004EA2">GBSA</text>
          <line x1="85" y1="36" x2="160" y2="36" stroke="#00A0E9" stroke-width="8"/>
        </g>
        <text x="210" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="30" fill="#333333">경기도경제과학진흥원</text>
      </svg>
    `
  },
  // 23. K-water (한국수자원공사)
  {
    filename: '23.png',
    name: '한국수자원공사',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(15, 10)">
          <path d="M15 45 Q70 10 135 25" fill="none" stroke="#F7941D" stroke-width="10" stroke-linecap="round"/>
          <path d="M25 55 Q75 30 125 40" fill="none" stroke="#00AEEF" stroke-width="8" stroke-linecap="round"/>
          <text x="10" y="98" font-family="'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#005BA6">K water</text>
        </g>
        <text x="195" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#333333">한국수자원공사</text>
        <text x="195" y="95" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="16" fill="#666666">Korea Water Resources Corporation</text>
      </svg>
    `
  },
  // 24. Korea Rural Community Corp (한국농어촌공사)
  {
    filename: '24.png',
    name: '한국농어촌공사',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <text x="25" y="78" font-family="'Segoe Script', cursive, sans-serif" font-weight="900" font-size="52" fill="#005BAC">kr</text>
        <ellipse cx="65" cy="40" rx="28" ry="10" fill="none" stroke="#F37021" stroke-width="6"/>
        <text x="120" y="80" font-family="'Nanum Pen Script', 'Noto Sans KR', cursive, sans-serif" font-weight="900" font-size="46" fill="#005BAC">한국농어촌공사</text>
      </svg>
    `
  },
  // 25. KOEM (해양환경공단)
  {
    filename: '25.png',
    name: '해양환경공단',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <text x="25" y="80" font-family="'Arial Black', sans-serif" font-weight="900" font-size="56" fill="#0066B3" letter-spacing="2">KOEM</text>
        <text x="220" y="80" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="42" fill="#0066B3" letter-spacing="2">해양환경공단</text>
      </svg>
    `
  },
  // 26. Financial Security Institute (금융보안원)
  {
    filename: '26.png',
    name: '금융보안원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(25, 25)">
          <polygon points="40,10 75,30 40,50 5,30" fill="#E6C875"/>
          <polygon points="5,30 40,50 40,75 5,55" fill="#C49A45"/>
          <polygon points="75,30 40,50 40,75 75,55" fill="#E2E2E2"/>
          <polygon points="40,30 55,40 40,50 25,40" fill="#FFFFFF"/>
        </g>
        <text x="125" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="42" fill="#333333">금융보안원</text>
        <text x="125" y="94" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#666666" letter-spacing="1">FINANCIAL SECURITY INSTITUTE</text>
      </svg>
    `
  },
  // 27. KODIT (신용보증기금)
  {
    filename: '27.png',
    name: '신용보증기금',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(15, 20)">
          <text x="0" y="55" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#0072CE">K<tspan fill="#84BD00">O</tspan>DIT</text>
        </g>
        <text x="175" y="64" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="40" fill="#333333">신용보증기금</text>
        <text x="175" y="92" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#666666" letter-spacing="1">KOREA CREDIT GUARANTEE FUND</text>
      </svg>
    `
  },
  // 28. KOREG (신용보증재단중앙회)
  {
    filename: '28.png',
    name: '신용보증재단중앙회',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <text x="20" y="58" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#0075C9">KO<tspan fill="#F37021">REG</tspan></text>
        <text x="20" y="102" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="32" fill="#444444">신용보증재단중앙회</text>
      </svg>
    `
  },
  // 29. KOTRA (대한무역투자진흥공사)
  {
    filename: '29.png',
    name: '코트라',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <text x="25" y="60" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#005BAC" letter-spacing="3">kotra</text>
        <text x="25" y="102" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="30" fill="#444444">대한무역투자진흥공사</text>
      </svg>
    `
  },
  // 30. KDI (한국개발연구원)
  {
    filename: '30.png',
    name: '한국개발연구원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(20, 20)">
          <text x="0" y="52" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#505050">KDI</text>
          <path d="M95 10 L115 10 L115 30" fill="none" stroke="#F37021" stroke-width="8"/>
        </g>
        <text x="160" y="62" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#333333">한국개발연구원</text>
        <text x="160" y="92" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="17" fill="#666666">Korea Development Institute</text>
      </svg>
    `
  },
  // 30-1. Daegu Safety Theme Park (대구시민안전테마파크)
  {
    filename: '30-1.png',
    name: '대구시민안전테마파크',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(20, 20)">
          <path d="M35 15 C15 15 10 35 25 55 L45 75" fill="none" stroke="#99CC00" stroke-width="12" stroke-linecap="round"/>
          <path d="M45 75 L65 55 C80 35 75 15 55 15 C45 15 40 22 40 22" fill="none" stroke="#993366" stroke-width="12" stroke-linecap="round"/>
        </g>
        <text x="120" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="34" fill="#333333">대구시민안전테마파크</text>
        <text x="120" y="94" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="16" fill="#666666">DAEGU SAFETY THEME PARK</text>
      </svg>
    `
  },
  // 30-2. KOMIPO (한국중부발전)
  {
    filename: '30-2.png',
    name: '한국중부발전',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <circle cx="65" cy="65" r="42" fill="#005BAC"/>
        <path d="M65 23 L65 107 M23 65 L107 65 M35 35 L95 95 M35 95 L95 35" stroke="#FFFFFF" stroke-width="4"/>
        <text x="125" y="60" font-family="'Arial Black', sans-serif" font-weight="900" font-size="38" fill="#005BAC">KOMIPO</text>
        <text x="125" y="95" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="30" fill="#005BAC">한국중부발전</text>
      </svg>
    `
  },
  // 30-3. ETRI (한국전자통신연구원)
  {
    filename: '30-3.png',
    name: '한국전자통신연구원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <text x="20" y="70" font-family="'Arial Black', sans-serif" font-weight="900" font-size="56" fill="#0066B3">ET<tspan fill="#F37021">RI</tspan></text>
        <text x="195" y="58" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="30" fill="#0066B3">한국전자통신연구원</text>
        <text x="195" y="86" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="#666666">Electronics and Telecommunications Research Institute</text>
      </svg>
    `
  },
  // 31. Busan Office of Education (부산광역시교육청)
  {
    filename: '31.png',
    name: '부산교육청',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(15, 20)">
          <path d="M25 55 C15 35 45 15 65 35 C75 45 65 65 45 75 Z" fill="#0072CE"/>
          <circle cx="55" cy="25" r="10" fill="#E5004F"/>
          <polygon points="40,40 50,25 60,40" fill="#F39800"/>
        </g>
        <text x="110" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#0072CE">부산광역시교육청</text>
        <text x="110" y="94" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#0072CE">BUSAN METROPOLITAN CITY OFFICE OF EDUCATION</text>
      </svg>
    `
  },
  // 32. Daegu Office of Education (대구광역시교육청)
  {
    filename: '32.png',
    name: '대구교육청',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="65" r="40" fill="#00A0E9"/>
        <path d="M50 45 C45 65 75 75 80 55" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <path d="M35 65 C45 85 85 85 95 65" fill="none" stroke="#84BD00" stroke-width="6"/>
        <text x="125" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#333333">대구광역시교육청</text>
        <text x="125" y="94" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#555555">DAEGU METROPOLITAN OFFICE OF EDUCATION</text>
      </svg>
    `
  },
  // 33. Gyeongsangnamdo Office of Education (경상남도교육청)
  {
    filename: '33.png',
    name: '경남교육청',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="40" r="16" fill="#84BD00"/>
        <path d="M35 75 C35 55 65 55 75 70 C85 85 55 95 35 75 Z" fill="#0072CE"/>
        <text x="110" y="64" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#333333">경상남도교육청</text>
        <text x="110" y="92" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="15" fill="#666666">GYEONGSANGNAMDO OFFICE OF EDUCATION</text>
      </svg>
    `
  },
  // 34. Sejong City Office of Education (세종특별자치시교육청)
  {
    filename: '34.png',
    name: '세종교육청',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="65" r="42" fill="#0072CE"/>
        <path d="M45 65 L85 65 M65 45 L65 85" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
        <text x="125" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="34" fill="#005BAC">세종특별자치시교육청</text>
        <text x="125" y="92" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#005BAC">SEJONG CITY OFFICE OF EDUCATION</text>
      </svg>
    `
  },
  // 35. Daegu Catholic University (대구가톨릭대학교)
  {
    filename: '35.png',
    name: '대구가톨릭대학교',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <circle cx="65" cy="65" r="40" fill="#002D62"/>
        <path d="M65 35 L65 95 M45 55 L85 55" stroke="#FFFFFF" stroke-width="7"/>
        <text x="125" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="36" fill="#002D62">대구가톨릭대학교</text>
        <text x="125" y="94" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#777777" letter-spacing="1">DAEGU CATHOLIC UNIVERSITY</text>
      </svg>
    `
  },
  // 36. USG Shared University (USG 공유대학)
  {
    filename: '36.png',
    name: 'USG 공유대학',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 130" width="460" height="130">
        <text x="25" y="75" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#004A99">USG</text>
        <text x="165" y="74" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#333333">공유대학</text>
      </svg>
    `
  },
  // 37. Woosong University (우송대학교)
  {
    filename: '37.png',
    name: '우송대학교',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(15, 25)">
          <circle cx="25" cy="30" r="22" fill="none" stroke="#007A3D" stroke-width="12"/>
          <path d="M60 48 L80 12 L100 48" fill="none" stroke="#004B87" stroke-width="12" stroke-linecap="round"/>
          <rect x="115" y="12" width="36" height="36" fill="#C8102E"/>
        </g>
        <text x="185" y="60" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="42" fill="#222222">우송대학교</text>
        <text x="185" y="88" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#666666">WOOSONG UNIVERSITY</text>
      </svg>
    `
  },
  // 38. SolBridge (솔브릿지국제경영대학)
  {
    filename: '38.png',
    name: '솔브릿지',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 130" width="480" height="130">
        <text x="240" y="68" font-family="'Arial Black', sans-serif" font-weight="900" font-size="48" fill="#0C2340" letter-spacing="4" text-anchor="middle">SOLBRIDGE</text>
        <text x="240" y="98" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#555555" letter-spacing="2" text-anchor="middle">INTERNATIONAL SCHOOL OF BUSINESS</text>
      </svg>
    `
  },
  // 39. Peking University (북경대학교)
  {
    filename: '39.png',
    name: '북경대학교',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 130" width="480" height="130">
        <circle cx="65" cy="65" r="42" fill="#8B0000"/>
        <circle cx="65" cy="65" r="34" fill="none" stroke="#FFFFFF" stroke-width="3"/>
        <text x="65" y="74" font-family="'Songti SC', 'SimSun', serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">北大</text>
        <text x="135" y="80" font-family="'STKaiti', 'KaiTi', 'Noto Serif SC', serif" font-weight="900" font-size="48" fill="#8B0000" letter-spacing="6">北京大学</text>
      </svg>
    `
  },
  // 40. Nanyang Technological University (난양공대)
  {
    filename: '40.png',
    name: '난양공대',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(20, 18)">
          <path d="M10 10 L65 10 L65 50 C65 75 37 85 37 85 C37 85 10 75 10 50 Z" fill="#D71920"/>
          <path d="M10 40 L65 40 L65 50 C65 75 37 85 37 85 C37 85 10 75 10 50 Z" fill="#FFFFFF"/>
          <text x="37" y="70" font-family="'Arial Black', sans-serif" font-weight="900" font-size="20" fill="#002B49" text-anchor="middle">NTU</text>
        </g>
        <text x="110" y="55" font-family="'Arial Black', sans-serif" font-weight="900" font-size="26" fill="#002B49">NANYANG</text>
        <text x="110" y="80" font-family="'Arial Black', sans-serif" font-weight="900" font-size="22" fill="#002B49">TECHNOLOGICAL UNIVERSITY</text>
        <text x="110" y="104" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#D71920" letter-spacing="3">SINGAPORE</text>
      </svg>
    `
  },
  // 41. Northwestern University (노스웨스턴대학교)
  {
    filename: '41.png',
    name: '노스웨스턴대학교',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <circle cx="65" cy="65" r="42" fill="#4E2A84"/>
        <circle cx="65" cy="65" r="34" fill="none" stroke="#FFFFFF" stroke-width="3"/>
        <text x="65" y="76" font-family="'Times New Roman', serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">N</text>
        <text x="130" y="60" font-family="'Georgia', serif" font-weight="700" font-size="36" fill="#4E2A84">Northwestern</text>
        <text x="130" y="96" font-family="'Georgia', serif" font-weight="700" font-size="36" fill="#4E2A84">University</text>
      </svg>
    `
  },
  // 42. 2nd Operational Command (제2작전사령부)
  {
    filename: '42.png',
    name: '제2작전사령부',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <polygon points="65,15 15,105 115,105" fill="#002B7F"/>
        <polygon points="65,28 28,95 102,95" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <text x="65" y="88" font-family="'Arial Black', sans-serif" font-weight="900" font-size="48" fill="#FFFFFF" text-anchor="middle">2</text>
        <text x="140" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="40" fill="#222222">제2작전사령부</text>
      </svg>
    `
  },
  // 43. DTaQ (국방기술품질원)
  {
    filename: '43.png',
    name: '국방기술품질원',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <g transform="translate(15, 20)">
          <path d="M10 20 L40 20 L40 65 L20 65" fill="none" stroke="#ED1C24" stroke-width="10"/>
          <circle cx="65" cy="42" r="26" fill="#0072CE"/>
          <line x1="75" y1="52" x2="90" y2="67" stroke="#0072CE" stroke-width="8" stroke-linecap="round"/>
        </g>
        <text x="130" y="62" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#222222">국방기술품질원</text>
        <text x="130" y="92" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="16" fill="#666666">Defense Agency for Technology and Quality</text>
      </svg>
    `
  },
  // 44. 5th Logistics Support Command (제5군수지원사령부)
  {
    filename: '44.png',
    name: '제5군수지원사령부',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <circle cx="65" cy="65" r="42" fill="#003399"/>
        <circle cx="65" cy="65" r="32" fill="#FFFFFF"/>
        <polygon points="65,38 42,85 88,85" fill="#003399"/>
        <text x="65" y="80" font-family="'Arial Black', sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle">5</text>
        <text x="130" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="38" fill="#222222">제5군수지원사령부</text>
      </svg>
    `
  },
  // 46. 1st Engineer Brigade (제1공병여단)
  {
    filename: '46.png',
    name: '제1공병여단',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <g transform="translate(20, 20)">
          <rect x="10" y="30" width="60" height="50" fill="#FFCC00" stroke="#000000" stroke-width="4"/>
          <rect x="25" y="15" width="30" height="25" fill="#FFCC00" stroke="#000000" stroke-width="4"/>
          <rect x="33" y="35" width="14" height="40" fill="#003399"/>
          <text x="40" y="64" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">1</text>
        </g>
        <text x="120" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="40" fill="#222222">제1공병여단</text>
      </svg>
    `
  },
  // 47. KOBACO (한국방송광고진흥공사)
  {
    filename: '47.png',
    name: '코바코',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <text x="20" y="74" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#ED1C24">kobaco</text>
        <circle cx="175" cy="30" r="6" fill="#ED1C24"/>
        <circle cx="190" cy="22" r="6" fill="#ED1C24"/>
        <circle cx="205" cy="30" r="6" fill="#ED1C24"/>
        <text x="235" y="64" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="34" fill="#333333">한국방송광고진흥공사</text>
        <text x="235" y="92" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="15" fill="#666666">Korea Broadcast Advertising Corp.</text>
      </svg>
    `
  },
  // 48. 50th Infantry Division (제50보병사단)
  {
    filename: '48.png',
    name: '제50보병사단',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
        <circle cx="65" cy="65" r="44" fill="#ED1C24"/>
        <circle cx="65" cy="65" r="32" fill="#FFFFFF"/>
        <circle cx="65" cy="65" r="22" fill="#ED1C24"/>
        <text x="65" y="74" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">V</text>
        <text x="135" y="78" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="40" fill="#222222">제50보병사단</text>
      </svg>
    `
  },
  // 49. Hyundai Engineering (현대엔지니어링)
  {
    filename: '49.png',
    name: '현대엔지니어링',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
        <polygon points="20,95 65,15 110,95" fill="#009639"/>
        <polygon points="20,95 65,15 40,95" fill="#F39200"/>
        <text x="125" y="75" font-family="'Noto Sans KR', 'Arial Black', sans-serif" font-weight="900" font-size="46" fill="#003876" letter-spacing="2">현대엔지니어링</text>
      </svg>
    `
  },
  // 50. SBS M&C (SBS미디어크리에이트)
  {
    filename: '50.png',
    name: 'SBS M&C',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 130" width="520" height="130">
        <g transform="translate(25, 20)">
          <ellipse cx="65" cy="45" rx="55" ry="38" fill="#00205B"/>
          <path d="M40 45 C45 30 65 30 75 45 C85 60 100 60 95 45 C90 30 70 30 60 45 C50 60 35 60 40 45 Z" fill="#FFFFFF" opacity="0.95"/>
        </g>
        <text x="165" y="66" font-family="'Arial Black', 'Segoe UI', sans-serif" font-weight="900" font-size="46" fill="#00205B" letter-spacing="2">SBS M&amp;C</text>
        <text x="165" y="96" font-family="'Noto Sans KR', sans-serif" font-weight="700" font-size="17" fill="#555555" letter-spacing="1">SBS 미디어크리에이트</text>
      </svg>
    `
  }
];

async function run() {
  console.log(`Generating ${logos.length} PNG logos into ${OUT_DIR}...`);

  for (const item of logos) {
    const destPath = path.join(OUT_DIR, item.filename);
    const svgBuffer = Buffer.from(item.svg.trim());
    await sharp(svgBuffer, { density: 300 })
      .png({ quality: 100 })
      .toFile(destPath);
    console.log(`✓ Generated ${item.filename} (${item.name})`);
  }

  console.log(`All ${logos.length} logos generated successfully!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
