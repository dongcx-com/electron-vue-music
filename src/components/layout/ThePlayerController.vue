<template>
    <div class="flex items-center justify-center gap-x-3">
        <icon-park
            v-show="loopType===0"
            type="PlayOnce"
            size="20"
            :stroke-width="3"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            @click="toggleLoop"
            title="单曲循环"
        ></icon-park>
        <icon-park
            v-show="loopType===1"
            type="LoopOnce"
            size="20"
            :stroke-width="3"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            @click="toggleLoop"
            title="列表循环"
        ></icon-park>
        <icon-park
            v-show="loopType===2"
            type="ShuffleOne"
            size="20"
            :stroke-width="3"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            @click="toggleLoop"
            title="随机播放"
        ></icon-park>
        <icon-park
            type="GoStart"
            size="28"
            theme="filled"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            @click="prev"
            title="上一首"
        ></icon-park>
        <icon-park
            v-show="!isPause"
            type="PauseOne"
            size="45"
            theme="filled"
            class="hover-text text-emerald-400 no-drag"
            @click="togglePlay"
            title="暂停"
        ></icon-park>
        <icon-park
            v-show="isPause"
            type="Play"
            size="45"
            theme="filled"
            class="hover-text text-emerald-400 no-drag"
            @click="togglePlay"
            title="播放"
        ></icon-park>
        <icon-park
            type="GoEnd"
            size="28"
            class="hover-text no-drag"
            :class="{'icon-button':isLyric}"
            @click="next"
            title="下一首"
        ></icon-park>
        <el-popover placement="top" width="50px" trigger="click">
            <template #reference>
                <icon-park
                    v-if="!muted"
                    type="VolumeSmall"
                    size="20"
                    :stroke-width="3"
                    class="hover-text no-drag"
                    :class="{'icon-button':isLyric}"
                    :title="`音量:${currVolume}`"
                ></icon-park>
                <icon-park
                    v-if="muted"
                    type="VolumeMute"
                    size="20"
                    :stroke-width="3"
                    class="hover-text no-drag"
                    :class="{'icon-button':isLyric}"
                    title="音量:静音"
                ></icon-park>
            </template>
            <the-player-volume-slider></the-player-volume-slider>
        </el-popover>
    </div>
</template>

<script>
import { defineAsyncComponent, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
    LOOP_TYPE,
    SONG,
    IS_PLAYING,
    IS_PAUSE,
    MUTED,
    VOLUME,
} from "@utils/getters";
import { SET_LOOP_TYPE, SET_IS_PLAYING } from "@utils/mutations";
import { NEXT, PREV, FADE_OUT, FADE_IN } from "@utils/actions";
import {
    listenThumbarPrevButton,
    listenThumbarTogglePlayButton,
    listenThumbarNextButton,
} from "@utils/plugins";

export default {
    name: "ThePlayerController",
    props: {
        isLyric: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ThePlayerVolumeSlider: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayerVolumeSlider.vue")
        ),
    },
    setup() {
        const store = useStore();

        const loopType = computed({
            get: () => store.getters[LOOP_TYPE],
            set: (val) => {
                store.commit(SET_LOOP_TYPE, val);
            },
        });

        const muted = computed(() => store.getters[MUTED]);

        const isPause = computed(() => store.getters[IS_PAUSE]);

        const toggleLoop = () => {
            if (loopType.value == 2) {
                loopType.value = 0;
            } else {
                loopType.value++;
            }
        };

        const prev = () => {
            store.dispatch(PREV);
        };

        const togglePlay = () => {
            if (!store.getters[SONG].id) return;
            const isPlaying = store.getters[IS_PLAYING];
            let isHowler = computed(
                () => process.env.VUE_APP_HOWLERJS == "true"
            );
            if (!isHowler.value) {
                if (isPlaying) {
                    store.dispatch(FADE_OUT);
                } else {
                    store.dispatch(FADE_IN);
                }
            } else {
                store.commit(SET_IS_PLAYING, !isPlaying);
            }
        };

        const next = () => {
            store.dispatch(NEXT);
        };

        listenThumbarPrevButton(() => {
            prev();
        });

        listenThumbarTogglePlayButton(() => {
            togglePlay();
        });

        listenThumbarNextButton(() => {
            next();
        });

        return {
            loopType,
            isPause,
            muted,
            toggleLoop,
            prev,
            togglePlay,
            next,
            currVolume: computed(() => store.getters[VOLUME] + "%"),
        };
    },
};
</script>

<style lang="scss" scoped>
.icon-button {
    @apply text-white;
    @apply hover:text-emerald-400;
}
</style>