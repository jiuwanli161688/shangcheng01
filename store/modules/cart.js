import { getCartList, addToCart, updateCart, deleteCart, clearCart } from '@/api/modules/cart'

const state = {
  cartList: [],
  cartCount: 0
}

const mutations = {
  SET_CART_LIST(state, list) {
    state.cartList = list
    state.cartCount = list.reduce((total, item) => total + item.quantity, 0)
  },
  ADD_TO_CART(state, goods) {
    const existingItem = state.cartList.find(item => item.id === goods.id && item.specId === goods.specId)
    if (existingItem) {
      existingItem.quantity += goods.quantity
    } else {
      state.cartList.push({ ...goods, selected: true })
    }
    state.cartCount = state.cartList.reduce((total, item) => total + item.quantity, 0)
  },
  UPDATE_CART_ITEM(state, { id, specId, quantity, selected }) {
    const item = state.cartList.find(item => item.id === id && item.specId === specId)
    if (item) {
      if (quantity !== undefined) item.quantity = quantity
      if (selected !== undefined) item.selected = selected
    }
    state.cartCount = state.cartList.reduce((total, item) => total + item.quantity, 0)
  },
  REMOVE_CART_ITEM(state, { id, specId }) {
    const index = state.cartList.findIndex(item => item.id === id && item.specId === specId)
    if (index !== -1) {
      state.cartList.splice(index, 1)
    }
    state.cartCount = state.cartList.reduce((total, item) => total + item.quantity, 0)
  },
  CLEAR_CART(state) {
    state.cartList = []
    state.cartCount = 0
  }
}

const actions = {
  // 获取购物车列表
  async getCartList({ commit }) {
    try {
      const res = await getCartList()
      commit('SET_CART_LIST', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 添加到购物车
  async addToCart({ commit }, goods) {
    try {
      const res = await addToCart(goods)
      commit('ADD_TO_CART', goods)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 更新购物车商品数量
  async updateCartItem({ commit }, { id, specId, quantity, selected }) {
    try {
      const res = await updateCart({ id, specId, quantity, selected })
      commit('UPDATE_CART_ITEM', { id, specId, quantity, selected })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 删除购物车商品
  async removeCartItem({ commit }, { id, specId }) {
    try {
      const res = await deleteCart({ id, specId })
      commit('REMOVE_CART_ITEM', { id, specId })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 清空购物车
  async clearCart({ commit }) {
    try {
      const res = await clearCart()
      commit('CLEAR_CART')
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getters = {
  cartTotalPrice: state => {
    return state.cartList.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  },
  selectedCartItems: state => {
    return state.cartList.filter(item => item.selected)
  },
  selectedTotalPrice: state => {
    return state.cartList
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  isAllSelected: state => {
    return state.cartList.length > 0 && state.cartList.every(item => item.selected)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}