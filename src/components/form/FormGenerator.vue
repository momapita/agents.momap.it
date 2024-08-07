<template>
    <BlockUI :blocked="blocked" :class="blocked ? 'relative' : ''">
        
        <ProgressSpinner v-if="blocked" class="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2" />
        
        <Form method="post" class="text-sm" @submit="onSaveEdit">
        
            <!-- Sezione dei vari fields -->
            <div :class="styleComputed">
                <div v-for="(field, key) in localData" :key="key" v-show="field && !field?.notShow">
                    <div class="w-full flex items-start justify-center gap-2 flex-col">

                        <!-- Label and Error Message -->
                        <label :for="field?.key" class="flex items-center gap-2 flex-wrap pl-2">
                            
                            <!-- Field information -->
                            <div v-if="field?.label && Array.isArray(field?.label) && field?.label.length > 0" class="space-x-1">
                                <span v-for="(singleField, index) in field?.label" :key="index">
                                    {{ $t(field?.localTranslate ? singleField : `${tKey ? `${tKey}.` : ''}${singleField}`) }}
                                </span>
                            </div>

                            <div v-else-if="field?.label && !Array.isArray(field?.label) && field?.label !== '' && field?.label !== null">
                                {{ $t(field?.localTranslate ? field : `${tKey ? `${tKey}.` : ''}${field?.label}`) }}
                            </div>

                            <!-- Error message -->
                            <ErrorMessage as="div" :name="field?.key" v-slot="{ message }">
                                <Message severity="error" class="text-xs">{{ message }}</Message>
                            </ErrorMessage>

                        </label>

                        <!-- Renderizzo il field con il template per le varie tipologie -->
                        <Field v-model="field.model" :name="field?.key" :placeholder="$t(`${tKey}.${field?.placeholder}`)" :rules="field?.rules || null" autocomplete="on">
                            
                            <!-- Caso in cui è un Dropdown -->
                            <template v-if="field?.type === 'dropdown'">
                                <Select 
                                    v-model="field.model"
                                    v-bind="field.bind"
                                    @change="field?.bind?.onchange && typeof field?.bind?.onchange === 'function' ? field.bind?.onchange($event) : null"
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è una multiselect -->
                            <template v-else-if="field?.type === 'multiselect'">
                                <MultiSelect 
                                    v-model="field.model"
                                    v-bind="field.bind"
                                    @change="field?.bind?.onchange && typeof field?.bind?.onchange === 'function' ? field.bind?.onchange($event) : null"
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è un Calendar -->
                            <template v-else-if="field?.type === 'calendar'">
                                <DatePicker
                                    v-model="field.model"
                                    v-bind="field.bind || {}"
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è un numero -->
                            <template v-else-if="field?.type === 'number'">
                                <InputNumber 
                                    v-model="field.model"
                                    v-bind="field.bind || {}"
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è un toggle -->
                            <template v-else-if="field?.type === 'toggle'">
                                <ToggleButton 
                                    v-model="field.model" 
                                    v-bind="field.bind || {}"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è un textarea -->
                            <template v-else-if="field?.type === 'textarea'">
                                <Textarea 
                                    v-model="field.model"
                                    v-bind="field.bind || {}"
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    class="w-full"
                                    :inputProps="{ autocomplete: true }"
                                />
                            </template>

                            <!-- Caso in cui è una password -->
                            <template v-else-if="field?.type === 'password'">
                                <Password 
                                    v-model="field.model" 
                                    v-bind="field.bind || {}" 
                                    :placeholder="$t(`${tKey}.${field?.placeholder}`)"
                                    :inputProps="{ autocomplete: true }"
                                    class="w-full"
                                />
                            </template>

                            <!-- Caso di default (input txt) -->
                            <template v-else>
                                <InputText v-model="field.model" v-bind="field.bind || {}" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                            </template>
                            
                        </Field>

                    </div>
                </div>
            </div>

            <!-- Sezione dei bottoni -->
            <div class="flex justify-end gap-2 mt-8">
                <Button
                    :aria-label="$t(btnSave?.label)"
                    :label="$t(btnSave?.label)"
                    :icon="btnSave?.icon"
                    type="submit"
                    class="w-full"
                />
            </div>

        </Form>

    </BlockUI>
</template>

<script setup>

    // Basic imports
    import { ref, onMounted, computed } from 'vue';

    // Services imports
    import { formatFormModelValues } from "@/helpers/form.js";
    import DateServices from '@/helpers/date';

    // definisco le props
    const props = defineProps({
        fields: {
            type: Object,
            required: true
        },
        styleType: {
            type: String,
            default: "default",
            validator: (value) => {
                return ["default", "grid"].includes(value);
            },
            required: false
        },
        tKey: {
            type: String,
            required: false,
            default: null
        },
        blocked: {
            type: Boolean,
            required: false,
            default: false
        },
        btnSave: {
            type: Object,
            required: false,
            default: {
                icon: null,
                label: 'general.save'
            }
        }
    });

    // definisco gli emits
    const emits = defineEmits(['submit']);

    // definisco una variabile per tenere traccia degli errori
    const errorFormatter = ref(false);

    // definisco una variabile locale per il dato
    const localData = ref(formatFormModelValues(props?.fields) || {});

    // dichiaro un computed per lo style in base a props.styleType
    const styleComputed = computed(() => {
        switch (props.styleType) {
            case "grid":
                return "grid grid-cols-auto-fill-400 items-center justify-center gap-10";
            default:
                return "space-y-4";
        }
    });

    // definisco una funzione per salvare le modifiche (emetto evento)
    const onSaveEdit = (event) => {
        try {

            // formatto tutte le date in event, se presenti in localData.value e col type calendar
            for (const key in localData.value) {
                if (localData.value[key].type === 'calendar') {
                    event[key] = DateServices.formatDateValue(event[key]);
                    localData.value[key].model = event[key];
                }
            }

            // setto l'oggetto 
            const obj = {
                "event": event,
                "value": localData.value
            };
      
            // emetto l'evento onSave
            emits('submit', obj);

        } catch (error) {
            console.error('Error in onSaveEdit', error);
        }
    };

    // definisco una funzione da esporre per aggiornare un singolo campo
    const onUpdateField = (key, value, updateKeys = ['model']) => {
        try {

            if (!localData.value.hasOwnProperty(key)) {
                throw new Error(`Key '${key}' does not exist in localData.value`);
            }

            let target = localData.value[key];

            // Usa reduce per attraversare le chiavi tranne l'ultima
            target = updateKeys.slice(0, -1).reduce((acc, currentKey) => {
                if (!acc.hasOwnProperty(currentKey)) {
                    throw new Error(`Key '${currentKey}' does not exist in the path`);
                }
                return acc[currentKey];
            }, target);

            const lastKey = updateKeys[updateKeys.length - 1];
            if (!target.hasOwnProperty(lastKey)) {
                throw new Error(`Key '${lastKey}' does not exist in the final target`);
            }

            // Imposta il valore all'ultima chiave
            target[lastKey] = value;
        } catch (error) {
            console.error(error.message);
        }
    };

    // get Fields model
    const getFieldsModel = (key) => {
        return localData.value.hasOwnProperty(key) ? localData.value[key].model : null;
    };

    // hook per validare props.fields
    onMounted(async () => {
        try {

            // valido props.fields
            if(!localData){
                throw new Error("Invalid fields");
            }

        } catch (error) {
            errorFormatter.value = true;
        }
    });

    // esporto le variabili
    defineExpose({
        onUpdateField,
        getFieldsModel
    });

</script>