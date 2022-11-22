<template>
    <custom-title title="你的专属歌单"></custom-title>
    <div class="grid grid-flow-row grid-cols-3 lg:grid-cols-5 gap-5 2xl:grid-cols-10">
        <div
            v-for="(item,index) in sampleSize(personalized,10)"
            :key="index"
            :class="{'item-1':index===0}"
            @click="handlePush(item.id)"
        >
            <cover-play
                :picUrl="item.picUrl"
                :name="item.name"
                :play-count="item.playCount"
                show-play-count
            ></cover-play>
            <div class="mt-2 text-xs text-main truncate">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, ref } from "@vue/runtime-core";
import { queryPersonalized } from "@/api/netease/personalized";
import { sampleSize } from "lodash";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "CustomPersonalized",
    components: {
        CustomTitle: defineAsyncComponent(() =>
            import("@/components/common/Title.vue")
        ),
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
    },
    setup() {
        const personalized = ref([]);

        const getPersonalized = async () => {
            if (personalized.value.length) return;
            personalized.value = await queryPersonalized();
        };
        getPersonalized();

        const router = useRouter();

        const handlePush = (id) => {
            router.push({ name: pages.PLAY_LIST, query: { id: id } });
        };

        return {
            personalized,
            sampleSize,
            handlePush,
        };
    },
};
</script>

<style>
</style>