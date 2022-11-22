<template>
    <swiper slides-per-group-auto slides-per-view="auto" :navigation="true" :grab-cursor="true">
        <swiper-slide v-for="item in banners" :key="item.bannerId">
            <img :src="item.pic" class="banner-image" @click="onClick(item)" />
        </swiper-slide>
    </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { ref, watch } from "@vue/runtime-core";
import { queryBanners } from "@/api/netease/banner";
import { useStore } from "vuex";
import { PLAY } from "@utils/actions";

export default {
    name: "Banner",
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        const store = useStore();

        const banners = ref([]);

        const getBanners = async () => {
            if (banners.value.length) return;
            banners.value = await queryBanners();
        };

        getBanners();

        const onClick = (banner) => {
            if (banner.targetType === 1) {
                // play(banner.targetId);
                store.dispatch(PLAY, banner.targetId);
            }
        };

        return {
            banners,
            onClick,
        };
    },
};
</script>

<style lang="scss" scoped>
.swiper {
    @apply -mx-2.5;
    .swiper-slide {
        @apply w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 px-2.5;
    }
}

.banner-image {
    @apply rounded-lg cursor-pointer transition-all object-cover;
    @apply hover:shadow hover:opacity-80;
}
</style>