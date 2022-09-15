<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <my-search @click="gotoSearch"></my-search>

    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{ height: wh + 'px' }">
        <block v-for="(item, index) in cateList" :key="index">
          <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChange(index)">{{ item.cat_name }}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{ height: wh + 'px' }" :scroll-top="scrollTop">
        <!-- 二级标题 -->
        <view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="index2">
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>

          <!-- 三级分类 item 项 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoFoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 当前设备可用的高度
      wh: 0,
      // 分类列表数据
      cateList: [],
      // 点击分类的索引
      active: 0,
      // 二级目录数据
      cateLevel2: [],
      // 滚动条距离顶部的距离
      scrollTop: 0
    };
  },
  onLoad() {
    // 1. 调用 uniapp 内置api uni.getSystemInfo()
    const sysInfo = uni.getSystemInfoSync();
    console.log('sysInfo', sysInfo);
    // 1.2 获取到可用的高度，赋值给data里的 wh
    this.wh = sysInfo.windowHeight - 50;

    // 调用获取分类列表数据的方法
    this.getCateList();
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
    // 获取分类数据
    async getCateList() {
      const { data: res } = await uni.$http.get('/api/public/v1/categories');
      console.log(res);
      if (res.meta.status !== 200) return uni.$showMsg();
      this.cateList = res.message;

      // 获取二级目录数据
      this.cateLevel2 = res.message[0].children;
    },
    // 左侧分类点击事件
    activeChange(i) {
      this.active = i;
      // 重新为二级分类赋值
      this.cateLevel2 = this.cateList[i].children;
      // 重置滚动条距离顶部的距离 并且scrollTop的值前后不能一样，所以让值在0 与 1 之间切换
      this.scrollTop = this.scrollTop === 0 ? 1 : 0;
    },

    // 跳转到分包对应的商品页面
    gotoFoodsList(item) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
      });
    }
  }
};
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
}
.left-scroll-view {
  width: 120px;

  .left-scroll-view-item {
    background-color: #f7f7f7;
    line-height: 60px;
    text-align: center;
    font-size: 12px;

    &.active {
      background-color: #fff;
      position: relative;

      &::before {
        content: '';
        display: block;
        background-color: #c00000;
        width: 3px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
      }
    }
  }
}

// 右侧区域
.right-scroll-view {
  background-color: #fff;
}
// 右侧标题
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    display: flex;
    margin-bottom: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    image {
      width: 60px;
      height: 60px;
    }
    text {
      font-size: 12px;
    }
  }
}
</style>
