/**
 * Extracts a YouTube video ID from any standard YouTube URL or raw ID.
 */
export function extractYoutubeVideoId(raw?: string | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  // Try URL parsing for watch?v=..., youtu.be/..., shorts/..., embed/..., live/...
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProto);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      if (/^[A-Za-z0-9_-]{6,20}$/.test(id)) return id;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[A-Za-z0-9_-]{6,20}$/.test(vParam)) return vParam;

      const pathMatch = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{6,20})/);
      if (pathMatch) return pathMatch[1];
    }
  } catch {
    // Fallback to regex below
  }

  const regexMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/i
  );
  if (regexMatch) return regexMatch[1];

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Generates a responsive 16:9 YouTube embed HTML block playable inside both the editor and live article.
 */
export function buildYoutubeEmbedHtml(videoId: string): string {
  const safeId = videoId.replace(/[^A-Za-z0-9_-]/g, '');
  return `<div data-youtube-embed="${safeId}" contenteditable="false" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin: 16px 0; background: #000000; border: 1px solid #27272a;"><iframe src="https://www.youtube.com/embed/${safeId}" title="YouTube video (${safeId})" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
}

/**
 * Extracts all embedded YouTube video IDs from notice content strings.
 */
export function extractEmbeddedYoutubeIds(content: string[]): string[] {
  const joined = (content || []).join('\n');
  const ids: string[] = [];
  const regex = /youtube\.com\/embed\/([A-Za-z0-9_-]{6,20})/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(joined)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

/**
 * Replaces standalone YouTube URL lines or bare YouTube anchor paragraphs with playable 16:9 video embeds.
 */
function embedStandaloneYoutubeLinks(html: string): string {
  // 1. Standalone <p><a href="youtube-url">youtube-url</a></p> or <div>...</div>
  let result = html.replace(
    /<(p|div)(?:\s[^>]*)?>\s*(?:<a\s+[^>]*href=["'](https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/[^"'\s<]+)["'][^>]*>\s*(?:https?:\/\/[^<]+)\s*<\/a>|(https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/[^\s<]+))\s*<\/\1>/gi,
    (fullMatch, _tag, anchorUrl, bareUrl) => {
      const targetUrl = anchorUrl || bareUrl;
      const ytId = extractYoutubeVideoId(targetUrl);
      return ytId ? buildYoutubeEmbedHtml(ytId) : fullMatch;
    }
  );

  // 2. Standalone bare YouTube URL on its own line in plain text
  result = result.replace(
    /(^|\n)\s*(https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/[^\s<]+)\s*(?=\n|$)/gi,
    (fullMatch, prefix, url) => {
      const ytId = extractYoutubeVideoId(url);
      return ytId ? `${prefix}${buildYoutubeEmbedHtml(ytId)}` : fullMatch;
    }
  );

  return result;
}

/**
 * Formats notice content supporting both plain text (with formatting tokens) and rich HTML.
 */
export function formatNoticeContent(raw: string): string {
  if (!raw) return '';

  // If already HTML markup, preserve as HTML (and auto-embed standalone YouTube link paragraphs)
  if (
    /<(p|div|h[1-6]|blockquote|ul|ol|table|section|figure|img|hr|span|font|b|strong|i|em|u|s|strike|a|br|iframe)[\s>/]/i.test(
      raw
    )
  ) {
    return embedStandaloneYoutubeLinks(raw);
  }

  let formatted = embedStandaloneYoutubeLinks(raw);

  // 1. Bold: **text** or [굵게]text[/굵게] or <b>text</b>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff; font-weight: 700;">$1</strong>');
  formatted = formatted.replace(/\[굵게\](.*?)\[\/굵게\]/g, '<strong style="color: #ffffff; font-weight: 700;">$1</strong>');

  // 1-2. Underline: <u>text</u> or __text__ or [밑줄]text[/밑줄]
  formatted = formatted.replace(/<u>(.*?)<\/u>/gi, '<u style="text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #fbbf24;">$1</u>');
  formatted = formatted.replace(/__(.*?)__/g, '<u style="text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #fbbf24;">$1</u>');
  formatted = formatted.replace(/\[밑줄\](.*?)\[\/밑줄\]/g, '<u style="text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #fbbf24;">$1</u>');

  // 2. Gold highlight: ★text★ or [골드]text[/골드]
  formatted = formatted.replace(/★(.*?)★/g, '<span style="color: #fbbf24; font-weight: 700;">$1</span>');
  formatted = formatted.replace(/\[골드\](.*?)\[\/골드\]/g, '<span style="color: #fbbf24; font-weight: 700;">$1</span>');

  // 3. Headings: ■ heading or ### heading
  formatted = formatted.replace(/^(?:■|###)\s*(.+)$/gm, '<h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 16px 0 6px 0;">$1</h3>');

  // 4. Blockquotes: > quote
  formatted = formatted.replace(/^>\s*(.+)$/gm, '<blockquote style="border-left: 3px solid #fbbf24; padding-left: 12px; margin: 10px 0; color: #d4d4d8; font-style: italic;">$1</blockquote>');

  // 5. Dividers: ────... or --- or ===
  formatted = formatted.replace(/^(?:─{4,}|-{3,}|={3,})$/gm, '<hr style="border: 0; border-top: 1px solid #3f3f46; margin: 18px 0;" />');

  // 6. Links: [title](url)
  formatted = formatted.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #fbbf24; text-decoration: underline; font-weight: 600; text-underline-offset: 3px;">$1</a>');

  // 7. Bullet items: • item
  formatted = formatted.replace(/^•\s*(.+)$/gm, '<div style="display: flex; gap: 8px; margin: 4px 0;"><span style="color: #fbbf24; font-weight: bold;">•</span><span>$1</span></div>');

  // 8. Numbered items: 1. item
  formatted = formatted.replace(/^(\d+)\.\s*(.+)$/gm, '<div style="display: flex; gap: 8px; margin: 4px 0;"><span style="color: #fbbf24; font-weight: bold; font-family: monospace;">$1.</span><span>$2</span></div>');

  // 9. Convert newlines to <br /> if not right after a block element
  formatted = formatted.replace(/\n/g, '<br />');

  return formatted;
}
