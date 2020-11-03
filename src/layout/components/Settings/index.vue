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
      <div class="top">
        <el-tooltip v-for="(item, index) in colorList" :key="index" class="item" effect="dark" :content="item.key" placement="top">
          <el-tag :color="item.color" @click="changeColor(item.color)">
            <i v-if="item.color === skinPeeler" class="el-icon-check" />
          </el-tag>
        </el-tooltip>
      </div>
    </div>
    <div class="drawer-item">
      <span>菜单支持拼音搜索</span>
      <el-switch v-model="supportPinyinSearch" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>条数</span>
      <div class="drawer-select">
        <el-select v-model="onePageRow" placeholder="请选择">
          <el-option
            v-for="item in pageSizes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
// 颜色选择器
import ThemePicker from '@/components/ThemePicker'
import { addClass, removeClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import '@/assets/defult-theme/index.css' // the theme changed version element-ui css
import '@/assets/white-theme/index.css' // the theme changed version element-ui css

export default {
  components: { ThemePicker },
  data() {
    return {
      colorList: [
        {
          key: '深蓝色（默认）', color: '#192A5E', theme: ''
        },
        {
          key: '深灰色', color: '#304156', theme: 'custom-theme'
        },
        {
          key: '紫色', color: '#4056FF', theme: 'defult-theme'
        },
        {
          key: '绿色', color: '#52C41A', theme: 'white-theme'
        }
      ],
      pageSizes: [10, 20, 50, 100, 500, 1000]
    }
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
    skinPeeler() {
      return this.$store.state.settings.skinPeeler
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
    },
    onePageRow: {
      get() {
        return this.$store.state.settings.onePageRow
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'onePageRow',
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
        const { theme } = this.colorList.filter((item) => {
          return item.color === val
        })[0]
        removeClass(document.body, 'defult-theme')
        removeClass(document.body, 'custom-theme')
        removeClass(document.body, 'white-theme')
        if (theme) {
          addClass(document.body, theme)
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
    },
    // 换肤
    changeColor(color) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'skinPeeler',
        value: color
      })
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
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      padding: 12px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .top{
        display: flex;
        .item{
          height: 26px;
          padding: 0 6px;
          width: 26px;
          margin-right: 10px;
          cursor: pointer;
          line-height: 26px;
          color: #fff;
        }
      }
    }

    .drawer-switch {
      float: right
    }
    .drawer-select{
      float: right;
      width: 100px;
    }
  }
</style>
