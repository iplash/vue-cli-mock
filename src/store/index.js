import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import user from './modules/user';
import getters from './getters';

// https://github.com/vuejs/vuex/tree/dev/examples
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    user,
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
