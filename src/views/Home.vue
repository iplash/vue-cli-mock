<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <button @click="demo">测试</button>
    <img alt="Vue logo" src="../assets/logo.png">
    <Main/>
  </div>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/global/cc-svg-icon';

export default {
  name: 'home',
  components: {
    Main,
  },
  methods: {
    demo() {
      this.$store.dispatch('user/login', { username: 'admin', pwd: 'admin' });
    },
  },
};
</script>
