<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!--引用自身-->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 是否只有一个子菜单要展示
    hasOneShowingChild(children = [], parent) {
      // 过滤掉 hidden为true 的路由
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // 路由只有一个
      if (showingChildren.length === 1) {
        return true
      }
      // 没有要展示的子路由（父级路由也不展示）
      if (showingChildren.length === 0) {
        // 赋值父级路由 并把路径置空，不展示父级路由
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      // 路由两个以上
      return false
    },
    // 解析路径
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        // 外链
        return routePath
      }
      if (isExternal(this.basePath)) {
        // 基础路径是外链
        return this.basePath
      }
      // 把一个路径或路径片段的序列解析为一个绝对路径
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
