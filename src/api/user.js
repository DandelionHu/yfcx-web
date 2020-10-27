import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/managerLogin',
    method: 'post',
    data
  })
}
// 菜单
export function findLoginList(data) {
  return request({
    url: '/admin/baseAuthority/findLoginList',
    method: 'post',
    data
  })
}
// 按钮权限
export function findLoginKeys(data) {
  return request({
    url: '/admin/baseAuthority/findLoginKeys',
    method: 'post',
    data
  })
}
// 退出
export function logout() {
  return request({
    url: '/admin/managerLogout',
    method: 'post'
  })
}
