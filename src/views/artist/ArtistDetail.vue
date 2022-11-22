<template>
    <div class="artist-detail p-5" v-if="artistDetail">
        <top-info :artist-detail="artistDetail"></top-info>

        <el-tabs class="mt-3" v-model="tab">
            <el-tab-pane lazy label="精选" name="choice"></el-tab-pane>
            <el-tab-pane lazy :label="`歌曲 ${artistDetail?.artist?.musicSize}`" name="music">
                <songs :id="id"></songs>
            </el-tab-pane>
            <el-tab-pane lazy :label="`专辑 ${artistDetail?.artist?.albumSize}`" name="album">
                <album-list :id="id"></album-list>
            </el-tab-pane>
            <el-tab-pane lazy :label="`视频 ${artistDetail?.artist?.mvSize}`" name="mv">
                <video-list :id="id"></video-list>
            </el-tab-pane>
            <el-tab-pane lazy label="详情" name="desc">
                <desc-list :id="id"></desc-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { defineAsyncComponent, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { queryArtistDetail } from "@/api/netease/artist";

export default {
    name: "ArtistDetail",
    components: {
        TopInfo: defineAsyncComponent(() =>
            import("@/components/artist/TopInfo.vue")
        ),
        Songs: defineAsyncComponent(() =>
            import("@/components/artist/Songs.vue")
        ),
        AlbumList: defineAsyncComponent(() =>
            import("@/components/artist/AlbumList.vue")
        ),
        VideoList: defineAsyncComponent(() =>
            import("@/components/artist/VideoList.vue")
        ),
        DescList: defineAsyncComponent(() =>
            import("@/components/artist/DescList.vue")
        ),
    },
    setup() {
        const route = useRoute();

        const id = Number(route.query.id);
        const artistDetail = ref({});
        const tab = ref("music");

        const getArtistDetail = async () => {
            artistDetail.value = await queryArtistDetail(id);
        };
        getArtistDetail();

        return {
            id,
            artistDetail,
            tab,
        };
    },
};
</script>

<style lang="scss">
.artist-detail {
    .el-tabs__nav-wrap::after {
        height: 0;
    }

    .el-tabs__header {
        @apply m-0;
    }
}
</style>