import { createStore } from 'vuex'

import getters from './getters'

import mutations from './mutations'

import qq from './modules/qq'
import netease from './modules/netease'
import user from './modules/user'
import search from './modules/search'
import player from './modules/player'
import lyric from './modules/lyric'

export default createStore({
  state: {
    platform: 'netease',
    windowHeight: '',
    windowWidth: '',
    darkTheme: false,
    windowIsMax: false,
    fullScreen: false,
    asideWidth: '',
    headerHeight: '',
    scrollTop: ''
  },
  getters,
  mutations,
  modules: {
    qq,
    netease,
    user,
    search,
    player,
    lyric
  }
})
