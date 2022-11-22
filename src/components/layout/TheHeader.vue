<template>
    <div class="flex items-center justify-between drag h-14 bg-view" ref="headerRef">
        <div class="flex items-center pl-5">
            <icon-park
                type="Left"
                :size="iconSize"
                :stroke-width="2"
                class="icon-button no-drag"
                @click="handleRoute('back')"
            ></icon-park>
            <icon-park
                type="Right"
                :size="iconSize"
                :stroke-width="2"
                class="icon-button no-drag"
                @click="handleRoute('go')"
            ></icon-park>
            <div class="search no-drag ml-2">
                <the-search></the-search>
            </div>
        </div>
        <div class="flex items-center mr-5">
            <the-user-info></the-user-info>
            <icon-park type="Mail" :stroke-width="2" class="icon-button no-drag"></icon-park>
            <icon-park
                type="Platte"
                :stroke-width="2"
                class="icon-button no-drag"
                @click="changeThemeMode"
            ></icon-park>
            <icon-park type="HamburgerButton" :stroke-width="2" class="icon-button no-drag"></icon-park>
            <el-divider direction="vertical" />
            <icon-park
                type="minus"
                :stroke-width="2"
                class="icon-button no-drag"
                title="最小化"
                @click="handleOper('mini')"
            ></icon-park>
            <icon-park
                type="square"
                :stroke-width="2"
                class="icon-button no-drag"
                :title="`最${windowIsMax?'小':'大'}化`"
                @click="handleOper('max')"
            ></icon-park>
            <icon-park
                type="close"
                :stroke-width="2"
                class="icon-button no-drag"
                title="关闭"
                @click="handleOper('close')"
            ></icon-park>
        </div>
    </div>
</template>

<script>
import {
    defineAsyncComponent,
    computed,
    ref,
    onMounted,
} from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { windowChangeTHemeColor } from "@utils/plugins";
import { useStore } from "vuex";
import {
    SET_DARK_THEME,
    SET_WINDOW_IS_MAX,
    SET_WINDOW_HEIGHT,
    SET_WINDOW_WIDTH,
    SET_HEADER_HEIGHT,
} from "@utils/mutations";
import { WINDOW_IS_MAX } from "@utils/getters";
import {
    windowHide,
    windowMini,
    windowMaxMin,
    listenWindowMaxMin,
} from "@utils/plugins";
import { BrowserWindow } from "@electron/remote";
import { useWindowSize, useTimeoutFn } from "@vueuse/core";

export default {
    name: "TheHeader",
    components: {
        TheSearch: defineAsyncComponent(() =>
            import("@/components/layout/TheSearch.vue")
        ),
        TheUserInfo: defineAsyncComponent(() =>
            import("@/components/layout/TheUserInfo.vue")
        ),
    },
    setup() {
        const iconSize = 22;

        const router = useRouter();

        const store = useStore();

        const handleRoute = (type) => {
            switch (type) {
                case "back":
                    router.back();
                    break;
                case "go":
                    router.go(1);
                    break;
            }
        };

        const changeThemeMode = () => {
            store.commit(SET_DARK_THEME, windowChangeTHemeColor().value);
        };

        const handleOper = (type) => {
            const currId = BrowserWindow.getFocusedWindow().id;
            switch (type) {
                case "mini":
                    windowMini();
                    break;
                case "max":
                    windowMaxMin(currId);
                    break;
                case "close":
                    windowHide(currId);
                    break;
            }
        };

        const { start } = useTimeoutFn(() => {
            const { height, width } = useWindowSize();
            store.commit(SET_WINDOW_HEIGHT, height);
            store.commit(SET_WINDOW_WIDTH, width);
        });

        listenWindowMaxMin((res) => {
            store.commit(SET_WINDOW_IS_MAX, res);
            start();
        });

        const headerRef = ref(null);

        onMounted(() => {
            store.commit(SET_HEADER_HEIGHT, headerRef.value.offsetHeight);
        });

        return {
            iconSize,
            handleRoute,
            changeThemeMode,
            handleOper,
            windowIsMax: computed(() => store.getters[WINDOW_IS_MAX]),
            headerRef,
        };
    },
};
</script>

<style lang="scss" scoped>
.search {
    @apply text-xs;
    :deep(.el-input__wrapper) {
        @apply rounded-full text-xs bg-[#e4e4e4] dark:bg-[#333334];
    }
}

.icon-button {
    @apply p-2 cursor-pointer;
    @apply hover:text-emerald-400;
}
</style>