// based imports
import { createI18n } from "vue-i18n";

// rules imports
import pluralRules from "./rules/pluralization";
import numberFormats from "./rules/numbers.js";
import datetimeFormats from "./rules/datetime.js";

// default import languages
import it from '@/i18n/locales/it.json';

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: { it },
  runtimeOnly: true,
  pluralRules,
  numberFormats,
  datetimeFormats
});