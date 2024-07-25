<template>
    
    <!-- Dichiaro il context Menu -->
    <ContextMenu v-if="contextMenuSelection.show" ref="cm" :model="contextMenuSelection.obj" @hide="!objRow">
      <template #item="{ item }">
        <OptionsWrapper :items="[{ ...item }]" :objRow="objRow" :referenceState="'contextMenu'" />
      </template>
    </ContextMenu>

    <DataTable
        :id="`datatable_${Math.random().toString(36).substring(7)}`"
        ref="tableRef"
        :value="products"
        :filterDisplay="filterColumns && filterColumns.length > 0 ? filterDisplay : null"
        :globalFilterFields="filterColumns || []"
        :contextMenu="contextMenuSelection.show"
        v-model:contextMenuSelection="objRow"
        @rowContextmenu="onRowContextMenu"
    >
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>


        <!-- Se è richiesta la colonna delle opzioni, la aggiungo -->
        <Column
            v-if="optionsCol && contextMenuSelection.obj"
            :header="$t('general.options')"
            alignFrozen="right"
            :frozen="contextMenuSelection?.frozen && contextMenuSelection?.frozen === true"
        >
            <template #body="slotProps">
                <OptionsWrapper :items="contextMenuSelection.obj" :objRow="slotProps.data" :referenceState="'cols'" />
            </template>
        </Column>


    </DataTable>

</template>

<script setup>
    
    // based imports
    import { ref, onMounted, inject, computed } from 'vue';
    import { useI18n } from "vue-i18n";

    // import helpers components
    import OptionsWrapper from './helpersComponents/OptionsWrapper.vue';

    // definisco le props
    const props = defineProps({
        pageName : {
            type: String,
            required: true,
            // Indica il pageName a cui puntare
        },
        database : {
            type: String,
            required: false,
            default: 'Agents',
            // Indica il database a cui puntare
        },
        export : {
            type: Boolean,
            default: true,
            // Indica se si possono effettuare le export
        },
        search : {
            type: Boolean,
            default: true,
            // Indica se si possono effettuare le ricerca
        },
        filterColumns : {
            type: Array,
            default: () => [],
            // [ <name of the column>, ... ]
        },
        filterDisplay : {
            type: String,
            required: false,
            default: 'menu',
            // Indica come viene visualizzato il filtro per singola colonna
        },
        visibleColumns : {
            type: Array,
            default: () => null,
            // [ <name of the column>, ... ]
        },
        sumCols : {
            type: Array,
            required: false,
            default: () => [],
            // [ <name of the column> ]
        },
        dinamicColumnsCall : {
            type: Object,
            required: false,
            default: () => null
            /*{
                PageName: <name of the api call>,
                filters: <filters array>,
                sortOrder: <sort order value>,
                sortField: <sort field value>
            }*/
        },
        dinamicExportColumnsCall : {
            type: Object,
            required: false,
            default: () => null,
            /*{
                PageName: <name of the api call>,
                filters: <filters array>,
                sortOrder: <sort order value>,
                sortField: <sort field value>
            }*/
        },
        colsFormat : {
            type: Object,
            required: false,
            default: [],
            /*[
                {
                    header: el,
                    components: <components with defineAsyncComponent>,
                    formatter: {
                        multiple: <value true or false>,
                        format: <format function>
                    },
                    dinamicProps: <dinamic props function>
                }
            ]*/
        },
        optionsCol : {
            type: Boolean,
            required: false,
            default: true,
            // Valore per la visualizzazione della colonna opzioni
        },
        contextMenuSelection : {
            type: Object, 
            required: false, 
            default: {
                compactMenu: false,
                show: false,
                frozen: false,
                obj: null
            },
            // Oggetto per la gestione del menu contestuale e delle opzioni in tabella (se optionsCol = true)
        },
        rowClick : {
            type: Function,
            required: false,
            default: () => null
            // Evento per il click su singola riga
        },
        size : {
            type: String,
            required: false,
            default: 'small',
            validator: (value) => {
                return ["small", "medium", "large"].includes(value);
            }
            // Dimensione della tabella
        },
        rows : {
            type: Number,
            default: 15,
            // Numero di righe da visualizzare
        },
        eventOnSingleRecord : {
            type: Function,
            required: false,
            default: () => null
            // Evento quando il risultato risulta singolo
        },
        subHeaderObj: {
            type: Object,
            required: false,
            default: {
                field: null,
                mode: null,
                expandableRowGroups: false
            }
        }
    });

    // oggetto di test
    const products = ref([{ code: 'f230fh0g3', name: 'Donut', category: 'Donut', quantity: 2 }]);

    // definisco la lingua
    const { t, d } = useI18n();

    // import http service e toastBus
    const HttpService = inject('HttpService');
    const toastBus = inject('toastBus');

    // definisco i riferimenti dei componenti
    const tableRef = ref(null);
    const tableData = ref(null);

    // definisco i riferimenti utili per il context menu
    const cm = ref(null);
    const objRow = ref(null);

    // definisco la funzione per visualizzare il context menu
    const onRowContextMenu = (event) => {
        props.contextMenuSelection.show && cm.value.show(event.originalEvent);
    };

    onMounted(() => {
        console.log("DataTableWrapper");
    });

</script>