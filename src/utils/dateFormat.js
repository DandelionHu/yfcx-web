import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
// 获取今天日期
export function getTodayDate() {
  return [moment().format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')]
}
// 获取今天时间
export function getTodayTime() {
  return [moment().format('YYYY-MM-DD 00:00:00'),
    moment().format('YYYY-MM-DD 23:59:59')]
}
// 获取昨天日期
export function getYesterdayDate() {
  return [moment().subtract(1, 'days').format('YYYY-MM-DD'),
    moment().subtract(1, 'days').format('YYYY-MM-DD')]
}
// 获取昨天时间
export function getYesterdayTime() {
  return [moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
    moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')]
}
// 获取本周日期
export function getCurrentWeekDate() {
  return [moment().day('Monday').format('YYYY-MM-DD'),
    moment().day('Monday').day(+7).format('YYYY-MM-DD')]
}
// 获取本周时间
export function getCurrentWeekTime() {
  return [moment().day('Monday').format('YYYY-MM-DD 00:00:00'),
    moment().day('Monday').day(+7).format('YYYY-MM-DD 23:59:59')]
}
// 获取本月日期
export function getCurrentMonthDate() {
  return [moment().startOf('month').format('YYYY-MM-DD'),
    moment().endOf('month').format('YYYY-MM-DD')]
}
// 获取本月时间
export function getCurrentMonthTime() {
  return [moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
    moment().endOf('month').format('YYYY-MM-DD 23:59:59')]
}
// 获取最近第几天
export function getLastFewDays(day) {
  return moment().subtract(day, 'days').format('YYYY-MM-DD')
}
// 获取最近第几月
export function getLastFewMonth(month) {
  return moment().subtract(month, 'month').format('MM')
}
// 获取最近第几年
export function getLastFewYear(year) {
  return moment().subtract(year, 'year').format('YYYY')
}
// 获取最近第几天 数组
export function getLastFewDaysArr(day) {
  if (day > 0) {
    return [moment().subtract(day, 'days').format('YYYY-MM-DD'),
      moment().subtract(0, 'days').format('YYYY-MM-DD')]
  } else {
    return [moment().subtract(0, 'year').format('YYYY-MM-DD'),
      moment().subtract(day, 'days').format('YYYY-MM-DD')]
  }
}
// 获取最近第几月 数组
export function getLastFewMonthArr(month) {
  if (month > 0) {
    return [moment().subtract(month, 'month').format('MM'),
      moment().subtract(0, 'month').format('MM')]
  } else {
    return [moment().subtract(0, 'year').format('MM'),
      moment().subtract(month, 'month').format('MM')]
  }
}
// 获取最近几年 数组
export function getLastFewYearArr(year) {
  if (year > 0) {
    return [moment().subtract(year, 'year').format('YYYY'),
      moment().subtract(0, 'year').format('YYYY')]
  } else {
    return [moment().subtract(0, 'year').format('YYYY'),
      moment().subtract(year, 'year').format('YYYY')]
  }
}
// 时间戳转换成日期
export function UnixToDate(unixTime, str) {
  str = str || 'YYYY-MM-DD HH:mm:ss'
  return moment(unixTime).format(str)
}
// 日期转换成时间戳
export function DateToUnix(data) {
  return moment(data).unix()
}
// 转换为日期
export function formatDate(value, format) {
  format = format || 'YYYY-MM-DD'
  return moment(value).format(format)
}
