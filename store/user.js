export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    // 3. 读取本地的收货地址数据，初始化 address 对象(⬇这个address是本地存储 键值对 键的名字)
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),

  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 2. 调用数据持久化
      this.commit('m_user/saveAddressToStorage')

    },
    // 1. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },

  // 数据包装器
  getters: {

    // 收货详细地址的计算属性
    addstr(state) {
      // 先判断这个收货地址对象，是否为空对象
      if (!state.address.provinceName) return '';

      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo;
    }
  },
}
