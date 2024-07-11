<template>
    <div class="fixed z-50 w-[95%] h-14 lg:h-16 lg:max-w-2xl -translate-x-1/2 bg-white border rounded-t-3xl bottom-0 left-1/2 dark:border-totalGray dark:bg-totalGray">
        <div class="grid h-full lg:max-w-2xl grid-cols-5 mx-auto items-center justify-center">

            <!-- Renderizzo i vari elementi -->
            <div
                v-for="item in navigationList"
                :key="item?.title"
                class="flex items-center justify-center cursor-pointer"
                v-tooltip.top="{ value: item?.title }"
            >
                <span class="material-symbols-outlined material-symbols-font-300 !text-2xl" :class="item?.class"> {{ item.icon }} </span>
            </div>

            <!-- Bottone tema -->
            <ToggleTheme />

        </div>
    </div>
</template>

<script setup>

    // based imports
    import { ref } from 'vue';

    // components imports
    import ToggleTheme from '@/components/reusable/ToggleTheme.vue';

    // dichiaro un oggetto per la lista della navigazione
    const navigationList = ref([
        {
            title: "Home",
            icon: "home"
        },
        {
            title: "Bilancio Ordini",
            icon: "account_balance_wallet"
        },
        {
            title: "Aggiungi Ordine",
            icon: "add",
            class: "bg-green-500 text-white rounded-full h-10 w-10 !flex items-center justify-center"
        },
        {
            title: "Impostazioni Account",
            icon: "manage_accounts"
        }
    ]);

</script>