import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
// 请求白名单
const whiteUrl = ['/managerLogin']
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(config => {
  // 白名单过滤
  const url = config.url.replace(config.baseURL, '') // 前缀替换
  if (!whiteUrl.some(item => url === item)) {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
  }

  // 检测是否包含文件类型
  let hasFile = false
  // 循环data，检测是否有数组
  for (const key in config.data) {
    const item = config.data[key]
    if (item instanceof FileList || item instanceof File || item instanceof Blob) {
      hasFile = true
    }
    if (Array.isArray(config.data[key])) {
      // 是数组,阻止深度序列化
      config.data = qs.stringify(config.data, { indices: false })
      return config
    }
  }
  // 处理提交参数
  if (!hasFile) {
    config.data = qs.stringify(config.data) // 转为formdata数据格式
  } else {
    // 检测到存在文件使用 FormData 提交数据
    const formData = new FormData()
    Object.keys(config.data).forEach(key => {
      formData.append(key, config.data[key])
    })
    config.data = formData
  }
  return config
}, errorHandler)

// 响应拦截
service.interceptors.response.use(response => {
  const { code, message, isSuccess } = response.data
  if (code !== -1 && isSuccess) {
    // 获取数据成功
    return response.data
  } else {
    Message({
      message: message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(message || 'Error'))
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
