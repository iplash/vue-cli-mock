import Vue from 'vue';
import Router from 'vue-router';
import pointsRouter from './modules/points';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login/index'),
      hidden: true,
    },
    {
      path: '/',
      redirect: '/points/platform',
      hidden: true,
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true,
    },
    pointsRouter,
  ],
});
