import i18n from "@/i18n";
import { nextTick } from "vue";

const Trans = {
  
  get defaultLocale() {
    return import.meta.env.VITE_DEFAULT_LOCALE
  },

  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",");
  },

  get currentLocale() {
    return i18n.global.locale.value
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  async switchLanguage(newLocale) {

    // setto la lingua e la lingua di validazione
    await Trans.loadLocaleMessages(newLocale);

    // setto il resto
    Trans.currentLocale = newLocale
    localStorage.setItem("user-locale", newLocale);
    document.querySelector("html").setAttribute("lang", newLocale)
  },

  async loadLocaleMessages(locale) {
    if(!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`@/i18n/locales/${locale}/index.js`);
      i18n.global.setLocaleMessage(locale, messages.default);
    }
    return nextTick();
  },

  async loadLocaleMessagesPrimevue(locale) {
    if(i18n.global.availableLocales.includes(locale)) {
      try {

        // Faccio la chiamata get per recuperare il file
        const response = await fetch('https://auth-api.momap.it/v1/returnFileCdnByUrl', {
          method: 'POST',
          body: JSON.stringify({ url: `https://cdn.momap.it/app/i18n/primevue_${locale}.json` })
        });

        // recuperp il risultato
        const results = await response.json();

        return results;

      } catch (error) {
        throw new Error(`Cannot load locale messages for ${locale}.json`);
      }
    }
  },

  isLocaleSupported(locale) {
    return Trans.supportedLocales.includes(locale)
  },

  getUserLocale() {
    const locale = window.navigator.language || window.navigator.userLanguage || Trans.defaultLocale
    return {
      locale: locale,
      localeNoRegion: locale.split('-')[0]
    }
  },

  getPersistedLocale() {
    const persistedLocale = localStorage.getItem("user-locale")

    if(Trans.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    } else {
      return 'it'
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = Trans.getPersistedLocale()
    if(userPersistedLocale) {
      return userPersistedLocale
    }

    const userPreferredLocale = Trans.getUserLocale()

    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale
    }

    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion
    }
    
    return Trans.defaultLocale
  }

}

export default Trans