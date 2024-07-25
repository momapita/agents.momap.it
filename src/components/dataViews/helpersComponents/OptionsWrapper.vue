<template>
    <div :class="{ 'flex items-center justify-start gap-2': referenceState != 'contextMenu' }">
        
        <!-- Sezione se il type è default -->
        <section
            v-if="type === 'default' && Array.isArray(items) && items.length > 0"
            class="my-1 p-2 cursor-pointer text-sm"
            v-for="(item, index) in items" :key="index"
        >
            <div
                v-if="item?.type && typeof mapArrType === 'object' && (item?.type in mapArrType)"
                class="flex items-center justify-start gap-2"
                @click="item?.action(objRow)"
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

</script>