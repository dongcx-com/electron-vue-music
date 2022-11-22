<template>
    <div class="pb-5">
        <div v-for="option in options" :key="option.key" class="flex text-xs mb-5">
            <div class="flex-shrink-0 text-slate-400">{{ option.name }}：</div>
            <div class="ml-3">
                <el-space wrap :size="10" :spacer="spacer">
                    <div
                        type="text"
                        class="hover-text px-1 py-0.5"
                        :class="{active:(item.key===pageData.type && option.key==='type')||(item.key===pageData.area && option.key==='area') || (item.key===pageData.initial  && option.key==='initial')}"
                        v-for="(item,index) in option.list"
                        :key="index"
                        @click="optionChange(option.key,item.key)"
                    >{{item.name}}</div>
                </el-space>
            </div>
        </div>
    </div>
    <div class="grid grid-flow-row grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-5">
        <div
            v-for="artist in artists"
            :key="artist.id"
            class="flex items-center flex-col"
            @click="toArtist(artist.id)"
        >
            <img
                :src="artist.img1v1Url+'?param=120y120'"
                alt
                class="rounded-full cursor-pointer w-full aspect-square object-cover bg-dc"
            />
            <div class="mt-2 text-sm">{{ artist.name }}</div>
        </div>
    </div>
    <div class="py-10">
        <el-button
            text
            class="text-center w-full"
            :loading="pageData.loading"
            @click="loadMore"
        >加载更多</el-button>
    </div>
</template>

<script>
import { ElDivider } from "element-plus";
import { ref, reactive, h } from "@vue/runtime-core";
import { queryArtistList } from "@/api/netease/artist";
import { useRouter } from "vue-router";
import pages from "@/router/pages";

export default {
    name: "Artist",
    setup() {
        const spacer = h(ElDivider, { direction: "vertical" });

        const artists = ref([]);
        const pageData = reactive({
            init: false,
            loading: false,
            page: 1,
            limit: 60,
            initial: "-1",
            type: -1,
            area: -1,
        });

        const getArtistList = async () => {
            pageData.loading = true;
            try {
                const data = await queryArtistList(pageData);
                if (pageData.page === 1) {
                    artists.value = data;
                } else {
                    artists.value.push(...data);
                }
                pageData.init = true;
                pageData.loading = false;
            } catch (e) {
                pageData.page--;
            }
        };

        getArtistList();

        const loadMore = () => {
            pageData.page++;
            getArtistList();
        };

        const optionChange = (keyName, keyValue) => {
            console.log(keyName, keyValue);
            pageData.page = 1;
            if (keyName === "type") pageData.type = keyValue;
            if (keyName === "area") pageData.area = keyValue;
            if (keyName === "initial") pageData.initial = keyValue;
            getArtistList();
        };

        const router = useRouter();
        const toArtist = (id) => {
            router.push({ name: pages.ARTIST_DETAIL, query: { id: id } });
        };

        const options = [
            {
                name: "语种",
                key: "area",
                list: [
                    { key: -1, name: "全部" },
                    { key: 7, name: "华语" },
                    { key: 96, name: "欧美" },
                    { key: 8, name: "日本" },
                    { key: 16, name: "韩国" },
                    { key: 0, name: "其他" },
                ],
            },
            {
                name: "分类",
                key: "type",
                list: [
                    { key: -1, name: "全部" },
                    { key: 1, name: "男歌手" },
                    { key: 2, name: "女歌手" },
                    { key: 3, name: "乐队组合" },
                ],
            },
            {
                name: "筛选",
                key: "initial",
                list: [
                    { key: "-1", name: "热门" },
                    { key: "a", name: "A" },
                    { key: "b", name: "B" },
                    { key: "c", name: "C" },
                    { key: "d", name: "D" },
                    { key: "e", name: "E" },
                    { key: "f", name: "F" },
                    { key: "g", name: "G" },
                    { key: "h", name: "H" },
                    { key: "i", name: "I" },
                    { key: "j", name: "J" },
                    { key: "k", name: "K" },
                    { key: "l", name: "L" },
                    { key: "m", name: "M" },
                    { key: "n", name: "N" },
                    { key: "o", name: "O" },
                    { key: "p", name: "P" },
                    { key: "q", name: "Q" },
                    { key: "r", name: "R" },
                    { key: "s", name: "S" },
                    { key: "t", name: "T" },
                    { key: "u", name: "U" },
                    { key: "v", name: "V" },
                    { key: "w", name: "W" },
                    { key: "x", name: "X" },
                    { key: "y", name: "Y" },
                    { key: "z", name: "Z" },
                    { key: "0", name: "#" },
                ],
            },
        ];

        return {
            spacer,
            artists,
            pageData,
            options,
            loadMore,
            optionChange,
            toArtist,
        };
    },
};
</script>

<style lang="scss" scoped>
.active {
    @apply bg-emerald-400 text-white rounded;
}
</style>