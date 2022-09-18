<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>

    <view class="cart-title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 商品列表区域 -->
    <!-- uni-swipe-action 是最外层包裹性质的容器 -->
    <uni-swipe-action>
      <!-- 指定 :show-radio="true" 属性，从而显示 radio 组件： -->
      <block v-for="(goods, i) in cart" :key="i">
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
          <my-goods @radio-change="radioChangeHandler" :goods="goods" :showRadio="true" :showNum="true" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 使用自定义结算组件 -->
    <my-settle></my-settle>
  </view>

  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <textarea class="tip-text">空空如也</textarea>
  </view>
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState, mapMutations } from 'vuex';
export default {
  // 将 badgeMix 混入到当前的页面中进行使用
  mixins: [badgeMix],
  computed: {
    ...mapState('m_cart', ['cart'])
  },
  data() {
    return {
      options: [
        {
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }
      ]
    };
  },
  methods: {
    ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
    // 商品的勾选状态发生了变化
    radioChangeHandler(e) {
      console.log(e); // 输出得到的数据 -> {goods_id: 395, goods_state: false}
      // 调用vuex（cart.js）中的方法，存放goods_state的最新状态
      this.updateGoodsState(e);
    },
    // 商品的数量发生了变化
    numberChangeHandler(e) {
      console.log('count变化', e);
      this.updateGoodsCount(e);
    },
    // 点击了滑动操作按钮
    swipeActionClickHandler(goods) {
      console.log(goods);
      // 删除操作方法，并把id传过去
      this.removeGoodsById(goods.goods_id);
    }
  }
};
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  font-size: 14px;

  .cart-title-text {
    margin-left: 10px;
  }
}

// 空白购物车区域样式
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    text-align: center;
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
