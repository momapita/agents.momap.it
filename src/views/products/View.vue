<template>
    <DataTableWrapper
        ref="tableRef"
        :pageName="'products'"
        :rows="15"
        :contextMenuSelection="contextMenuSelection"
        :headerButtons="headerButtons"
        :filterColumns="['pr__fatt_api_code', 'pr__fatt_api_name','pr__fatt_api_description', 'pr__fatt_api_stock_current', 'pr__fatt_api_created_at', 'pr__fatt_api_updated_at', 'pr__fatt_api_category']"
        :colsFormat="colsFormat"
        :toolBarStyle="false"
    />
</template> 

<script setup>

    // based imports
    import { ref, inject } from 'vue';
    
    // Middleware and error handler import and services
    import Middleware from '@/router/middleware.js';
    import { executeWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // Table services
    import TableServices from '@/helpers/table';

    // Crud imports
    import CrudView from './Crud.vue';

    // gestisco il bus del dialog e dell'http   
    const dialogBus = inject('dialogBus');
    const HttpService = inject('HttpService');

    // recupero il riferimento della tabella
    const tableRef = ref(null);

    // definisco l'oggetto per la gestione del context menu
    const contextMenuSelection = ref({
        show: true,
        frozen: false,
        requireRole: 'admin',
        obj: [
            {
                type: 'edit',
                disabled: false,
                action: (event) => showModal('edit', event)
            },
            {
                type: 'delete',
                disabled: false,
                action: (event) => executeDelete(event)
            }
        ],
    });

    // definisco la funzione per pulsanti nell'header della tabella
    const headerButtons = ref([
        {
            type: 'add',
            disabled: false,
            requireRole: 'admin',
            action: (event) => showModal('add', event)
        }
    ]);

    // definisco la funzione per aprire il dialog in modifica o aggiunta
    const showModal = (mode = 'add', event = null) => {
        const optionsData = {
            data: {
                mode,
                event,
                tableRef: tableRef.value || null
            }
        }
        dialogBus.emit(CrudView, optionsData);
    }

    // definisco la funzione per eliminare il prodotto
    const executeDelete = executeWithGlobalErrorHandling(async (values) => {

        // setto il middleware
        if(!Middleware.hasPermission('admin')) {
            throw new Error('Non hai i permessi per eseguire questa azione');
        }

        // controllo i valori passati
        if(!values || typeof values !== 'object' || Object.keys(values).length === 0) {
            throw new Error('Valori non validi');
        }

        // recupero l'id
        const { pr_product_id : id = null } = values;

        // controllo che esista id
        if(!id || parseInt(id) <= 0 || isNaN(parseInt(id)) || parseInt(id) === undefined) {
            throw new Error('id non trovato');
        }

        console.log("executeDelete", id);

        /* elimino il prodotto
        await HttpService.delete(`product/${id}`);

        // ricarico la tabella
        tableRef.value && tableRef.value.reload();*/

    });

    // definisco la funzione per pulsanti nell'header della tabella
    const colsFormat = [
        ...TableServices.formatterBaseCols(['pr__fatt_api_code', 'pr__fatt_api_name','pr__fatt_api_description', 'pr__fatt_api_stock_current', 'pr__fatt_api_category'], 12),
        ...TableServices.formatterDateCols(['pr__fatt_api_created_at', 'pr__fatt_api_updated_at'])
    ]

</script>