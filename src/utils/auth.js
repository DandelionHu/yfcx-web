import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserKey = 'Admin-UserInfo'
// token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 用户信息
export function getUserInfo() {
  const userInfo = Cookies.get(UserKey)
  return userInfo ? JSON.parse(userInfo) : {}
}

export function setUserInfo(userInfo) {
  return Cookies.set(UserKey, JSON.stringify(userInfo))
}

export function removeUserInfo() {
  return Cookies.remove(UserKey)
}
