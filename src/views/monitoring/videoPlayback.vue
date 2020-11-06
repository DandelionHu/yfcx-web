<template>
  <div class="homepage">
    <div v-if="Token" :class="[ tagsView ? 'active' : '','left']">
      <el-tree
        :data="treeData"
        highlight-current
        default-expand-all
        :props="defaultProps"
        @node-click="handleNodeClick">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }} {{ data.Children ? '' : (data.Online?'(在线)':'(离线)') }}</span>
        </span>
      </el-tree>
    </div>
    <div v-if="Token" :class="[ tagsView ? 'active' : '','cenetr']">
      <div class="top">
        <span>{{camName}}</span>
        <el-radio-group v-model="chooseData" size="small" @change="changeTime">
          <el-radio-button label="1">今天</el-radio-button>
          <el-radio-button label="2">昨天</el-radio-button>
          <el-radio-button label="3">前天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="playback"></div>
    </div>
    <div v-if="Token" :class="[ tagsView ? 'active' : '','right']">
      <el-table
        :data="videoList"
        style="width: 100%">
        <el-table-column type="expand">
          <template>
            下载
          </template>
        </el-table-column>
        <el-table-column label="序号" >
        </el-table-column>
        <el-table-column label="开始时间">
        </el-table-column>
        <el-table-column label="时长" >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { login, deviceTree, playbackQuery } from '@/api/videoApi'
import { setToken } from '@/utils/videoAuth'
import { getLastFewDays } from '@/utils/dateFormat'
export default {
  name: 'VideoPlayback',
  data() {
    return {
      defaultProps: {
        children: 'Children',
        label: 'Name'
      },
      treeData: [],
      Token: '',
      loginData: {
        uid: 'admin',
        pwd: '12345',
        digest: 'none'
      },
      camName: '选择摄像机', // 摄像机名称
      camId: '', // 摄像机ID
      startDate: '',
      endDate: '',
      chooseData: 1, // 今天
      videoList: [] // 视频列表
    }
  },
  computed: {
    tagsView() {
      return this.$store.state.settings.tagsView
    },
    theme() {
      return this.$store.state.settings.theme
    }
  },
  mounted() {
    this.login()
    // 今天
    this.startDate = getLastFewDays(0).replace(/-/g, '') + '000000'
    this.endDate = getLastFewDays(-1).replace(/-/g, '') + '000000'
  },
  methods: {
    async login() {
      const { Token } = await login(this.loginData)
      this.Token = Token
      setToken(Token)
      this.deviceTree()
    },
    // 查询
    async deviceTree() {
      const { Items: res } = await deviceTree({})
      this.treeData = res
    },
    // 切换摄像机
    handleNodeClick(data) {
      if (!data.Children && data.Cat === 'cam') {
        // 摄像机
        this.camName = data.Name
        this.camId = data.Id
        this.getPlaybackQuery()
      }
    },
    // 获取录像文件
    async getPlaybackQuery() {
      const { Items: res } = await playbackQuery({ cid: this.camId, 'time-from': this.startDate, 'time-to': this.endDate })
      if (res) {
        for (const i in res) {
          res[i].name = this.camName
          res[i].cid = this.camId
        }
        this.videoList = res
      }
    },
    // 时间
    changeTime(val) {
      if (val === 1) {
        // 今天
        this.startDate = getLastFewDays(0).replace(/-/g, '') + '000000'
        this.endDate = getLastFewDays(-1).replace(/-/g, '') + '000000'
      } else if (val === 2) {
        // 昨天
        this.startDate = getLastFewDays(1).replace(/-/g, '') + '000000'
        this.endDate = getLastFewDays(0).replace(/-/g, '') + '000000'
      } else if (val === 3) {
        // 昨天
        this.startDate = getLastFewDays(2).replace(/-/g, '') + '000000'
        this.endDate = getLastFewDays(1).replace(/-/g, '') + '000000'
      }
      if (this.camId) {
        this.getPlaybackQuery()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .homepage {
    display: flex;
    flex-wrap: nowrap;
    .left {
      width: 270px;
      height: calc(100vh - 45px);
      overflow: auto;
      overflow-x: hidden;
      padding: 10px 0px;
      box-sizing: border-box;
      background: rgb(249, 250, 251);
      &.active {
        height: calc(100vh - 80px);
      }
      .el-tree{
        background-color: rgb(249, 250, 251)
      }
      ::v-deep .el-tree-node__content{
        height: 35px;
      }
      ::v-deep .el-tree-node__content:hover{
        background-color: #dddddd !important;
      }
    }
    .cenetr {
      height: calc(100vh - 45px);
      flex:1;
      background: #000;
      display: flex;
      flex-wrap: wrap;
      padding: 2px 2px;
      box-sizing: border-box;
      flex-direction: column;
      &.active {
        height: calc(100vh - 80px);
      }
      .top{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px 0px;
        span{
          margin-right: 15px;
          color: #28ff9d;
        }
      }
    }
    .right{
      width: 270px;
      height: calc(100vh - 45px);
      overflow: auto;
      overflow-x: hidden;
      padding: 10px 0px;
      box-sizing: border-box;
      background: rgb(249, 250, 251);
      &.active {
        height: calc(100vh - 80px);
      }
    }
  }
</style>
