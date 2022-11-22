<template>
    <the-audio v-if="!isHowler&&!isLyric"></the-audio>
    <howler v-if="isHowler&&!isLyric"></howler>
    <div class="flex flex-col items-stretch h-20 bg-view" :class="{'bgOpacity':isLyric}">
        <the-player-slider :isLyric="isLyric"></the-player-slider>
        <div class="flex grow px-5 items-center">
            <div class="flex-1">
                <the-player-song :isLyric="isLyric"></the-player-song>
            </div>
            <div class="flex-1">
                <the-player-controller :isLyric="isLyric"></the-player-controller>
            </div>
            <div class="flex-1">
                <the-player-action :isLyric="isLyric"></the-player-action>
            </div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, computed } from "@vue/runtime-core";

export default {
    name: "TheFooter",
    props: {
        isLyric: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ThePlayerSlider: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayerSlider.vue")
        ),
        ThePlayerSong: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayerSong.vue")
        ),
        ThePlayerController: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayerController.vue")
        ),
        ThePlayerAction: defineAsyncComponent(() =>
            import("@/components/layout/ThePlayerAction.vue")
        ),
        TheAudio: defineAsyncComponent(() =>
            import("@/components/layout/TheAudio.vue")
        ),
        Howler: defineAsyncComponent(() =>
            import("@/components/common/Howler.vue")
        ),
    },
    setup() {
        let isHowler = computed(() => process.env.VUE_APP_HOWLERJS == "true");
        return {
            isHowler,
        };
    },
};
</script>

<style lang="scss" scoped>
.bgOpacity {
    @apply bg-opacity-0;
}
</style>