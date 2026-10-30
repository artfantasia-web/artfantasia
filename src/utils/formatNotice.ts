/**
 * Formats notice content supporting both plain text (with formatting tokens) and rich HTML.
 */
export function formatNoticeContent(raw: string): string {
  if (!raw) return '';

  // If already full HTML blocks, preserve as HTML
  if (/<(p|div|h1|h2|h3|h4|blockquote|ul|ol|table|section)[\s>]/i.test(raw)) {
    return raw;
  }

  let formatted = raw;

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
