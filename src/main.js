import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 公共 css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 全局路由守卫
import './utils/error-log' // 错误日志
import directive from './directive/permission'

import * as filters from './filters' // 全局过滤器

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置 element-ui 布局大小
})
Vue.use(directive) // 按钮权限指令

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
