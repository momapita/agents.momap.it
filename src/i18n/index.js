/******
 *  Utilizzo libreria vue-i18n
 *   
 *   $d --> Formattazione per la data
 * 
 *   $t --> Traduzioni testuali
 * 
 *  $n --> Formattazione numerica
 * 
 * ******/

// based imports
import { createI18n } from "vue-i18n";

// rules imports
import numberFormats from "./rules/numbers.js";
import datetimeFormats from "./rules/datetime.js";

// default import languages
import itBaseI18n from '@/i18n/locales/it/index.js';

// import vee-validate/i18n
import { configure as configVeeValidate } from 'vee-validate';
import { localize } from '@vee-validate/i18n';

// import languages for veeValidate
import it from '@/i18n/locales/it/veeValidate.js';
import en from '@/i18n/locales/en/veeValidate.js';

// configuro vee-validate
configVeeValidate({
  generateMessage: localize({
    en,
    it,
  }),
})

// configuro vue-i18n
export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: { it: itBaseI18n },
  runtimeOnly: false,
  numberFormats,
  datetimeFormats
});

