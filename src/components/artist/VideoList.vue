<template>
    <div class="mt-5">
        <div
            class="grid grid-flow-row gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
            <div v-for="(item,index) in list" :key="index" :class="{'item-1':index===0}">
                <cover-play
                    :name="item.name"
                    :pic-url="item.imgurl16v9"
                    video
                    :play-count="item.playCount"
                    show-play-count
                ></cover-play>
                <div class="mt-2 text-xs truncate hover-text">{{ item.name }}</div>
            </div>
        </div>
        <div class="flex justify-center py-5" v-if="list.length>0 && !pageData.noMore">
            <el-button
                :loading="pageData.loading"
                text
                class="text-center w-full"
                @click="loadMore"
            >加载更多</el-button>
        </div>
    </div>
</template>

<script>
import {
    defineAsyncComponent,
    ref,
    toRefs,
    reactive,
    computed,
} from "@vue/runtime-core";
import { queryArtistMv } from "@/api/netease/artist";
export default {
    name: "VideoList",
    props: {
        id: Number,
    },
    components: {
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
    },
    setup(props) {
        const { id } = toRefs(props);

        const list = ref([]);

        const pageData = reactive({
            limit: 40,
            page: 1,
            loading: false,
            noMore: false,
        });
        const offset = computed(() => {
            if (pageData.page === 1) return 0;
            return list.value.length + pageData.limit;
        });

        const getArtistMv = async () => {
            try {
                pageData.loading = true;
                const { mvs } = await queryArtistMv(
                    id.value,
                    pageData.limit,
                    offset.value
                );
                if (pageData.page === 1) {
                    list.value = mvs;
                } else {
                    list.value.push(...mvs);
                }
                if (mvs.length < pageData.limit) pageData.noMore = true;
            } catch (e) {
                pageData.page--;
            }
            pageData.loading = false;
        };

        getArtistMv();

        const loadMore = () => {
            pageData.page++;
            getArtistMv();
        };

        return {
            list,
            pageData,
            loadMore,
        };
    },
};
</script>

<style>
</style>