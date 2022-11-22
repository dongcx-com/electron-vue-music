<template>
    <div class="flex justify-end items-center gap-x-2.5">
        <span
            class="text-xs"
            :class="{'icon-button':isLyric}"
        >{{ useFormatDuring(currentTime) }} / {{ useFormatDuring(duration) }}</span>
        <icon-park
            type="TextMessage"
            size="18"
            :stroke-width="3"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            title="歌词"
        ></icon-park>
        <div class="flex items-center hover-text" @click="showPlayList">
            <icon-park
                type="MusicList"
                size="18"
                :stroke-width="3"
                class="hover-text no-drag"
                :class="{'icon-button':isLyric}"
                title="播放列表"
            ></icon-park>
            <span class="text-xs" :class="{'icon-button':isLyric}">{{ playListCount }}</span>
        </div>
    </div>
</template>

<script>
import { useFormatDuring } from "@utils/number";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { CURRENT_TIME, DURATION, PLAY_LIST } from "@utils/getters";
import { SET_SHOW_PLAY_LIST } from "@utils/mutations";

export default {
    name: "ThePlayerAction",
    props: {
        isLyric: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const store = useStore();

        const currentTime = computed(() => store.getters[CURRENT_TIME]); //当前播放时间
        const duration = computed(() => store.getters[DURATION]); //总播放时长

        const playListCount = computed(() => store.getters[PLAY_LIST].length);

        const showPlayList = () => {
            store.commit(SET_SHOW_PLAY_LIST, true);
        };
        return {
            useFormatDuring,
            currentTime,
            duration,
            playListCount,
            showPlayList,
        };
    },
};
</script>

<style lang="scss" scoped>
.icon-button {
    @apply text-down;
    @apply hover:text-emerald-400;
}
</style>