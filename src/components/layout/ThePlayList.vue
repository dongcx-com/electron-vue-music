<template>
    <el-drawer
        v-model="showPlayList"
        direction="rtl"
        :with-header="false"
        size="320px"
        append-to-body
        :modal="false"
    >
        <div class="flex flex-col">
            <div class="p-2.5 flex-shrink-0 title" ref="drawerTitleRef">
                <div class="text-xl">播放队列</div>
                <div class="text-xs mt-1 flex justify-between items-center">
                    <div>{{ playListCount }} 首歌曲</div>
                    <div class="text-dc flex items-center hover-text" @click="clearPlayList">
                        <icon-park type="Delete" title="清空"></icon-park>
                        <!-- <span class="ml-0.5">清空</span> -->
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-hidden">
                <el-scrollbar class="scrollbar" ref="scrollbarRef">
                    <the-play-list-song-item
                        v-for="song in playList"
                        :key="song.id"
                        :song="song"
                        :privilege="find(privileges,['id', song.id])"
                        :active="song.id===id"
                        @dblclick="play(song.id)"
                    ></the-play-list-song-item>
                </el-scrollbar>
                <el-backtop :right="100" :bottom="100" />
            </div>
            <div class="w-full h-16 pt-2" ref="drawerFooterRef" @click="showPlayList=false">
                <div
                    class="w-full h-full border-t border-gray-200 flex items-center justify-end cursor-pointer icon-button"
                >
                    <icon-park type="MusicList" size="18" title="收起"></icon-park>
                    <span class="ml-0.5 text-xs">收起</span>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import {
    defineAsyncComponent,
    computed,
    ref,
    watch,
    nextTick,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import {
    SHOW_PLAY_LIST,
    PLAY_LIST,
    ID,
    WINDOW_HEIGHT,
    PRIVILEGES,
} from "@utils/getters";
import { PLAY, CLEAR_PLAY_LIST } from "@utils/actions";
import { SET_SHOW_PLAY_LIST } from "@utils/mutations";
import { useTimeoutFn, useCssVar } from "@vueuse/core";
import { find } from "lodash";

export default {
    name: "ThePlayList",
    components: {
        ThePlayListSongItem: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayListSongItem.vue")
        ),
    },
    setup() {
        const store = useStore();

        const showPlayList = computed({
            get: () => store.getters[SHOW_PLAY_LIST],
            set: (val) => {
                store.commit(SET_SHOW_PLAY_LIST, val);
            },
        });

        const playListCount = computed(() => store.getters[PLAY_LIST].length);

        const clearPlayList = () => {
            store.dispatch(CLEAR_PLAY_LIST);
        };

        const playList = computed(() => store.getters[PLAY_LIST]);

        const privileges = computed(() => store.getters[PRIVILEGES]);

        const id = computed(() => store.getters[ID]);

        const play = (id) => {
            store.dispatch(PLAY, id);
        };

        const drawerTitleRef = ref(null);

        const drawerFooterRef = ref(null);

        const scrollbarRef = ref(null);

        const titleHeight = ref(0);

        const footerHeight = ref(0);

        watch(
            () => store.getters[SHOW_PLAY_LIST],
            (val) => {
                if (val) {
                    nextTick(() => {
                        const { start } = useTimeoutFn(() => {
                            titleHeight.value =
                                drawerTitleRef.value.offsetHeight;
                            footerHeight.value =
                                drawerFooterRef.value.offsetHeight;
                            setScrollbarHeight();
                        });
                        start();
                    });
                }
            }
        );

        watch(
            () => store.getters[WINDOW_HEIGHT],
            () => {
                setScrollbarHeight();
            },
            { immediate: false }
        );

        const setScrollbarHeight = () => {
            const scrollbarHeight = useCssVar(
                "--scrollbarHeight",
                scrollbarRef
            );
            scrollbarHeight.value =
                store.getters[WINDOW_HEIGHT] -
                titleHeight.value -
                footerHeight.value -
                40 +
                "px";
        };

        return {
            showPlayList,
            playListCount,
            clearPlayList,
            playList,
            id,
            play,
            drawerTitleRef,
            drawerFooterRef,
            scrollbarRef,
            privileges,
            find,
        };
    },
};
</script>

<style lang="scss" scoped>
.scrollbar {
    --scrollbarHeight: 0px;
    height: var(--scrollbarHeight);
}

.icon-button {
    @apply text-down;
    @apply hover:text-emerald-400;
}
</style>