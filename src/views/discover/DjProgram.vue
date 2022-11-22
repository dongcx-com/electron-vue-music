<template>
    <custom-title title="推荐电台" class="mt-5"></custom-title>
    <div class="grid grid-flow-row grid-cols-3 lg:grid-cols-6 gap-5">
        <div v-for="item in djProgram" :key="item.id" @click="handlePush(item.id)">
            <cover-play :pic-url="item.picUrl" :name="item.name" :play-count="0"></cover-play>
            <div class="truncate text-xs mt-2">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, ref } from "@vue/runtime-core";
import { queryPersonalizedDjProgram } from "@/api/netease/personalized";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "DjProgram",
    components: {
        CustomTitle: defineAsyncComponent(() =>
            import("@/components/common/Title.vue")
        ),
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
    },
    setup() {
        const router = useRouter();

        const djProgram = ref([]);

        const getDjProgram = async () => {
            if (djProgram.value.length) return;
            djProgram.value = await queryPersonalizedDjProgram();
        };

        getDjProgram();

        const handlePush = (id) => {
            router.push({ name: pages.VIDEO, query: { id: id } });
        };

        return {
            djProgram,
            handlePush,
        };
    },
};
</script>

<style>
</style>