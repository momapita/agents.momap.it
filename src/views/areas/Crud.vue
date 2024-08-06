<template>
    <FormGenerator 
        :fields="formModel"
        :key="formKey"
        :tKey="'table'"
        class="w-full"
        ref="formRef"
        @submit="onSubmit"
    />
</template>

<script setup>
    
    // based imports
    import { inject, onMounted, ref, computed, nextTick } from "vue";

    // error handler import and services
    import { executeWithGlobalErrorHandling, executeFormWithGlobalErrorHandling } from '@/helpers/errorHandler';

    // services and models imports
    import { fillFormModel } from "@/helpers/form.js"; 

    // store imports
    import { useAreasStore } from '@/stores/areas.js';

    // recupero il riferimento del dialog globale
    const dialogRef = inject('dialogRef');

    // http service
    const HttpService = inject('HttpService');

    // definisco il modello per il form
    const formModel = ref({
        ar__area_id: {
            key: "ar__area_id",
            label: "ar__area_id",
            placeholder: "ar__area_id",
            model: null,
            type: "text",
            notShow: true
        },
        ar__name: {
            key: "ar__name",
            label: "ar__name",
            placeholder: "ar__name",
            model: null,
            type: "text",
            rules: 'required|min:4',
        },
        regions_ids: {
            key: "regions_ids",
            label: "regions_ids",
            placeholder: "regions_ids",
            model: null,
            type: "multiselect",
            bind: {
                onchange: (event) => {

                    // recupero le province
                    const regionsIds = Array.isArray(event?.value) ? event.value.map(Number) : [];
                    const provinces = regionsIds.length ? useAreasStore().getProvincesByRegionIds(regionsIds) || [] : useAreasStore().allProvinces;

                    // recupero le province selezionate dall'utente e le filtro dalle province risultanti
                    const selectedProvincesIds = Array.isArray(formRef.value?.getFieldsModel('provinces_ids')) ? formRef.value?.getFieldsModel('provinces_ids').map(Number) : [];
                    const filteredSelectProvincesIds = selectedProvincesIds.filter(id => new Set(provinces.map(obj => parseInt(obj.id))).has(id)).map(id => id.toString());

                    // aggiorno le opzioni e il modello
                    formRef.value?.onUpdateField('provinces_ids', provinces, ['bind', 'options']);
                    formRef.value?.onUpdateField('provinces_ids', filteredSelectProvincesIds, ['model']);

                },
                filter: true,
                filterFields: ['label', 'id'],
                showClear: true,
                optionLabel: "label",
                optionValue: "id",
                virtualScrollerOptions: { itemSize: 38 },
                display: "chip",
                options: useAreasStore().allRegions,
            },
            arrToString: true,
            rules: 'required'
        },
        provinces_ids: {
            key: "provinces_ids",
            label: "provinces_ids",
            placeholder: "provinces_ids",
            model: null,
            type: "multiselect",
            bind: {
                filter: true,
                filterFields: ['label', 'id'],
                showClear: true,
                optionLabel: "label",
                optionValue: "id",
                virtualScrollerOptions: { itemSize: 38 },
                display: "chip",
                options: useAreasStore().allProvinces
            },
            arrToString: true,
            rules: 'required'
        },
    });

    // definisco il formKey e il riferimento
    const formKey = ref(0);
    const formRef = ref(null);

    // definisco le props derivanti dal dialog e la modalità del crud
    const props = ref(null);
    const addMode = computed(() => props?.value?.mode === 'add');

    // definisco la funzione per riempire il modello in modifica
    const fillModelEdit = executeWithGlobalErrorHandling(async () => {
        
        if(addMode.value === null || addMode.value === undefined || addMode.value === true) {
            throw new Error('addMode non trovato oppure true');
        }

        if(!props?.value){
            throw new Error('data non trovata');
        }

        const { ar__area_id: id = null } = props?.value?.event;
    
        // controllo che esista id
        if(!id || parseInt(id) <= 0 || isNaN(parseInt(id)) || parseInt(id) === undefined) {
            throw new Error('id non trovato');
        }

        // recupero i dati dell'area
        const response = await HttpService.get(`areas/${id}`);

        // setto i dati nel modello
        formModel.value = fillFormModel(formModel, response.data);

    }, false);

    // definisco la funzione per il submit
    const onSubmit = executeFormWithGlobalErrorHandling(async (values) => {
        console.log(values);
    });

    onMounted(async () => {
        try {

            // aspetto che il dialog venga renderizzato
            await nextTick();

            // setto i dati nelle props
            props.value = dialogRef?.value?.data || null;

            // riempio il modello in base di addMode
            addMode.value != true && await fillModelEdit();

            // incremento il formKey
            formKey.value += 1;

        } catch (error) {
            console.error(error);
        }
    });

</script>