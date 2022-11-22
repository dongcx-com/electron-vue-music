import http from "@/utils/http"
import { head } from 'lodash'

export const querySongUrl = async (id) => {
    const { data } = await http.get('/song/url', { id: id })
    return head(data)
}

export const queryDetail = async (id) => {
    const { songs, privileges } = await http.get('/song/detail', { ids: id })
    return { song: head(songs), privilege: head(privileges) }
}

export const queryLyric = async (id) => {
    const { lrc } = await http.get('/lyric', { id: id })
    return lrc
}