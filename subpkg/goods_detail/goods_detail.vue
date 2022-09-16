<template>
  <view v-if="goods_info.goods_name" class="goods-deteil-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i"><image :src="item.pics_big" @click="preview(i)"></image></swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{ goods_info.goods_price }}</view>
      <!-- 商品信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品的名字 -->
        <view class="goods-name">{{ goods_info.goods_name }}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
        <!-- 运费 -->
      </view>
      <view class="yf">快递：免运费</view>
    </view>

    <!-- 富文本内容 -->
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 是否圆角 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 商品详情对象
      goods_info: {},
      // 左侧按钮的配置对象
      options: [
        {
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: 'red'
        },
        {
          icon: 'cart',
          text: '购物车',
          info: 2
        }
      ],
      // 右侧的配置对象
      buttonGroup: [
        {
          text: '加入购物车',
          backgroundColor: '#ff0000',
          color: '#fff'
        },
        {
          text: '立即购买',
          backgroundColor: '#ffa200',
          color: '#fff'
        }
      ]
    };
  },
  onLoad(options) {
    // options 获取到商品id
    const goods_id = options.goods_id;
    // 调用请求商品数据详情的方法
    this.getGoodsDetail(goods_id);
  },
  methods: {
    // 左侧按钮（店铺、购物车）
    onClick(e) {
      if (e.content.text === '购物车') {
        // 跳转到购物车页面、
        uni.switchTab({
          url: '/pages/cart/cart'
        });
      }
    },
    // 右侧按钮（加入购物车、立即购买）
    buttonClick(e) {
      console.log(e);
      this.options[2].info++;
    },
    // 实现轮播图的预览效果
    preview(i) {
      // 调用 uni.previewImage() 方法预览图片
      uni.previewImage({
        // 预览时，默认显示图片的索引
        current: i,
        // 所有图片 url 地址的数组
        urls: this.goods_info.pics.map(x => x.pics_big)
      });
    },
    // 定义请求商品详情数据的方法
    async getGoodsDetail(goods_id) {
      // 调接口 并且把商品id传给接口，id从哪里来的？从上一个页面，一层一层传下来的
      const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id: goods_id });
      // 使用字符串的 replace() 替换方法，用正则来替换，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style ="display:block;"').replace(/webp/g, 'jpg');
      console.log(res);
      if (res.meta.status !== 200) return uni.$showMsg();
      this.goods_info = res.message;
    }
  }
};
</script>

<style lang="scss">
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
// 购物车按钮的样式
.goods_nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
// 页面内容的底部内边距
.goods-deteil-container {
  padding-bottom: 50px;
}
</style>
