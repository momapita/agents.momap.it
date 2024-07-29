<template>
    <RouterLink to="/login">Users</RouterLink>
    <DataTableWrapper
        :pageName="'users'"
        :rows="15"
        :contextMenuSelection="contextMenuSelection"
        :headerButtons="headerButtons"
        :visibleColumns="['us__name','us__last_name', 'ut__description']"
        :filterColumns="['us__name', 'ut__description']"
        :sumCols="['us__name', 'ut__description']"
        :colsFormat="colsFormat"
        :toolBarStyle="false"
    />
</template> 

<script setup>
    
    import { ref } from 'vue';
    import TableServices from '@/helpers/table';
    import { RouterLink } from 'vue-router';

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
        ...TableServices.formatterBaseCols(['us__name', 'us__last_name'], 12)
    ]

</script>