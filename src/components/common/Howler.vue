<template></template>

<script>
import { ref, onMounted, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
    URL,
    VOLUME,
    IS_PLAYING,
    MUTED,
    SLIDER_INPUT,
    SLIDER_TIME,
    LOOP_TYPE,
    RECORD_VOLUME,
} from "@utils/getters";
import {
    SET_IS_PLAYING,
    SET_IS_PAUSE,
    SET_CURRENT_TIME,
    SET_DURATION,
    SET_ENDED,
    SET_SLIDER_INPUT,
} from "@utils/mutations";
import { useIntervalFn } from "@vueuse/core";
import { NEXT, RANDOM_PLAY } from "@utils/actions";

export default {
    name: "Howler",
    setup() {
        const store = useStore();

        const HowlConstructor = ref(null);
        let sound = ref(null);

        const { pause, resume } = useIntervalFn(() => {
            if (sound.value) {
                store.commit(SET_CURRENT_TIME, sound.value.seek());
            }
        }, 1000);

        import("howler").then((mod) => {
            HowlConstructor.value = mod.Howl;

            sound.value = new HowlConstructor.value({
                src: [store.getters[URL]],
                volume: store.getters[VOLUME] / 100,
                onload: onLoad,
                onplay: onPlay,
                onend: onEnd,
                onstop: onStop,
                onpause: onPause,
                onfade: onFade,
                loop: store.getters[LOOP_TYPE] === 0,
            });
        });

        watch(
            () => store.getters[URL],
            (val) => {
                if (
                    HowlConstructor &&
                    HowlConstructor.value &&
                    sound &&
                    sound.value
                ) {
                    sound.value = new HowlConstructor.value({
                        src: [val],
                        volume: store.getters[VOLUME] / 100,
                        onload: onLoad,
                        onplay: onPlay,
                        onend: onEnd,
                        onstop: onStop,
                        onpause: onPause,
                        onfade: onFade,
                        onseek: onSeek,
                        loop: store.getters[LOOP_TYPE] === 0,
                    });

                    if (store.getters[IS_PLAYING]) {
                        sound.value.stop();
                    }

                    store.commit(SET_IS_PLAYING, true);

                    // sound.value.play();
                }
            }
        );

        const onLoad = function () {
            if (sound.value) {
                store.commit(SET_DURATION, sound.value.duration());
            }
        };

        const onPlay = () => {
            handlePlayStatus();
        };

        const onEnd = () => {
            handlePlayStatus();
            playEnd();
        };

        const onStop = () => {
            handlePlayStatus();
        };

        const onPause = () => {
            handlePlayStatus();
        };

        const onFade = () => {
            if (!store.getters[IS_PLAYING]) {
                if (sound.value) {
                    sound.value.pause();
                }
            }
        };

        const onSeek = () => {
            store.commit(SET_SLIDER_INPUT, false);
        };

        const handlePlayStatus = () => {
            if (sound.value) {
                store.commit(SET_IS_PLAYING, sound.value.playing());
                console.log(store.getters[IS_PLAYING])
                store.commit(SET_IS_PAUSE, !sound.value.playing());
                store.commit(SET_ENDED, !sound.value.playing());
            }
        };

        const playEnd = () => {
            console.log("播放结束");
            switch (store.getters[LOOP_TYPE]) {
                case 0:
                    handleLoop(true);
                    break;
                case 1:
                    store.dispatch(NEXT);
                    break;
                case 2:
                    store.dispatch(RANDOM_PLAY);
                    break;
            }
        };

        const handleLoop = (flag) => {
            if (sound.value) {
                sound.value.loop(flag);
            }
        };

        const fadeInOut = (from = 0, to = 1, duration = 1000) => {
            if (sound.value) {
                sound.value.fade(from, to, duration);
            }
        };

        watch(
            () => store.getters[IS_PLAYING],
            (val) => {
                console.log(val);
                if (val) {
                    if (sound.value) {
                        sound.value.play();
                    }
                    fadeInOut(0, store.getters[RECORD_VOLUME] / 100);
                    resume();
                } else {
                    fadeInOut(store.getters[RECORD_VOLUME] / 100, 0);
                    pause();
                }
            }
        );

        watch(
            () => store.getters[SLIDER_INPUT],
            (val) => {
                if (sound.value) {
                    sound.value.seek(store.getters[SLIDER_TIME]);
                }
                if (val) {
                    pause();
                } else {
                    resume();
                }
            }
        );

        // watch(
        //     () => store.getters[SLIDER_TIME],
        //     (val) => {
        //         console.log(val);
        //         if (sound.value) {
        //             sound.value.seek(val);
        //         }
        //         store.commit(SET_SLIDER_INPUT, false);
        //     }
        // );

        watch(
            () => store.getters[VOLUME],
            (val) => {
                if (sound.value) {
                    sound.value.volume(val / 100);
                }
            }
        );

        watch(
            () => store.getters[MUTED],
            (val) => {
                if (sound.value) {
                    sound.value.mute(val);
                }
            }
        );

        watch(
            () => store.getters[LOOP_TYPE],
            (val) => {
                handleLoop(val === 0);
            }
        );
    },
};
</script>

<style>
</style>