<!--全屏-->
<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    // 初始化
    this.init()
  },
  beforeDestroy() {
    // 销毁
    this.destroy()
  },
  methods: {
    // 点击全屏
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '你的浏览器不能工作',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    // 初始化
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    // 销毁
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
