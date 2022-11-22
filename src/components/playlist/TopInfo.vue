<template>
    <div class="flex items-stretch">
        <img
            :src="playlist?.coverImgUrl"
            alt
            class="w-44 h-44 object-cover rounded-xl flex-shrink-0"
        />
        <div class="pl-5 flex flex-col justify-between py-1 flex-1">
            <div>
                <div class="text-2xl font-bold">{{ playlist?.name }}</div>
                <div class="flex items-center text-xs text-dc pb-2 pt-3">
                    <el-avatar :src="playlist?.creator?.avatarUrl" size="small" round />
                    <span class="ml-2">{{ playlist?.creator?.nickname }}</span>
                    <div class="ml-5 flex text-dc">
                        <div
                            class="ml-2 hover-text"
                            v-for="tag in playlist?.tags"
                            :key="tag"
                        >#{{ tag }}</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500 leading-normal">
                    <more-text :text=" playlist?.description" :end="90"></more-text>
                </div>
            </div>
            <div class="justify-self-stretch mt-5 gap-x-2 flex items-center">
                <button class="w-32 button" @click="playAll">
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
import { defineAsyncComponent, computed, toRefs } from "@vue/runtime-core";
export default {
    name: "TopInfo",
    props: {
        playlist: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    emits: ["playAll"],
    components: {
        MoreText: defineAsyncComponent(() =>
            import("@/components/common/MoreText.vue")
        ),
    },
    setup(props, { emit }) {
        const { playlist } = toRefs(props);

        const playAll = () => {
            emit("playAll");
        };
        return {
            playAll,
            playlistInfo: computed(() => playlist.value),
        };
    },
};
</script>

<style>
</style>