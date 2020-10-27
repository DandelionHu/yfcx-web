// eslint-disable-next-line no-unused-vars
import { login, logout, findLoginList, findLoginKeys } from '@/api/user'
import { getToken, setToken, removeToken, setUserInfo, removeUserInfo, getUserInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: getUserInfo(),
  menu: [], // 菜单
  roles: [] // 权限
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { returnValue } = response
        // 设置token
        commit('SET_TOKEN', returnValue.token)
        // 设置用户信息
        commit('SET_USERINFO', returnValue)
        // 存储到cookie
        setToken(returnValue.token)
        setUserInfo(returnValue)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取权限信息
  getLoginList({ commit, state }) {
    return new Promise((resolve, reject) => {
      findLoginList({}).then(response => {
        // 获取到菜单为空
        if (!response.returnValue || response.returnValue.length === 0) {
          reject('无菜单')
        } else {
          // 获取按钮
          findLoginKeys({}).then(res => {
            commit('SET_ROLES', res.returnValue)
            commit('SET_MENU', response.returnValue)
            resolve(response.returnValue)
          })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        commit('SET_ROLES', [])
        // 清除token
        removeToken()
        removeUserInfo()
        // 重置路由
        resetRouter()
        // 清空tagsview
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 清除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      commit('SET_ROLES', [])
      removeToken()
      removeUserInfo()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true, // 调用时要加文件名
  state,
  mutations,
  actions
}
