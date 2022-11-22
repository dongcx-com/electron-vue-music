import http from "@/utils/http"

export const querySearchHotDetail = async () => {
    const { data } = await http.get('search/hot/detail')
    return data
}

export const querySearchSuggest = async (keywords) => {
    const { result } = await http.get('search/suggest', { keywords: keywords })
    return result
}