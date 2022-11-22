import http from "@/utils/http"

export const queryTopListDetail = async () => {
    const { list } = await http.get('/toplist/detail')
    return list
}