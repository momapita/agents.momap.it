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
    
    import { ref } from 'vue';
    import TableServices from '@/helpers/table';

    // definisco l'oggetto per la gestione del context menu
    const contextMenuSelection = ref({
        show: true,
        frozen: false,
        obj: [
            {
                type: 'edit',
                disabled: false,
                action: (event) => {
                    console.log("edit", event);
                }
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
            action: (event) => {
                console.log("add", event);
            }
        }
    ]);

    const colsFormat = [
        ...TableServices.formatterBaseCols(['ar__name'], 12),
        ...TableServices.formatterDateCols(['ar__created_at', 'ar__updated_at', 'ar__deactived_at'])
    ]

</script>