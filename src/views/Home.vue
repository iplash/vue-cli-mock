<template>
  <div class="home">
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
};
</script>
