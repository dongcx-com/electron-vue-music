<template>
    <div
        class="flex p-2.5 border-b border-b-stone-50 dark:border-b-stone-800 hover-bg-view"
        :class="{'active':active}"
    >
        <el-image
            lazy
            :src="song.al?.picUrl+'?param=80y80'"
            class="aspect-square w-10 flex-shrink-0"
        />
        <div class="ml-2 text-xs h-10 flex flex-1 w-1">
            <div class="flex flex-1 flex-col justify-between truncate">
                <div class="flex items-center">
                    <div class="truncate">{{ song.name }}</div>
                    <div
                        class="text-xs text-white rounded px-0.5 scale-75"
                        :class="customClass"
                    >{{textTitle}}</div>
                    <icon-park
                        v-if="song.mv>0"
                        type="Youtube"
                        size="16"
                        class="ml-1 text-orange-400 hover:text-orange-500 cursor-pointer"
                    ></icon-park>
                </div>
                <div class="truncate">{{ head(song.ar)?.name }}</div>
            </div>
            <div class="flex-shrink-0 ml-5 flex items-center justify-end">
                <div class="truncate">
                    <small>{{ useFormatDuring(song.dt / 1000) }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent, toRefs, computed } from "@vue/runtime-core";
import { useFormatDuring } from "@utils/number";
import { head } from "lodash";
import { HI_RES, LOSS_LESS } from "@utils/quality";

export default {
    name: "ThePlayListSongItem",
    props: {
        song: {
            type: Object,
            default() {
                return {};
            },
        },
        privilege: {
            type: Object,
            default() {
                return {};
            },
        },
        active: Boolean,
    },
    setup(props) {
        const { privilege } = toRefs(props);

        const textTitle = computed(() => {
            return privilege.value.playMaxBrLevel === HI_RES
                ? "Hi-Res"
                : privilege.value.playMaxBrLevel === LOSS_LESS
                ? "SQ"
                : "";
        });

        const customClass = computed(() => {
            if (privilege.value.playMaxBrLevel === LOSS_LESS) {
                return [
                    "bg-white",
                    "border",
                    "border-sq",
                    "text-sq",
                    "leading-3",
                ];
            }

            return [
                "bg-white",
                "border",
                "border-hires",
                "text-hires",
                "leading-4",
            ];
        });

        return {
            useFormatDuring,
            head,
            customClass,
            textTitle,
        };
    },
};
</script>

<style lang="scss" scoped>
.active {
    @apply border-l-2 border-l-emerald-400 text-emerald-400 dark:bg-stone-800 bg-stone-100;
}
</style>