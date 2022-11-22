<template>
    <div class="mt-5 flex items-center justify-between">
        <div class="flex gap-x-2">
            <button class="w-28 button-outline button-sm" @click="playAll">
                <icon-park type="PlayOne" size="14" class="mr-1"></icon-park>播放全部
            </button>
            <button class="w-28 button-outline button-sm">
                <icon-park type="Download" size="12" class="mr-1"></icon-park>下载
            </button>
            <button class="w-28 button-outline button-sm">
                <icon-park type="FullSelection" size="12" class="mr-1"></icon-park>批量操作
            </button>
        </div>
        <div class="gap-x-5 flex mr-10 text-xs">
            <div
                class="hover-text"
                :class="{'text-emerald-400':pageData.order==='hot'}"
                @click="setOrder('hot')"
            >最热</div>
            <div
                class="hover-text"
                :class="{'text-emerald-400':pageData.order==='time'}"
                @click="setOrder('time')"
            >最新</div>
        </div>
    </div>
    <div class="mt-2">
        <div class="flex text-xs text-gray-400 py-2">
            <div class="flex-auto">歌曲</div>
            <div class="w-1/3">专辑</div>
            <div class="w-20">时长</div>
        </div>
        <div class="text-sm">
            <template v-for="song in songList" :key="song.id">
                <song-list-item :show-ar-name="false" show-al-name :song="song"></song-list-item>
            </template>
        </div>
        <div class="flex justify-center py-5" v-if="songList.length>0 && !pageData.noMore">
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
    reactive,
    computed,
    toRefs,
} from "@vue/runtime-core";
import { queryArtistSongs } from "@/api/netease/artist";
import { PUSH_PLAY_LIST, PLAY } from "@utils/actions";
import { useStore } from "vuex";
import { head } from "lodash";

export default {
    name: "Songs",
    props: {
        id: Number,
    },
    components: {
        SongListItem: defineAsyncComponent(() =>
            import("@/components/common/SongListItem.vue")
        ),
    },
    setup(props) {
        const { id } = toRefs(props);

        const store = useStore();

        const songList = ref([]);

        const pageData = reactive({
            order: "hot",
            limit: 20,
            page: 1,
            loading: false,
            noMore: false,
        });

        const offset = computed(() => {
            if (pageData.page === 1) return 0;
            return songList.value.length + pageData.limit;
        });

        const getArtistSongs = async () => {
            try {
                pageData.loading = true;
                const { songs } = await queryArtistSongs(
                    id.value,
                    pageData.order,
                    pageData.limit,
                    offset.value
                );
                if (pageData.page === 1) {
                    songList.value = songs;
                } else {
                    songList.value.push(...songs);
                }
                if (songs.length < pageData.limit) pageData.noMore = true;
            } catch (e) {
                pageData.page--;
            }
            pageData.loading = false;
        };

        getArtistSongs();

        const loadMore = () => {
            pageData.page++;
            getArtistSongs();
        };

        const setOrder = (o) => {
            pageData.page = 1;
            pageData.order = o;
            getArtistSongs();
        };

        const playAll = () => {
            store.dispatch(PUSH_PLAY_LIST, {
                replace: true,
                songs: songList.value,
            });

            store.dispatch(PLAY, head(songList.value)?.id);
        };

        return {
            songList,
            pageData,
            setOrder,
            loadMore,
            playAll,
        };
    },
};
</script>

<style>
</style>