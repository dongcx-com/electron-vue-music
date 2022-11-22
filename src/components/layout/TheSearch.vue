<template>
    <el-popover
        :popper-style="popperStyle"
        v-model:visible="showSearchView"
        width="250px"
        trigger="focus"
    >
        <template #reference>
            <el-input
                v-model="searchKeyword"
                placeholder="搜索音乐、MV、歌单"
                :prefix-icon="Search"
                clearable
                @input="searchInput"
                @focus="handleShowSearchView(true)"
                @blur="handleShowSearchView(false)"
            ></el-input>
        </template>
        <div class="h-96">
            <el-scrollbar>
                <div class="pb-2.5">
                    <div v-if="showHot">
                        <div class="pt-2 pb-1.5 px-2.5">热门搜索</div>
                        <div
                            v-for="(item,index) in searchHot"
                            :key="item.searchWord"
                            class="py-2.5 px-2.5 hover-text cursor-pointer flex justify-between items-center text-xs"
                            @click="hotClick(item.searchWord)"
                        >
                            <div>
                                <span class="mr-1">{{ index + 1 }}.</span>
                                <span>{{ item.searchWord }}</span>
                            </div>
                            <div class="text-red-300 text-xs">{{ useNumberFormat(item.score)}}</div>
                        </div>
                    </div>
                    <the-search-suggest
                        v-else
                        :suggestData="suggestData"
                        @handleShowSearchView="handleShowSearchView"
                    ></the-search-suggest>
                </div>
            </el-scrollbar>
        </div>
    </el-popover>
</template>

<script>
import { defineAsyncComponent, computed, ref } from "@vue/runtime-core";
import { querySearchHotDetail, querySearchSuggest } from "@/api/netease/search";
import { Search } from "@element-plus/icons-vue";
import { useNumberFormat } from "@utils/number";
import { debounce } from "lodash";
import { useStore } from "vuex";
import { DARK_THEME } from "@utils/getters";

export default {
    name: "TheSearch",
    components: {
        TheSearchSuggest: defineAsyncComponent(() =>
            import("@/components/layout/TheSearchSuggest.vue")
        ),
    },
    setup() {
        const store = useStore();

        const popperStyle = computed(() =>
            store.getters[DARK_THEME]
                ? "max-width:auto;padding:0;background-color:#1e1e1f"
                : "max-width:auto;padding:0;"
        );

        const showSearchView = ref(false);

        const searchKeyword = ref("");

        const handleShowSearchView = (type) => {
            showSearchView.value = type;
        };

        const searchInput = debounce((value) => getSearchSuggest(), 500, {
            maxWait: 1000,
        });

        const searchHot = ref([]);

        const getSearchHotDetail = async () => {
            if (searchHot.value.length) return;
            searchHot.value = await querySearchHotDetail();
        };

        getSearchHotDetail();

        const suggestData = ref({});

        const hotClick = (text) => {
            searchKeyword.value = text;
            getSearchSuggest();
            showSearchView.value = true;
        };

        const getSearchSuggest = async () => {
            suggestData.value = await querySearchSuggest(searchKeyword.value);
        };

        return {
            showSearchView,
            handleShowSearchView,
            searchKeyword,
            searchInput,
            Search,
            showHot: computed(() => searchKeyword.value == ""),
            searchHot,
            hotClick,
            useNumberFormat,
            suggestData,
            popperStyle,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>