<template>
  <div class="app-container">
    <table-search :search-data-source="searchDataSource" @change="tableSearchChange">
      <template v-slot:extra>
        <el-button v-permission:recruitTag_add type="success" @click="handleAdd">添加</el-button>
      </template>
    </table-search>
    <s-table
      ref="stable"
      v-loading="loading"
      :index="tableIndex"
      :table-column="tableColumn"
      :table-data="tableData"
      :operate="operate"
      :page-total="pageTotal"
      @currentChange="getList"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
      <span slot="createTime" slot-scope="data">
        {{ data.scope.createTime | dayjs }}
      </span>
    </s-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <edit-form ref="dialogForm" :form-data-source="formDataSource" :form-data-value="formData" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import STable from '@/components/STable'
import TableSearch from '@/components/TableSearch'
import EditForm from '@/components/EditForm'
import { baseFieldFindList, baseFieldSaveField, baseFieldFindById, baseFieldDeleteAll } from '@/api/yfcxApi'
export default {
  name: 'RecruitTag',
  components: {
    STable,
    TableSearch,
    EditForm
  },
  data() {
    return {
      pageTotal: 0, // 总条数
      tableColumn: [
        { prop: 'title', label: '标题' },
        { prop: 'content', label: '内容' },
        {
          prop: 'createTime',
          label: '创建时间',
          scopedSlots: { tableRender: 'createTime' }
        }
      ],
      tableData: [],
      operate: [
        { name: '编辑',
          func: 'handleEdit',
          type: 'primary',
          permission: 'recruitTag_edit'
        },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: 'recruitTag_delete'
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
        }
      ],
      title: '添加类型',
      dialogVisible: false,
      formDataSource: [
        {
          type: 'text', // 控件类型
          labelText: '标题', // 控件显示的文本
          fieldName: 'title',
          placeholder: '请输入标题', // 默认控件的空值文本
          maxlength: '10',
          rules: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ]
        },
        {
          type: 'textarea', // 控件类型
          labelText: '内容', // 控件显示的文本
          fieldName: 'content',
          placeholder: '请输入内容', // 默认控件的空值文本
          maxlength: '100'
        }
      ], // 表单数据源
      formData: {}, // 表单数据
      loading: false,
      editId: '' // 编辑id
    }
  },
  async created() {
    this.loading = true
    await this.getList({
      page: 1,
      size: 10
    })
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
      const requestParameters = Object.assign({}, this.queryParam, { groups: this.groups }, obj || {})
      const res = await baseFieldFindList(requestParameters)
      this.tableData = res.returnValue
      this.pageTotal = res.totals
    },
    // 添加
    handleAdd() {
      this.dialogVisible = true
      this.title = '添加类型'
      if (this.$refs.dialogForm) {
        // 首次调用时组件还没加载
        this.$refs.dialogForm.resetForm()
      }
    },
    // 保存
    onSave() {
      this.$refs.dialogForm.handleSubmit(async(data) => {
        data.groups = this.groups
        data.id = this.editId || ''
        const { returnValue: res } = await baseFieldSaveField(data)
        if (res) {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.editId = ''
          this.getList()
        }
      })
    },
    // 编辑
    handleEdit(val) {
      this.editId = val.row.id
      this.getDetail(val.row.id)
      this.dialogVisible = true
      this.title = '修改类型'
    },
    // 删除
    handleDelete(val) {
      this.$confirm(`真的要删除 ${val.row.title} 吗?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const obj = {
          ids: []
        }
        obj.ids.push(val.row.id)
        const { returnValue: res } = await baseFieldDeleteAll(obj)
        if (res) {
          this.$message.success('删除成功')
          this.getList()
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    // 详情
    async getDetail(id) {
      const { returnValue: res } = await baseFieldFindById({ id })
      this.formData = res
    }
  }
}
</script>
<style lang="scss"></style>
