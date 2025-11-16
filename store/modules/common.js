const state = {
  systemInfo: null,
  location: null,
  networkType: 'unknown'
}

const mutations = {
  SET_SYSTEM_INFO(state, info) {
    state.systemInfo = info
  },
  SET_LOCATION(state, location) {
    state.location = location
  },
  SET_NETWORK_TYPE(state, networkType) {
    state.networkType = networkType
  }
}

const actions = {
  // 获取系统信息
  getSystemInfo({ commit }) {
    return new Promise((resolve) => {
      uni.getSystemInfo({
        success: (res) => {
          commit('SET_SYSTEM_INFO', res)
          resolve(res)
        }
      })
    })
  },
  
  // 获取位置信息
  getLocation({ commit }) {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          commit('SET_LOCATION', res)
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  
  // 获取网络状态
  getNetworkType({ commit }) {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          commit('SET_NETWORK_TYPE', res.networkType)
          resolve(res.networkType)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}