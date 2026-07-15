/**
 * Title Case: kapitalkan huruf pertama tiap kata, sisanya dibiarkan apa adanya
 * (supaya akronim yang diketik kapital seperti "CSS"/"API" tetap utuh).
 * "belajar ngoding" -> "Belajar Ngoding"
 */
export function titleCase(input: string): string {
  return input
    .trim()
    .replace(/(^|\s)(\S)/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/**
 * Sentence case: kapitalkan hanya huruf pertama, sisanya dibiarkan apa adanya.
 * "belajar banyak bla..." -> "Belajar banyak bla..."
 */
export function sentenceCase(input: string): string {
  const s = input.trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
