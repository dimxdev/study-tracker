export const QUOTES: string[] = [
  "I may be slow, but I never stop crawling forward. 🐢",
  "Sedikit-sedikit, lama-lama jadi bukit. Konsisten dulu, cepat belakangan. ⛰️",
  "Progress kecil tetap progress. Yang penting jalan terus. 🚶",
  "Kamu nggak harus hebat buat mulai, tapi harus mulai buat jadi hebat. 🚀",
  "Belajar itu maraton, bukan sprint. Nikmati prosesnya. 🏃",
  "Satu langkah hari ini lebih baik daripada rencana sempurna yang nggak jalan. ✨",
  "Bintang nggak bersinar tanpa kegelapan. Terus belajar walau pelan. ⭐",
  "Fokus ke satu hal, selesaikan, lalu lanjut. Kamu pasti bisa. 💪",
  "Hari ini belajar apa? Yuk, satu item aja dulu. 🌱",
  "Konsistensi ngalahin motivasi. Muncul aja tiap hari. 🔥",
];

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
