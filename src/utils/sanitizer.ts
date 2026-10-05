/**
 * Utility for input sanitization
 * Removes dangerous HTML / Script tags to prevent XSS and HTML Injection
 */
export function sanitizeString(input: any): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Strip script tags and HTML tags, trim whitespace
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = { ...obj };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeString(result[key]);
    }
  }
  return result;
}
