import store from '@/store'
// 权限指令
function checkPermission(el, binding) {
  let permission
  let type
  if (Object.prototype.toString.call(binding.value) === '[object Object]') {
    permission = binding.value.permission
    type = binding.value.type
  } else {
    permission = binding.value || binding.arg
  }
  const roles = store.getters && store.getters.roles
  if (permission.length > 0) {
    const hasPermission = roles.includes(permission)
    if (!hasPermission) {
      if (type) {
        // 不可点击
        el.disabled = true
        el.style.opacity = 0.4
        el.style.cursor = 'not-allowed'
      } else {
        // 删除节点
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    // throw new Error(`无权限`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
