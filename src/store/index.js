import Vue from "vue";
import Vuex from "vuex";
import myClient from './modules/myClient/index'

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    myClient,
  }
})

