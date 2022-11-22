const lyric = {
    state: {
        showLyricsDetail: false,
        lyric: ""//歌词
    },

    mutations: {
        SET_SHOW_LYRICS_DETAIL(state, showLyricsDetail) {
            state.showLyricsDetail = showLyricsDetail
        },
        SET_LYRIC(state, lyric) {
            state.lyric = lyric
        },
    },
}

export default lyric