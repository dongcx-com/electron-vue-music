const user = {
    state: {
        showSearchView: false,
        searchKeyword: '',
    },

    mutations: {
        SET_SHOW_SEARCH_VIEW(state, showSearchView) {
            state.showSearchView = showSearchView
        },
        SET_SEARCH_KEYWORD(state, searchKeyword) {
            state.searchKeyword = searchKeyword
        },
    },
}

export default user