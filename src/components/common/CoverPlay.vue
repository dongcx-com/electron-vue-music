<template>
    <div
        class="cover-play-image"
        :class="{'aspect-square':!video,'aspect-video':video,'no-transY':noTransY}"
    >
        <el-image :src="picUrl" :alt="name" class="w-full bg-gray-50 object-cover" />
        <div class="mask flex justify-center items-center">
            <icon-park
                :type="icon"
                :size="iconSize"
                :theme="iconTheme"
                class="text-white play-icon opacity-0 transition-opacity hover:text-teal-400"
                :title="name"
            ></icon-park>
        </div>
        <div v-if="showPlayCount" class="play-count">
            <icon-park :type="video?'Play':'Headset'" size="12" class="mr-1"></icon-park>
            <text>{{ useNumberFormat(playCount || 0) }}</text>
        </div>
    </div>
</template>

<script>
import { useNumberFormat } from "@utils/number";
import { defineAsyncComponent, ref } from "@vue/runtime-core";
export default {
    name: "CoverPlay",
    props: {
        picUrl: String,
        playCount: Number,
        name: String,
        showPlayCount: Boolean,
        video: Boolean,
        icon: {
            type: String,
            default: "PlayOne",
        },
        iconSize: {
            type: String,
            default: "50",
        },
        iconTheme: {
            type: String,
            default: "filled",
        },
        noTransY: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        return {
            useNumberFormat,
        };
    },
};
</script>

<style lang="scss" scoped>
.cover-play-image {
    @apply rounded-lg cursor-pointer transition-all relative overflow-hidden;

    @apply hover:-translate-y-1;

    .mask {
        @apply absolute inset-0 bg-black bg-opacity-0 transition-all duration-500;
    }

    .play-count {
        @apply absolute bottom-1 right-1 text-white text-xs bg-black bg-opacity-80 pl-2 pr-2 rounded-full pt-0.5 pb-0.5 flex items-center transition-all scale-90;
    }

    &:hover {
        .mask {
            @apply bg-opacity-50;
            .play-icon {
                @apply opacity-100;
            }
        }

        .play-count {
            @apply opacity-0;
        }
    }
}

.no-transY {
    @apply hover:-translate-y-0;
}
</style>