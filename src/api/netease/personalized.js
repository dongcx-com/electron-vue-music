import http from "@/utils/http"

export const queryPersonalizedPrivateContentList = async (limit = 10, offset = 0) => {
    const { result } = await http.get('personalized/privatecontent/list', {
        limit: limit,
        offset: offset
    })
    return result
}

export const queryPersonalized = async () => {
    const { result } = await http.get('/personalized')
    return result
}

export const queryPersonalizedNewSong = async () => {
    const { result } = await http.get('/personalized/newsong')
    return result
}

export const queryPersonalizedMv = async () => {
    const { result } = await http.get('personalized/mv')
    return result
}

export const queryPersonalizedDjProgram = async () => {
    const { result } = await http.get('personalized/djprogram')
    return result
}