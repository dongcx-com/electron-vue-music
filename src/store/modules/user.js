const user = {
    state: {
        isLogin: false,
        userInfo: {}
    },

    mutations: {
        SET_IS_LOGIN(state, isLogin) {
            state.isLogin = isLogin
        },
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo
        },
    },
}

export default user