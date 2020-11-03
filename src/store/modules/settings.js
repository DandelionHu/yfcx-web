import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import storage from 'store'

const { showSettings, tagsView, fixedHeader, colorWeak, supportPinyinSearch, sidebarLogo, skinPeeler, onePageRow } = defaultSettings

const state = {
  theme: storage.get('theme', variables.theme),
  showSettings: storage.get('showSettings', showSettings),
  tagsView: storage.get('tagsView', tagsView),
  fixedHeader: storage.get('fixedHeader', fixedHeader),
  sidebarLogo: storage.get('sidebarLogo', sidebarLogo),
  colorWeak: storage.get('colorWeak', colorWeak),
  skinPeeler: storage.get('skinPeeler', skinPeeler),
  supportPinyinSearch: storage.get('supportPinyinSearch', supportPinyinSearch),
  onePageRow: storage.get('onePageRow', onePageRow)
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      // 保存到localstorage
      storage.set(key, value)
    }
  }
}

const actions = {
  // 改变配置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

