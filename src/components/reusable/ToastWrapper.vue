<template>
    <div>
        <Toast group="appToast" />
    </div>
</template>

<script setup>

    // based imports
    import { inject } from 'vue';

    // services imports
    import { useI18n } from "vue-i18n";
    import { useToast } from 'primevue/usetoast';

    // definisco il servizio del toast
    const toastBus = inject('toastBus');
    const toast = useToast();

    // definisco le variabili utili per la lingua
    const { t } = useI18n();

    // definisco le opzioni base del toast
    const baseOptions = {
        action: t(`general.close`),
        group: 'appToast',
        life: 3000,
        sticky: true
    };

    // definisco la funzione per mostrare il toast 
    const showToast = (detail = '', severity = 'default', position = 'top-right') => {
        toast.add({
            ...baseOptions,
            severity,
            detail,
            position
        });
    }

    // definisco gli eventi per il toast
    toastBus.on('*', (args, data) => showToast(args, data));

</script>