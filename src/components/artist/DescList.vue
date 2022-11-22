<template>
    <div v-loading="!artistDesc" style="min-height: 200px;">
        <div
            v-if="artistDesc && artistDesc?.introduction?.length>0"
            v-for="item in artistDesc?.introduction"
        >
            <div class="py-5 font-bold text-sm">{{ item.ti }}</div>
            <div
                class="text-xs text-slate-500 leading-7"
                style="white-space: pre-wrap"
                v-html="item.txt"
            />
        </div>
        <el-empty description="暂无数据" v-else />
    </div>
</template>

<script>
import { ref, toRefs } from "@vue/runtime-core";
import { queryArtistDesc } from "@/api/netease/artist";
export default {
    name: "DescList",
    props: {
        id: Number,
    },
    setup(props) {
        const { id } = toRefs(props);

        const artistDesc = ref();

        const getArtistDesc = async () => {
            artistDesc.value = await queryArtistDesc(id.value);
        };

        getArtistDesc();

        return {
            artistDesc,
        };
    },
};
</script>

<style>
</style>