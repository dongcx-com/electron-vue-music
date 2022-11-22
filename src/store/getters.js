const getters = {
  platform: state => state.platform,
  windowHeight: state => state.windowHeight,
  windowWidth: state => state.windowWidth,
  darkTheme: state => state.darkTheme,
  windowIsMax: state => state.windowIsMax,
  fullScreen: state => state.fullScreen,
  asideWidth: state => state.asideWidth,
  headerHeight: state => state.headerHeight,
  scrollTop: state => state.scrollTop,

  // user
  isLogin: state => state.user.isLogin,
  userInfo: state => state.user.userInfo,

  //search
  showSearchView: state => state.search.showSearchView,
  searchKeyword: state => state.search.searchKeyword,

  // player
  showPlayList: state => state.player.showPlayList,
  isPlaying: state => state.player.isPlaying,
  id: state => state.player.id,
  url: state => state.player.url,
  songUrl: state => state.player.songUrl,
  song: state => state.player.song,
  volume: state => state.player.volume,
  loopType: state => state.player.loopType,
  isPause: state => state.player.isPause,
  muted: state => state.player.muted,
  currentTime: state => state.player.currentTime,
  duration: state => state.player.duration,
  sliderInput: state => state.player.sliderInput,
  ended: state => state.player.ended,
  sliderTime: state => state.player.sliderTime,
  playList: state => state.player.playList,
  fadeVolume: state => state.player.fadeVolume,
  fadeInFlag: state => state.player.fadeInFlag,
  fadeOutFlag: state => state.player.fadeOutFlag,
  recordVolume: state => state.player.recordVolume,
  privileges: state => state.player.privileges,

  //lyric
  showLyricsDetail: state => state.lyric.showLyricsDetail,
  lyric: state => state.lyric.lyric,
}

export default getters
