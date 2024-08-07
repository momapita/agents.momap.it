<template>
    <div :class="{ 'flex items-center justify-start gap-2': referenceState != 'contextMenu' }">
        
        <!-- Confirm Popup -->
        <ConfirmPopup group="headless">
            <template #container="{ message: objectsArr, acceptCallback, rejectCallback }">
                <div class="rounded p-4">

                    <!-- Message -->
                    <span>
                        {{ $te(`${objectsArr?.message?.label}`) ? $t(`${objectsArr?.message?.label}`) : 'Sei sicuro di voler effettuare questa azione?' }}
                    </span>

                    <!-- Buttons -->
                    <div class="flex items-center gap-2 mt-4">
                        <Button :label="$t(objectsArr?.message?.acceptLabel)" @click="acceptCallback" severity="success" size="small" class="flex-1"></Button>
                        <Button :label="$t(objectsArr?.message?.rejectLabel)" @click="rejectCallback" severity="danger" size="small" class="flex-1"></Button>
                    </div>

                </div>
            </template>
        </ConfirmPopup>

        <!-- Sezione se il type è default -->
        <section
            v-if="type === 'default' && Array.isArray(items) && items.length > 0"
            class="my-1 p-2 cursor-pointer text-sm"
            v-for="(item, index) in items" :key="index"
        >
            <div
                v-if="item?.type && typeof mapArrType === 'object' && (item?.type in mapArrType)"
                class="flex items-center justify-start gap-2"
                @click="('requireConfirm' in mapArrType[item?.type]) ? showConfirm($event,item) : item?.action(objRow)"
                v-tooltip.top="referenceState != 'contextMenu' ? { value: item?.label ? (Array.isArray(item?.label) ? item?.label.map(el => $t(el)).join(' ') : $t(item?.label)) : $t(mapArrType[item?.type]?.label) } : null"
            >
                
                <!-- Icona -->
                <span class="material-symbols-outlined material-symbols-font-300" :class="mapArrType[item?.type]?.color"> {{ mapArrType[item?.type]?.icon }} </span>
                
                <!-- Label -->
                <span v-if="referenceState === 'contextMenu'">
                    {{ item?.label ? (Array.isArray(item?.label) ? item?.label.map(el => $t(el)).join(' ') : $t(item?.label)) : $t(mapArrType[item?.type]?.label) }}
                </span>

            </div>

        </section>
        
    </div>
</template>

<script setup>

    // based imports
    import { ref } from 'vue';

    // services imports
    import { useConfirm } from "primevue/useconfirm";

    // definisco il servizio di confirm
    const confirm = useConfirm();

    // definisco le props
    const props = defineProps({
        type : {
            type: String,
            default: 'default',
            validator : (value) => {
                return ["default", "compact"].includes(value);
            }
        },
        items : {
            type: Array,
            default: () => [],
            required: true
        },
        objRow : {
            type: Object,
            default: () => {},
            required: false
        },
        referenceState : {
            type: String,
            default: 'contextMenu',
            validator : (value) => {
                return ["contextMenu", "cols"].includes(value);
            }
        }
    });

    // definisco il modello per i pulsanti
    const mapArrType = ref(
        {
            edit: {
                icon: 'edit',
                color: 'text-green-500',
                label: 'general.edit',
            },
            delete: {
                icon: 'cancel',
                color: 'text-red-500',
                label: 'general.delete',
                requireConfirm: {
                    label: 'general.delete_confirm',
                    acceptLabel: 'general.yes',
                    rejectLabel: 'general.no'
                }
            },
            export: {
                icon: 'download',
                color: 'text-orange-500',
                label: 'general.export',
            },
            share: {
                icon: 'ios_share',
                color: 'text-purple-500',
                label: 'general.share',
            },
        }
    );

    const showConfirm = (event, item) => {
        confirm.require({
            target: event.currentTarget,
            group: 'headless',
            message: { ...mapArrType.value[item?.type]?.requireConfirm},
            accept: () => item?.action(props.objRow)
        });
    }

</script>