import {
  mapGetters
} from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    // 监听 total 值的变化
    // total() {
    //   // 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
    //   this.setBadge()
    // }
    total: {
      immediate: true,
      handler(newVal, oldVal) {
        this.setBadge()
      }
    }
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
      })
    },
  },
}
