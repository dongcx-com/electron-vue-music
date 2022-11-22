<template>
    <div v-if="suggestData" v-for="order in suggestData.order">
        <div class="pt-2 pb-1.5 px-2.5">{{ getTitle(order) }}</div>
        <div
            v-for="item in suggestData.songs"
            :key="item.id"
            v-if="order==='songs'"
            class="py-1.5 px-2.5 hover-bg-main text-xs cursor-pointer"
            @click="play(item.id)"
        >
            <span class="text-emerald-500">{{ item.name }}</span>
            <span class="pl-1">- {{ head(item.artists)?.name }}</span>
        </div>
        <div
            v-for="item in suggestData.albums"
            :key="item.id"
            v-if="order==='albums'"
            class="py-1.5 px-2.5 hover-bg-main text-xs cursor-pointer"
            @click="routerPush(pages.ALBUM,item.id)"
        >
            <span class="text-emerald-500">{{ item.name }}</span>
            <span class="pl-1">- {{ item.artist.name }}</span>
        </div>
        <div
            v-for="item in suggestData.artists"
            :key="item.id"
            v-if="order==='artists'"
            class="py-1.5 px-2.5 hover-bg-main text-xs cursor-pointer flex items-center"
            @click="routerPush(pages.ARTIST_DETAIL,item.id)"
        >
            <el-avatar size="small" :src="item.img1v1Url" />
            <span class="text-emerald-500 ml-2">{{ item.name }}</span>
        </div>
        <div
            v-for="item in suggestData.playlists"
            :key="item.id"
            v-if="order==='playlists'"
            class="py-1.5 px-2.5 hover-bg-main text-xs cursor-pointer flex items-center"
            @click="routerPush(pages.PLAY_LIST,item.id)"
        >
            <el-avatar size="small" :src="item.coverImgUrl" />
            <div class="text-emerald-500 ml-2 truncate flex-1 w-1">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
import { PLAY } from "@utils/actions";
import { useStore } from "vuex";
import { head } from "lodash";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "TheSearchSuggest",
    props: {
        suggestData: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    emits: ["handleShowSearchView"],
    setup(props, { emit }) {
        const store = useStore();

        const router = useRouter();

        const getTitle = (name) => {
            switch (name) {
                case "songs":
                    return "单曲";
                case "albums":
                    return "专辑";
                case "artists":
                    return "歌手";
                case "playlists":
                    return "歌单";
                default:
                    return name;
            }
        };

        const play = (id) => {
            store.dispatch(PLAY, id);
        };

        const routerPush = (name, id) => {
            router.push({ name: name, query: { id: id } }).then(() => {
                emit("handleShowSearchView", false);
            });
        };

        return {
            getTitle,
            play,
            routerPush,
            head,
            pages,
        };
    },
};
</script>

<style>
</style>