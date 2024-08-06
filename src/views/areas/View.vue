<template>
    <DataTableWrapper
        :pageName="'areas'"
        :rows="15"
        :contextMenuSelection="contextMenuSelection"
        :headerButtons="headerButtons"
        :visibleColumns="['ar__name','ar__created_at', 'ar__updated_at', 'ar__deactived_at']"
        :filterColumns="['ar__name', 'ar__created_at', 'ar__updated_at', 'ar__deactived_at']"
        :colsFormat="colsFormat"
        :toolBarStyle="false"
    />
</template> 

<script setup>

    // based imports
    import { ref, inject } from 'vue';

    // services imports
    import TableServices from '@/helpers/table';

    // Crud imports
    import CrudView from './Crud.vue';

    const dialogBus = inject('dialogBus');

    // definisco l'oggetto per la gestione del context menu
    const contextMenuSelection = ref({
        show: true,
        frozen: false,
        obj: [
            {
                type: 'edit',
                disabled: false,
                action: (event) => showModal('edit', event)
            },
            {
                type: 'delete',
                disabled: false,
                action: (event) => {
                    console.log("delete", event);
                }
            }
        ]
    });

    // definisco la funzione per pulsanti nell'header della tabella
    const headerButtons = ref([
        {
            type: 'add',
            disabled: false,
            action: (event) => showModal('add', event)
        }
    ]);

    // definisco la funzione per aprire il dialog in modifica o aggiunta
    const showModal = (mode = 'add', event = null) => {
        const optionsData = {
            data: {
                mode,
                event
            }
        }
        dialogBus.emit(CrudView, optionsData);
    }

    // definisco la funzione per pulsanti nell'header della tabella
    const colsFormat = [
        ...TableServices.formatterBaseCols(['ar__name'], 2),
        ...TableServices.formatterDateCols(['ar__created_at', 'ar__updated_at', 'ar__deactived_at'])
    ]

</script>