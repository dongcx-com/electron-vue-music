<template>
    <play-list-hot @cat-change="catChange"></play-list-hot>
    <div class="py-5 text-xl">{{pageData.cat}}歌单</div>

    <div class="gap-5 grid grid-flow-row grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7">
        <div
            v-for="(item,index) in list"
            :key="index"
            :class="{'item-1':index===0}"
            @click="toPlaylist(item)"
        >
            <cover-play
                :name="item.name"
                :pic-url="item.coverImgUrl"
                :play-count="item.playCount"
                show-play-count
            ></cover-play>
            <div class="mt-2 text-xs text-main leading-5">{{ item.name }}</div>
            <div class="mt-2 text-xs text-main truncate text-dc">{{ item.creator.nickname }}</div>
        </div>
    </div>
    <div class="py-10" v-if="pageData.more">
        <el-button
            text
            class="text-center w-full"
            @click="loadMore"
            :loading="pageData.loading"
        >加载更多</el-button>
    </div>
</template>

<script>
import { defineAsyncComponent, ref, reactive } from "@vue/runtime-core";
import { queryTopPlaylistHighquality } from "@/api/netease/playlist";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "Category",
    components: {
        CoverPlay: defineAsyncComponent(() =>
            import("@/components/common/CoverPlay.vue")
        ),
        PlayListHot: defineAsyncComponent(() =>
            import("@/views/music/category/PlayListHot.vue")
        ),
    },
    setup() {
        const router = useRouter();

        const list = ref();

        const pageData = reactive({
            init: false,
            loading: false,
            limit: 35,
            before: 0,
            more: false,
            cat: "全部",
        });

        const catChange = (cat) => {
            pageData.cat = cat;
            pageData.before = 0;
            pageData.more = false;

            getTopPlaylistHighquality();
        };

        const getTopPlaylistHighquality = async () => {
            pageData.loading = true;
            try {
                const { playlists, lasttime, more } =
                    await queryTopPlaylistHighquality({
                        limit: pageData.limit,
                        before: pageData.before,
                        cat: pageData.cat,
                    });
                if (pageData.before <= 0) {
                    list.value = playlists;
                } else {
                    list.value?.push(...playlists);
                }
                pageData.init = true;
                pageData.loading = false;

                pageData.before = lasttime;
                pageData.more = more;
            } catch (e) {}
        };

        getTopPlaylistHighquality();

        const loadMore = () => {
            getTopPlaylistHighquality();
        };

        const toPlaylist = (catDetail) => {
            router.push({
                name: pages.PLAY_LIST,
                query: { id: catDetail.id },
            });
        };

        return {
            list,
            pageData,
            catChange,
            loadMore,
            toPlaylist,
        };
    },
};
</script>

<style>
</style>