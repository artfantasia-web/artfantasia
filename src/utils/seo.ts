import { NoticeItem } from '../types';

export interface PageSeoConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * Formats numeric notice IDs into 4-digit zero-padded URL slugs starting from 0001.
 */
export function formatNoticeSlug(id: string | number): string {
  const raw = String(id).trim();
  if (/^\d+$/.test(raw)) {
    return String(Number(raw)).padStart(4, '0');
  }
  return raw;
}

function upsertMetaTag(
  selector: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Strips HTML and Markdown-like notice formatting tokens to generate clean 120-char summary text.
 */
export function extractNoticeSummary(
  content: string[],
  fallbackTitle: string,
  maxLength: number = 120
): string {
  const joined = (content || []).join(' ');
  const plain = joined
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\[\/?(?:굵게|밑줄|골드)\]/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/★(.*?)★/g, '$1')
    .replace(/(?:^|\s)(?:■|###|•|─{3,}|-{3,}|={3,})\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const source = plain || fallbackTitle.trim();
  return source.slice(0, maxLength);
}

export function applyPageSeo(config: PageSeoConfig) {
  if (typeof document === 'undefined') return;

  document.title = config.title;

  upsertMetaTag('meta[name="description"]', 'name', 'description', config.description);
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title);
  upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
  upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', config.url);
  upsertMetaTag('meta[property="og:type"]', 'property', 'og:type', config.type || 'website');

  upsertMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
  upsertMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);
  upsertMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', config.url);

  if (config.image) {
    upsertMetaTag('meta[property="og:image"]', 'property', 'og:image', config.image);
    upsertMetaTag(
      'meta[property="og:image:secure_url"]',
      'property',
      'og:image:secure_url',
      config.image
    );
    upsertMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', config.image);
  }

  upsertCanonicalLink(config.url);
}

export function applyNoticeDetailSeo(notice: NoticeItem) {
  if (typeof document === 'undefined') return;

  const canonicalPath = `/notice/${encodeURIComponent(formatNoticeSlug(notice.id))}`;
  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${canonicalPath}`
      : `https://artfantasia.co.kr${canonicalPath}`;

  const summary = extractNoticeSummary(notice.content, notice.title, 120);
  const fullTitle = `${notice.title} | 아트판타지아`;

  applyPageSeo({
    title: fullTitle,
    description: summary,
    url: currentUrl,
    image: 'https://artfantasia.co.kr/og-main.jpg',
    type: 'article',
  });

  // Update Article JSON-LD structured data for search engine crawlers
  const scriptId = 'dynamic-notice-jsonld';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const isoDate = notice.date ? notice.date.replace(/\./g, '-') : undefined;
  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: notice.title,
    description: summary,
    url: currentUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    ...(isoDate ? { datePublished: isoDate, dateModified: isoDate } : {}),
    author: {
      '@type': 'Organization',
      name: notice.author || '아트판타지아',
    },
    publisher: {
      '@type': 'Organization',
      name: '아트판타지아 (ArtFantasia)',
      logo: {
        '@type': 'ImageObject',
        url: 'https://artfantasia.co.kr/LOGO.png',
      },
    },
    inLanguage: 'ko-KR',
  });
}

export function clearNoticeDetailJsonLd() {
  if (typeof document === 'undefined') return;
  const scriptEl = document.getElementById('dynamic-notice-jsonld');
  if (scriptEl) {
    scriptEl.remove();
  }
}
