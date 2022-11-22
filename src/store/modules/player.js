
import { SET_PRIVILEGES, SET_LYRIC, SET_IS_PLAYING, SET_FADE_VOLUME, SET_VOLUME, SET_FADE_IN_FLAG, SET_FADE_OUT_FLAG, SET_MUTED, SET_ENDED, SET_SHOW_PLAY_LIST, SET_URL, SET_SONG_URL, SET_ID, SET_DURATION, SET_SONG, SET_PLAY_LIST, SET_CURRENT_TIME, SET_IS_PAUSE, SET_SLIDER_INPUT, SET_SLIDER_TIME } from '@utils/mutations'
import { querySongUrl, queryDetail, queryLyric } from '@/api/netease/song'
import { SONG_DETAIL, PUSH_PLAY_LIST, PLAY, RANDOM_PLAY, RE_PLAY } from '@utils/actions'
import { ID, PLAY_LIST, LOOP_TYPE, FADE_IN_FLAG, FADE_VOLUME, FADE_OUT_FLAG, RECORD_VOLUME, IS_PLAYING, PRIVILEGES } from '@utils/getters'
import { isArray, head, sample, last } from 'lodash'

const player = {
    state: {
        showPlayList: false,
        isPlaying: false, //是否播放中
        isPause: true,//是否暂停
        id: 0,
        url: "",//资源地址
        songUrl: {},
        song: {},
        playList: [],//播放列表
        volume: 60,//媒体音量，
        recordVolume: 60,//设置音量，与volume不同的是，该变量是记录手动设置的音量
        fadeVolume: 60,//当前的音量，与volume不同的是，该变量是记录歌曲在淡入淡出时的实时音量
        fadeInFlag: null, // 保存歌曲淡入的计时器id
        fadeOutFlag: null, // 保存歌曲淡出的计时器id
        loopType: 1,//循环模式 0 单曲循环 1 列表循环 2随机播放
        muted: false,//是否静音
        currentTime: 0,//当前播放时间
        duration: 0,//总播放时长
        sliderInput: false,//是否正在拖动进度条
        sliderTime: 0,//进度条拖动结束时的播放时间
        ended: false,//是否播放结束
        privileges: []
    },

    mutations: {
        SET_SHOW_PLAY_LIST(state, showPlayList) {
            state.showPlayList = showPlayList
        },
        SET_IS_PLAYING(state, isPlaying) {
            state.isPlaying = isPlaying
        },
        SET_IS_PAUSE(state, isPause) {
            state.isPause = isPause
        },
        SET_ID(state, id) {
            state.id = id
        },
        SET_URL(state, url) {
            state.url = url
        },
        SET_SONG_URL(state, songUrl) {
            state.songUrl = songUrl
        },
        SET_SONG(state, song) {
            state.song = song
        },
        SET_PLAY_LIST(state, playList) {
            state.playList = playList
        },
        SET_VOLUME(state, volume) {
            state.volume = volume
        },
        SET_LOOP_TYPE(state, loopType) {
            state.loopType = loopType
        },
        SET_MUTED(state, muted) {
            state.muted = muted
        },
        SET_CURRENT_TIME(state, currentTime) {
            state.currentTime = currentTime
        },
        SET_DURATION(state, duration) {
            state.duration = duration
        },
        SET_SLIDER_INPUT(state, sliderInput) {
            state.sliderInput = sliderInput
        },
        SET_ENDED(state, ended) {
            state.ended = ended
        },
        SET_SLIDER_TIME(state, sliderTime) {
            state.sliderTime = sliderTime
        },
        SET_FADE_VOLUME(state, fadeVolume) {
            state.fadeVolume = fadeVolume
        },
        SET_FADE_IN_FLAG(state, fadeInFlag) {
            state.fadeInFlag = fadeInFlag
        },
        SET_FADE_OUT_FLAG(state, fadeOutFlag) {
            state.fadeOutFlag = fadeOutFlag
        },
        SET_RECORD_VOLUME(state, recordVolume) {
            state.recordVolume = recordVolume
        },
        SET_PRIVILEGES(state, privileges) {
            state.privileges = privileges
        },
    },
    actions: {
        async play({ commit, dispatch, getters }, id) {

            if (getters[PLAY_LIST].length === 1) {
                dispatch(RE_PLAY)
            }

            if (id == getters[ID]) return;

            commit(SET_IS_PLAYING, false)
            const data = await querySongUrl(id)
            const lrc = await queryLyric(id)
            if (data && data.url) {
                commit(SET_URL, data.url)
                commit(SET_SONG_URL, data)
                commit(SET_ID, id)
                dispatch(SONG_DETAIL, id)
                commit(SET_IS_PLAYING, true)
            }

            if (lrc && lrc.lyric) {
                commit(SET_LYRIC, lrc.lyric)
            }
        },
        async songDetail({ commit, dispatch }, id) {
            const { song, privilege } = await queryDetail(id)
            commit(SET_SONG, song)
            dispatch(PUSH_PLAY_LIST, { replace: false, songs: song })
        },
        //播放列表里面添加音乐
        pushPlayList({ commit, getters, state }, playListInfo) {
            if (playListInfo.replace) {
                if (isArray(playListInfo.songs)) {
                    commit(SET_PLAY_LIST, playListInfo.songs)
                    return;
                }
                commit(SET_PLAY_LIST, [playListInfo.songs])
            }
            if (isArray(playListInfo.songs)) {
                playListInfo.songs.forEach(song => {
                    if (getters[PLAY_LIST].filter(s => s.id == song.id).length <= 0) {
                        state[PLAY_LIST].push(song)
                    }
                })
            } else {
                if (getters[PLAY_LIST].filter(s => s.id == playListInfo.songs.id).length <= 0) {
                    state[PLAY_LIST].push(playListInfo.songs)
                }
            }
        },
        pushPrivileges({ commit, getters, state }, privilege) {
            if (privilege.replace) {
                if (isArray(privilege.privileges)) {
                    commit(SET_PRIVILEGES, privilege.privileges)
                    return;
                }
                commit(SET_PRIVILEGES, [privilege.privileges])
            }
            if (isArray(privilege.privileges)) {
                privilege.privileges.forEach(el => {
                    if (getters[PRIVILEGES].filter(s => s.id == el.id).length <= 0) {
                        state[PRIVILEGES].push(el)
                    }
                })
            } else {
                if (getters[PRIVILEGES].filter(s => s.id == privilege.privileges.id).length <= 0) {
                    state[PRIVILEGES].push(privilege.privileges)
                }
            }
        },
        //重新播放
        rePlay({ commit, getters }) {
            commit(SET_CURRENT_TIME, 0)
            commit(SET_IS_PLAYING, true)
        },
        //下一曲
        next({ getters, dispatch }) {
            if (getters[LOOP_TYPE] === 2) {
                dispatch(RANDOM_PLAY)
            } else {
                const playListCount = getters[PLAY_LIST].length

                const thisIndex = getters[PLAY_LIST].findIndex(song => song.id === getters[ID]);

                let nextSong = {}
                if (thisIndex === playListCount - 1) {
                    nextSong = head(getters[PLAY_LIST]);
                } else {
                    const nextIndex = thisIndex + 1
                    nextSong = getters[PLAY_LIST][nextIndex];
                }
                dispatch(PLAY, nextSong.id)
            }
        },
        //上一曲
        prev({ getters, dispatch }) {
            const thisIndex = getters[PLAY_LIST].findIndex(song => song.id === getters[ID]);

            let prevSong = {}
            if (thisIndex === 0) {
                prevSong = last(getters[PLAY_LIST]);
            } else {
                const prevIndex = thisIndex - 1
                prevSong = getters[PLAY_LIST][prevIndex];
            }
            dispatch(PLAY, prevSong.id)
        },
        //随机播放
        randomPlay({ getters, dispatch }) {
            dispatch(PLAY, sample(getters[PLAY_LIST]).id)
        },
        clearPlayList({ commit }) {
            commit(SET_SONG_URL, {})
            commit(SET_URL, '')
            commit(SET_ID, 0)
            commit(SET_SONG, {})
            commit(SET_IS_PLAYING, false)
            commit(SET_IS_PAUSE, true)
            commit(SET_SLIDER_INPUT, false)
            commit(SET_SLIDER_TIME, 0)
            commit(SET_ENDED, false)
            commit(SET_MUTED, false)
            commit(SET_CURRENT_TIME, 0)
            commit(SET_PLAY_LIST, [])
            commit(SET_SHOW_PLAY_LIST, false)
            commit(SET_DURATION, 0)
        },
        // 淡出
        fadeOut({ getters, commit }) {
            let fadeInFlag = getters[FADE_IN_FLAG]
            let minus = Number((getters[FADE_VOLUME] / 50).toFixed(1))
            fadeInFlag && cancelAnimationFrame(fadeInFlag);
            (function songFadeOut() {
                let fadeVolume = getters[FADE_VOLUME]
                if (fadeVolume - minus <= 0) {
                    commit(SET_FADE_VOLUME, 0)
                    commit(SET_VOLUME, 0)

                    let fadeOutFlag = getters[FADE_OUT_FLAG]
                    cancelAnimationFrame(fadeOutFlag)
                    commit(SET_FADE_OUT_FLAG, null)

                    commit(SET_IS_PLAYING, false)
                } else {
                    fadeVolume = fadeVolume - minus
                    fadeVolume = Number(fadeVolume.toFixed(1))

                    commit(SET_FADE_VOLUME, fadeVolume)
                    commit(SET_VOLUME, fadeVolume)

                    let fadeOutFlag = requestAnimationFrame(songFadeOut)
                    commit(SET_FADE_OUT_FLAG, fadeOutFlag)
                }
            })()
        },
        // 淡入
        fadeIn({ getters, commit }) {
            let fadeOutFlag = getters[FADE_OUT_FLAG]
            let addend = Number((getters[RECORD_VOLUME] / 50).toFixed(1))
            fadeOutFlag && cancelAnimationFrame(fadeOutFlag);
            (function songFadeIn() {
                let fadeVolume = getters[FADE_VOLUME]
                let recordVolume = getters[RECORD_VOLUME]
                if (fadeVolume + addend >= recordVolume) {
                    commit(SET_FADE_VOLUME, recordVolume)
                    commit(SET_VOLUME, recordVolume)

                    let fadeInFlag = getters[FADE_IN_FLAG]
                    cancelAnimationFrame(fadeInFlag)
                    commit(SET_FADE_IN_FLAG, null)
                } else {
                    commit(SET_IS_PLAYING, true)

                    fadeVolume = fadeVolume + addend
                    fadeVolume = Number(fadeVolume.toFixed(1))

                    commit(SET_FADE_VOLUME, fadeVolume)
                    commit(SET_VOLUME, fadeVolume)

                    let fadeInFlag = requestAnimationFrame(songFadeIn)
                    commit(SET_FADE_IN_FLAG, fadeInFlag)
                }
            })()
        }
    }
}

export default player