<template>
    <div class="w-56 bg-main bg-opacity-70 h-screen flex flex-col" ref="asideRef">
        <el-scrollbar>
            <div class="mt-10 pl-6 pr-6 space-y-1.5" v-for="(menuItem,index) in menus" :key="index">
                <div class="menu-title text-main text-left">{{ menuItem.name }}</div>
                <div
                    class="menu-item hover-bg-main text-main"
                    v-for="menu in menuItem.menus"
                    :key="menu.key"
                    :class="{ 'active': currentKey === menu.key }"
                    @click="handleClick(menu)"
                >
                    <icon-park :type="menu.icon" size="18" :theme="menu.theme"></icon-park>
                    <span class="ml-1">{{ menu.name }}</span>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import { ref, watch, onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { SET_ASIDE_WIDTH } from "@utils/mutations";

export default {
    name: "TheAside",
    setup() {
        const menus = [
            {
                name: "在线音乐",
                menus: [
                    {
                        name: "推荐",
                        key: "discover",
                        icon: "Planet",
                        theme: "outline",
                    },
                    {
                        name: "音乐馆",
                        key: "music",
                        icon: "Music",
                        theme: "outline",
                    },
                    {
                        name: "视频",
                        key: "video",
                        icon: "VideoOne",
                        theme: "outline",
                    },
                    {
                        name: "电台",
                        key: "dj",
                        icon: "Fm",
                        theme: "outline",
                    },
                ],
            },
            {
                name: "我的音乐",
                menus: [
                    {
                        name: "我喜欢",
                        key: "love",
                        icon: "Like",
                        theme: "outline",
                    },
                    {
                        name: "本地歌曲",
                        key: "local",
                        icon: "Computer",
                        theme: "outline",
                    },
                    {
                        name: "下载歌曲",
                        key: "download",
                        icon: "DownloadThree",
                        theme: "outline",
                    },
                    {
                        name: "最近播放",
                        key: "recently",
                        icon: "PlayTwo",
                        theme: "outline",
                    },
                ],
            },
        ];

        const route = useRoute();

        const currentKey = ref(route.meta.menu);

        const router = useRouter();

        const asideRef = ref(null);

        const store = useStore();

        onMounted(() => {
            store.commit(SET_ASIDE_WIDTH, asideRef.value.offsetWidth);
        });

        watch(
            () => route.meta.menu,
            (menu) => {
                currentKey.value = menu;
            }
        );

        const handleClick = async (menu) => {
            await router.push({ name: menu.key, replace: true });
        };

        return {
            menus,
            handleClick,
            currentKey,
            asideRef,
        };
    },
};
</script>

<style lang="scss" scoped>
.menu-title {
    @apply text-xs pl-4 pr-4 pb-2;
}

.menu-item {
    @apply text-sm pl-4 pr-4 pt-1.5 pb-1.5 rounded cursor-pointer transition-colors flex items-center;
}

.active {
    @apply bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-50 cursor-default;
}
</style>
