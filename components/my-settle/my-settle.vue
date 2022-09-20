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
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {
      // 倒计时的秒数
      seconds: 3,
      // 定时器的 Id
      timer: null
    };
  },
  computed: {
    // 1. 将 total 映射到当前组件中
    ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
    // addstr 是详细的收货地址
    ...mapGetters('m_user', ['addstr']),
    // token 是用户登录成功之后的 token 字符串
    ...mapState('m_user', ['token']),
    ...mapState('m_cart', ['cart']),
    // 2. 是否全选 然后在radio绑定 isFullCheck 属性来实现 未选中状态
    isFullCheck() {
      return this.total === this.checkedCount;
    }
  },
  methods: {
    // 2. 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
    ...mapMutations('m_cart', ['updateAllGoodsState']),
    // 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
    // updateRedirectInfo 更新重定向的信息对象
    ...mapMutations('m_user', ['updateRedirectInfo']),
    // label 的点击事件处理函数
    changeAllState() {
      // 修改购物车中所有商品的选中状态
      // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
      this.updateAllGoodsState(!this.isFullCheck);
    },
    // 用户点击了结算按钮
    settlement() {
      // 1. 先判断是否勾选了要结算的商品
      if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！');

      // 2. 再判断用户是否选择了收货地址
      if (!this.addstr) return uni.$showMsg('请选择收货地址！');

      // 3. 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
      // if (!this.token) return uni.$showMsg('请先登录！');
      if (!this.token) return this.delayNavigate();

      // 4. 实现微信支付功能
      this.payOrder();
    },
    // 微信支付
    async payOrder() {
      // 1. 创建订单
      // 1.1 组织订单的信息对象
      const orderInfo = {
        // 订单价格
        order_price: this.checkedGoodsAmount,
        // 订单地址
        consignee_addr: this.addstr,
        // 商品列表内部存放商品（ID，amount和goods_price）列表
        goods: this.cart
          .filter(x => x.goods_state)
          .map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
      };
      // 1.2 发起请求创建订单
      const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
      console.log('res', res);
      // TODO 假数据
      const FakeDataOrderReference = {
        message: {
          order_id: 45,
          user_id: 12,
          order_number: 'GD20180504000000000045',
          order_price: 0.1,
          order_pay: '0',
          is_send: '否',
          trade_no: '',
          order_fapiao_title: '个人',
          order_fapiao_company: '',
          order_fapiao_content: '',
          consignee_addr: '广州市天河区',
          pay_status: '0',
          create_time: 1525408071,
          update_time: 1525408071,
          order_detail:
            '[{"goods_id":55578,"goods_name":"初语2017秋装新款潮牌女装加绒宽松BF风慵懒卫衣女套头连帽上衣","goods_price":279,"goods_small_logo":"http://image2.suning.cn/uimg/b2c/newcatentries/0070067836-000000000690453616_2_400x400.jpg","counts":1,"selectStatus":true}]',
          goods: [
            {
              id: 64,
              order_id: 45,
              goods_id: 5,
              goods_price: 15,
              goods_number: 11,
              goods_total_price: 15
            }
          ]
        },
        meta: { msg: '创建订单成功', status: 200 }
      };

      // if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！');
      // if (res.meta.status !== 200) return uni.$showMsg(res.meta.msg);
      // 1.3 得到服务器响应的“订单编号”
      const orderNumber = FakeDataOrderReference.message.order_number;
      console.log('假的订单编号', orderNumber);

      // 2. 订单预支付
      // 2.1 发起请求获取订单的支付信息
      const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber });
      console.log('res2', res2);
      // TODO 假数据 预支付订单
      const FakeDataPredict = {
        message: {
          pay: {
            timeStamp: '1525681145',
            nonceStr: 'BkPggorBXZwPGXe3',
            package: 'prepay_id=wx071619042918087bb4c1d3d72999385683',
            signType: 'MD5',
            paySign: 'D1642DEEF1663C8012EDEB9297E1D516'
          },
          order_number: 'GD20180507000000000110'
        },
        meta: { msg: '预付订单生成成功', status: 200 }
      };
      // 2.2 预付订单生成失败
      // if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！');
      // 2.3 得到订单支付相关的必要参数
      const payInfo = FakeDataPredict.message.pay;
      console.log('假的payInfo预支付订单', payInfo);

      // TODO
      // 3. 发起微信支付
      // 3.1 调用 uni.requestPayment() 发起微信支付
      const [err, succ] = await uni.requestPayment(payInfo);
      // 3.2 未完成支付
      if (err) return uni.$showMsg('订单未支付！');
      // 3.3 完成了支付，进一步查询支付的结果
      const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber });
      // 3.4 检测到订单未支付
      if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！');
      // 3.5 检测到订单支付完成
      uni.showToast({
        title: '支付完成！',
        icon: 'success'
      });
    },
    // 展示倒计时的提示消息
    showTips(n) {
      // 调用 uni.showToast() 方法，展示提示消息
      uni.showToast({
        // 不展示任何图标
        icon: 'none',
        // 提示的消息
        title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
        // 为页面添加透明遮罩，防止点击穿透
        mask: true,
        // 1.5 秒后自动消失
        duration: 1500
      });
    },
    // 延迟导航到 my 页面
    delayNavigate() {
      this.showTips(this.seconds);

      // 1. 将定时器的 Id 存储到 timer 中
      this.timer = setInterval(() => {
        this.seconds--;

        // 2. 判断秒数是否 <= 0
        if (this.seconds <= 0) {
          // 2.1 清除定时器
          clearInterval(this.timer);

          // 2.2 跳转到 my 页面
          uni.switchTab({
            url: '/pages/my/my',
            // 成功后的回调函数
            success: () => {
              // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
              this.updateRedirectInfo({
                // 跳转的方式
                openType: 'switchTab',
                // 从哪个页面跳转过去的
                from: '/pages/cart/cart'
              });
            }
          });

          // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
          return;
        }

        this.showTips(this.seconds);
      }, 1000);
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
