<template>
    <custom-title title="推荐新音乐"></custom-title>
    <div class="grid grid-flow-row grid-cols-2 2xl:grid-cols-5 gap-y-2.5 gap-x-5 cursor-pointer">
        <div
            v-for="(item,index) in personalizedNewSong"
            :key="index"
            class="hover-bg-view transition-all flex items-center"
            @click="play(item.id)"
        >
            <img :src="item.picUrl" alt class="w-12 h-12 object-cover rounded flex-shrink-0" />
            <div class="px-2 text-xs flex-auto flex flex-col w-1/3">
                <div class="text-xs flex-1 truncate">{{ item.name }}</div>
                <div class="mt-1.5 text-dc">{{ item.song.artists[0].name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, ref } from "@vue/runtime-core";
import { queryPersonalizedNewSong } from "@/api/netease/personalized";
import { useStore } from "vuex";
import { PLAY } from "@utils/actions";

export default {
    name: "PersonalizedNewSong",
    components: {
        CustomTitle: defineAsyncComponent(() =>
            import("@/components/common/Title.vue")
        ),
    },
    setup() {
        const store = useStore();

        const personalizedNewSong = ref([]);

        const getPersonalizedNewSong = async () => {
            if (personalizedNewSong.value.length) return;
            personalizedNewSong.value = await queryPersonalizedNewSong();
        };
        getPersonalizedNewSong();

        const play = (id) => {
            store.dispatch(PLAY, id);
        };

        return {
            personalizedNewSong,
            play,
        };
    },
};
</script>

<style>
</style>