import { Translation } from "./locale";

export const translationKeys = [
  "page.name",
  "layout.nav.login-with-github-cta",
  "layout.nav.no-name-placeholder",
  "components.searchBar.queryBar.label",
] as const;

export const translations: Translation<typeof translationKeys[number]> = {
  en: {
    "page.name": "wegrade",
    "layout.nav.login-with-github-cta": "Login with GitHub",
    "layout.nav.no-name-placeholder": "Account",
    "components.searchBar.queryBar.label": "Enter a name of an object",
  },
  de: {
    "page.name": "wegrade",
    "layout.nav.login-with-github-cta": "Mit GitHub anmelden",
    "layout.nav.no-name-placeholder": "Account",
    "components.searchBar.queryBar.label": "Name eines Objektes eingeben",
  },
};
export type TranslationKey = typeof translations.en & typeof translations.de;
