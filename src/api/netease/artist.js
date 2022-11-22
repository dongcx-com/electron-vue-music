import http from "@/utils/http"

export const queryArtistList = async (pageData = { type: Number, area: Number, initial: String, page: Number, limit: Number }) => {
    const res = await http.get('artist/list', {
        type: pageData.type,
        area: pageData.area,
        initial: pageData.initial,
        limit: pageData.limit,
        offset: (pageData.page - 1) * pageData.limit
    })

    return res.artists
}

export const queryArtistDetail = async (id) => {
    const { data } = await http.get('artist/detail', { id: id })
    return data
}

export const queryArtistSongs = async (id, order = 'time', limit = 10, offset = 0) => {
    return await http.get('artist/songs', { id: id, order: order, limit: limit, offset: offset })
}

export const queryArtistAlbum = async (id, limit = 10, offset = 0) => {
    return await http.get('artist/album', { id: id, limit: limit, offset: offset })
}

export const queryArtistMv = async (id, limit = 10, offset = 0) => {
    return await http.get('artist/mv', { id: id, limit: limit, offset: offset })
}

export const queryArtistDesc = async (id) => {
    return await http.get('artist/desc', { id: id })
}