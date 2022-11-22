<template>
    <div class="player-volume flex flex-col items-center pt-2 no-drag">
        <el-slider
            vertical
            height="100px"
            :show-tooltip="false"
            v-model="volume"
            size="small"
            :disabled="muted"
            @input="setVolume"
        />
        <div class="text-sm mt-3">{{ volume }}</div>
        <div class="mt-2">
            <icon-park
                v-show="muted"
                type="VolumeMute"
                size="16"
                theme="filled"
                class="hover-text"
                @click="toggleMuted"
            ></icon-park>
            <icon-park
                v-show="!muted"
                type="VolumeSmall"
                size="16"
                theme="filled"
                class="hover-text"
                @click="toggleMuted"
            ></icon-park>
        </div>
    </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { MUTED, RECORD_VOLUME, IS_PAUSE } from "@utils/getters";
import {
    SET_MUTED,
    SET_VOLUME,
    SET_RECORD_VOLUME,
    SET_FADE_VOLUME,
} from "@utils/mutations";

export default {
    name: "ThePlayerVolumeSlider",
    setup() {
        const store = useStore();

        const volume = computed({
            get: () => store.getters[RECORD_VOLUME],
            set: (val) => {
                store.commit(SET_RECORD_VOLUME, val);
                store.commit(SET_VOLUME, val);
                // if (store.getters[IS_PAUSE]) return;
                store.commit(SET_FADE_VOLUME, val);
            },
        });

        const muted = computed({
            get: () => store.getters[MUTED],
            set: (val) => {
                store.commit(SET_MUTED, val);
            },
        });

        const setVolume = (n) => {
            n = n > 100 ? 100 : n;
            n = n < 0 ? 0 : n;
            volume.value = n;
        };

        const toggleMuted = () => {
            muted.value = !muted.value;
        };
        return {
            volume,
            muted,
            setVolume,
            toggleMuted,
        };
    },
};
</script>

<style>
</style>