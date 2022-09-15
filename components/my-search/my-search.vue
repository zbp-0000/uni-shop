<template>
  <view class="my-search-container" :style="{ 'background-color': bgcolor }" @click="searchBoxHandler">
    <!-- 使用view组件模拟输入框 -->
    <view class="my-search-box" :style="{ 'border-radius': radius + 'px' }">
      <!-- 使用uni-ui提供的图标 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-search',
  props: {
    bgcolor: {
      type: String,
      default: '#c00000'
    },
    radius: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {};
  },
  methods: {
    searchBoxHandler() {
      console.log('~~~');
      // 通过子传父的方式，通知父组件，触发自定义事件
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  padding: 0 10px;
  // background-color: #c00000;
}
.my-search-box {
  height: 36px;
  background-color: #fff;
  // border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>
