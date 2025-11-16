import { login, getUserInfo, updateUserInfo, logout } from '@/api/modules/user'
import { setToken, removeToken, getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: null,
  isLogin: false
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    setToken(token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLogin = true
  },
  CLEAR_USER_INFO(state) {
    state.token = ''
    state.userInfo = null
    state.isLogin = false
    removeToken()
  }
}

const actions = {
  // 用户登录
  async login({ commit }, loginData) {
    try {
      const res = await login(loginData)
      commit('SET_TOKEN', res.data.token)
      // 登录成功后获取用户信息
      const userRes = await getUserInfo()
      commit('SET_USER_INFO', userRes.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const res = await getUserInfo()
      commit('SET_USER_INFO', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 更新用户信息
  async updateUserInfo({ commit, state }, userInfo) {
    try {
      const res = await updateUserInfo(userInfo)
      commit('SET_USER_INFO', { ...state.userInfo, ...userInfo })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 退出登录
  async logout({ commit, dispatch }) {
    try {
      await logout()
      commit('CLEAR_USER_INFO')
      // 清空购物车
      dispatch('cart/clearCart', null, { root: true })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getters = {
  isVip: state => {
    return state.userInfo && state.userInfo.vipLevel > 0
  },
  userAvatar: state => {
    return state.userInfo ? state.userInfo.avatar : '/static/images/avatar-default.png'
  },
  userName: state => {
    return state.userInfo ? state.userInfo.nickname : '未登录'
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}