<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box"><my-search @click="gotoSearch"></my-search></view>

    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"><image :src="item.image_src"></image></navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-list" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)"><image :src="item.image_src" class="nav-img"></image></view>
    </view>

    <!-- 楼层 -->
    <view class="floor-list">
      <!-- 楼层 item 顶 -->
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大盒子 -->
          <navigator :url="item.product_list[0].url" class="left-img-box">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
          </navigator>
          <!-- 右侧小盒子 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item" v-for="(item2, index2) in item.product_list" :key="index2">
              <image :src="item2.image_src" mode="widthFix" v-if="index2 !== 0" :style="{ width: item2.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 1.1 轮播图的数据列表，默认为空数组
      swiperList: [],
      // 2.1 分类导航数据列表
      navList: [],
      // 3.1 楼层数据
      floorList: []
    };
  },
  onLoad() {
    // 1.2 调用方法，获取轮播图数据
    this.getSwiperList();
    // 2.2 调用方法，获取分类导航数据
    this.getNavList();
    // 3.2 调用方法，获取楼层数据
    this.getFloorList();
  },

  methods: {
    // 点击搜索触发事件
    gotoSearch() {
      console.log('ok');
      // 跳转到search、页面
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    },
    // 1.3. 获取轮播图数据的方法
    async getSwiperList() {
      // 1.4 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
      console.log('轮播图数据', res);
      // 1.5 请求失败
      if (res.meta.status !== 200) {
        return uni.$showMsg();
        // 简化下面的方法（方便复用，挂载到uni实力上，在main.js）
        // return uni.showToast({
        //   title: '数据请求失败',
        //   duration: 1500, // 1.5秒后关闭弹框
        //   icon: 'none'
        // })
      }
      // 1.6 请求成功，为 data 中的数据赋值
      this.swiperList = res.message;
    },

    // 2.3. 获取轮播图数据的方法
    async getNavList() {
      // 2.4 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
      console.log('分类导航数据', res);
      // 2.5 请求失败
      if (res.meta.status !== 200) return uni.showMsg();
      // 2.6 请求成功，为 data 中的数据赋值
      this.navList = res.message;
    },

    // 分类跳转
    navClickHandler(item) {
      console.log('点击分类导航的数据', item);
      uni.switchTab({
        url: '/pages/cate/cate'
      });
      if (item.name === '分类') {
      }
    },

    // 3.3 获取楼层数据的方法
    async getFloorList() {
      // 3.4 调接口
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');
      console.log('楼层数据', res);
      // 3.5 失败
      if (res.meta.status !== 200) return uni.$showMsg();
      // 3.7 对数据进行处理
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
        });
      });
      // 3.6 成功 => 赋值
      this.floorList = res.message;
    }
  }
};
</script>

<style lang="scss">
// 轮播图
swiper {
  height: 330rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}
// 分类导航
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
// 楼层
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
// 楼层右层小盒子
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}

// 搜索页面吸顶
.search-box {
  // 定位
  position: sticky;
  // 定位的位置
  top: 0;
  // 层级
  z-index: 999;
}
</style>
