<template>
    <Select v-model="selectedCountry" :options="supportedLocalesArray">
        
        <!-- Renderizzo la lingua selezionata -->
        <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.national_key" class="flex items-center">
                <country-flag :country="slotProps.value.national_key" size='small'/>
            </div>
        </template>

        <!-- Renderizzo l'elenco -->
        <template #option="slotProps">
            <div class="flex items-center w-full">
                <div class="mx-auto">
                    <country-flag :country="slotProps.option.national_key" size='small'/>
                </div>
            </div>
        </template>

    </Select>
</template>

<script setup>
    
    // based imports
    import { ref, watch } from 'vue';
    import { useRouter } from "vue-router";

    // i18n services imports
    import Tr from "@/i18n/translation";

    // components and primevue imports
    import CountryFlag from 'vue-country-flag-next';
    import { usePrimeVue } from "primevue/config";
    import { setLocale as setVeeValidateLocale } from '@vee-validate/i18n';

    // recupero il router
    const router = useRouter();

    // recupero il plugin di primevue
    const primevue = usePrimeVue();

    // recupero le lingue supportate dal Tr e le key delle lingue dal .env
    const supportedLocales = Tr.supportedLocales;
    const supportedLocalesKeys = import.meta.env.VITE_SUPPORTED_LOCALES_KEYS.split(",") || [];

    // genero una variabile di riferimento per avere l'elenco delle lingue
    const supportedLocalesArray = ref(supportedLocales.map((locale, index) => {
        return {
            locale,
            national_key: supportedLocalesKeys[index]
        }
    }));

    // dichiaro la variabile per il modello della select
    const selectedCountry = ref(supportedLocalesArray.value.find(singleLocale => singleLocale.locale == Tr.getPersistedLocale()));

    // funzione per cambiare la lingua
    const changeLocale = async () => {
        try {

            // vontrollo che esista event?.value 
            if(!selectedCountry?.value) {
                throw new Error("Invalid event.value");
            }

            // recupero il valore di selectedCountry
            const { value = null } = selectedCountry;

            // controllo se il valore di selectedCountry è un oggetto
            if(!value || typeof value !== 'object' || Object.keys(value).length === 0) {
                throw new Error('Invalid locale');
            }

            // controllo se in value è presente la key 'locale'
            if(!('locale' in value) || !value?.locale) {
                throw new Error('Invalid locale');
            }

            // recupero il locale
            const { locale = null } = value;

            // controllo se la lingua selezionata è supportata 
            if(!Tr.isLocaleSupported(locale)) {
                throw new Error('Locale not supported');
            }

            // cambio la lingua
            await Tr.switchLanguage(locale);

            // recupero i messaggi di primevue
            const primevueMessage = await Tr.loadLocaleMessagesPrimevue(locale) || {};

            // setto i messaggi di primevue
            if(primevueMessage) {
                primevue.config.locale = primevueMessage;
            }

            // setto la lingua per VeeValidate
            setVeeValidateLocale(locale);

            // cambio la lingua dell'url
            try {
                await router.replace({ params: { locale } });
            } catch (e) {
                router.push('/');
            }

        } catch (error) {
            return error;
        }
    }

    // funzione per cambiare la lingua al watch di selectedCountry
    watch(selectedCountry, () => {
        changeLocale();
    }, { immediate: true });

</script>