<template>
    <div class="px-5">
        <h1 class="text-3xl font-bold pt-8 pb-4">推荐</h1>
        <banner></banner>
        <custom-personalized></custom-personalized>
        <personalized-new-song></personalized-new-song>
        <custom-movie></custom-movie>
    </div>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";
export default {
    name: "Discover",
    components: {
        Banner: defineAsyncComponent(() =>
            import("@/components/common/Banner.vue")
        ),
        CustomPersonalized: defineAsyncComponent(() =>
            import("./CustomPersonalized.vue")
        ),
        PersonalizedNewSong: defineAsyncComponent(() =>
            import("./PersonalizedNewSong.vue")
        ),
        CustomMovie: defineAsyncComponent(() => import("./CustomMovie.vue")),
    },
};
</script>

<style>
</style>