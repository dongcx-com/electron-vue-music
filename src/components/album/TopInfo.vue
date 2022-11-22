<template>
    <div class="flex items-stretch">
        <img :src="albumInfo.picUrl" alt class="w-44 h-44 object-cover rounded-xl flex-shrink-0" />
        <div class="pl-5 flex flex-col justify-between py-1 flex-1">
            <div class="flex flex-col justify-between flex-1">
                <div class="text-2xl font-bold">{{ albumInfo?.name }}</div>
                <div class="flex items-center text-xs text-gray-600">
                    <span class>{{ albumInfo?.artist?.name }}</span>
                </div>
                <div
                    class="text-xs text-gray-500 leading-normal"
                >{{ useDateFormat(albumInfo?.publishTime, "YYYY-MM-DD HH:mm:ss").value }}</div>
            </div>
            <div class="justify-self-stretch mt-5 gap-x-2 flex items-center">
                <button class="w-32 button">
                    <icon-park type="PlayOne" size="22" class="mr-1"></icon-park>
                    <span>播放全部</span>
                </button>
                <button class="w-32 button-outline">
                    <icon-park type="Like" size="18" class="mr-1"></icon-park>
                    <span>收藏</span>
                </button>
                <button class="button-outline w-8">
                    <icon-park type="More"></icon-park>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { toRefs, computed } from "@vue/runtime-core";
import { useDateFormat } from "@vueuse/core";

export default {
    name: "TopInfo",
    props: {
        album: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    setup(props) {
        const { album } = toRefs(props);

        const albumInfo = computed(() => album.value);

        return {
            albumInfo,
            useDateFormat,
        };
    },
};
</script>

<style>
</style>