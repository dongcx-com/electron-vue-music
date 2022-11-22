const mutations = {
    SET_PLATFORM(state, platform) {
        state.platform = platform
    },
    SET_WINDOW_HEIGHT(state, windowHeight) {
        state.windowHeight = windowHeight
    },
    SET_WINDOW_WIDTH(state, windowWidth) {
        state.windowWidth = windowWidth
    },
    SET_DARK_THEME(state, darkTheme) {
        state.darkTheme = darkTheme
    },
    SET_WINDOW_IS_MAX(state, windowIsMax) {
        state.windowIsMax = windowIsMax
    },
    SET_FULL_SCREEN(state, fullScreen) {
        state.fullScreen = fullScreen
    },
    SET_ASIDE_WIDTH(state, asideWidth) {
        state.asideWidth = asideWidth
    },
    SET_HEADER_HEIGHT(state, headerHeight) {
        state.headerHeight = headerHeight
    },
    SET_SCROLL_TOP(state, scrollTop) {
        state.scrollTop = scrollTop
    },
}

export default mutations