<template>
    <div class="flex items-stretch">
        <img
            :src="artistDetail?.artist?.cover"
            alt
            class="w-44 h-44 object-cover rounded-full flex-shrink-0"
        />
        <div class="pl-5 flex flex-col justify-between py-1 flex-1">
            <div class="flex flex-col justify-between flex-1">
                <div class="text-2xl font-bold">{{ artistDetail?.artist?.name }}</div>
                <div
                    class="text-xs text-gray-500 leading-normal mt-2"
                >{{artistDetail?.artist?.briefDesc.substring(0,90)}}...</div>
                <div class="flex text-xs gap-x-5 text-slate-500 mt-2">
                    <div>
                        单曲数：
                        <span>{{artistDetail?.artist?.musicSize}}</span>
                    </div>
                    <div>
                        专辑数：
                        <span>{{artistDetail?.artist?.albumSize}}</span>
                    </div>
                    <div>
                        MV数：
                        <span>{{artistDetail?.artist?.mvSize}}</span>
                    </div>
                </div>
            </div>
            <div class="justify-self-stretch mt-5 gap-x-2 flex items-center">
                <button class="w-32 button">
                    <icon-park type="Plus" size="18" class="mr-1"></icon-park>
                    <span>关注</span>
                </button>
                <button class="w-32 button-outline">
                    <icon-park type="Fm" size="18" class="mr-1"></icon-park>
                    <span>歌手电台</span>
                </button>
                <button class="button-outline w-8">
                    <icon-park type="More"></icon-park>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopInfo",
    props: {
        artistDetail: {
            type: Object,
            default() {
                return {};
            },
        },
    },
};
</script>

<style>
</style>