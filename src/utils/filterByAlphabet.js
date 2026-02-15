// src/utils/filterByAlphabet.js

/**
 * Filters a list by matching a query against a chosen string field.
 * - Case-insensitive
 * - Alphabet-based (startsWith) by default
 *
 * @param {Array} list - items to filter
 * @param {string} query - user's search text
 * @param {(item:any)=>string} getText - function that returns the text to search from each item
 * @param {{ mode?: "startsWith" | "includes" }} options
 * @returns {Array}
 */
export function filterByAlphabet(list, query, getText, options = {}) {
  const mode = options.mode || "startsWith";
  const q = String(query || "").trim().toLowerCase();

  if (!q) return Array.isArray(list) ? list : [];

  const arr = Array.isArray(list) ? list : [];
  return arr.filter((item) => {
    const text = String(getText?.(item) ?? "").toLowerCase();
    if (!text) return false;

    return mode === "includes" ? text.includes(q) : text.startsWith(q);
  });
}
