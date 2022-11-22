<template>
    <div class="flex player-song">
        <!-- <img alt class="w-11 h-11 rounded cursor-pointer" :src="song.al?.picUrl || opticalDisk" /> -->
        <div class="w-11 h-11 rounded" v-show="!isLyric">
            <cover-play
                :picUrl="song.al?.picUrl || opticalDisk"
                icon="double-up"
                noTransY
                iconSize="18"
                name="展开歌曲详情页"
                @click="showLyricsDetail"
            ></cover-play>
        </div>
        <div class="ml-2 text-xs flex flex-col justify-between">
            <div class="w-52 2xl:w-96 cursor-pointer truncate" v-show="!isLyric">
                <div class="flex">
                    <div
                        v-if="songUrl.freeTrialInfo?.end>0"
                        class="bg-red-500 text-xs text-white rounded px-0.5 scale-75"
                    >试听</div>
                    <span>{{ song.name || '开源云音乐' }}</span>
                    <span class="ml-2 text-dc">- {{ head(song.ar)?.name || `ElectronVueMusic` }}</span>
                </div>
            </div>
            <div class="flex gap-x-3 text-main">
                <icon-park
                    type="Like"
                    size="18"
                    :stroke-width="3"
                    class="text-slate-400 hover-like no-drag"
                    :class="{'icon-like':isLyric}"
                    title="我喜欢"
                ></icon-park>
                <icon-park
                    type="DownTwo"
                    size="18"
                    :stroke-width="3"
                    class="text-slate-400 hover-text no-drag"
                    :class="{'icon-button':isLyric}"
                    title="下载该歌曲"
                ></icon-park>
                <icon-park
                    type="MoreTwo"
                    size="18"
                    :stroke-width="3"
                    :class="{'icon-button':isLyric}"
                    class="text-slate-400 hover-text no-drag"
                    title="更多"
                ></icon-park>
                <el-badge :value="1000" :max="999" class="badge no-drag">
                    <icon-park
                        type="Comment"
                        size="18"
                        :stroke-width="3"
                        class="text-slate-400 hover-text"
                        :class="{'icon-button':isLyric}"
                        title="评论"
                    ></icon-park>
                </el-badge>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, defineAsyncComponent } from "@vue/runtime-core";
import images from "@/utils/images";
import { useStore } from "vuex";
import { SONG_URL, SONG } from "@utils/getters";
import { SET_SHOW_LYRICS_DETAIL } from "@utils/mutations";
import { head } from "lodash";

export default {
    name: "ThePlayerSong",
    props: {
        isLyric: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
    },
    setup() {
        const store = useStore();

        const song = computed(() => store.getters[SONG]);
        const songUrl = computed(() => store.getters[SONG_URL]);

        const showLyricsDetail = () => {
            store.commit(SET_SHOW_LYRICS_DETAIL, true);
        };

        return {
            song,
            songUrl,
            opticalDisk: images.GHOST_BLADE,
            head,
            showLyricsDetail,
        };
    },
};
</script>

<style lang="scss">
.player-song {
    .badge {
        .el-badge__content {
            @apply scale-75 left-1 bg-stone-100 text-slate-500 bg-opacity-80 right-auto;
            @apply dark:bg-stone-900;
        }
    }
}
</style>

<style lang="scss" scoped>
.mask {
    @apply absolute inset-0 bg-black bg-opacity-0 transition-all duration-500;
}

.icon-like {
    @apply text-down;
    @apply hover:text-like;
}

.icon-button {
    @apply text-down;
    @apply hover:text-emerald-400;
}
</style>