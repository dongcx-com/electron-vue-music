<template>
    <div class="leading-5">
        <template v-if="show">
            <span v-if="!isShow">{{ text.substring(0, end) }}...</span>
            <span v-else>{{ text }}...</span>
            <span
                class="ml-5 text-gray-700 hover-text"
                @click="isShow=!isShow"
            >[{{ isShow ? '收起' : '详情' }}]</span>
        </template>
        <template v-else>{{ text }}</template>
    </div>
</template>

<script>
import { ref, toRefs } from "@vue/runtime-core";
export default {
    name: "MoreText",
    props: {
        text: String,
        end: Number,
    },
    setup(props) {
        const { text, end } = toRefs(props);

        const show = ref(false);
        const isShow = ref(false);

        if (text.value && text.value.length > end.value) {
            show.value = true;
        }

        return {
            show,
            isShow,
        };
    },
};
</script>

<style>
</style>