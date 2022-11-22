<template>
    <audio ref="musicRef"></audio>
</template>

<script>
import { ref, onMounted, watch } from "@vue/runtime-core";
import { useMediaControls } from "@vueuse/core";
import { useStore } from "vuex";
import {
    URL,
    VOLUME,
    IS_PLAYING,
    MUTED,
    SLIDER_INPUT,
    SLIDER_TIME,
    LOOP_TYPE,
    CURRENT_TIME,
} from "@utils/getters";
import {
    SET_IS_PLAYING,
    SET_IS_PAUSE,
    SET_CURRENT_TIME,
    SET_DURATION,
    SET_ENDED,
    SET_SLIDER_INPUT,
} from "@utils/mutations";
import { RE_PLAY, NEXT } from "@utils/actions";
import { useTimeoutFn } from "@vueuse/core";
import { toggleThumbarPlayButton } from "@utils/plugins";

export default {
    name: "TheAudio",
    setup() {
        const store = useStore();

        const musicRef = ref(null);

        const { playing, currentTime, duration, volume, ended, muted } =
            useMediaControls(musicRef, {
                src: store.getters[URL],
            });

        watch(
            () => store.getters[URL],
            (url) => {
                musicRef.value.src = url;
            }
        );

        watch(playing, (val) => {
            store.commit(SET_IS_PLAYING, val);
            store.commit(SET_IS_PAUSE, !val);
            if (val) {
                ended.value = !val;
            }
        });

        watch(
            () => store.getters[IS_PLAYING],
            (val) => {
                playing.value = val;
                toggleThumbarPlayButton(val);
            }
        );

        watch(
            () => store.getters[MUTED],
            (val) => {
                muted.value = val;
            }
        );

        watch(
            () => store.getters[VOLUME],
            (val) => {
                volume.value = val / 100;
            }
        );

        watch(
            () => store.getters[SLIDER_TIME],
            (val) => {
                currentTime.value = val;
                store.commit(SET_SLIDER_INPUT, false);
            }
        );

        watch(currentTime, (val) => {
            const isPlaying = store.getters[IS_PLAYING];
            const sliderInput = store.getters[SLIDER_INPUT];
            if (isPlaying && !sliderInput) {
                store.commit(
                    SET_CURRENT_TIME,
                    parseInt(currentTime.value.toString())
                );
                store.commit(SET_DURATION, parseInt(duration.value.toString()));
            }
        });

        watch(
            () => store.getters[CURRENT_TIME],
            (val) => {
                if (val === 0) {
                    currentTime.value = val;
                }
            }
        );

        watch(ended, (val) => {
            store.commit(SET_ENDED, val);
            if (!ended.value) return;
            playEnd();
        });

        const playEnd = () => {
            console.log("播放结束");
            switch (store.getters[LOOP_TYPE]) {
                case 0:
                    rePlay();
                    break;
                case 1:
                    store.dispatch(NEXT);
                    break;
                case 2:
                    store.dispatch(RANDOM_PLAY);
                    break;
            }
        };

        const rePlay = () => {
            const { start } = useTimeoutFn(() => {
                store.dispatch(RE_PLAY);
            }, 1500);

            start();
        };

        onMounted(() => {
            volume.value = store.getters[VOLUME] / 100;
            muted.value = store.getters[MUTED];
        });

        return {
            musicRef,
        };
    },
};
</script>

<style>
</style>