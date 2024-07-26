<template>
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
                            <Select v-model="field.model" v-bind="field.bind" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                        </template>

                        <!-- Caso in cui è una multiselect -->
                        <template v-else-if="field?.type === 'multiselect'">
                            <MultiSelect v-model="field.model" v-bind="field.bind" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                        </template>

                        <!-- Caso in cui è un Calendar -->
                        <template v-else-if="field?.type === 'calendar'">
                            <Calendar v-model="field.model" v-bind="field.bind || {}" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                        </template>

                        <!-- Caso in cui è un numero -->
                        <template v-else-if="field?.type === 'number'">
                            <InputNumber v-model="field.model" v-bind="field.bind || {}" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                        </template>

                        <!-- Caso in cui è un toggle -->
                        <template v-else-if="field?.type === 'toggle'">
                            <ToggleButton v-model="field.model" v-bind="field.bind || {}" class="w-full" />
                        </template>

                        <!-- Caso in cui è un textarea -->
                        <template v-else-if="field?.type === 'textarea'">
                            <Textarea v-model="field.model" v-bind="field.bind || {}" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
                        </template>

                        <!-- Caso in cui è una password -->
                        <template v-else-if="field?.type === 'password'">
                            <Password v-model="field.model" v-bind="field.bind || {}" :placeholder="$t(`${tKey}.${field?.placeholder}`)" class="w-full" />
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

</script>