import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import common from './modules/common'
import address from './modules/address'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    cart,
    user,
    common,
    address
  }
})

export default store