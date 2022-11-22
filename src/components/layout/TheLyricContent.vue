<template>
    <div class="w-full h-full flex items-center">
        <div class="cover absolute" ref="coverRef">
            <el-image :src="song.al?.picUrl|| images.GHOST_BLADE" fit="cover" class="w-full h-full"></el-image>
        </div>
        <div class="lyric absolute w-5/12 no-drag">
            <lyric-scroll></lyric-scroll>
        </div>
    </div>
</template>

<script>
import { computed, defineAsyncComponent } from "@vue/runtime-core";
import { useWindowSize, useTimeoutFn, useCssVar } from "@vueuse/core";
import { watch, ref, nextTick } from "@vue/runtime-core";
import { useStore } from "vuex";
import { SONG, FULL_SCREEN } from "@utils/getters";
import images from "@/utils/images";

export default {
    name: "TheLyricContent",
    components: {
        LyricScroll: defineAsyncComponent(() =>
            import("@/components/common/LyricScroll.vue")
        ),
    },
    setup() {
        const store = useStore();

        const song = computed(() => store.getters[SONG]);

        const { width } = useWindowSize();

        const coverRef = ref(null);

        let lastWidth = width;

        watch(
            width,
            (val) => {
                nextTick(() => {
                    const { start } = useTimeoutFn(() => {
                        setCoverStyle(val > lastWidth);
                        lastWidth = val;
                    });
                    start();
                });
            },
            { immediate: false }
        );

        watch(
            () => store.getters[FULL_SCREEN],
            (val) => {
                const coverRefVar = useCssVar("--cover-w-h", coverRef);
                const coverRefLeft = useCssVar("--cover-left", coverRef);
                if (val) {
                    coverRefVar.value = "360px";
                    coverRefLeft.value = "14.5%";
                } else {
                    coverRefVar.value = "350px";
                    coverRefLeft.value = "10%";
                }
            }
        );

        const setCoverStyle = (isAdd) => {
            const coverRefVar = useCssVar("--cover-w-h", coverRef);
            const coverRefLeft = useCssVar("--cover-left", coverRef);

            let resultVar = Number(
                coverRefVar.value.substring(0, coverRefVar.value.length - 2)
            );

            let resultLeft = Number(
                coverRefLeft.value.substring(0, coverRefLeft.value.length - 1)
            );
            if (isAdd) {
                if (resultVar < 360) {
                    resultVar += 1;
                    resultLeft += 0.5;
                }
            } else {
                if (resultVar > 350) {
                    resultVar -= 1;
                    resultLeft -= 0.5;
                }
            }

            coverRefVar.value = resultVar + "px";
            coverRefLeft.value = resultLeft + "%";
        };

        return {
            coverRef,
            song,
            images,
        };
    },
};
</script>

<style lang="scss" scoped>
.cover {
    --cover-w-h: 350px;
    --cover-left: 10%;
    width: var(--cover-w-h);
    height: var(--cover-w-h);
    left: var(--cover-left);
}

.lyric {
    height: 400px;
    right: 10%;
}
</style>