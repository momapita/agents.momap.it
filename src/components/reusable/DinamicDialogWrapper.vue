<template>
  <DynamicDialog />
</template>

<script setup>

    // based imports
    import { inject } from 'vue';

    // service import
    import { useDialog } from 'primevue/usedialog';
    import { useI18n } from 'vue-i18n';

    // definisco il servizio del dialog bus
    const dialogBus = inject('dialogBus');

    // recupero il servizio useDialog di primevue
    const dialog = useDialog();

    // dichiaro le variabili che mi servono per il multilingua
    const { t } = useI18n();

    const basedDialogOptions = (title) =>{
      return {
        props: {
          header: t(title),
          modal: true,
          draggable: true,
          dismissableMask: true,
          maximizable: true,
          style: {
            width: '50vw',
          },
          breakpoints:{
            '960px': '75vw',
            '640px': '100vw'
          }
        }
      }
    }

    const showDialog = (args, payload) => {
      const { title = 'general.info', data } = payload;
      dialog.open(args, { ...basedDialogOptions(title), data });
    }

    // definisco gli eventi per il toast
    dialogBus.on('*', (args, payload) => showDialog(args, payload));

</script>