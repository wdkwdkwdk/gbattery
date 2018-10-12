import Vue from 'vue'
import App from './App'
import store from './store'
Vue.prototype.$store = store
wx.cloud.init({
  traceUser: true
})
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
