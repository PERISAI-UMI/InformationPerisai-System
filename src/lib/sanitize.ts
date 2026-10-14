/**
 * sanitize.ts — Edge-safe HTML Content Sanitization
 *
 * Menggunakan library `sanitize-html` dengan whitelist ketat untuk konten
 * artikel, berita, dan deskripsi rich text.
 *
 * Seluruh atribut event handler (onload, onerror, onclick, dsb.) dan skema URL
 * berbahaya (javascript:, data: selain gambar aman) dibersihkan secara total.
 */

import sanitize from "sanitize-html";

export const ALLOWED_TAGS = [
  // Heading & Paragraf
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "div",
  "span",
  "hr",
  "br",

  // Penekanan & Tipografi
  "b",
  "i",
  "u",
  "strong",
  "em",
  "strike",
  "s",
  "code",
  "pre",
  "blockquote",

  // Daftar / List
  "ul",
  "ol",
  "li",

  // Hyperlink & Gambar
  "a",
  "img",

  // Tabel
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

export const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "name", "target", "rel", "title"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  th: ["colspan", "rowspan", "align"],
  td: ["colspan", "rowspan", "align"],
  span: ["class"],
  div: ["class"],
  p: ["class"],
};

export const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];

/**
 * Sanitasi string HTML dengan whitelist yang aman untuk Cloudflare Workers dan SSR.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string") {
    return "";
  }

  return sanitize(dirtyHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Otomatis tambahkan noopener noreferrer jika target="_blank"
        if (attribs.target === "_blank") {
          return {
            tagName: "a",
            attribs: {
              ...attribs,
              rel: "noopener noreferrer",
            },
          };
        }
        return {
          tagName: "a",
          attribs,
        };
      },
    },
    // Pastikan tidak ada tag script atau iframe yang lolos
    disallowedTagsMode: "discard",
  });
}

export default sanitizeHtml;

