<template>
    
    <!-- Dichiaro il context Menu -->
    <ContextMenu v-if="contextMenuSelection.show" ref="cm" :model="contextMenuSelection.obj" @hide="!objRow">
      <template #item="{ item }">
        <OptionsWrapper :items="[{ ...item }]" :objRow="objRow" :referenceState="'contextMenu'" />
      </template>
    </ContextMenu>

    <!-- Skeleton se non ci sono dati -->
    <Skeleton height="100%" v-if="!firstLoading" />

    <template v-else>

        <Toolbar class="mb-6" v-if="toolBarStyle && headerButtons">
            
            <!-- Renderizzo i vari elementi di headerButtons -->
            <template #start>
                <HeaderButtonsWrapper :items="headerButtons" />
            </template>

            <template #end>
                <div class="flex items-center justify-start gap-4">

                    <!-- Bottone per il reload della tabella -->
                    <Button
                        type="button"
                        severity="contrast"
                        icon="pi pi-refresh"
                        outlined
                        :label="isMobile != true ? $t('general.reload') : null"
                        @click="onEventsDatatable"
                    />

                    <!-- Bottone per l'esportazione (se richiesta) -->
                    <SplitButton 
                        v-if="exportEnabled"
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

                </div>
            </template>
        
        </Toolbar>
        
        <DataTable
            :id="`datatable_${Math.random().toString(36).substring(7)}`"
            ref="tableRef"
            :size="'small'"
            stripedRows
            removableSort
            lazy
            :loading="loading"
            :value="tableData"
            :contextMenu="contextMenuSelection.show"
            v-model:contextMenuSelection="objRow"
            @rowContextmenu="onRowContextMenu"
            :first="lazyParams.first"
            :totalRecords="totalRecords"
            :rows="lazyParams.rows"
            v-model:filters="filters"
            @page="onEventsDatatable($event)"
            @sort="onEventsDatatable($event)"
            @filter="onEventsDatatable($event)"
            :filterDisplay="filterColumns && filterColumns.length > 0 ? filterDisplay : null"
            :globalFilterFields="filterColumns || []"
            paginator
            :paginatorTemplate="`${!isMobile ? 'RowsPerPageDropdown FirstPageLink' : '' } PrevPageLink CurrentPageReport NextPageLink ${!isMobile ? 'LastPageLink' : '' }`"
            :currentPageReportTemplate="`{last} di {totalRecords} ${$t('general.totals')}`"
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
                    v-if="!toolBarStyle"
                />
            </template>
        
            <!-- Paginator end template -->
            <template #paginatorend>
                <SplitButton
                    v-if="exportEnabled && !toolBarStyle"
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

                    <!-- Sezione del titolo -->
                    <div v-if="titlePage" class="py-1.5 px-3">
                        <h3 class="text-xl font-bold"> {{ titlePage }} </h3>
                    </div>

                    <!-- Sezione dei pulsanti -->
                    <div class="flex items-center justify-start flex-1" v-if="headerButtons && !toolBarStyle">
                        <HeaderButtonsWrapper :items="headerButtons" />
                    </div>

                    <!-- Sezione della ricerca -->
                    <div v-if="search">
                        <InputText :placeholder="`${$t('general.search')}...`" v-model="filters['global'].value" @change="onEventsDatatable" />
                    </div>
                </div>
            </template>

            <!-- Renderizzo le colonne -->
            <Column
                v-for="column in columns"
                :key="column.Field"
                :field="column.Field"
                :header="column.Header"
                :sortable="true"
                :showFilterMenu="column.Field in filters && column.Field !== 'id'"
                :showFilterMatchModes="false"
                :filterField="column.Field in filters && column.Field !== 'id' ? column.Field : null"
                :frozen="getColsFormat(column.Field)?.frozen === true"
            >

                <!-- Template icona del filtro -->
                <template #filtericon>
                    <span class="material-symbols-outlined material-symbols-font-300"> search </span>
                </template>

                <!-- Template del filtro -->
                <template #filter="{filterModel,filterCallback}">
                    <div v-if="column.Field in filters">

                        <!-- se presente filterModel lo renderizzo -->
                        <div v-if="getColsFormat(column.Field)?.filterModel && getColsFormat(column.Field)?.filterModel.components">
                        <component
                            :is="getColsFormat(column.Field)?.filterModel?.components"
                            class="!z-1"
                            v-bind="getColsFormat(column.Field)?.filterModel?.bind"
                            v-model="filterModel.value"
                        />
                        </div>

                        <div v-else>
                            <InputText v-model="filterModel.value" />
                        </div>
                    </div>
                </template>

                <!-- Template del body -->
                <template #body="{ data }">

                    <div v-if="colsFormat.find(item => item.header.toLowerCase() === column.Field.toLowerCase())" :id="`tour_table_${column.Field}`">
                        
                        <!-- Se è presente un componente lo renderizzo -->
                        <component 
                            v-if="getColsFormat(column.Field)?.components && !getColsFormat(column.Field).func"
                            :is="getColsFormat(column.Field).components"
                            v-bind="{
                                ...(getColsFormat(column.Field).dinamicProps ? 
                                (
                                    getColsFormat(column.Field)?.dinamicPropsMultiple ? getColsFormat(column.Field).dinamicProps(data) : getColsFormat(column.Field).dinamicProps(data[column.Field])
                                )
                                : {}
                                )
                            }"
                        >

                            <!-- Eseguo la formattazione singola se richiesta -->
                            <p v-if="getColsFormat(column.Field).formatter && !getColsFormat(column.Field).formatter?.multiple">
                                {{ getColsFormat(column.Field).formatter.format(data[column.Field]) }}
                            </p>

                            <!-- Eseguo la formattazione multipla se richiesta -->
                            <p v-else-if="getColsFormat(column.Field).formatter && getColsFormat(column.Field).formatter?.multiple">
                                {{ getColsFormat(column.Field).formatter.format(data) }}
                            </p>

                            <!-- Se la formattazione non c'è -->
                            <div v-else>
                                {{ data[column.field] != '' ? data[column.Field] : $t('general.dataNotFound') }}
                            </div>


                        </component>

                        <!-- Se non è un componente, lo renderizzo in base a func  -->
                        <component
                            v-else
                            :is="getColsFormat(column.Field).func(data[column.Field])"
                            v-bind="{
                                ...(getColsFormat(column.Field).dinamicProps ? 
                                (
                                    getColsFormat(column.Field)?.dinamicPropsMultiple ? getColsFormat(column.Field).dinamicProps(data) : getColsFormat(column.Field).dinamicProps(data[column.Field])
                                )
                                : {}
                                )
                            }"
                        />

                    </div>

                    <div v-else :id="`tour_table_${column.Field}`">
                        {{ data[column.Field] != '' ? data[column.Field] : $t('general.dataNotFound') }}
                    </div>

                </template>

            </Column>

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

</template>

<script setup>

    // Based imports
    import { ref, onMounted, inject } from 'vue';
    import { useI18n } from "vue-i18n";

    // Services imports
    import dayjs from 'dayjs';
    import TableServices from '@/helpers/table';
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
        exportEnabled : {
            type: Boolean,
            default: true,
            // Indica se si possono effettuare le export
        },
        search : {
            type: Boolean,
            default: true,
            // Indica se si possono effettuare le ricerca
        },
        titlePage : {
            type: String,
            required: false,
            default: null,
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
                pageName: <name of the api call>,
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
                pageName: <name of the api call>,
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
            default: () => null,
            /*[
                {
                    type: <type of the button> | 'add' | 'edit' | 'delete | 'export',
                    disabled: <boolean true or false>,
                    action: <action function>
                }
            ]*/
        },
        toolBarStyle: {
            type: Boolean,
            default: false
        }
    });

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
    const rowPageOptions = ref(TableServices.setRowsPerPage(props.rows));

    // Definisco una variabile reactive per gestire l'esportazione lato front
    const exportItems = [
        { label: 'Pdf', command: () => exportTable('pdf') },
        { label: 'Excel', command: () => exportTable('excel') }
    ];

    // definisco i riferimenti e i dati utili per la gestione della tabella
    const tableRef = ref(null);
    const tableData = ref(null);

    // definisco le colonne 
    const columns = ref([]);
    const columnsVisible = ref([]);
    const columnsExport = ref([]);

    // definisco le variabili per i loading
    const loading = ref(false);
    const firstLoading = ref(false);
    const loadingExport = ref(false);

    // definisco le variabili utili per la paginazione e i filtri
    const filters = ref({});
    const lazyParams = ref(TableServices.setBaseLazyParams(props.rows));

    // definisco le variabili reattive per i totali di records e i totali per le colonne
    const totalRecords = ref(0);
    const sumColsRecords = ref(null);

    // definisco la funzione per recuperare i dati di formattazione di una colonna
    const getColsFormat = (col = null) => {
        try {
        
            if(!col){
                throw new Error('Col not defined');
            }

            // recupero l'oggetto della formattazione
            const colFormatter = props.colsFormat.find(item => item.header.toLowerCase() === col.toLowerCase());

            // ritorno l'oggetto
            return colFormatter || null;

        } catch (error) {
            import.meta.env.VITE_DEVELOPMENT === 'true' && console.error(error);
            return null;
        }
    };

    // definisco la funzione per visualizzare il context menu
    const onRowContextMenu = (event) => {
        props.contextMenuSelection.show && cm.value.show(event.originalEvent);
    };

    // definisco la funzione per recuperare eventuali colonne dinamiche
    const loadDinamicCols = async () => {
        try {

            // controllo se è settatto props.visibleColumns
            if(props.visibleColumns && props.visibleColumns.length > 0){
                columnsVisible.value = props.visibleColumns;
                throw new Error('VisibleColumns already defined');
            }

            // controllo la presenza di props.dinamicCols
            if(!props.dinamicColumnsCall || !Object.keys(props.dinamicColumnsCall).length > 0 || !props.dinamicColumnsCall.pageName){
                throw new Error('DinamicCols not defined');
            }

            // recupero i dati dal backend
            const response = await HttpService.post('viewPage.php', {
                database: props.database || null,
                ...props.dinamicColumnsCall
            });

            // setto le colonne visibili
            columnsVisible.value = response.data.map(item => item.key || null).filter(item => item !== null);

        } catch (error) {
            columnsVisible.value = null;
        }
    };

    // definisco la funzione per recuperare eventuali colonne in esportazione dinamica
    const loadDinamicColsExport = async () => {
        try {

            // controllo che sia settato exportEnabled
            if(!props.exportEnabled){
                throw new Error('ExportEnabled not defined');
            }

            // controllo se è settatto props.dinamicExportCols
            if(!props.dinamicExportColumnsCall || !Object.keys(props.dinamicExportColumnsCall).length > 0 || !props.dinamicExportColumnsCall.pageName){
                throw new Error('DinamicExportCols not defined');
            }

            // recupero i dati dal backend
            const response = await HttpService.post('viewPage.php', {
                database: props.database || null,
                ...props.dinamicExportColumnsCall
            });

            // setto le colonne visibili in esportazione
            columnsExport.value = response.data.map(item => item.key || null).filter(item => item !== null);

        } catch (error) {
            columnsExport.value = columnsVisible.value || props.visibleColumns || columns.value;
        }
    };

    // definisco la funzione per inizializzare i filtri
    const initFilter = async () => {
        filters.value = {
            'global' : { value: null, matchMode: TableServices.getMatchMode('CONTAINS') },
            ...props.filterColumns.reduce((acc, item) => {

                // controllo se esiste un componente per il filtro
                const matchMode = getColsFormat(item)?.filterModel ? getColsFormat(item)?.filterModel?.matchMode || null : null;

                // setto il filtro
                acc[item] = { value: null, matchMode: matchMode ?? TableServices.getMatchMode('CONTAINS') };
                
                return acc;
            }, {})
        };
    };

    // definisco la funzione per l'esportazione
    const exportTable = (type) => {
        console.log("exportTable", type);
    };

    // definisco la funzione per recuperare i dati paginati in modo dinamico
    const loadDatatableData = async () => {
        try {

            if(!lazyParams.value){
                throw new Error('LazyParams not defined');
            }

            // setto il loading a true
            loading.value = true;

            // setto una variabile per le colonne visibili
            const columnsVisibleLocal = columnsVisible.value || props.visibleColumns || null;

            // se sumCols è presente, lo filtro in base a columnsVisible (estrapolo solo le colonne visibili)
            const sumColsLocal = props.sumCols && props.sumCols.length > 0 && columnsVisibleLocal && columnsVisibleLocal.length > 0 ? 
            props.sumCols.filter(item => columnsVisibleLocal.includes(item)) : null;

            const objectLocal = {
                ...lazyParams.value,
                pageName: props.pageName || null,
                database: props.database || null,
                columnVisible: columnsVisibleLocal,
                ...sumColsLocal && { sumColums: sumColsLocal },
            };

            // recupero i dati dal backend
            const response = await HttpService.post('viewPage.php', objectLocal);
            
            // setto i dati nella variabile reactive
            tableData.value = response.data;

            // setto i totalRecords
            totalRecords.value = response?.totalRecords ? parseInt(response.totalRecords) : 0;

            // setto i sumColsRecords
            sumColsRecords.value = response?.sumColums && typeof response.sumColums == 'object' && Object.keys(response.sumColums).length > 0 ? response.sumColums : null;

            if(!response?.cols || response?.cols?.length == 0){
                throw new Error('Cols not defined');
            }

            // setto localCols trasformando l'oggetto in un array
            const localCols = Object.keys(response?.cols).map(key => {
                return {
                    Field: response?.cols[key].Field,
                    Type: response?.cols[key].Type,
                    Header: key
                };
            });

            // se è presente props.visibleColumns, ordino localCols in base a props.visibleColumns
            if(props.visibleColumns && props.visibleColumns.length > 0){
                localCols.sort((a, b) => {
                    return props.visibleColumns.indexOf(a.Field) - columnsVisibleLocal.indexOf(b.Field);
                });
            }

            // se è presente columnsVisible, setto solo le colonne visibili
            if(!columnsVisible.value || columnsVisible.value.length === 0){
                columns.value = localCols;
            } else {
                columns.value = columnsVisible.value.map(field => localCols.find(obj => obj.Field === field));
            }

            // setto il loading a false
            loading.value = false;

            // se è presente eventOnSingleRecord e i totalRecords sono 1, eseguo l'azione
            if(props.eventOnSingleRecord.onEvent && totalRecords.value === 1){
                props.eventOnSingleRecord.action(tableData.value[0] || {});
            }
        
        } catch (error) {
            import.meta.env.VITE_DEVELOPMENT === 'true' && console.error(error);
            tableData.value = [];
            loading.value = false;
        }
    }

    // definisco la funzione che gestisce gli eventi del datatable
    const onEventsDatatable = async (event = {}) => {
        try {

            // controllo la presenza di event
            if(!event){
                throw new Error('Event not defined');
            }

            // recupero eventuali filtri
            const localFilters = event?.filters || filters.value || {};

            // controllo la presenza di filtri
            if(!localFilters){
                throw new Error('Filters not defined');
            }

            // formatto il filtro globale
            const globalFilter = localFilters?.global && localFilters?.global?.value != null ? localFilters.global.value?.trim() : null;

            // formatto i filtri per avere un array di oggetti con field e value
            const filtersFormatted = Object.keys(localFilters).map(key => {

                // recupero il valore del filtro
                const filterValue = localFilters[key].value != null ? localFilters[key].value : null;

                // controllo se il filtro è un array e se ha due elementi e nel primo elemento è presente un oggetto dayjs
                const value = Array.isArray(filterValue) && filterValue.length === 2 && dayjs(filterValue[0]).isValid() ? 
                [
                    dayjs(filterValue[0]).format('YYYY-MM-DD'),
                    dayjs(filterValue[1]).format('YYYY-MM-DD')
                ] : filterValue !== null ? filterValue : null;

                // ritorno l'oggetto
                return {
                field: key,
                value: value,
                matchMode: localFilters[key].matchMode || FilterMatchMode.CONTAINS
                };
            }).filter(item => item.value !== null && item.value !== '' && item.field !== 'global');

            // setto i parametri per la paginazione
            lazyParams.value = {
                first: event.first || 0,
                rows: event.rows || props.rows || 15,
                sortField: event.sortField || lazyParams.value.sortField,
                sortOrder: event.sortOrder || lazyParams.value.sortOrder,
                ...(globalFilter !== null && { uniqueFilter: globalFilter }),
                ...(filtersFormatted !== null && { filters: filtersFormatted }),
            };

            // carico i dati
            await loadDatatableData();

        } catch (error) {
            import.meta.env.VITE_DEVELOPMENT === 'true' && console.error(error);
            return;
        }
    };

    onMounted(async () => {

        // inizializzo i filtri
        await initFilter();

        // funzione per settare eventuali colonne dinamiche
        await loadDinamicCols();

        // carico i dati
        await loadDatatableData();

        await loadDinamicColsExport();

        // setto il loading a true
        firstLoading.value = true;

    });

</script>