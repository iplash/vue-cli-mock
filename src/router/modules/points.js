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
      meta: { title: '平台管理', icon: 'el-icon-menu' },
    },
    {
      path: 'setting',
      component: () => import('@/views/points/setting.vue'),
      name: '积分设置',
      meta: { title: '积分设置', icon: 'el-icon-setting' },
    },
    {
      path: 'activity',
      component: () => import('@/views/points/activity.vue'),
      name: '积分活动',
      meta: { title: '积分活动', icon: 'el-icon-present' },
    },
    {
      path: 'users',
      component: () => import('@/views/points/users.vue'),
      name: '用户列表',
      meta: { title: '用户列表', icon: 'el-icon-user' },
    },
    {
      path: 'turnover',
      component: () => import('@/views/points/turnover.vue'),
      name: '积分流水',
      meta: { title: '积分流水', icon: 'el-icon-toilet-paper' },
    },
    {
      path: 'fails',
      component: () => import('@/views/points/fails.vue'),
      name: '异常积分',
      meta: { title: '异常积分', icon: 'el-icon-warning-outline' },
    },
  ],
};

export default pointsRouter;
