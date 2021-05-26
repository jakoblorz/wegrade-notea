export type Locale = typeof locales[number];
export const locales = ["en", "de"] as const;
export const defaultLocale: Locale = "en" as const;

export const languageNames = {
  en: "English",
  de: "Deutsch",
};

export type Translation<T extends string | number | symbol> = {
  [key in Locale]: {
    [key in T]: string;
  };
};

export const isLocale = (test: string): test is Locale => {
  return locales.some((locale) => locale === test);
};

export const getInitialLocale = (): Locale => {
  const localSetting = localStorage.getItem("locale");
  if (localSetting && isLocale(localSetting)) {
    return localSetting;
  }

  const [browserSetting] = navigator.language.split("-");
  if (isLocale(browserSetting)) {
    return browserSetting;
  }

  return defaultLocale;
};
