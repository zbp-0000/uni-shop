<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址</button>
    </view>

    <!-- 渲染收获信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">
            收货人：
            <text>{{ address.userName }}</text>
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：
            <text>{{ address.telNumber }}</text>
          </view>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-boder"></image>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
  name: 'my-address',
  data() {
    return {
      // 2.1 注释掉下面的 address 对象，使用 2.2 中的代码替代之
      // address: {} // 收货地址对象
    };
  },
  methods: {
    // 3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
    ...mapMutations('m_user', ['updateAddress']),
    // 选择收货地址
    async chooseAddress() {
      // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
      //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
      const [err, succ] = await uni.chooseAddress().catch(err => err);
      console.log(err, succ);
      // 2. 用户成功的选择了收货地址
      if (err === null && succ.errMsg === 'chooseAddress:ok') {
        // 为 data 里面的收货地址对象赋值
        // this.address = succ; // 替换成this.updateAddress(succ)
        // 3.3 调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面
        this.updateAddress(succ);
      }

      // 这种判断只能判断，安卓或者微信模拟器;完善 if 语句：加上err.errMsg === 'chooseAddress:fail authorize no response' 来判断苹果设备
      // 判断用户 是否授权 访问地址
      if ((err && err.errMsg === 'chooseAddress:fail auth deny') || err.errMsg === 'chooseAddress:fail authorize no response') {
        console.log('需要重新授权');
        // 通过调用这个方法，让用户重新授权
        this.reAuth();
      }
    },
    // 调用此方法，重新发起收货地址的授权
    async reAuth() {
      // 3.1 提示用户对地址进行授权
      const [err2, confirmResult] = await uni.showModal({
        content: '检测到您没打开地址权限，是否去设置打开',
        confirmText: '确认',
        cancelText: '取消'
      });
      console.log(confirmResult);
      // 如果弹框出错，直接return
      if (err2) return;
      // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
      if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！');

      // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
      if (confirmResult.confirm)
        return uni.openSetting({
          // 3.4.1 授权结束，需要对授权的结果做进一步判断
          success: settingResult => {
            // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址');
            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！');
          }
        });
    }
  },
  computed: {
    // 2.2 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
    ...mapState('m_user', ['address']),
    ...mapGetters('m_user', ['addstr'])
  }
};
</script>

<style lang="scss">
.address-boder {
  display: block;
  width: 100%;
  height: 5px;
}

.address-choose-box {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address-info-box {
  font-size: 12px;
  display: flex;
  height: 90px;
  flex-direction: column;
  justify-content: center;
  padding: 5px;
  .row1 {
    display: flex;
    justify-content: space-between;
    .row1-right {
      display: flex;
      justify-content: space-between;
    }
  }
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>
