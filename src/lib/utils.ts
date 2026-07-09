import type { Lang } from "@/data/content";

export const repo = "svdimonshop-gif/OrderFlow-Site";
export const releaseFallback = `https://github.com/${repo}/releases/latest/download/OrderFlow.apk`;
export const releasePage = `https://github.com/${repo}/releases/latest`;
export const telegramUrl = "https://t.me/dl_studio_group";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}

export function formatBytes(bytes: number, lang: Lang) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} ${lang === "ru" ? "МБ" : "МБ"}`;
}

export function formatDate(value: string | null | undefined, lang: Lang) {
  if (!value) return lang === "ru" ? "дата недоступна" : "дата недоступна";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return lang === "ru" ? "дата недоступна" : "дата недоступна";
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}
