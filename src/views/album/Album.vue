<template>
    <div class="p-5" v-if="state.albumData">
        <top-info :album="state.albumData"></top-info>

        <el-tabs class="mt-3" v-model="tab">
            <el-tab-pane lazy :label="`歌曲 ${songList.length}`" name="songs">
                <div class="flex text-xs text-gray-400 py-2">
                    <div class="flex-auto">歌曲</div>
                    <div class="w-1/3">歌手</div>
                    <div class="w-20">时长</div>
                </div>
                <template v-for="(song,index) in songList" :key="index">
                    <song-list-item :song="song" show-ar-name></song-list-item>
                </template>
            </el-tab-pane>
            <el-tab-pane lazy label="评论" name="comments" />
            <el-tab-pane lazy label="专辑详情" name="desc">
                <div
                    class="text-xs text-slate-500 leading-7"
                    style="white-space: pre-wrap"
                    v-html="albumData?.description"
                ></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { defineAsyncComponent, ref, reactive } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { queryAlbum } from "@/api/netease/album";

export default {
    name: "Album",
    components: {
        TopInfo: defineAsyncComponent(() =>
            import("@/components/album/TopInfo.vue")
        ),
        SongListItem: defineAsyncComponent(() =>
            import("@/components/common/SongListItem")
        ),
    },
    setup() {
        const state = reactive({
            albumData: {},
        });

        const songList = ref([]);
        const tab = ref("songs");

        const route = useRoute();

        const id = Number(route.query.id);

        const getAlbum = async () => {
            const { album, songs } = await queryAlbum(id);
            state.albumData = album;
            songList.value = songs;
        };

        getAlbum();

        return {
            state,
            songList,
            tab,
        };
    },
};
</script>

<style>
</style>