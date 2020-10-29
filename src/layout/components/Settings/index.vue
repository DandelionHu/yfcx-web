<template>
  <div class="drawer-container">
    <h3 class="drawer-title">系统布局配置</h3>
    <div class="drawer-item">
      <span>按钮主题色</span>
      <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
    </div>
    <div class="drawer-item">
      <span>开启 Tags-View</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>固定 Header</span>
      <el-switch v-model="fixedHeader" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>侧边栏 Logo</span>
      <el-switch v-model="sidebarLogo" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>色弱模式</span>
      <el-switch v-model="colorWeak" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>换肤</span>
      <el-switch v-model="skinPeeler" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>菜单支持拼音搜索</span>
      <el-switch v-model="supportPinyinSearch" class="drawer-switch" />
    </div>
  </div>
</template>

<script>
// 颜色选择器
import ThemePicker from '@/components/ThemePicker'
import { addClass, removeClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css

export default {
  components: { ThemePicker },
  data() {
    return {}
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    colorWeak: {
      get() {
        return this.$store.state.settings.colorWeak
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'colorWeak',
          value: val
        })
      }
    },
    skinPeeler: {
      get() {
        return this.$store.state.settings.skinPeeler
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'skinPeeler',
          value: val
        })
      }
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'supportPinyinSearch',
          value: val
        })
      }
    }
  },
  watch: {
    colorWeak: {
      handler: function(val, oldVal) {
        this.updateColorWeak(val)
      },
      immediate: true
    },
    skinPeeler: {
      handler: function(val, oldVal) {
        if (val) {
          addClass(document.body, 'custom-theme')
        } else {
          removeClass(document.body, 'custom-theme')
        }
      },
      immediate: true
    }
  },
  methods: {
    // 颜色改变
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    // 色弱
    updateColorWeak(colorWeak) {
      document.documentElement.className = colorWeak ? 'colorWeak' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      padding: 12px 0;
    }

    .drawer-switch {
      float: right
    }
  }
</style>
