<!--进度条-->
<template>
  <div class="progress">
    <div :class="[type === 'line' ? 'width500' : '', 'progress-box']">
      <el-progress :type="type" :percentage="width" :text-inside="textInside" :stroke-width="strokeWidth" :color="theme" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'line'
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: 0,
      timer: null
    }
  },
  computed: {
    strokeWidth() {
      if (this.type === 'line') {
        return 18
      }
      return 8
    },
    textInside() {
      if (this.type === 'line') {
        return true
      }
      return false
    },
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    percentage(val) {
      this.width = val
      if (this.width === 100) {
        clearInterval(this.timer)
      }
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init() {
      this.timer = setInterval(() => {
        if (this.width < 99) {
          this.width++
        }
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
  .progress{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.2);
    z-index: 10000;
    .progress-box{
      width: 100px;
      height: 100px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -50px;
      margin-top: -50px;
    }
    .progress-box.width500{
      width:500px;
      margin-left:-250px;
    }
  }
</style>
