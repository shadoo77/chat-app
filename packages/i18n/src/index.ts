export const locales = ["en", "nl", "ar", "fr", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
