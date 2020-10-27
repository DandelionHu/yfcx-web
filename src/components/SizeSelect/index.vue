<!--布局大小选择组件-->
<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: '默认布局', value: 'default' },
        { label: '中等布局', value: 'medium' },
        { label: '小型布局', value: 'small' },
        { label: '超小布局', value: 'mini' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSetSize(size) {
      // 设置element组件大小
      this.$ELEMENT.size = size
      // 设置cookie
      this.$store.dispatch('app/setSize', size)
      // 刷新缓存的页面
      this.refreshView()
      this.$message({
        message: '布局大小设置成功',
        type: 'success'
      })
    },
    refreshView() {
      // 删除页面缓存
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)
      // 当前
      const { fullPath } = this.$route
      // 重定向当前页
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
