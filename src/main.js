import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.scss';
import App from './App.vue';
import router from './router';
import store from './store';
// import './components/index';
import '../mock/index';

Vue.use(Element);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
