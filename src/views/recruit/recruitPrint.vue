<template>
  <div>
    <el-page-header :style="{ color:theme }" class="m-b20" content="打印招聘" @back="goBack" />
    <div class="app-container">
      <el-button type="danger" @click="print">打印</el-button>
      <div class="print-box">
        <vue-easy-print ref="easyPrint" table-show>
          <template>
            <div class="print">
              <h1>月报表</h1>
              <div>
                <label>统计周期:1111</label>
                <label class="flr">打印时间:1111</label>
              </div>
              <div>
                <label>销售总重量(吨):1111</label>
                <label>销售总重量(吨):1111</label>
                <label>销售总重量(吨):1111</label>
              </div>
              <div v-for="page in pages" :key="page" class="table-print pageNext">
                <table cellpadding="0" cellspacing="0">
                  <thead>
                    <th v-for="item in tableColumn" :key="item.prop">{{ item.label }}</th>
                  </thead>
                  <!-- 每页显示onePageRow条数据 -->
                  <tr v-for="(row,index) in tableData.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
                    <td>{{ (page-1)*onePageRow + index + 1 }}</td>
                    <td>{{ row.title }}</td>
                    <td>{{ row.fieldName }}</td>
                    <td>{{ row.content }}</td>
                    <td>{{ row.effective }}</td>
                    <td>{{ row.state | state }}</td>
                    <td>{{ row.contact }}</td>
                    <td>{{ row.tel }}</td>
                    <td>{{ row.address }}</td>
                    <td>{{ row.createTime | dayjs }}</td>
                  </tr>
                  <!-- 插入空白行 -->
                  <template v-if="blankLines===true && tableData.slice((page-1)*onePageRow,page*onePageRow).length<5">
                    <tr v-for="d in (5-tableData.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </template>
                </table>
                <div>
                  <label>制表人:1111</label>
                  <label class="flr">{{ page }}/{{ pages }}</label>
                </div>
              </div>
            </div>
          </template>
        </vue-easy-print>
      </div>
    </div>
  </div>
</template>
<script>
import { baseRecruitFindList } from '@/api/yfcxApi'
import vueEasyPrint from 'vue-easy-print'
export default {
  name: 'RecruitPrint',
  components: {
    vueEasyPrint
  },
  // 过滤器
  filters: {
    state(value) {
      const stateObj = {
        1: '正常',
        2: '禁用'
      }
      return stateObj[value] || ''
    }
  },
  props: {
    // 选中的项
    chooseData: {
      type: Array,
      default() {
        return []
      }
    },
    // 搜索条件
    queryParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableColumn: [
        { prop: 'index', label: '序号' },
        { prop: 'title', label: '标题' },
        { prop: 'fieldName', label: '招聘类型' },
        { prop: 'content', label: '招聘内容' },
        { prop: 'effective', label: '有效期' },
        { prop: 'state', label: '状态' },
        { prop: 'contact', label: '联系人' },
        { prop: 'tel', label: '联系电话' },
        { prop: 'address', label: '联系地址' },
        { prop: 'createTime', label: '创建时间' }
      ],
      tableData: [],
      // 是否插入空白行
      blankLines: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    // 每页多少行
    onePageRow() {
      return this.$store.state.app.onePageRow
    },
    pages() {
      // 求当前数据能打印的页数
      var pages_ = Math.ceil(this.tableData.length / this.onePageRow)// 向上取整数
      return pages_ <= 0 ? 1 : pages_
    }
  },
  async mounted() {
    await this.getList()
    this.$nextTick(() => {
      this.print()
    })
  },
  methods: {
    // 返回
    goBack() {
      this.$emit('editClose')
    },
    // 列表
    async getList() {
      const { returnValue: res } = await baseRecruitFindList(this.queryParam)
      if (res) {
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
        this.tableData = this.tableData.concat(res)
      }
    },
    // 打印
    print() {
      this.$refs.easyPrint.print()
    }
  }
}
</script>
<style lang="scss" scope>
  @import "~@/styles/print.scss";
  .print-box{
    max-width: 900px;
  }
</style>
