const user = {
  state: {
    userInfo: '',
    token: '',
    needUpgrade: false,
  },

  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setToken(state, data) {
      state.token = data
    },
    clearToken(state) {
      state.token = ''
    },
    setUpgrade(state, data) {
      state.needUpgrade = data
    }
  },

  actions: {}
}

export default user