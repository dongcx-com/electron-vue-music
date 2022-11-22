<template>
    <div class="player-slider no-drag" :class="{'lyric-slider':isLyric}" ref="sliderRef">
        <el-slider
            :show-tooltip="false"
            :min="0"
            v-model="currentTime"
            :max="duration"
            @change="handleSliderChange"
            @input="handleSliderInput"
            @click="handleSliderClick"
        />
    </div>
</template>

<script>
import { computed, ref, watch, toRefs } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
    CURRENT_TIME,
    DURATION,
    WINDOW_WIDTH,
    ASIDE_WIDTH,
} from "@utils/getters";
import {
    SET_CURRENT_TIME,
    SET_SLIDER_INPUT,
    SET_SLIDER_TIME,
} from "@utils/mutations";
import { useCssVar } from "@vueuse/core";

export default {
    name: "ThePlayerSlider",
    props: {
        isLyric: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const { isLyric } = toRefs(props);

        const store = useStore();

        const duration = computed(() => store.getters[DURATION]);

        const currentTime = computed({
            get: () => store.getters[CURRENT_TIME],
            set: (val) => {
                if (isNaN(val) || duration.value == 0) return;
                store.commit(SET_CURRENT_TIME, val);
            },
        });

        let isHowler = computed(() => process.env.VUE_APP_HOWLERJS == "true");

        // 使用鼠标拖曳时，只在松开鼠标后触发
        const handleSliderChange = (val) => {
            if (isNaN(val) || duration.value == 0) return;
            store.commit(SET_SLIDER_INPUT, false);
            store.commit(SET_SLIDER_TIME, val);
        };

        // 使用鼠标拖曳时，活动过程实时触发
        const handleSliderInput = (val) => {
            if (isNaN(val) || duration.value == 0) return;
            if (isHowler.value) {
                store.commit(SET_SLIDER_TIME, val);
            }
            store.commit(SET_SLIDER_INPUT, true);
        };

        const handleSliderClick = () => {
            if (duration.value == 0) return;
            store.commit(SET_SLIDER_TIME, currentTime.value);
            store.commit(SET_SLIDER_INPUT, false);
        };

        const sliderRef = ref(null);

        // watch(
        //     () => store.getters[WINDOW_WIDTH],
        //     (val) => {
        //         if (!isLyric.value) {
        //             const sliderVar = useCssVar("--slider-width", sliderRef);
        //             sliderVar.value = val - store.getters[ASIDE_WIDTH] + "px";
        //         }
        //     }
        // );

        return {
            currentTime,
            duration,
            sliderRef,
            handleSliderChange,
            handleSliderInput,
            handleSliderClick,
        };
    },
};
</script>

<style lang="scss">
.player-slider {
    // --slider-width: 804px;
    // width: var(--slider-width);

    .el-slider {
        height: 10px;

        .el-slider__runway,
        .el-slider__bar {
            height: 2px;
            border-radius: 0;
        }

        .el-slider__runway {
            //@apply bg-slate-50 dark:bg-stone-700 transition-all;
            //@apply hover:bg-stone-200 dark:hover:bg-stone-600;
        }

        .el-slider__button-wrapper {
            @apply opacity-0 transition-opacity;
            width: 10px;
            height: 10px;
            top: -10.5px;
        }

        &:hover {
            .el-slider__button-wrapper {
                @apply opacity-100;
            }
        }

        .el-slider__button {
            width: 8px;
            height: 8px;
            @apply bg-emerald-400;
        }
    }
}

.lyric-slider {
    .el-slider {
        .el-slider__runway {
            background-color: rgba(154, 162, 164, 0.15);
        }
    }
}
</style>