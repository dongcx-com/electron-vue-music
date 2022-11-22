<template>
    <div class="w-full h-full flex flex-col">
        <div class="h-28 w-full flex flex-col">
            <div
                class="font-medium text-2xl text-center text-white pb-3 truncate"
            >{{song.name?song.name:'ELECTRON VUE MUSIC'}}</div>
            <div class="flex flex-col text-center text-down text-sm truncate">
                <span v-show="song.name">歌手：{{head(song.ar)?.name}}</span>
                <span v-show="song.name">专辑：{{song?.al?.name}}</span>
            </div>
        </div>
        <div class="flex-1 lyric">
            <el-scrollbar ref="lyricScrollRef">
                <div
                    :class="['lyric-main',{'curr-lyric':currIndex===index},{'lyric-opacity-75':currIndex===index+1||currIndex===index-1},{'lyric-opacity-50':currIndex===index+2||currIndex===index-2},{'lyric-opacity-25':currIndex===index+3||currIndex===index-3},{'lyric-opacity-0':currIndex>=index+4||currIndex<=index-4}]"
                    v-for="(lyric,index) in currLyric.lines"
                    :ref="setLyricDivRefs"
                    :key="index"
                >
                    <span>{{lyric.txt}}</span>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { watch, ref, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { CURRENT_TIME, SONG, LYRIC, IS_PLAYING } from "@utils/getters";
import Lyric from "lyric-parser";
import { head } from "lodash";

export default {
    name: "LyricScroll",
    setup() {
        const store = useStore();

        const song = computed(() => store.getters[SONG]);

        const currLyric = ref({});
        const currIndex = ref(0);

        const lyricScrollRef = ref(null);

        let lyricDivRefs = [];

        const setLyricDivRefs = (el) => {
            if (el) {
                lyricDivRefs.push(el);
            }
        };

        const loopLyric = (time) => {
            if (currLyric.value && currLyric.value.seek) {
                currLyric.value.seek(time);
            }
        };

        watch(
            () => store.getters[CURRENT_TIME],
            (val) => {
                loopLyric(val * 1000);
            }
        );

        const lyricHandler = ({ lineNum, txt }) => {
            currIndex.value = lineNum;

            // 若当前行大于2,开始滚动,以保歌词显示于中间位置
            if (lineNum > 2) {
                let lineEl = lyricDivRefs[lineNum - 2]; //滚动到哪
                let top = lineEl.offsetTop;
                console.log(top);
                lyricScrollRef.value.scrollTo({ behavior: "smooth", top: top });
            } else {
                lyricScrollRef.value.scrollTo(0, 0);
            }
        };

        watch(
            () => store.getters[LYRIC],
            (val) => {
                //切换歌曲时，清空lyric-parser对象
                if (currLyric.value && currLyric.value.stop) {
                    currLyric.value.stop();
                }
                currLyric.value = new Lyric(val, lyricHandler);
            },
            { deep: true, immediate: true }
        );

        //监听播放状态，控制歌词播放
        watch(
            () => store.getters[IS_PLAYING],
            (val) => {
                if (currLyric.value && currLyric.value.togglePlay) {
                    currLyric.value.togglePlay();
                }
            },
            { immediate: false }
        );

        return {
            lyricScrollRef,
            currIndex,
            currLyric,
            setLyricDivRefs,
            song,
            head,
        };
    },
};
</script>

<style lang="scss" scoped>
.lyric {
    overflow: hidden;
}

.lyric-main {
    height: 50px;
    text-align: center;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease; //过渡属性
    font-size: 13px;
    // color: #fff;
    @apply text-white;
}
.curr-lyric {
    // color: #1ecc94;
    @apply text-curr;
    font-size: 18px;
}

.lyric-opacity-0 {
    @apply text-opacity-0;
}

.lyric-opacity-25 {
    @apply text-opacity-25;
}

.lyric-opacity-50 {
    @apply text-opacity-50;
}

.lyric-opacity-75 {
    @apply text-opacity-75;
}
</style>