<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
// 加载css
import variables from '@/styles/variables.scss'
import custom from '@/styles/custom.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    // 高亮显示
    activeMenu() {
      // 获取当前路由
      const route = this.$route
      const { meta, path } = route
      // 当前路由有activeMenu
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // 换肤
    skinPeeler() {
      return this.$store.state.settings.skinPeeler
    },
    // 主题色
    theme() {
      return this.$store.state.settings.theme
    },
    // 颜色
    variables() {
      if (this.skinPeeler) {
        return custom
      } else {
        return variables
      }
    },
    // 折叠
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
