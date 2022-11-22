<template>
    <div class="grid grid-flow-row grid-cols-8 2xl:grid-cols-12 gap-2.5">
        <div class="button-dc" @click="catClick('全部')">全部</div>
        <div
            v-for="tag in tags"
            :key="tag.id"
            class="button-dc"
            @click="catClick(tag.name)"
        >{{ tag.name }}</div>
    </div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
import { queryPlaylistHighqualityTags } from "@/api/netease/playlist";
export default {
    name: "PlayListHot",
    emits: ["catChange"],
    setup(props, { emit }) {
        const tags = ref([]);

        const getPlaylistHighqualityTags = async () => {
            if (tags.value.length) return;
            tags.value = await queryPlaylistHighqualityTags();
        };
        getPlaylistHighqualityTags();

        const catClick = (cat) => {
            emit("catChange", cat);
        };

        return {
            tags,
            catClick,
        };
    },
};
</script>

<style>
</style>