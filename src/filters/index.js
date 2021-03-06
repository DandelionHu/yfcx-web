// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
import moment from 'moment'
import toFixed from 'num-tofixed'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * 数字转换，保留多少位
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
  千分号
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
// 千克转换吨,保留几位小数
export function KGTonne(val, digits) {
  digits = digits || 5
  return toFixed((val / 1000), digits, true)
}
// 四舍五入
export function rounded(val, digits) {
  digits = digits || 2
  return toFixed(val, digits, true)
}
// 截取
export function cutOut(val, digits) {
  digits = digits || 2
  return toFixed(val, digits, false)
}
/**
 * abc => "Abc" 首字母大写
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
// 过滤 毫秒 转换成日期
export function dayjs(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
}
