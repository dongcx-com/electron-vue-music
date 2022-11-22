<template>
    <div class="flex song-item items-center w-full hover-bg-main" :class="{'playing':id===song.id}">
        <div class="flex-shrink-0 flex-1 flex items-center justify-between pr-5">
            <div class="items-center flex flex-1 w-10 flex-shrink-0">
                <icon-park
                    type="Like"
                    size="16"
                    class="text-gray-500 mr-1 cursor-pointer hover:text-red-400"
                ></icon-park>
                <div class="truncate" style="max-width: 30%;">
                    <small>{{ song.name }}</small>
                </div>
                <div
                    v-show="song.fee===1"
                    class="text-xs rounded px-0.5 scale-75 bg-white border border-curr text-curr leading-3"
                >VIP</div>
                <div
                    v-show="song.fee===1"
                    class="bg-red-500 text-xs text-white rounded px-0.5 scale-75"
                >试听</div>
                <div
                    v-show="textTitle"
                    class="text-xs rounded px-0.5 scale-75"
                    :class="customClass"
                >{{textTitle}}</div>
                <icon-park
                    v-if="song.mv>0"
                    type="PlayTwo"
                    size="16"
                    class="ml-2 text-orange-400 cursor-pointer"
                ></icon-park>
            </div>
            <div class="hidden icon-action flex-shrink-0">
                <div class="flex items-center gap-x-1.5 text-gray-400 ml-2">
                    <icon-park
                        title="播放"
                        type="PlayOne"
                        size="20"
                        class="hover-text"
                        @click="play"
                        v-show="(id===song.id&&isPause)||id!==song.id"
                    ></icon-park>
                    <icon-park
                        title="暂停"
                        type="pause"
                        size="20"
                        class="hover-text"
                        @click="play"
                        v-show="id===song.id&&!isPause"
                    ></icon-park>
                    <icon-park title="添加到" type="Add" size="16" class="hover-text"></icon-park>
                    <icon-park title="下载" type="DownTwo" size="16" class="hover-text"></icon-park>
                    <icon-park title="更多操作" type="MoreTwo" size="16" class="hover-text"></icon-park>
                </div>
            </div>
        </div>
        <div
            class="flex-shrink-0"
            :class="{'w-1/4':showAlName,'w-1/3':!showAlName}"
            v-if="showArName"
        >
            <div class="w-9/12 truncate">
                <small class="truncate max-w-full hover-text">{{head(song.ar)?.name}}</small>
            </div>
        </div>
        <div
            class="flex-shrink-0"
            :class="{'w-1/4':showArName,'w-1/3':!showArName}"
            v-if="showAlName"
        >
            <div class="w-9/12 truncate">
                <small class="truncate hover-text">{{song.al.name}}</small>
            </div>
        </div>
        <div class="w-20 flex-shrink-0">
            <div class="w-20 truncate">
                <small>{{ useFormatDuring(song.dt / 1000) }}</small>
            </div>
        </div>
    </div>
</template>

<script>
import { useFormatDuring } from "@utils/number";
import { head } from "lodash";
import { useStore } from "vuex";
import { ID, IS_PLAYING, IS_PAUSE } from "@utils/getters";
import { computed, toRefs } from "@vue/runtime-core";
import {
    PUSH_PLAY_LIST,
    PLAY,
    PUSH_PRIVILEGES,
    FADE_OUT,
    FADE_IN,
} from "@utils/actions";
import { HI_RES, LOSS_LESS } from "@utils/quality";

export default {
    name: "SongListItem",
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
        showArName: Boolean,
        showAlName: Boolean,
    },
    setup(props) {
        const { song, privilege } = toRefs(props);

        const store = useStore();
        const id = computed(() => store.getters[ID]);

        const isPause = computed(() => store.getters[IS_PAUSE]);

        const play = () => {
            if (song.value.id === id.value) {
                if (store.getters[IS_PLAYING]) {
                    store.dispatch(FADE_OUT);
                } else {
                    store.dispatch(FADE_IN);
                }
                return;
            }

            store.dispatch(PUSH_PLAY_LIST, {
                replace: false,
                songs: song.value,
            });
            store.dispatch(PUSH_PRIVILEGES, {
                replace: false,
                privileges: privilege.value,
            });

            store.dispatch(PLAY, song.value.id);
        };

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
            id,
            play,
            textTitle,
            customClass,
            isPause,
        };
    },
};
</script>

<style lang="scss" scoped>
.song-item {
    @apply py-2.5 pl-0.5;
    &:hover {
        .icon-action {
            @apply inline-block;
        }
    }
}

.playing {
    @apply bg-emerald-50 dark:bg-stone-800;
}
</style>