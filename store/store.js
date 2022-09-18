// 1.1 导入包 vue vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 2.1 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 3.1 导入收货地址的 vuex 模块
import modeleUser from './user.js'

// 1.2. 挂载
Vue.use(Vuex)
// 1.3. 创建实例对象
const store = new Vuex.Store({
  modules: {
    // 2.2 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
    //    购物车模块中 cart 数组的访问路径是 m_cart/cart
    'm_cart': moduleCart,
    // 3.2 挂载收货地址的 vuex 模块，模块内成员的访问路径被调整为 m_user，例如：
    //    收货地址模块中 cart 数组的访问路径是 m_user/cart
    'm_user': modeleUser
  }
})
// 4. 共享出去
export default store
