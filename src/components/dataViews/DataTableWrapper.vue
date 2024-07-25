<template>
    
    <!-- Dichiaro il context Menu -->
    <ContextMenu v-if="contextMenuSelection.show" ref="cm" :model="contextMenuSelection.obj" @hide="!objRow">
      <template #item="{ item }">
        <OptionsWrapper :items="[{ ...item }]" :objRow="objRow" :referenceState="'contextMenu'" />
      </template>
    </ContextMenu>

    <!-- Skeleton se non ci sono dati -->
    <Skeleton height="100%" v-if="!firstLoading" />

    <!-- DataTable -->
    <DataTable
        v-else
        :id="`datatable_${Math.random().toString(36).substring(7)}`"
        ref="tableRef"
        :size="'small'"
        stripedRows
        :value="products"
        :filterDisplay="filterColumns && filterColumns.length > 0 ? filterDisplay : null"
        :globalFilterFields="filterColumns || []"
        :contextMenu="contextMenuSelection.show"
        v-model:contextMenuSelection="objRow"
        @rowContextmenu="onRowContextMenu"
        removableSort
        paginator
        :paginatorTemplate="`${isMobile != true ? 'RowsPerPageDropdown' : ''}  PrevPageLink CurrentPageReport NextPageLink LastPageLink'`"
        :currentPageReportTemplate="`{last} di {totalRecords} ${$t('general.totals')}`"
        :rows="rows"
        :rowsPerPageOptions="rowPageOptions"
        scrollable
        scrollHeight="flex"
        :rowGroupMode="subHeaderObj?.mode || null"
        :groupRowsBy="subHeaderObj?.field || null"
        :expandableRowGroups="subHeaderObj?.expandableRowGroups || false"
        v-model:expandedRowGroups="expandedRowGroups"
    >

        <!-- Empty template -->
        <template #empty>
            <div class="flex items-center justify-center"> {{ $t('general.dataNotFound') }} </div>
        </template>

        <!-- Paginator start template  -->
        <template #paginatorstart>
            <Button
                type="button"
                severity="contrast"
                icon="pi pi-refresh"
                outlined
                :label="isMobile != true ? $t('general.reload') : null"
            />
        </template>
        
        <!-- Paginator end template -->
        <template #paginatorend>
            <SplitButton 
              v-if="export"
              :model="exportItems"
              size="small"
              outlined
              severity="contrast"
              :aria-label="$t('general.export')"
              v-tooltip.top="{value: $t('general.export') }"
            >
              <div class="flex items-center justify-center gap-4">
                <span class="material-symbols-outlined material-symbols-font-300" v-if="!loadingExport"> download </span>
                <ProgressSpinner v-else :strokeWidth="'5'":animationDuration="'.5s'" :aria-label="'loading'" class="!w-5 !h-5" />
              </div>
            </SplitButton>
        </template>

        <!-- Header Template -->
        <template #header>
            <div class="flex flex-col gap-4 lg:flex-row lg:justify-between">

                <!-- Sezione dei pulsanti -->
                <div class="flex items-center justify-start flex-1" v-if="headerButtons">
                    <HeaderButtonsWrapper :items="headerButtons" />
                </div>

                <!-- Sezione della ricerca -->
                <div v-if="search">
                    <InputText :placeholder="`${$t('general.search')}...`" />
                </div>
            </div>
        </template>

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
    
    // Based imports
    import { ref, onMounted, inject, computed } from 'vue';
    import { useI18n } from "vue-i18n";

    // Services imports
    import DateHelper from '@/helpers/date';
    import MatchModes from '@/helpers/matchModes';
    import { isMobile } from 'mobile-device-detect';

    // helpers components imports
    import OptionsWrapper from './helpersComponents/OptionsWrapper.vue';
    import HeaderButtonsWrapper from './helpersComponents/HeaderButtonsWrapper.vue';

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
        },
        headerButtons: {
            type: Object,
            required: false,
            default: () => null
        }
    });

    // oggetto di test
    const products = ref(Array.from({ length: 100 }, (_, i) => ({
        code: `f230fh0g3${i}`,
        name: 'Donut',
        category: 'Donut',
        quantity: 2
    })));

    // definisco la lingua
    const { t } = useI18n();

    // import http service e toastBus
    const HttpService = inject('HttpService');
    const toastBus = inject('toastBus');

    // definisco i riferimenti utili per il context menu e la riga selezionata
    const cm = ref(null);
    const objRow = ref(null);

    // definisco le eventuali righe espandibili
    const expandedRowGroups = ref([]);

    // Definisco una variabile computed per gestire il RowPerPageOptions
    const rowPageOptions = computed(() => {
        const options = [5, 10, 20, 50, 100];
        const rows = props.rows;
        if (!options.includes(rows)) {
            options.push(rows);
        }
        return options.sort((a, b) => a - b);
    });

    // Definisco una variabile reactive per gestire l'esportazione lato front
    const exportItems = [
        { label: 'Pdf', command: () => exportTable('pdf') },
        { label: 'Excel', command: () => exportTable('excel') }
    ];
    const loadingExport = ref(false);

    // definisco i riferimenti e i dati utili per la gestione della tabella
    const tableRef = ref(null);
    const tableData = ref(null);
    const firstLoading = ref(false);

    // definisco la funzione per visualizzare il context menu
    const onRowContextMenu = (event) => {
        props.contextMenuSelection.show && cm.value.show(event.originalEvent);
    };

    // definisco la funzione per l'esportazione
    const exportTable = (type) => {
        console.log("exportTable", type);
    };

    onMounted(() => {
        console.log("DataTableWrapper");

        // dopo 3 sec carico la tabella
        setTimeout(() => {
            firstLoading.value = true;
        }, 1500);
    });

</script>