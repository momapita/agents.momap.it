<template>
    <div class="flex flex-wrap gap-4 items-center justify-start w-full" v-if="Array.isArray(items) && items.length > 0">
        <Button 
            v-for="(item, index) in items"
            :key="index"
            v-bind="(item?.type in mapArrType) && mapArrType[item?.type]?.bind ? mapArrType[item?.type]?.bind : null"
            @click="item?.action"
            :class="$style.headerButtonTable"
        >
            <span class="material-symbols-outlined material-symbols-font-300"> {{ mapArrType[item?.type]?.icon }} </span>

            <span class="font-semibold tracking-wide">
                {{ item?.label ? (Array.isArray(item?.label) ? item?.label.map(el => $t(el)).join(' ') : $t(item?.label)) : $t(mapArrType[item?.type]?.label) }}
            </span>
        </Button>
    </div>
    <div v-else></div>
</template>

<script setup>

    // based imports
    import { ref } from 'vue';

    // services imports
    import { isMobile } from 'mobile-device-detect';

    // definisco le props
    const props = defineProps({
        items : {
            type: Array,
            default: () => [],
            required: true
        }
    });

    const mapArrType = ref(
        {
            add: {
                icon: 'add',
                label: 'general.add',
                bind: {
                    severity: "success",
                    outlined: false,
                    size: "small",
                    fluid: isMobile
                }
            },
            delete: {
                icon: 'cancel',
                label: 'general.delete',
                bind: {
                    severity: "danger",
                    outlined: false,
                    size: "small",
                    fluid: isMobile
                }
            },
            export: {
                icon: 'download',
                label: 'general.export',
                bind: {
                    severity: "warn",
                    outlined: false,
                    size: "small",
                    fluid: isMobile
                }
            },
            share: {
                icon: 'ios_share',
                label: 'general.share',
                bind: {
                    severity: "help",
                    outlined: false,
                    size: "small",
                    fluid: isMobile
                }
            },
        }
    );

</script>

<style module>
    .headerButtonTable {
        padding: 0.40rem 0.75rem !important;
    }
</style>