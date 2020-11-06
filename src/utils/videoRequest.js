import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/videoAuth'
// 请求白名单
const whiteUrl = ['/login.do']
// 创建 axios 实例
const service = axios.create({
  baseURL: '', // url = base url + request url
  timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(config => {
  // 白名单过滤
  const url = config.url.replace(config.baseURL, '') // 前缀替换
  if (!whiteUrl.some(item => url === item)) {
    if (store.getters.token) {
      config.params.token = getToken()
    }
  }
  return config
}, errorHandler)

// 响应拦截
service.interceptors.response.use(response => {
  const { Msg, Ok } = response.data
  if (Ok) {
    // 获取数据成功
    return response.data
  } else {
    Message({
      message: Msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(Msg || 'Error'))
  }
}, errorHandler)
// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 获取 token
    const token = getToken()
    if (error.response.status === 400) {
      Message({
        message: '参数错误',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 403) {
      Message({
        message: 'Forbidden',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 404) {
      Message({
        message: '接口不存在',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 406) {
      MessageBox.confirm('Token已失效，是否重新登录', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    if (error.response.status === 408) {
      Message({
        message: '无操作权限',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Message({
        message: 'Authorization verification failed',
        type: 'error',
        duration: 5 * 1000
      })
      if (token) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
    }
  }
  return Promise.reject(error)
}

export default service
