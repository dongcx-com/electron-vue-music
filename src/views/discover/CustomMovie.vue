<template>
    <custom-title title="推荐MV" class="mt-5"></custom-title>
    <div class="grid grid-flow-row grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="item in personalizedMv" :key="item.id" @click="handlePush(item.id)">
            <cover-play
                :pic-url="item.picUrl"
                video
                :name="item.name"
                :play-count="item.playCount"
                show-play-count
                @click="handlePush(item.id)"
            ></cover-play>
            <div class="truncate text-xs mt-2">{{ item.name }}</div>
            <div class="truncate text-xs mt-1.5 text-slate-400">
                <small>{{ item.artistName }}</small>
            </div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, ref } from "@vue/runtime-core";
import { queryPersonalizedMv } from "@/api/netease/personalized";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "CustomMovie",
    components: {
        CustomTitle: defineAsyncComponent(() =>
            import("@/components/common/Title.vue")
        ),
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
    },
    setup() {
        const personalizedMv = ref([]);

        const getPersonalizedMv = async () => {
            if (personalizedMv.value.length) return;
            personalizedMv.value = await queryPersonalizedMv();
        };

        getPersonalizedMv();

        const router = useRouter();

        const handlePush = (id) => {
            router.push({ name: pages.MV_DETAIL, query: { id: id } });
        };

        return { personalizedMv, handlePush };
    },
};
</script>

<style>
</style>