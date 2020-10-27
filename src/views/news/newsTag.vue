<template>
  <div class="app-container">
    <edit-form />
    <table-search :search-data-source="searchDataSource" @change="tableSearchChange">
      <template v-slot:extra>
        <el-button v-permission:news_add type="success">添加</el-button>
      </template>
    </table-search>
    <s-table
      v-loading="loading"
      :table-column="tableColumn"
      :table-data="tableData"
      :operate="operate"
      :operate-width="operateWidth"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @row-click="rowClick"
    />
  </div>
</template>
<script>
import STable from '@/components/STable'
import TableSearch from '@/components/TableSearch'
import EditForm from '@/components/EditForm'
export default {
  components: {
    STable,
    TableSearch,
    EditForm
  },
  data() {
    return {
      // 搜索数据源
      searchDataSource: [
        {
          type: 'text', // 控件类型
          labelText: '关键字', // 控件显示的文本
          fieldName: 'keyword',
          placeholder: '请输入关键字' // 默认控件的空值文本
        },
        {
          labelText: '创建日期',
          type: 'datetimeRange',
          fieldName: 'createDate',
          startName: 'startDate', // 开始日期字段
          endName: 'endDate', // 结束日期字段
          placeholder: ['开始日期', '选择日期']
        }
      ],
      tableColumn: [
        { prop: 'title', label: '标题', width: '50px' },
        { prop: 'content', label: '内容' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'creator', label: '创建人' },
        { prop: 'state', label: '状态' },
        { prop: 'title1', label: '标题' },
        { prop: 'content1', label: '内容' },
        { prop: 'createTime1', label: '创建时间' },
        { prop: 'creator1', label: '创建人' },
        { prop: 'state1', label: '状态' }
      ],
      tableData: [
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        },
        {
          title: 'sssss',
          content: 'wwwwwww',
          createTime: 'wwwwwww',
          creator: 'wwwwwww',
          state: 'wwwwwww',
          title1: 'sssss',
          content1: 'wwwwwww',
          createTime1: 'wwwwwww',
          creator1: 'wwwwwww',
          state1: 'wwwwwww'
        }
      ],
      operate: [
        {
          name: '编辑',
          func: 'handleEdit',
          type: 'primary'
        },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: 'delete_tag'
        }
      ],
      operateWidth: '150px',
      loading: false
    }
  },
  methods: {
    // 搜索框改变
    tableSearchChange(obj) {
      console.log('处理之后的数据', obj)
      this.queryParam = obj.queryParams
      if (obj.type === 'submit') {
        // 执行查询
        // 刷新当前页
      } else if (obj.type === 'filtrate') {
        // 执行了筛选
        // 刷新到第一页
      } else if (obj.type === 'reset') {
        // 执行了重置
        // 刷新到第一页
      }
      throw new Error('抛出异常')
    },
    // 编辑
    handleEdit(val) {
      console.log('val', val)
    },
    // 删除
    handleDelete(val) {},
    rowClick() {}
  }
}
</script>
