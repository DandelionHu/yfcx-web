import request from '@/utils/videoRequest'
// 登录
export function login(data) {
  return request({
    url: '/login.do',
    method: 'GET',
    params: data
  })
}
// 获取分组
export function deviceTree(data) {
  return request({
    url: '/device-tree.do',
    method: 'GET',
    params: data
  })
}
