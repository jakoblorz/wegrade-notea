import React, { createContext, useState, useEffect, useContext } from "react";
import {
  Locale,
  getInitialLocale,
  TranslationKey,
  translations,
  defaultLocale,
} from "../i18n";

export type LocaleDescriptor = Locale;
export const TranslationContext = createContext<{
  locale: LocaleDescriptor;
  setLocale: (locale: LocaleDescriptor) => void;
}>({
  locale: "en",
  setLocale: () => null,
});

export function useTranslation() {
  const { locale } = useContext(TranslationContext);

  function t(key: keyof TranslationKey) {
    if (!translations[locale][key]) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }
    return translations[locale][key] || translations[defaultLocale][key] || "";
  }

  return {
    t,
    locale,
  };
}

export const TranslationProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLocale());
  useEffect(() => {
    if (locale !== localStorage.getItem("locale")) {
      localStorage.setItem("locale", locale);
    }
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};
