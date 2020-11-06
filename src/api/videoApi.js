import request from '@/utils/videoRequest'
// 登录
export function login(data) {
  return request({
    url: '/mapVideo/login.do',
    method: 'GET',
    params: data
  })
}
// 获取分组
export function deviceTree(data) {
  return request({
    url: '/mapVideo/device-tree.do',
    method: 'GET',
    params: data
  })
}
// 获取流
export function camQuery(data) {
  return request({
    url: '/mapVideo/cam-query-by-id.do',
    method: 'GET',
    params: data
  })
}
// 录像结束
export function recordingStop(data) {
  return request({
    url: '/mapVideo/real-recording-stop.do',
    method: 'GET',
    params: data
  })
}
// 录像开始
export function recordingStart(data) {
  return request({
    url: '/mapVideo/real-recording-start.do',
    method: 'GET',
    params: data
  })
}
// 抓拍
export function snapshot(data) {
  return request({
    url: '/mapVideo/cam-real-snapshot.do',
    method: 'GET',
    params: data
  })
}
// 请求控制
export function requestPtz(data) {
  return request({
    url: '/mapVideo/request-ptz.do',
    method: 'GET',
    params: data
  })
}
// 控制
export function ptzControl(data) {
  return request({
    url: '/videoFile/ptz-control.do',
    method: 'GET',
    params: data
  })
}
// 录像文件
export function playbackQuery(data) {
  return request({
    url: '/mapVideo/css-playback-query.do',
    method: 'GET',
    params: data
  })
}
