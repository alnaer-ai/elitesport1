
/**
 * Simple HTML sanitizer and stripper
 */

export function sanitizeHtml(html?: string | null): string {
    if (!html) return "";
    // In a real app, use isomorphic-dompurify or similar. 
    // For now, assuming API returns trusted HTML or valid markup.
    return html;
}

export function stripHtml(html?: string | null): string {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
}
