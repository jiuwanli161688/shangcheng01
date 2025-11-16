import Vue from 'vue'
import App from './App'
import store from './store'

// 引入请求封装
import { http } from './utils/request'

// 挂载到Vue原型
Vue.prototype.$http = http
Vue.prototype.$store = store

// 引入全局混入
import commonMixin from './mixins/common'
Vue.mixin(commonMixin)

// 全局组件自动注册
// const componentsContext = require.context('@/components', true, /\.vue$/)
// componentsContext.keys().forEach(component => {
//   const componentConfig = componentsContext(component)
//   const componentName = componentConfig.default.name
//   if (componentName) {
//     Vue.component(componentName, componentConfig.default || componentConfig)
//   }
// })

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()