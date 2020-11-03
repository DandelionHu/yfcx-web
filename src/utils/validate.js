/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 是否是url
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 是否是小写字母
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 是否是大写字母
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 是否是字母
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 是否是邮箱
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 是否是字符串
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 是否是数组
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
// 只能输入正整数
export function positiveInteger(val) {
  if (val !== '' && val !== undefined && val !== null) {
    val = val.replace(/[^\d]/g, '') // 清除“数字”以外的字符
    return val
  }
}
// 只能输入整数
export function integer(val) {
  if (val !== '' && val !== undefined && val !== null) {
    val = val.replace(/[^-\d]/g, '') // 清除“数字”以外的字符
    val = val.replace(/\-{2,}/g, '-') // 只保留第一个- 清除多余的.
    val = val.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-')
    return val
  }
}
// 只能输入正金额，两位小数
export function positiveCheckPrice(val) {
  if (val !== '' && val !== undefined && val !== null) {
    val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    val = val.replace(/^\./g, '') // 验证第一个字符是数字而不是.
    val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    const re = /([0-9]+.[0-9]{2})[0-9]*/
    val = val.replace(re, '$1')
    return val
  }
}
// 只能输入金额，两位小数
export function checkPrice(val) {
  if (val !== '' && val !== undefined && val !== null) {
    val = val.replace(/[^-\d.]/g, '') // 清除“数字”和“.”以外的字符
    val = val.replace(/^\./g, '') // 验证第一个字符是数字而不是.
    val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
    val = val.replace(/\-{2,}/g, '-') // 只保留第一个- 清除多余的.
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    val = val.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-')
    val = val.replace('-.', '$#$').replace('$#$', '-')
    if (val.indexOf('-') > 0) {
      val = val.replace('-', '')
    }
    const re = /([0-9]+.[0-9]{2})[0-9]*/
    val = val.replace(re, '$1')
    return val
  }
}
// 字母和数字
export function checkMix(val) {
  return val.replace(/[^\w]/g, '')
}
