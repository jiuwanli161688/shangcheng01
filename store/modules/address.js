import { getAddressList, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/api/modules/address'

const state = {
  addressList: [],
  defaultAddress: null
}

const mutations = {
  SET_ADDRESS_LIST(state, list) {
    state.addressList = list
    state.defaultAddress = list.find(item => item.isDefault) || null
  },
  ADD_ADDRESS(state, address) {
    state.addressList.push(address)
    if (address.isDefault) {
      state.defaultAddress = address
      state.addressList.forEach(item => {
        if (item.id !== address.id) {
          item.isDefault = false
        }
      })
    }
  },
  UPDATE_ADDRESS(state, address) {
    const index = state.addressList.findIndex(item => item.id === address.id)
    if (index !== -1) {
      state.addressList.splice(index, 1, address)
      if (address.isDefault) {
        state.defaultAddress = address
        state.addressList.forEach(item => {
          if (item.id !== address.id) {
            item.isDefault = false
          }
        })
      }
    }
  },
  DELETE_ADDRESS(state, id) {
    const index = state.addressList.findIndex(item => item.id === id)
    if (index !== -1) {
      const address = state.addressList[index]
      state.addressList.splice(index, 1)
      if (address.isDefault && state.addressList.length > 0) {
        state.addressList[0].isDefault = true
        state.defaultAddress = state.addressList[0]
      }
    }
  },
  SET_DEFAULT_ADDRESS(state, id) {
    state.addressList.forEach(item => {
      item.isDefault = item.id === id
    })
    state.defaultAddress = state.addressList.find(item => item.id === id) || null
  }
}

const actions = {
  // 获取地址列表
  async getAddressList({ commit }) {
    try {
      const res = await getAddressList()
      commit('SET_ADDRESS_LIST', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 添加地址
  async addAddress({ commit }, address) {
    try {
      const res = await addAddress(address)
      commit('ADD_ADDRESS', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 更新地址
  async updateAddress({ commit }, address) {
    try {
      const res = await updateAddress(address)
      commit('UPDATE_ADDRESS', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 删除地址
  async deleteAddress({ commit }, id) {
    try {
      const res = await deleteAddress(id)
      commit('DELETE_ADDRESS', id)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 设置默认地址
  async setDefaultAddress({ commit }, id) {
    try {
      const res = await setDefaultAddress(id)
      commit('SET_DEFAULT_ADDRESS', id)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}