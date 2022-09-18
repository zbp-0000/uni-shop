<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" />
      <text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>
    <!-- 结算 -->
    <view class="btn-settle">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {};
  },
  computed: {
    // 1. 将 total 映射到当前组件中
    ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
    // 2. 是否全选 然后在radio绑定 isFullCheck 属性来实现 未选中状态
    isFullCheck() {
      return this.total === this.checkedCount;
    }
  },
  methods: {
    // 2. 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
    ...mapMutations('m_cart', ['updateAllGoodsState']),
    // label 的点击事件处理函数
    changeAllState() {
      // 修改购物车中所有商品的选中状态
      // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
      this.updateAllGoodsState(!this.isFullCheck);
    }
  }
};
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: aliceblue;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;

  // 全选
  .radio {
    display: flex;
    align-items: center;
  }
  // 合计
  .amount-box {
    .amount {
      color: #c00000;
    }
  }
  // 结算按钮
  .btn-settle {
    height: 50px;
    min-width: 100px;
    color: aliceblue;
    text-align: center;
    line-height: 50px;
    padding: 0 10px;
    background-color: #c00000;
  }
}
</style>
