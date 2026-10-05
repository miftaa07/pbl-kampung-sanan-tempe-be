"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeString = sanitizeString;
exports.sanitizeObject = sanitizeObject;
/**
 * Utility for input sanitization
 * Removes dangerous HTML / Script tags to prevent XSS and HTML Injection
 */
function sanitizeString(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // Strip script tags and HTML tags, trim whitespace
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}
function sanitizeObject(obj) {
    const result = { ...obj };
    for (const key in result) {
        if (typeof result[key] === 'string') {
            result[key] = sanitizeString(result[key]);
        }
    }
    return result;
}
