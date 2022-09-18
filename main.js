// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

// 导入 网络请求的 包
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http // 挂载到 uni 实例上
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({ // 显示loading
    title: '数据加载中...'
  })
}
// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading() // 关闭loading
}

// 封装uni.$showMsg 方法，并且是挂载到 uni 实例上的，今后需要提示消息的时候，直接调用uni.$showMsg 方法即可
uni.$showMsg = function(title = '数据加载失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 2. 将 store 挂载到 Vue 实例上
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
