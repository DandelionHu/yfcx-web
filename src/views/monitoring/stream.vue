<template>
  <div class="stream">
    <video
      :id="[`video${index}`]"
      class="video"
      type="application/x-mpegURL"
      :poster="poster ? (isStream ? loadingVideo : novideo) : ''"
      src=""
      autoplay="autoplay"
    >
      <source :src="sourceUrl">
    </video>
    <div class="operation">
      <span class="num">{{ index }}</span>
      <span class="name">{{ dataStream.Name?dataStream.Name:'' }}</span>
      <div class="opt">
        <svg-icon class="imgIcon" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" :title="isFullscreen?'退出全屏':'全屏'" @click="screenFull" />
        <img src="@/assets/images/bmp.jpg" title="抓拍" class="img" @click="snapshot">
        <span class="countDown">{{ countText }}</span>
        <img :src="isRecord?record1:record0" :title="isRecord?'结束录像':'录像'" class="img" @click="recordingStart">
        <img src="@/assets/images/closeStr.png" title="关闭" class="img" @click="closeStream(false)">
      </div>
    </div>
    <el-dialog
      title="预览抓拍图片"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <img class="width100per" :src="`data:image/jpeg;base64,${ImageData}`" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { camQuery, recordingStart, recordingStop, snapshot, requestPtz, ptzControl } from '@/api/videoApi'
import flvjs from 'flv.js/dist/flv.min.js'

export default {
  props: {
    // 编号
    index: {
      type: Number,
      default: 1
    },
    // 选中的编号
    chooseIndex: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    },
    // 云台控制
    control: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isStream: false, // 是否正在打开视频
      novideo: require('@/assets/images/novideo.png'),
      loadingVideo: require('@/assets/images/loading.gif'),
      isFullscreen: false, // 全屏
      dataStream: {},
      isRecord: false, // 录像
      record0: require('@/assets/images/record_0.jpg'),
      record1: require('@/assets/images/record_1.jpg'),
      countText: '', // 录像时间
      dialogVisible: false, // 抓拍
      ImageData: '',
      sourceUrl: '',
      poster: true,
      isRequestPtz: false // 云台控制
    }
  },
  watch: {
    id(val) {
      if (this.index === this.chooseIndex) {
        this.showStream(val)
      }
    },
    control: {
      handler(val) {
        if (this.index === this.chooseIndex) {
          console.log(val)
          this.getRequestPtz()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.flvjsStop()
  },
  methods: {
    // 抓拍
    async snapshot() {
      const { dataStream } = this
      if (!dataStream.flvPlayer) {
        this.$message.error('请先打开视频')
        return false
      } else {
        const loading = this.$loading({
          lock: true,
          text: '拍照中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const { ImageData } = await snapshot({ cid: dataStream.Id, stream: dataStream.stream, mode: '1' })
        this.addFile(1, ImageData)
        loading.close()
        // 预览
        this.dialogVisible = true
        this.ImageData = ImageData
      }
    },
    // 关闭
    closeStream(type) {
      const { dataStream } = this
      if (!dataStream.flvPlayer) {
        if (!type) {
          this.$message.error('请先打开视频')
        }
        return false
      }
      // 结束录像
      clearInterval(this.dataStream.interval)
      this.dataStream.interval = null
      this.dataStream.Rid = ''
      this.countText = ''
      this.isRecord = false
      // 结束视频
      if (this.dataStream.flvPlayer) {
        this.flvjsStop()
      }
      this.dataStream = {}
    },
    // 全屏
    screenFull() {
      const { dataStream, index } = this
      if (this.isFullscreen && !dataStream.flvPlayer) {
        // 全屏 没视频
        this.$emit('fullscreen', { type: false, index: index })
        this.isFullscreen = !this.isFullscreen
        return false
      }
      if (!dataStream.flvPlayer) {
        this.$message.error('请先打开视频')
        return false
      }
      if (dataStream.Rid) {
        this.$message.error('请先结束所有视频的录像')
        return false
      }
      // 关闭摄像头
      if (dataStream && dataStream.flvPlayer) {
        this.flvjsStop()
      }
      if (!this.isFullscreen) {
        // 全屏
        this.$emit('fullscreen', { type: true, index: index })
        this.showStream(dataStream.Id)
        this.isFullscreen = !this.isFullscreen
      } else {
        // 退出全屏
        this.$emit('fullscreen', { type: false, index: index })
        this.showStream(dataStream.Id)
        this.isFullscreen = !this.isFullscreen
      }
    },
    // 显示流
    async showStream(id) {
      const { index, dataStream } = this
      if (dataStream && dataStream.Rid) {
        this.$message.error('请先结束录像')
        return false
      }
      this.isStream = !this.isStream
      const { Items } = await camQuery({ cid: id, stream: 1 })
      const list = Items[0]
      if (!list.OnlineFlag) {
        this.$message.error('摄像机离线')
        return false
      }
      list.flvPlayer = dataStream.flvPlayer ? dataStream.flvPlayer : null
      list.DownUrl = []
      list.stream = 1
      this.dataStream = list
      if (flvjs.isSupported()) {
        this.flvjsPlay(index, list.FlvUrl, list.Name)
      } else {
        this.$message.error('该浏览器不支持视频播放，请使用谷歌浏览器')
      }
    },
    // h5播放
    flvjsPlay(streamIndex, url, name) {
      const videoElement = document.getElementById(`video${streamIndex}`)
      this.flvjsStop()
      this.dataStream.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: url,
        isLive: true
      }, {
        enableWorker: true,
        enableStashBuffer: false,
        stashInitialSize: 128
      })
      // 重连机制
      let lastDecFrames = null
      let timeoutCount = 0
      const timeoutSecond = 10
      this.dataStream.flvPlayer.on(flvjs.Events.STATISTICS_INFO, (info) => {
        // 每秒检测一次已解码的帧数，超时就进行重连
        if (lastDecFrames != null) {
          if (lastDecFrames === info.decodedFrames) {
            timeoutCount++
            if (timeoutCount > timeoutSecond) {
              console.log('重连')
              this.flvjsPlay(url, name)
            }
          } else {
            timeoutCount = 0
          }
        }
        if (info.decodedFrames > 0) {
          lastDecFrames = info.decodedFrames
        }
      })
      this.dataStream.flvPlayer.attachMediaElement(videoElement)
      this.dataStream.flvPlayer.load()
      this.dataStream.flvPlayer.play()
      this.isStream = !this.isStream
    },
    // h5停止
    flvjsStop() {
      if (this.dataStream.flvPlayer !== null && this.dataStream.flvPlayer) {
        this.dataStream.flvPlayer.unload()
        this.dataStream.flvPlayer.destroy()
        this.dataStream.flvPlayer = null
      }
    },
    // 录像
    async recordingStart() {
      const { dataStream, isRecord } = this
      if (!dataStream.flvPlayer) {
        this.$message.error('请先打开视频')
        return false
      }
      const flvPlayer = dataStream.flvPlayer
      const Rid = dataStream.Rid
      if (flvPlayer) {
        // 摄像机在播放
        clearInterval(dataStream.interval)
        dataStream.interval = null

        if (Rid && isRecord) {
          // 正在录像,停止录像
          const loading = this.$loading({
            lock: true,
            text: '录像结束',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const { DownUrl } = await recordingStop({ cid: dataStream.Id, rid: Rid })
          this.isRecord = !this.isRecord
          loading.close()
          this.$message.success('录像结束')
          this.dataStream.DownUrl.push(DownUrl)
          this.dataStream.Rid = ''
          this.countText = ''
          const t = parseInt((300 - this.dataStream.currentTime) / 60)
            ? (parseInt((300 - this.dataStream.currentTime) / 60) + '分' + (300 - this.dataStream.currentTime) % 60 + '秒')
            : (300 - this.dataStream.currentTime) % 60 + '秒'
          this.addFile(2, DownUrl, t)
        } else if (!isRecord) {
          const loading = this.$loading({
            lock: true,
            text: '录像开始',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.countDown()
          const { Rid } = await recordingStart({ cid: dataStream.Id, stream: dataStream.stream })
          this.isRecord = !this.isRecord
          loading.close()
          this.$message.success('录像开始')
          this.dataStream.Rid = Rid // 录像id
        }
      }
    },
    // 倒计时
    countDown() {
      this.dataStream.currentTime = 300
      this.dataStream.interval = setInterval(() => {
        this.dataStream.currentTime--
        const countText = parseInt(this.dataStream.currentTime / 60) + ':' + this.dataStream.currentTime % 60
        this.countText = countText
        if (this.dataStream.currentTime <= 0) {
          clearInterval(this.dataStream.interval)
          this.countText = ''
          // 主动结束录像
          this.recordingStart()
        }
      }, 1000)
    },
    // 添加文件
    addFile(fileType, fileData, videoDuration) {
      console.log('添加文件', fileType, fileData, videoDuration)
    },
    // 请求控制
    async getRequestPtz() {
      const { dataStream } = this
      if (!dataStream.flvPlayer) {
        this.$message.error('请先打开视频')
        return false
      }
      const id = dataStream.Id
      let para = ''
      if (this.control.type === 2) {
        // 预置位控制
        para = this.control.locationValue
        if (!para) {
          this.$message.error('请选择预置位')
          return false
        }
      } else if (this.control.type === 1) {
        // 方向控制
        para = this.control.sliderValue
      }
      if (this.isRequestPtz) {
        this.getPtzControl(id, this.control.cmd, this.control.action, para, this.control.type)
      } else {
        const { Ok } = await requestPtz({ cid: id })
        if (Ok) {
          this.isRequestPtz = true
          this.getPtzControl(id, this.control.cmd, this.control.action, para, this.control.type)
        }
      }
    },
    // 控制
    async getPtzControl(cid, cmd, action, para, type) {
      const { Ok, Msg } = await ptzControl({ cid, cmd, action, para })
      if (Ok) {
        if (type === 1) {
          // 方向控制要结束
          const { Ok, Msg } = await ptzControl({ cid, cmd, action: 0, para })
          if (!Ok) {
            this.$message.error(Msg)
          }
        }
      } else {
        this.$message.error(Msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .stream{
    width: 100%;
    height: 100%;
    background: #191c1f;
    display: flex;
    flex-direction: column;
    border: 1px solid #191c1f;
    &.active{
      border: 1px solid rgb(64, 158, 255);
    }
    .video{
      width: 100%;
      height: calc(100% - 30px);
      background: #191c1f;
      position: relative;
    }
    .operation{
      height: 30px;
      width: 100%;
      background: #212529;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .num {
        color: #fff;
        font-size: 15px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: #33383e;
        text-align: center;
      }
      .name {
        font-size: 14px;
        color: #fff;
        white-space: nowrap;
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
      }
      .opt {
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: center;
        .countDown {
          font-size: 12px;
          color: #ff6262;
        }
        .img {
          margin: 0px 4px;
          cursor: pointer;
          color: #fff;
          font-size: 16px;
          line-height: 19px;
          width: 16px;
          height: 16px;
        }
        .imgIcon{
          color: #c7c6c6;
          width: 17px;
          height: 14px;
          cursor: pointer;
          margin-right: 5px;
          margin-top: 3px;
        }
      }
    }
    ::v-deep .el-dialog__body{
      padding:10px;
    }
  }
</style>
