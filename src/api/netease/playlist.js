import http from "@/utils/http"

export const queryPlaylistHighqualityTags = async () => {
    const { tags } = await http.get("playlist/highquality/tags")
    return tags
}

export const queryTopPlaylistHighquality = async (params = { limit: Number, before: Number, cat: String }) => {
    return await http.get("top/playlist/highquality", params)
}

export const queryPlayListDetail = async (id, s = 8) => {
    const { playlist, privileges } = await http.get('/playlist/detail', { id: id, s: s })
    return { playlist, privileges }
}

export const queryPlayListTrackAll = async (id) => {
    const { songs } = await http.get('playlist/track/all', { id: id })
    return songs
}