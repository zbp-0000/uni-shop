<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'my-login',
  data() {
    return {};
  },
  computed: {
    ...mapState('m_user', ['redirectInfo'])
  },
  methods: {
    // updateUserInfo 更新用户的基本信息(并且回存储到本地)
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
    // 获取微信用户的基本信息
    getUserInfo(e) {
      console.log('用户的基本信息', e);
      // 判断用户是否授权成功
      // if (e.detail.errMsg !== 'getUserInfo:ok') return uni.$showMsg('您取消了授权');
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！');
      console.log(e.detail.userInfo);

      // 调用存储更新用户信息的方法
      this.updateUserInfo(e.detail.userInfo);

      // 调用获取token方法，并把拿到的一部分数据传过去
      this.getToken(e.detail);
    },
    // 调用登录接口，换取永久的 token
    async getToken(info) {
      // 调用微信登录接口 uni.login()
      const [err, res] = await uni.login().catch(err => err);
      console.log('res', res);
      if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败');

      // 准备参数
      const query = {
        code: res.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      };

      // 换取 token
      const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
      // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！');

      // 直接把token保存到vuex中
      let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o';
      this.updateToken(token);

      // 判断 vuex 中的 redirectInfo 是否为 null
      // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
      this.navigateBack();
    },

    // 返回登录之前的那个页面函数
    navigateBack() {
      if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
        // 调用uni.switchTab 进行bavbar的跳转
        uni.switchTab({
          url: this.redirectInfo.from,
          complete: () => {
            // this.$store.commit('m_user/updateRedirectInfo', null);
            this.updateRedirectInfo(null);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  // 伪元素 绘制椭圆
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translateY(50%);
    background-color: #fff;
  }
  .btn-login {
    width: 90%;
    margin: 15px 0;
    background-color: #c00000;
    border-radius: 100px;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
