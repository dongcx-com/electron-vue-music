<template>
    <el-header height="60px" class="flex items-center justify-between">
        <icon-park
            type="down"
            size="30"
            :stroke-width="2"
            class="icon-button no-drag"
            @click="handleShow"
            title="收起歌曲详情页"
        ></icon-park>
        <div class="flex items-center">
            <icon-park
                type="full-screen-one"
                size="16"
                :stroke-width="3"
                class="icon-button no-drag"
                title="全屏"
                @click="handleOper('full')"
                v-show="!windowIsFullScreen"
            ></icon-park>
            <icon-park
                type="off-screen-one"
                size="16"
                :stroke-width="3"
                class="icon-button no-drag"
                title="还原"
                @click="handleOper('full')"
                v-show="windowIsFullScreen"
            ></icon-park>
            <icon-park
                type="minus"
                :stroke-width="3"
                class="icon-button ml-4 no-drag"
                title="最小化"
                @click="handleOper('mini')"
                v-show="!windowIsFullScreen"
            ></icon-park>
            <icon-park
                type="square"
                :stroke-width="3"
                class="icon-button ml-4 no-drag"
                :title="`最${windowIsMax?'小':'大'}化`"
                @click="handleOper('max')"
                v-show="!windowIsFullScreen"
            ></icon-park>
            <icon-park
                type="close"
                :stroke-width="3"
                class="icon-button ml-4 no-drag"
                title="关闭"
                @click="handleOper('close')"
                v-show="!windowIsFullScreen"
            ></icon-park>
        </div>
    </el-header>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
    windowHide,
    windowMini,
    windowMaxMin,
    listenWindowMaxMin,
    windowFullScreen,
    listenWindowFullScreen,
} from "@utils/plugins";
import { BrowserWindow } from "@electron/remote";
import { WINDOW_IS_MAX, FULL_SCREEN } from "@utils/getters";
import {
    SET_WINDOW_IS_MAX,
    SET_WINDOW_HEIGHT,
    SET_FULL_SCREEN,
    SET_WINDOW_WIDTH,
} from "@utils/mutations";
import { useWindowSize, useTimeoutFn } from "@vueuse/core";

export default {
    name: "TheLyricHeader",
    emits: ["handleShow"],
    setup(props, { emit }) {
        const store = useStore();

        const handleShow = () => {
            emit("handleShow", false);
        };

        const handleOper = (type) => {
            let currId = BrowserWindow.getFocusedWindow().id;
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
                case "full":
                    windowFullScreen(currId);
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

        listenWindowFullScreen((res) => {
            store.commit(SET_FULL_SCREEN, res);
            start();
        });

        return {
            handleShow,
            handleOper,
            windowIsMax: computed(() => store.getters[WINDOW_IS_MAX]),
            windowIsFullScreen: computed(() => store.getters[FULL_SCREEN]),
        };
    },
};
</script>

<style lang="scss" scoped>
.icon-button {
    @apply text-down cursor-pointer;
    @apply hover:text-emerald-400;
}
</style>