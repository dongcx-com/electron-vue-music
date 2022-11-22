<template>
    <div class="mt-2">
        <div class="flex text-xs text-gray-400 py-2">
            <div class="flex-auto">歌曲</div>
            <div class="w-1/4">歌手</div>
            <div class="w-1/4">专辑</div>
            <div class="w-20">时长</div>
        </div>
        <div class="text-sm">
            <template v-for="song in songs.slice(0,pageSize*page)" :key="song.id">
                <song-list-item
                    :song="song"
                    show-ar-name
                    show-al-name
                    :privilege="find(privileges,['id', song.id])"
                ></song-list-item>
            </template>
        </div>
        <div class="flex justify-center py-5" v-if="songs.length>pageSize && !noMore">
            <el-button text class="text-center w-full" @click="loadMore">加载更多</el-button>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, ref, computed, toRefs } from "@vue/runtime-core";
import { find } from "lodash";

export default {
    name: "SongList",
    props: {
        songs: {
            type: Array,
            default() {
                return [];
            },
        },
        privileges: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    components: {
        SongListItem: defineAsyncComponent(() =>
            import("@/components/common/SongListItem.vue")
        ),
    },
    setup(props) {
        const { songs } = toRefs(props);

        const pageSize = ref(10);
        const page = ref(1);

        const noMore = computed(() => {
            return page.value - songs.value.length / pageSize.value >= 0;
        });

        const loadMore = () => {
            page.value = page.value + 1;
        };

        return {
            pageSize,
            page,
            loadMore,
            noMore,
            find,
        };
    },
};
</script>

<style>
</style>