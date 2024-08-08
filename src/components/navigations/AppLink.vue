<template>
    <section v-if="isExternal || routeExists" v-can="requireRole">

        <!-- Caso in cui è un link Esterno -->
        <a 
            v-if="isExternal"
            :href="to"
            target="_blank"
            rel="noopener"
            class="w-full flex items-center gap-2 justify-start p-1 border-b-2 border-transparent font-medium leading-5 hover:border-gray-300 transition duration-150 ease-in-out focus:outline-none"
        >
            <slot/>
            <span class="material-symbols-outlined material-symbols-font-300 text-xs"> ungroup </span>
        </a>

        <!-- Caso in cui si tratta di un link interno -->
        <RouterLink
            v-else-if="routeExists"
            :to="routerLinkTo"
            class="w-full p-1 flex items-center gap-2 justify-start border-b-2 border-transparent leading-5 hover:border-gray-300 transition duration-150 ease-in-out focus:outline-none"
        >
            <slot/>
        </RouterLink>

    </section>
</template>
    
<script setup>

    // based imports
    import { computed, toRefs } from 'vue';

    // router imports
    import { useRouter, useRoute, RouterLink } from 'vue-router';
    
    // Definisco le props
    const props = defineProps({
        to: {
            type: String,
            default: null
        },
        params: {
            type: Object,
            default: null
        }
    });

    const { to, params } = toRefs(props);

    // Definisco il router e il route
    const router = useRouter();
    const route = useRoute();

    // Computed per capire se il link è esterno o interno
    const isExternal = computed(() => /^https?:\/\//.test(to.value) || /^mailto:/.test(to.value) || /^tel:/.test(to.value) );

    // Computed per generare l'oggetto 'to' per RouterLink con i parametri se presenti
    const routerLinkTo = computed(() => {
      const { to, params } = props;
      return params ? { name: to, params } : { name: to };
    });

    // Computed per verificare se la rotta esiste
    const routeExists = computed(() => {
        try {
            const route = router.resolve(routerLinkTo.value);
            return route.name !== undefined;
        } catch (error) {
            return false;
        }
    });

    // Computed per recuperare il requireRole della rotta
    const requireRole = computed(() => {
        try {
            const route = router.resolve(routerLinkTo.value) || null;
            return route != null && route.name !== undefined ? (route?.meta && route?.meta?.requiredRole ? route.meta.requiredRole : null) : null;
        } catch (error) {
            return null;
        }
    });

</script>
  