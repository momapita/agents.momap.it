<template>
  <DynamicDialog />
</template>

<script setup>

    // based imports
    import { inject } from 'vue';

    // service import
    import { useDialog } from 'primevue/usedialog';

    // definisco il servizio del dialog bus
    const dialogBus = inject('dialogBus');

    // recupero il servizio useDialog di primevue
    const dialog = useDialog();

    const showDialog = (args, data) => {
        console.log("showDialog", args, data);
        dialog.open(args, data);
    }

    // definisco gli eventi per il toast
    dialogBus.on('*', (args, data) => showDialog(args, data));

</script>