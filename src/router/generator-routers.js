import Layout from '@/layout'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}
// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  Layout: Layout,
  // 你需要动态引入的页面组件
  // 新闻资讯
  'newsTag': () => import(/* webpackChunkName: "fail" */'@/views/news/newsTag'),
  'newsList': () => import(/* webpackChunkName: "fail" */'@/views/news/newsList'),
  // 招聘列表
  'recruitList': () => import(/* webpackChunkName: "fail" */'@/views/recruit/recruitList'),
  'recruitTag': () => import(/* webpackChunkName: "fail" */'@/views/recruit/recruitTag'),
  // 系统设置
  'managerList': () => import(/* webpackChunkName: "fail" */'@/views/baseManager/managerList'),
  'roleList': () => import(/* webpackChunkName: "fail" */'@/views/baseRole/roleList'),
  'addAuthority': () => import(/* webpackChunkName: "fail" */'@/views/baseAuthority/addAuthority')
}
/**
 * 动态生成菜单
 */
export const generatorDynamicRouter = (menu) => {
  return new Promise((resolve, reject) => {
    const childrenNav = []
    // 后端数据, 根级树数组,  根级 PID
    listToTree(menu, childrenNav, '0')
    const routers = generator(childrenNav)
    routers.push(notFoundRouter)
    resolve(routers)
  })
}
/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单 parentId=0
    if (item.pid === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      path: item.path || '',
      // 路由名称，建议唯一
      name: item.namekey || '',
      // 该路由对应页面的
      component: item.htmlurl ? constantRouterComponents[item.htmlurl] : Layout,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.name,
        icon: item.icon ? item.icon : undefined,
        roles: item.authKeys
      }
    }
    // 是否设置了隐藏菜单
    if (item.showMenu === '1') {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (item.hideChildren === '1') {
      currentRouter.hideChildrenInMenu = true
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
