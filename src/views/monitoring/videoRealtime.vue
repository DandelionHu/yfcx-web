<template>
  <div class="homepage">
    <viewport
      v-if="Token"
      :class="[ tagsView ? 'active' : '', 'left']"
      @showStream="showStream"
      @switchover="switchover"
      @closeAllStream="closeAllStream"
      @requestPtz="requestPtz"
    />
    <div v-if="Token" :class="[ tagsView ? 'active' : '', 'right',`col-${num}`]">
      <div v-for="item of interfaceNum" :key="item" :class="[item==active?'active':'','screen']" @click="screenChoose(item)">
        <stream
          :id="id"
          :ref="`stream${item}`"
          :class="[item==index?'active':'']"
          :index="item"
          :choose-index="index"
          :control="control"
          @fullscreen="fullscreen"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/videoApi'
import { setToken } from '@/utils/videoAuth'
import viewport from './viewport'
import stream from './stream'
export default {
  name: 'VideoRealtime',
  components: {
    viewport,
    stream
  },
  data() {
    return {
      Token: '',
      loginData: {
        uid: 'admin',
        pwd: '12345',
        digest: 'none'
      },
      interfaceNum: 4, // 当前选择画面数
      num: 4, // 当前打开画面数
      index: 1, // 当前选中的画面
      id: '',
      active: '', // 画面全屏
      control: {}
    }
  },
  computed: {
    tagsView() {
      return this.$store.state.settings.tagsView
    }
  },
  mounted() {
    this.login()
  },
  methods: {
    async login() {
      const { Token } = await login(this.loginData)
      this.Token = Token
      setToken(Token)
    },
    // 显示流
    showStream(id) {
      if (!this.index) {
        this.$message.error('请先选中画面')
        return false
      }
      this.id = id
    },
    // 切换画面
    switchover(index) {
      this.interfaceNum = index
      this.num = index
      this.index = 1
      if (index === 1) {
        // 单画面
        this.active = 1
      } else {
        this.active = ''
      }
    },
    // 关闭所有画面
    closeAllStream() {
      const interfaceNum = this.interfaceNum
      for (let i = 1; i <= interfaceNum; i++) {
        this.$refs[`stream${i}`][0].closeStream(true)
      }
    },
    // 全屏
    fullscreen(data) {
      if (data.type) {
        // 全屏
        this.num = 1
        this.active = data.index
      } else {
        this.num = this.interfaceNum
        this.active = ''
      }
    },
    // 选中的画面
    screenChoose(index) {
      this.index = index
    },
    // 云台控制
    requestPtz(obj) {
      this.control = obj
    }
  }
}
</script>
<style scoped lang="scss">
  .homepage{
    display:flex;
    flex-wrap:nowrap;
    .left{
      width: 270px;
      height: calc(100vh - 45px);
      overflow: auto;
      overflow-x:hidden;
      &.active {
        height: calc(100vh - 80px);
      }
    }
    .right{
      height: calc(100vh - 45px);
      width: 100%;
      background: #000;
      display: flex;
      flex-wrap: wrap;
      padding: 2px 2px;
      box-sizing: border-box;
      &.active {
        height: calc(100vh - 80px);
      }
      .screen{
        display: inline-block;
        padding: 2px 2px;
        box-sizing: border-box;
      }
      &.col-1 .screen {
        width: 100%;
        height: 100%;
        display:none;
      }
      &.col-1 .screen.active {
        display:block;
      }
      &.col-4 .screen{
        width: 50%;
        height: 50%;
      }
      &.col-9 .screen {
        width: 33.33%;
        height: 33.33%;
      }
      &.col-16 .screen {
        width: 25%;
        height: 25%;
      }
    }
  }
</style>
