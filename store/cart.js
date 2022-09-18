export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]') // 每次加载的时候，从本地拿数据，如果本地没有就是空数组
  }),

  // 模块的 mutations 方法
  mutations: {
    // 删除购物车商品方法
    removeGoodsById(state, goods_id) {
      // 通过 filter 过滤（过滤掉数组中不是这个id元素的，然后返回出来）
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 数据持久化
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车商品数量的方法
    updateGoodsCount(state, goods) {
      // 查找cart中有没有这个商品，有的话，就返回出来
      const findResult = state.cart.find(x => x.goods_id === goods
        .good_id) // 离谱！！！ 这里外面返回的goods数据，里面good_id  没有 s ！！！！！
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    addToCart(state, goods) {
      // 判断是否有这个商品，根据goods_id 来判断
      const finResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // console.log(finResult); // 商品信息
      if (!finResult) { // 如果没有，就把这个商品push到cart数组里
        state.cart.push(goods)
      } else {
        // 如果有这个商品，就让这个商品数量+1
        finResult.goods_count++
      }

      // 调用本地存储的方法
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },

    // 数据持久化方法
    saveToStorage(state) {
      // 调用uni.setStorageSync把数据存到本地，cart是名字，JSON.stringify(state.cart)是转为字符串的数据
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },

  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {

      // let c = 0
      // // 循环统计商品的数量，累加到变量 c 中
      // state.cart.forEach(goods => c += goods.goods_count)
      // return c
      // 改造为如下：

      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量

      // goods_state 是勾选状态
      // reduce方法：total 是初始化的值(这里为0)，item为第(每)一个商品
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选商品的总价格
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price,
          0)
        .toFixed(2)
    }
  },
}
