<!--头部搜索导航框-->
<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索导航"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// 模糊搜索
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    // 获取全部路由
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    // 搜索路由变化
    searchPool(list) {
      this.initFuse(list)
    },
    // 监听显示
    show(value) {
      if (value) {
        // 监听页面点击
        document.body.addEventListener('click', this.close)
      } else {
        // 移除监听
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    // 点击搜索按钮
    click() {
      this.show = !this.show
      if (this.show) {
        // 显示 获取焦点
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    // 关闭
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    // 搜索变化
    change(val) {
      // 跳转路由
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      // 不显示搜索
      this.$nextTick(() => {
        this.show = false
      })
    },
    // 初始化fuse
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // 过滤掉不可以在侧边栏中显示的路由
    // 生成标题
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []
      for (const router of routes) {
        // hidden状态
        if (router.hidden) { continue }
        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }
        if (router.meta && router.meta.title) {
          // 添加标题
          data.title = [...data.title, router.meta.title]
          if (router.redirect !== 'noRedirect') {
            // 只添加带有标题的路由
            // 特殊情况:需要排除没有重定向的路由
            res.push(data)
          }
        }
        // 递归子路由
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    // 输入值发生变化时调用
    querySearch(query) {
      if (query !== '') {
        // 模糊搜索
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 50px;
      border: 0;
      padding-left: 10px;
      padding-right: 10px;
      box-shadow: none !important;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
