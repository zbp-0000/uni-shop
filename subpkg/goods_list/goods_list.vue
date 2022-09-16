<template>
  <view>
    <view class="goods-list">
      <!-- block标签，不会实际渲染到结构中，起到一个包裹的性值 -->
      <!-- 把block改为 view 因为block不能绑定点击事件 -->
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)"><my-goods :goods="goods"></my-goods></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 请求参数对象
      queryObj: {
        // 查询关键词
        query: '',
        // 商品分类id
        cid: '',
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },
      // 商品列表的数据
      goodsList: [],
      // 总数量，用来实现分页
      total: 0,
      // 节流阀 === 是否正在请求数据
      isloading: false
    };
  },
  onLoad(options) {
    console.log(options);
    this.queryObj.query = options.query || '';
    this.queryObj.cid = options.cid || '';

    // 调用获取商品列表数据的方法
    this.getGoodsList();
  },
  methods: {
    gotoDetail(item) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
      });
    },
    // 获取商品列表数据的方法
    async getGoodsList(cb) {
      // cb 接受的是：停止下拉刷新的回调函数
      // 打开节流阀
      this.isloading = true;

      const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);

      // 只要数据请求完毕，就立即按需调用 cb 回调函数
      cb && cb();

      // 关闭节流阀
      this.isloading = false;
      if (res.meta.status !== 200) return uni.$showMag();
      // 为数据赋值，通过扩展运算符的形势，进行新旧数据的拼接
      this.goodsList = [...this.goodsList, ...res.message.goods]; // 10条商品数据
      this.total = res.message.total; // 总数居条数
    }
  },
  // 触底的函数 让页面加载数据 并且要在pages.json 开启触底距离
  onReachBottom() {
    // 判断是否还有下一页数据
    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！');
    // 判断节流阀 为true时，不请求数据
    if (this.isloading) return;
    // 让页码值自增+1
    this.queryObj.pagenum += 1;
    this.getGoodsList();
  },

  // 上拉刷新函数
  onPullDownRefresh() {
    // 重置关键数据
    this.queryObj.pagenum = 1; // 页码重置为1
    this.total = 0; // 总数量条数重置为0
    this.isloading = false; // 关闭节流阀
    this.goodsList = []; // 重置商品数据
    // 重新发起数据请求
    // 调用数据请求函数，并且把 停止函数 传到 数据请求函数函数
    this.getGoodsList(() => uni.stopPullDownRefresh());
  }
};
</script>

<style lang="scss"></style>
