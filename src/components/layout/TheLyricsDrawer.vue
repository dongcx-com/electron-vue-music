<template>
    <el-drawer
        v-model="showLyricsDetail"
        direction="btt"
        size="100%"
        custom-class="lyric-drawer"
        :modal="false"
        :with-header="false"
    >
        <div class="w-screen h-screen drag main">
            <div
                class="w-full h-full absolute bg-optical-disk bg-img"
                :style="`background-image: url(${song.al?.picUrl|| images.GHOST_BLADE})`"
            ></div>
            <el-container class="w-full h-full bg-mask absolute z-10">
                <the-lyric-header @handleShow="(val)=>{showLyricsDetail = val}"></the-lyric-header>
                <el-main>
                    <the-lyric-content></the-lyric-content>
                </el-main>
                <el-footer height="auto">
                    <the-footer isLyric></the-footer>
                </el-footer>
            </el-container>
        </div>
    </el-drawer>
</template>

<script>
import { computed, defineAsyncComponent, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { SHOW_LYRICS_DETAIL, SONG, FULL_SCREEN } from "@utils/getters";
import { SET_SHOW_LYRICS_DETAIL } from "@utils/mutations";
import images from "@/utils/images";
import { windowFullScreen } from "@utils/plugins";
import { BrowserWindow } from "@electron/remote";

export default {
    name: "TheLyricsDrawer",
    components: {
        TheFooter: defineAsyncComponent(() =>
            import("@/components/layout/TheFooter.vue")
        ),
        TheLyricHeader: defineAsyncComponent(() =>
            import("@/components/layout/TheLyricHeader.vue")
        ),
        TheLyricContent: defineAsyncComponent(() =>
            import("@/components/layout/TheLyricContent.vue")
        ),
    },
    setup() {
        const store = useStore();

        const showLyricsDetail = computed({
            get: () => store.getters[SHOW_LYRICS_DETAIL],
            set: (val) => {
                store.commit(SET_SHOW_LYRICS_DETAIL, val);
            },
        });

        const song = computed(() => store.getters[SONG]);

        watch(
            () => store.getters[SHOW_LYRICS_DETAIL],
            (val) => {
                if (!val) {
                    if (store.getters[FULL_SCREEN]) {
                        const currId = BrowserWindow.getFocusedWindow().id;
                        windowFullScreen(currId);
                    }
                }
            }
        );

        return {
            showLyricsDetail,
            images,
            song,
        };
    },
};
</script>

<style lang="scss" scoped>
.main {
    overflow: hidden;
}

.bg-mask {
    background: rgba(17, 17, 17, 0.45);
}

.bg-img {
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(20px);
    transform: scale(1.5);
    background-position: 50%;
}

.bg-img::after {
    content: " ";
    display: block;
    width: 100%;
    height: 400rpx;
    z-index: 0;
}

.icon-button {
    @apply text-down cursor-pointer;
    @apply hover:text-emerald-400;
}
</style>

<style lang="scss">
.lyric-drawer {
    .el-drawer__body {
        padding: 0px;
    }
}
</style>