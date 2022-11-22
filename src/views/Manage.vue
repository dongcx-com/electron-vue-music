<template>
    <el-container class="common-layout">
        <el-aside width="auto">
            <the-aside></the-aside>
        </el-aside>
        <el-main>
            <el-container>
                <el-header height="auto">
                    <the-header></the-header>
                </el-header>
                <el-main>
                    <el-scrollbar class="scrollbar" @scroll="scroll">
                        <router-view v-slot="{ Component }">
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </router-view>
                    </el-scrollbar>
                </el-main>
                <el-footer height="auto">
                    <the-footer></the-footer>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
    <the-play-list></the-play-list>
    <the-lyrics-drawer></the-lyrics-drawer>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";
import { useWindowSize, useTimeoutFn } from "@vueuse/core";
import { useStore } from "vuex";
import {
    SET_WINDOW_HEIGHT,
    SET_WINDOW_WIDTH,
    SET_SCROLL_TOP,
} from "@utils/mutations";

export default {
    name: "Manage",
    components: {
        TheAside: defineAsyncComponent(() =>
            import("@/components/layout/TheAside.vue")
        ),
        TheHeader: defineAsyncComponent(() =>
            import("@/components/layout/TheHeader.vue")
        ),
        TheFooter: defineAsyncComponent(() =>
            import("@/components/layout/TheFooter.vue")
        ),
        ThePlayList: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayList.vue")
        ),
        TheLyricsDrawer: defineAsyncComponent(() =>
            import("@/components/layout/TheLyricsDrawer.vue")
        ),
    },
    setup() {
        const store = useStore();

        const { start } = useTimeoutFn(() => {
            const { height, width } = useWindowSize();
            store.commit(SET_WINDOW_HEIGHT, height);
            store.commit(SET_WINDOW_WIDTH, width);
        });

        start();

        const scroll = ({ scrollLeft, scrollTop }) => {
            store.commit(SET_SCROLL_TOP, scrollTop);
        };

        return {
            scroll,
        };
    },
};
</script>

<style scoped lang="scss">
.common-layout {
    height: calc(100vh);
}

.common-layout .el-aside {
    // background-color: #f9fafb;
    color: var(--el-text-color-primary);
    text-align: center;
}

.common-layout .el-main {
    @apply bg-white;
    @apply dark:bg-[#1e1e1f];
    color: var(--el-text-color-primary);
    padding: 0;
}

.common-layout .el-header {
    padding: 0;
}

.common-layout .el-footer {
    padding: 0;
}

.scrollbar {
    height: calc(100vh - 136px);
}
</style>

<style lang="scss">
.el-overlay {
    -webkit-app-region: no-drag !important;
}

.el-drawer {
    -webkit-app-region: no-drag !important;
}
</style>