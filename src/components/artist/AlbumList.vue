<template>
    <div class="mt-5">
        <div class="grid grid-flow-row grid-cols-3 lg:grid-cols-5 gap-5 2xl:grid-cols-8">
            <div v-for="(item,index) in list" :key="index" :class="{'item-1':index===0}">
                <cover-play :name="item?.name" :pic-url="item?.picUrl" :play-count="0"></cover-play>
                <div class="mt-2 text-xs truncate">{{ item?.name }}</div>
                <div
                    class="mt-1 text-xs text-slate-400 truncate"
                >{{ useDateFormat(item?.publishTime,'YYYY-MM-DD HH:mm:ss').value }}</div>
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
    computed,
    reactive,
} from "@vue/runtime-core";
import { queryArtistAlbum } from "@/api/netease/artist";
import { useDateFormat } from "@vueuse/core";

export default {
    name: "AlbumList",
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

        const getArtistAlbum = async () => {
            try {
                pageData.loading = true;
                const { hotAlbums } = await queryArtistAlbum(
                    id.value,
                    pageData.limit,
                    offset.value
                );
                if (pageData.page === 1) {
                    list.value = hotAlbums;
                } else {
                    list.value.push(...hotAlbums);
                }
                if (hotAlbums.length < pageData.limit) {
                    pageData.noMore = true;
                }
            } catch (e) {
                pageData.page--;
            }
            pageData.loading = false;
        };

        getArtistAlbum();

        const loadMore = () => {
            pageData.page++;
            getArtistAlbum();
        };

        return {
            list,
            pageData,
            loadMore,
            useDateFormat,
        };
    },
};
</script>

<style>
</style>