<template>
  <view>
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState } from 'vuex';
export default {
  // 将 badgeMix 混入到当前的页面中进行使用
  mixins: [badgeMix],
  data() {
    return {};
  },
  computed: {
    ...mapState('m_user', ['token'])
  },
  onLoad() {}
};
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>
