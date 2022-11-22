import http from "@/utils/http"

export const queryVideoGroupList = async () => {
    const { data } = await http.get('video/group/list')
    return data
}

export const queryVideoGroup = async (id, offset) => {
    const { datas, hasmore } = await http.get(id ? 'video/group' : 'video/timeline/all', {
        id: id,
        offset: offset
    })
    return { datas, hasmore }
}