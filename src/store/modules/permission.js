import { asyncRoutes, constantRoutes } from '@/router'
import { generatorDynamicRouter } from '@/router/generator-routers'
/**
 * 使用 meta.role 过滤
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 路由权限存在
  if (route.meta && route.meta.roles) {
    // 路由权限 是否包含 获取到的权限
    // 匹配一条即为true
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 没定义默认有权限
    return true
  }
}

/**
 * 路由过滤
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // 遍历路由
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // 校验通过
      if (tmp.children) {
        // 校验子菜单
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 添加
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [], // 全部路由
  addRoutes: [] // 添加的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 合并
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 过滤路由
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // admin 全部路由
        accessedRoutes = asyncRoutes || []
      } else {
        // 过滤
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // 生成路由
  generateRoutesMenu({ commit }, menu) {
    return new Promise(resolve => {
      generatorDynamicRouter(menu).then(routers => {
        commit('SET_ROUTES', routers)
        resolve(routers)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
