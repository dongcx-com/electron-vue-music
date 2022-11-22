import http from "@/utils/http"

export const queryBanners = async () => {
    const { banners } = await http.get('/banner', { type: 1 })
    return banners
}