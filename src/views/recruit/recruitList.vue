<template>
  <div>
    <div v-show="showList" class="app-container">
      <table-search :search-data-source="searchDataSource" @change="tableSearchChange">
        <template v-slot:extra>
          <el-button v-permission:recruitList_add type="success" @click="handleAdd">添加</el-button>
          <el-button v-permission:recruitList_add type="warning" @click="handleExport">导出</el-button>
          <el-button v-permission:recruitList_add type="danger" @click="handlePrint">打印</el-button>
        </template>
      </table-search>
      <s-info />
      <s-table
        ref="stable"
        v-loading="loading"
        :index="tableIndex"
        :table-column="tableColumn"
        :table-data="tableData"
        :operate="operate"
        :pagination="pagination"
        :operate-width="operateWidth"
        @currentChange="getList"
        @handleInfo="handleInfo"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
      >
        <span slot="state" slot-scope="data">
          {{ data.scope.state | state }}
        </span>
        <span slot="address" slot-scope="data">
          {{ data.scope.province + data.scope.city + data.scope.area + data.scope.address }}
        </span>
        <span slot="createTime" slot-scope="data">
          {{ data.scope.createTime | dayjs }}
        </span>
      </s-table>
    </div>
    <!--添加页面-->
    <add-recruit v-if="showAdd" :edit-id="editId" @editClose="editClose" />
    <!-- 详情页面 -->
    <recruit-info v-if="showInfo" :edit-id="editId" @editClose="editClose" />
    <!--打印页面-->
    <recruit-print v-if="showPrint" :choose-data="chooseData" :query-param="queryParam" @editClose="editClose" />
    <!--导出-->
    <s-progress v-if="isExport" :percentage="percentage" type="circle" />
  </div>
</template>
<script>
import STable from '@/components/STable'
import SInfo from '@/components/SInfo'
import TableSearch from '@/components/TableSearch'
import SProgress from '@/components/SProgress'
import { baseRecruitFindList, baseFieldFindList, baseRecruitDeleteAll } from '@/api/yfcxApi'
import addRecruit from './addRecruit'
import recruitInfo from './recruitInfo'
import recruitPrint from './recruitPrint'
export default {
  name: 'RecruitList',
  components: {
    STable,
    SInfo,
    TableSearch,
    SProgress,
    addRecruit,
    recruitInfo,
    recruitPrint
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
  data() {
    return {
      inputText: '',
      loading: false,
      operateWidth: '250px',
      pagination: {},
      tableColumn: [
        { prop: 'title', label: '标题' },
        { prop: 'fieldName', label: '招聘类型' },
        { prop: 'content', label: '招聘内容' },
        { prop: 'effective', label: '有效期' },
        {
          prop: 'state',
          label: '状态',
          scopedSlots: { tableRender: 'state' }
        },
        { prop: 'contact', label: '联系人' },
        { prop: 'tel', label: '联系电话' },
        {
          prop: 'address',
          label: '联系地址',
          scopedSlots: { tableRender: 'address' }
        },
        {
          prop: 'createTime',
          label: '创建时间',
          scopedSlots: { tableRender: 'createTime' }
        }
      ],
      tableData: [],
      operate: [
        { name: '查看',
          func: 'handleInfo',
          type: 'info',
          permission: 'recruitList_info'
        },
        { name: '编辑',
          func: 'handleEdit',
          type: 'primary',
          permission: 'recruitList_edit'
        },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: 'recruitList_delete'
        }
      ],
      tableIndex: '序号',
      groups: 'recruit_groups',
      queryParam: {}, // 搜索
      searchDataSource: [
        {
          type: 'text',
          labelText: '关键字',
          fieldName: 'keyword',
          placeholder: '请输入关键字'
        },
        {
          labelText: '创建日期',
          type: 'datetimeRange',
          fieldName: 'createDate',
          startName: 'startDate', // 开始日期字段
          endName: 'endDate', // 结束日期字段
          placeholder: ['开始日期', '结束日期']
        },
        {
          type: 'select',
          labelText: '招聘类型',
          fieldName: 'fieldId',
          placeholder: '请选择',
          defaultValue: '',
          multiple: false,
          options: []
        },
        {
          type: 'select',
          labelText: '状态',
          fieldName: 'state',
          placeholder: '请选择',
          defaultValue: '',
          multiple: false,
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '禁用',
              value: 2
            }
          ]
        }
      ],
      showList: true,
      showAdd: false,
      showInfo: false,
      showPrint: false,
      editId: '', // 编辑id
      isExport: false,
      percentage: 0,
      chooseData: [] // 打印选中的项
    }
  },
  computed: {
    onePageRow() {
      return this.$store.state.settings.onePageRow
    }
  },
  async created() {
    this.pagination = {
      size: this.onePageRow,
      page: 1,
      pageTotal: 0 // 总条数
    }
    this.loading = true
    this.getTag()
    const obj = {
      size: this.pagination.size,
      page: this.pagination.page
    }
    await this.getList(obj)
    this.loading = false
  },
  methods: {
    // 搜索
    tableSearchChange(obj) {
      this.queryParam = obj.queryParams
      if (obj.type === 'submit') {
        // 执行查询
        // 刷新当前页
        this.$refs.stable.refresh()
      } else if (obj.type === 'filtrate') {
        // 执行了筛选
        // 刷新到第一页
        this.$refs.stable.refresh(true)
      } else if (obj.type === 'reset') {
        // 执行了重置
        // 刷新到第一页
        this.$refs.stable.refresh(true)
      }
    },
    // 获取列表
    async getList(obj) {
      const requestParameters = Object.assign({}, this.queryParam, obj || {})
      const res = await baseRecruitFindList(requestParameters)
      this.tableData = res.returnValue
      this.pagination.pageTotal = res.totals
    },
    // 获取招聘类型
    async getTag() {
      const requestParameters = Object.assign({}, { groups: this.groups })
      const { returnValue: res } = await baseFieldFindList(requestParameters)
      if (res) {
        res.forEach((v, i) => {
          this.searchDataSource[2].options.push({
            label: v.title,
            value: v.id
          })
        })
      }
    },
    // 添加
    handleAdd() {
      this.editId = ''
      this.showList = false
      this.showInfo = false
      this.showAdd = true
    },
    // 查看
    handleInfo(data) {
      this.editId = data.row.id
      this.showList = false
      this.showInfo = true
    },
    // 编辑
    handleEdit(data) {
      this.editId = data.row.id
      this.showList = false
      this.showAdd = true
    },
    // 删除
    handleDelete(data) {
      this.$confirm(`真的要删除 ${data.row.title} 吗?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const obj = {
          ids: []
        }
        obj.ids.push(data.row.id)
        const { returnValue: res } = await baseRecruitDeleteAll(obj)
        if (res) {
          this.$message.success('删除成功')
          this.getList(this.$refs.stable.getPage())
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    // 编辑关闭
    editClose() {
      this.showList = true
      this.showAdd = false
      this.showInfo = false
      this.showPrint = false
      // 刷新当前页
      this.$refs.stable.refresh()
    },
    // 导出
    handleExport() {
      this.isExport = true
      setTimeout(() => {
        this.percentage = 100
        this.isExport = false
      }, 10000)
    },
    // 打印
    handlePrint() {
      this.showList = false
      this.showPrint = true
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
