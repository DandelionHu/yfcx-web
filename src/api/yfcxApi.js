import request from '@/utils/request'
// 全部权限
export function baseAuthorityFindList(data) {
  return request({
    url: '/admin/baseAuthority/findList',
    method: 'post',
    data
  })
}
// 保存权限
export function baseAuthoritySaveAuthority(data) {
  return request({
    url: '/admin/control/baseAuthority/saveAuthority',
    method: 'post',
    data
  })
}
// 保存权限
export function baseAuthorityFindById(data) {
  return request({
    url: '/admin/baseAuthority/findById',
    method: 'post',
    data
  })
}
// 标记删除
export function baseAuthorityDeleteAll(data) {
  return request({
    url: '/admin/baseAuthority/deleteAll',
    method: 'post',
    data
  })
}
// 物理删除
export function baseAuthorityDeleteRealById(data) {
  return request({
    url: '/admin/control/baseAuthority/deleteRealById',
    method: 'post',
    data
  })
}
// 招聘列表
export function baseRecruitFindList(data) {
  return request({
    url: '/admin/baseRecruit/findList',
    method: 'post',
    data
  })
}
// 招聘详情
export function baseRecruitFindById(data) {
  return request({
    url: '/admin/baseRecruit/findById',
    method: 'post',
    data
  })
}
// 删除招聘
export function baseRecruitDeleteAll(data) {
  return request({
    url: '/admin/control/baseRecruit/deleteAll',
    method: 'post',
    data
  })
}
// 保存招聘
export function baseRecruitSaveRecruit(data) {
  return request({
    url: '/admin/control/baseRecruit/saveRecruit',
    method: 'post',
    data
  })
}
// 修改招聘
export function baseRecruitUpdateState(data) {
  return request({
    url: '/admin/control/baseRecruit/updateState',
    method: 'post',
    data
  })
}
// 数据库字典列表
export function baseFieldFindList(data) {
  return request({
    url: '/admin/baseField/findList',
    method: 'post',
    data
  })
}
// 数据库字典保存
export function baseFieldSaveField(data) {
  return request({
    url: '/admin/control/baseField/saveField',
    method: 'post',
    data
  })
}
// 数据库字典详情
export function baseFieldFindById(data) {
  return request({
    url: '/admin/baseField/findById',
    method: 'post',
    data
  })
}
// 数据库字典删除
export function baseFieldDeleteAll(data) {
  return request({
    url: '/admin/control/baseField/deleteAll',
    method: 'post',
    data
  })
}
