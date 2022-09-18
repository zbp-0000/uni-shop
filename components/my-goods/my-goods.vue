<template>
  <!-- 封装的商品组件 -->
  <view class="goods-item">
    <!-- 左侧的盒子 -->
    <view class="goods-item-left">
      <!-- 动态绑定checked 在props：goods里面，有个goods_state属性 -->
      <radio v-if="showRadio" :checked="goods.goods_state" color="#c00000" @click="radioClickHandler"></radio>
      <image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 右侧的盒子 标题 价格 -->
    <view class="goods-item-right">
      <!-- 有些图片没有了，我们定义一个默认的图片，用来加载 -->
      <view class="goods-name">{{ goods.goods_name }}</view>
      <!-- 用过滤器过滤价格，保留2位小数 -->
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{ goods.goods_price | tofixed }}</view>
        <!-- 商品数量 -->
        <uni-number-box v-if="showNum" :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  // 定义 props 属性，用来接收外界传递到当前组件的数据
  props: {
    // 商品的信息对象
    goods: {
      type: Object,
      default: {}
    },
    // 是否展示图片左侧的 radio
    showRadio: {
      type: Boolean,
      // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
      default: false
    },
    // 是否展示价格右侧的 NumberBox 组件
    showNum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 默认的空图片
      defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
    };
  },
  methods: {
    // NumberBox 组件的 change 事件处理函数
    numChangeHandler(val) {
      console.log('改变后的商品数量', val);
      this.$emit('num-change', {
        // 商品id
        good_id: this.goods.goods_id,
        // 商品数量
        goods_count: +val
      });
    },
    // radio 组件的点击事件处理函数
    radioClickHandler() {
      // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
      // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
      this.$emit('radio-change', {
        // 商品的 Id
        goods_id: this.goods.goods_id,
        // 商品最新的勾选状态
        goods_state: !this.goods.goods_state
      });
    }
  },
  filters: {
    // 把数字处理为带两位小数点的数字
    tofixed(num) {
      return Number(num).toFixed(2);
    }
  }
};
</script>

<style lang="scss">
.goods-item {
  // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
  // 设置盒模型为 border-box
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  // 左
  .goods-item-left {
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-pic {
      width: 100px;
      height: 100px;
      // 避免底部有间隙
      display: block;
    }
  }
  // 右
  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    // 商品标题
    .goods-name {
      font-size: 13px;
    }
    // 价格文字
    .goods-info-box {
      color: #c00000;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
