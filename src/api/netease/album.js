import http from "@/utils/http"

export const queryAlbum = async (id) => {
    const { album, songs } = await http.get('album', { id: id })
    return { album, songs }
}