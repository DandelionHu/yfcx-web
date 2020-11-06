<template>
  <el-menu
    default-active="1-2"
    background-color="#f9fafb"
    class="viewport"
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-menu" />
        <span>视图</span>
      </template>
      <el-menu-item index="1-1" @click="switchover(1)">单画面</el-menu-item>
      <el-menu-item index="1-2" @click="switchover(4)">四画面</el-menu-item>
      <el-menu-item index="1-3" @click="switchover(9)">九画面</el-menu-item>
      <el-menu-item index="1-4" @click="switchover(16)">十六画面</el-menu-item>
      <el-menu-item index="1-5" @click="closeAllStream()">关闭所有视频</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-video-camera-solid" />
        <span>监控点</span>
      </template>
      <el-tree :data="treeData" highlight-current default-expand-all :props="defaultProps" @node-click="handleNodeClick">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }} {{ data.Children ? '' : (data.Online?'(在线)':'(离线)') }}</span>
        </span>
      </el-tree>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-s-tools" />
        <span>云台控制</span>
      </template>
      <div class="control">
        <div class="m-b20">
          <el-divider content-position="left">方向控制</el-divider>
          <el-slider v-model="sliderValue" :min="0" :max="255" :format-tooltip="formatTooltip" />
          <div class="direction-btn">
            <div class="direction">
              <span title="左上" @click="requestPtz(13,1,1)"><i class="el-icon-top-left"></i></span>
              <span title="上" @click="requestPtz(1,1,1)"><i class="el-icon-top"></i></span>
              <span title="右上" @click="requestPtz(14,1,1)"><i class="el-icon-top-right"></i></span>
            </div>
            <div class="direction">
              <span title="变倍加" @click="requestPtz(5,1,1)"><i class="el-icon-plus"></i></span>
              <span class="nobg">变倍</span>
              <span title="变倍减" @click="requestPtz(6,1,1)"><i class="el-icon-minus"></i></span>
            </div>
          </div>
          <div class="direction-btn">
            <div class="direction">
              <span title="左" @click="requestPtz(3,1,1)"><i class="el-icon-back"></i></span>
              <span title="右" @click="requestPtz(4,1,1)"><i class="el-icon-right"></i></span>
            </div>
            <div class="direction">
              <span title="变焦加" @click="requestPtz(7,1,1)"><i class="el-icon-plus"></i></span>
              <span class="nobg">变焦</span>
              <span title="变焦减" @click="requestPtz(8,1,1)"><i class="el-icon-minus"></i></span>
            </div>
          </div>
          <div class="direction-btn">
            <div class="direction">
              <span title="左下" @click="requestPtz(15,1,1)"><i class="el-icon-bottom-left"></i></span>
              <span title="下" @click="requestPtz(2,1,1)"><i class="el-icon-bottom"></i></span>
              <span title="右下" @click="requestPtz(16,1,1)"><i class="el-icon-bottom-right"></i></span>
            </div>
            <div class="direction">
              <span title="光圈加" @click="requestPtz(9,1,1)"><i class="el-icon-plus"></i></span>
              <span class="nobg">光圈</span>
              <span title="光圈减" @click="requestPtz(10,1,1)"><i class="el-icon-minus"></i></span>
            </div>
          </div>
        </div>
        <div class="m-b20">
          <el-divider content-position="left">预置位控制</el-divider>
          <div class="location">
            <el-select v-model="locationValue" size="small" placeholder="预置">
              <el-option
                v-for="item in location"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-button class="m-l10" size="small" type="primary" plain @click="requestPtz(11,1,2)">调用</el-button>
            <el-button size="small" type="success" plain  @click="requestPtz(11,0,2)">设置</el-button>
          </div>
        </div>
      </div>
    </el-submenu>
  </el-menu>
</template>
<script>
import { deviceTree } from '@/api/videoApi'
export default {
  props: {},
  data() {
    return {
      defaultProps: {
        children: 'Children',
        label: 'Name'
      },
      treeData: [],
      location: [],
      locationValue: '',
      sliderValue: 128 // 速度初始值
    }
  },
  computed: {
    tagsView() {
      return this.$store.state.settings.tagsView
    }
  },
  mounted() {
    this.deviceTree()
    this.locationInit()
  },
  methods: {
    // 查询
    async deviceTree() {
      const { Items: res } = await deviceTree({})
      this.treeData = res
    },
    // 切换摄像机
    handleNodeClick(data) {
      if (!data.Children && data.Cat === 'cam') {
        // 摄像机
        this.$emit('showStream', data.Id)
      }
    },
    // 切换画面
    switchover(index) {
      this.$emit('switchover', index)
    },
    // 关闭所有画面
    closeAllStream() {
      this.$emit('closeAllStream')
    },
    // 预置位
    locationInit() {
      const location = []
      for (let i = 1; i < 256; i++) {
        location.push(i)
      }
      this.location = location
    },
    // 云台速度
    formatTooltip(val) {
      return `云台速度:${val}`
    },
    // 调用
    requestPtz(cmd, action, type) {
      this.$emit('requestPtz', { cmd, action, type, sliderValue: this.sliderValue, locationValue: this.locationValue })
    }
  }
}
</script>
<style lang="scss" scoped>
  .viewport {
    background: #fff;
    box-sizing: border-box;
    .el-submenu .el-menu-item {
      background: #f0f0f0 !important;
    }

    .el-menu-item:hover {
      background-color: #dddddd !important;
    }

    ::v-deep .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      display: block !important;
    }

    .el-tree{
      background-color: #F0F0F0
    }
    ::v-deep .el-tree-node__content{
      height: 35px;
    }
    ::v-deep .el-tree-node__content:hover{
      background-color: #dddddd !important;
    }
    .control{
      background-color: #F0F0F0;
      padding: 10px;
      box-sizing: border-box;
    }
    ::v-deep .el-divider__text{
      background: #f0f0f0;
    }
    ::v-deep .el-divider--horizontal{
      margin: 10px 0;
    }
    ::v-deep .el-slider{
      width: 90%;
      margin: 0 auto;
    }
    ::v-deep .el-slider__runway{
      background-color: #c6c7c9;
    }
    .direction-btn{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0px;
      flex-wrap: nowrap;
      .direction{
        display: flex;
        flex-wrap: nowrap;
        width: 46%;
        justify-content: space-between;
        align-items: center;
        span{
          width: 27px;
          height: 27px;
          background: #42b983;
          color: #fff;
          border: 1px solid #42b983;
          font-size: 12px;
          cursor: pointer;
          line-height: 25px;
          text-align: center;
          &.nobg{
            background: transparent;
            border: none;
            color: #282828;
          }
        }
      }
    }
    .location{
      display: flex;
      flex-wrap: nowrap;
      padding-top: 13px;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
