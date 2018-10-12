import state from './state'
import mutations from './mutations.js'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations
})
