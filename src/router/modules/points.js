import Layout from '@/layout/index.vue';

const pointsRouter = {
  path: '/points',
  component: Layout,
  redirect: '/points/platform',
  name: '积分系统',
  meta: {
    title: '积分系统',
    icon: 'table',
  },
  children: [
    {
      path: 'platform',
      component: () => import('@/views/points/platform.vue'),
      name: '平台管理',
      meta: { title: '平台管理' },
    },
  ],
};

export default pointsRouter;
