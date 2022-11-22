import http from "@/utils/http"

export const queryMvUrl = async (id) => {
    const { data } = await http.get("mv/url", { id: id })
    return data
}