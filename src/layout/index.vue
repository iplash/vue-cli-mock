<template>
  <el-container>
    <el-aside style="width: auth">
      <el-menu
        :default-active="key"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        text-color="#fff"
        active-text-color="#409eff"
      >
        <el-menu-item
          v-for="route in menus"
          :key="route.path"
          :base-path="route.path"
          :index="`/points/${route.path}`"
          @click="changeRoute(`/points/${route.path}`)"
        >
          <i :class="route.meta.icon"></i>
          <span slot="title">{{route.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <i
          :class="`el-icon-s-${ isCollapse ? 'unfold' : 'fold' }`"
          style="font-size: 28px; cursor: pointer;"
          @click="changeIsCollapse"
        ></i>
        <span></span>
      </el-header>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view :key="key"/>
          </keep-alive>
        </transition>
      </el-main>
      <el-footer>Integral Management System ©2019 Created by Didida Group.</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import router from '../router';

export default {
  name: 'Layout',
  data() {
    return {
      isCollapse: true,
    };
  },
  components: {},
  computed: {
    key() {
      return this.$route.path;
    },
    menus() {
      const {
        options: { routes },
      } = router;
      return routes[routes.length - 1].children;
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    changeIsCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    changeRoute(url) {
      router.push(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header,
.el-footer {
  text-align: center;
  line-height: 60px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  background-color: #FFF;
  color: #333;
  text-align: left;
}

.el-aside {
  background-color: #304156;
  color: #fff;
  text-align: center;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 176px;
}

body > .el-container {
  margin-bottom: 40px;
  min-height: 100vh;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
