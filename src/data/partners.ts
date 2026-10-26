export interface PartnerLogo {
  id: string;
  filename: string;
  name?: string;
  alt?: string;
  category?: 'corporate' | 'public' | 'education' | 'military';
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  // Row 1 (1 ~ 13)
  { id: '1', filename: '1.png' },
  { id: '2', filename: '2.png' },
  { id: '3', filename: '3.png' },
  { id: '4', filename: '4.png' },
  { id: '5', filename: '5.png' },
  { id: '6', filename: '6.png' },
  { id: '7', filename: '7.png' },
  { id: '8', filename: '8.png' },
  { id: '9', filename: '9.png' },
  { id: '10', filename: '10.png' },
  { id: '11', filename: '11.png' },
  { id: '12', filename: '12.png' },
  { id: '13', filename: '13.png' },

  // Row 2 (14 ~ 26)
  { id: '14', filename: '14.png' },
  { id: '15', filename: '15.png' },
  { id: '16', filename: '16.png' },
  { id: '17', filename: '17.png' },
  { id: '18', filename: '18.png' },
  { id: '19', filename: '19.png' },
  { id: '20', filename: '20.png' },
  { id: '21', filename: '21.png' },
  { id: '22', filename: '22.png' },
  { id: '23', filename: '23.png' },
  { id: '24', filename: '24.png' },
  { id: '25', filename: '25.png' },
  { id: '26', filename: '26.png' },

  // Row 3 (27 ~ 30-3, 31 ~ 36)
  { id: '27', filename: '27.png' },
  { id: '28', filename: '28.png' },
  { id: '29', filename: '29.png' },
  { id: '30', filename: '30.png' },
  { id: '30-1', filename: '30-1.png' },
  { id: '30-2', filename: '30-2.png' },
  { id: '30-3', filename: '30-3.png' },
  { id: '31', filename: '31.png' },
  { id: '32', filename: '32.png' },
  { id: '33', filename: '33.png' },
  { id: '34', filename: '34.png' },
  { id: '35', filename: '35.png' },
  { id: '36', filename: '36.png' },

  // Row 4 (37 ~ 44, 46 ~ 50)
  { id: '37', filename: '37.png' },
  { id: '38', filename: '38.png' },
  { id: '39', filename: '39.png' },
  { id: '40', filename: '40.png' },
  { id: '41', filename: '41.png' },
  { id: '42', filename: '42.png' },
  { id: '43', filename: '43.png' },
  { id: '44', filename: '44.png' },
  { id: '46', filename: '46.png' },
  { id: '47', filename: '47.png' },
  { id: '48', filename: '48.png' },
  { id: '49', filename: '49.png' },
  { id: '50', filename: '50.png' },
];

// Row distributions: 52 items total evenly divided across 4 rows (13 items each)
export const TICKER_ROW_1 = PARTNER_LOGOS.slice(0, 13);  // 13 items (1..13)
export const TICKER_ROW_2 = PARTNER_LOGOS.slice(13, 26); // 13 items (14..26)
export const TICKER_ROW_3 = PARTNER_LOGOS.slice(26, 39); // 13 items (27..36)
export const TICKER_ROW_4 = PARTNER_LOGOS.slice(39, 52); // 13 items (37..50)
