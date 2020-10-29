<!--table组件-->
<template>
  <div class="lin-table">
    <el-table
      ref="linTable"
      v-loading="loading"
      row-key="id"
      :max-height="height"
      :border="border"
      :data="currentData"
      :highlight-current-row="highlightCurrentRow ? true : false"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingIcon"
      :element-loading-background="loadingBG"
      :row-class-name="rowClassName"
      :show-summary="showSummary"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
      @select-all="selectAll"
      @row-click="rowClick"
    >
      <!--单选多选 -->
      <el-table-column v-if="type" :type="type" width="55" />
      <!--序号 -->
      <el-table-column v-if="index" :label="index" type="index" :index="currentIndex" width="55" />
      <el-table-column
        v-for="item in filterTableColumn"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="true"
        :filters="item.filters ? item.filters : null"
        :filter-method="item.filterMethod ? item.filterMethod : null"
        :column-key="item.filterMethod ? item.prop : null"
        :formatter="item.formatter ? item.formatter : null"
        :sortable="item.sortable ? item.sortable : false"
        :fixed="item.fixed ? item.fixed : false"
        :width="item.width ? item.width : ''"
        :min-width="minWidth"
      >
        <template slot-scope="scope">
          <template v-if="item.scopedSlots">
            <slot :name="item.scopedSlots.tableRender" :scope="scope.row" />
          </template>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operate.length > 0" label="操作" fixed="right" :width="operateWidth">
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in operate"
            :key="index"
            v-permission="{ permission: item.permission ? item.permission : '', type: 'disabled' }"
            :type="item.type"
            plain
            size="mini"
            @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
          >{{ item.name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pagination"
      class="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="pageObj.size"
      :total="pagination.pageTotal"
      :current-page="currentPage"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
// 加载css
import variables from '@/styles/variables.scss'
export default {
  props: {
    // 表头名称
    tableColumn: {
      type: Array,
      default: () => []
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 自定义按键及绑定方法
    operate: {
      type: Array,
      default: () => []
    },
    // 定制要展示的列
    customColumn: {
      type: Array,
      default: () => []
    },
    // 左侧固定列
    fixedLeftList: {
      type: Array,
      default: () => []
    },
    // 右侧固定列
    fixedRightList: {
      type: Array,
      default: () => []
    },
    // 是否开启表格多选
    type: {
      type: String,
      default: null
    },
    // 是否显示索引
    index: {
      index: String,
      default: ''
    },
    // 是否开启表格单选
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 动画加载
    loading: {
      type: Boolean,
      default: false
    },
    // 动画提示
    loadingText: {
      type: String,
      default: ''
    },
    // 动画图标
    loadingIcon: {
      type: String,
      default: 'el-icon-loading'
    },
    // 动画背景色
    loadingBG: {
      type: String,
      default: 'rgba(255,255,255,0.5)'
    },
    // 分页
    pagination: {
      type: [Object, Boolean],
      default: function() {
        return {
          size: 10, // 每页多少条
          pageTotal: 0,
          page: 1
        }
      }
    },
    // 边框
    border: {
      type: Boolean,
      default: true
    },
    // 合计
    showSummary: {
      type: Boolean,
      default: false
    },
    // 单元格最小宽度
    minWidth: {
      type: String,
      default: '100px'
    },
    // 操作宽度
    operateWidth: {
      type: String,
      default: '275px'
    },
    // 排序
    sortable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500, 1000],
      height: variables.tableMaxHeight,
      filterTableColumn: [], // 定制展示的列
      currentPage: '', // 当前选中页
      currentData: [], // 每次切换页码的时候要给table传入不同的数据
      selectedTableData: [], // 多选选中的数据
      currentRow: null, // 单选选中的数据
      oldVal: [], // 上一次选中的数据
      oldKey: [], // 上一次选中数据的key
      currentIndex: '', // 当前索引，切换页面的时候需要重新计算
      rowClassName: '', // 行样式
      pageObj: {} // 给外部
    }
  },
  computed: {
    globalOptions() {
      // 全局配置
      return {
        sortable: this.sortable
      }
    },
    renderDataSource() {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.tableColumn.map(item => ({ ...this.globalOptions, ...item }))
    }
  },
  watch: {
    fixedLeftList: {
      handler() {
          // eslint-disable-line
        this.filterTableColumn.map((item, index) => {
          if (this.fixedLeftList.indexOf(item.label) > -1) {
            this.$set(this.filterTableColumn[index], 'fixed', 'left')
          } else if (this.fixedRightList.indexOf(item.label) === -1) {
            this.$set(this.filterTableColumn[index], 'fixed', false)
          }
          return ''
        })
      },
      deep: true,
      immediate: true
    },
    fixedRightList: {
      handler() {
          // eslint-disable-line
        this.filterTableColumn.map((item, index) => {
          if (this.fixedRightList.indexOf(item.label) > -1) {
            this.$set(this.filterTableColumn[index], 'fixed', 'right')
          } else if (this.fixedLeftList.indexOf(item.label) === -1) {
            this.$set(this.filterTableColumn[index], 'fixed', false)
          }
          return ''
        })
      },
      deep: true,
      immediate: true
    },
    customColumn: {
      handler(val) {
        if (val.length > 1) {
          this.filterTableColumn = this.renderDataSource.filter(v => val.indexOf(v.label) > -1)
        }
      },
      deep: true
    },
    tableData: {
      handler() {
        // 分页配置
        if (this.pageObj && this.pageObj.size) {
          this.currentData = this.tableData.filter((item, index) => index < this.pageObj.size)
          if (this.currentData.length === 0 && this.pageObj.page > 1) {
            // 最后一页数据为空  往前翻一页
            this.currentChange(this.pageObj.page - 1)
          }
        } else {
          this.currentData = this.tableData
        }
      },
      deep: true,
      immediate: true
    },
    tableColumn: {
      handler() {
        // 如果一开始没有传要展示的列 就默认全展示
        if (this.customColumn.length > 1) {
          this.filterTableColumn = this.renderDataSource.filter(v => this.customColumn.indexOf(v.label) > -1)
        } else {
          this.filterTableColumn = this.renderDataSource
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // 初始化分页
    this.pageObj.size = this.pagination.size
    this.pageObj.page = this.pagination.page
    this.currentPage = this.pagination.page
    this.currentIndex = this.pagination.page
  },
  beforeMount() {
    // 先放在session里，因为每次切换页码table都会重新渲染，之前选中都数据就丢失了  sessionstorage在create里面打包会提示undefined
    sessionStorage.setItem('selectedTableData', JSON.stringify([]))
  },
  methods: {
    // 开发者自定义的函数
    buttonMethods(func, index, row) {
      this.$emit(func, { index, row })
    },
    // 行内跳转页面
    goToGroupEditPage(_this, index, row) {
      _this.$emit('goToGroupEditPage', { index, row })
    },
    // 多选-选中checkbox
    toggleSelection(rows, flag) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.linTable.toggleRowSelection(row, flag)
        })
      } else {
        this.$refs.linTable.clearSelection()
      }
    },
    // 全选-取消全选
    selectAll(val) {
      this.oldKey = val.map(item => item.key)
    },
    // 单选
    handleCurrentChange(val, oldVal) {
      this.currentRow = val
      this.$emit('handleCurrentChange', { val, oldVal })
    },
    // 单击某一行
    rowClick(row) {
        // eslint-disable-line
      // 选中-多选
      if (!this.oldKey.includes(row.key)) {
        this.oldKey.push(row.key)
        const data = this.oldVal.concat(row)
        this.handleSelectionChange(data)
        // 选中checkbox
        this.toggleSelection(this.currentData.filter(item => item.key === row.key))
        // 取消选中
      } else {
        this.oldKey = this.oldKey.filter(item => item !== row.key)
        const data = this.oldVal.filter(item => item.key !== row.key)
        this.handleSelectionChange(data)
        this.toggleSelection(
          this.currentData.filter(item => item.key === row.key),
          false
        )
      }
      // 选中-单选
      if (this.currentOldRow && this.currentOldRow.key === row.key) {
        // 取消单选选中
        this.$refs.linTable.setCurrentRow()
        this.currentOldRow = null
        return
      }
      this.currentOldRow = row
    },
    // 切换当前页
    currentChange(page) {
      this.pageObj.page = page
      const currentSelectedData = []
      this.oldVal = []
      this.currentPage = page // 当前选中页
      this.selectedTableData = JSON.parse(sessionStorage.getItem('selectedTableData'))
      // 过滤,前端分页用
      // this.currentData = this.tableData.filter((item, index) => index >= (this.currentPage - 1) * this.pageObj.size &&
      //           index < this.currentPage * this.pageObj.size)
      this.$emit('currentChange', this.pageObj)
      // 已选中的数据打勾
      this.selectedTableData.forEach(item => {
        for (let i = 0; i < this.currentData.length; i++) {
          if (this.currentData[i].key === item.key) {
            // 切换页码重新计算oldVal
            this.oldVal.push(this.currentData[i])
            // 需要打勾的数据
            currentSelectedData.push(this.currentData[i])
          }
        }
      })
      this.$nextTick(() => {
        this.toggleSelection(currentSelectedData)
      })
      // 切换行索引
      this.currentIndex = (this.currentPage - 1) * this.pageObj.size + 1
    },
    // 条数变更
    handleSizeChange(size) {
      this.pageObj.size = size
      if (this.pageObj.page === 1) {
        this.$emit('currentChange', this.pageObj)
      }
    },
    // checkbox触发函数
    handleSelectionChange(val) {
      const valKeys = val.map(item => item.key)
      const oldValKeys = this.oldVal.map(item => item.key)
      this.selectedTableData = JSON.parse(sessionStorage.getItem('selectedTableData'))
      // 一条数据都没选中
      if (this.selectedTableData.length === 0) {
        this.selectedTableData = this.selectedTableData.concat(val)
        this.$emit('selection-change', this.selectedTableData)
        this.oldVal = [...val]
        sessionStorage.setItem('selectedTableData', JSON.stringify(this.selectedTableData))
        return
      }
      // 判断是选中数据还是取消选中
      if (valKeys.length < oldValKeys.length) {
        const delKey = oldValKeys.filter(item => !valKeys.includes(item))
        this.selectedTableData = this.selectedTableData.filter(item => !delKey.includes(item.key))
        this.$emit('selection-change', this.selectedTableData)
      } else {
        const addKey = valKeys.filter(item => !oldValKeys.includes(item))
        const addVal = val.filter(item => addKey.includes(item.key))
        this.selectedTableData = this.selectedTableData.concat(addVal)
        this.$emit('selection-change', this.selectedTableData)
      }
      sessionStorage.setItem('selectedTableData', JSON.stringify(this.selectedTableData))
      this.oldVal = [...val]
    },
    // 刷新table
    refresh(val) {
      if (val) {
        // 刷新到第一页
        this.pageObj.page = 1
        // 计算序号索引
        this.currentIndex = 1
        this.$emit('currentChange', this.pageObj)
      } else {
        this.$emit('currentChange', this.pageObj)
      }
    },
    // 获取页码
    getPage() {
      return this.pageObj
    }
    // 拖拽
    // setDrag() {
    //   const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    //   this.rowClassName = 'rowClassName' // 设置行样式，添加移动手势
    //   this.sortable = Sortable.create(el, {
    //     setData(dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: (evt) => {
    //       const dragData = [...this.currentData]
    //       let { oldIndex, newIndex } = evt
    //       if (this.pagination) {
    //         oldIndex = evt.oldIndex * this.currentPage
    //         newIndex = evt.newIndex * this.currentPage
    //       }
    //       dragData[oldIndex] = this.currentData[newIndex]
    //       dragData[newIndex] = this.currentData[oldIndex]
    //       this.$emit('getDragData', { dragData, oldIndex, newIndex })
    //     },
    //   })
    // },
    // 导出excel
    // exportExcel(fileName = 'sheet') {
    //   const targetTable = this.$XLSX.utils.table_to_book(document.querySelectorAll('.el-table__body-wrapper > table')[0])
    //   const writeTable = this.$XLSX.write(targetTable, { bookType: 'xlsx', bookSST: true, type: 'array' })
    //   try {
    //     FileSaver.saveAs(new Blob([writeTable], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
    //   } catch (e) { if (typeof console !== 'undefined') console.log(e, writeTable) }
    //   return writeTable
    // },
    // 导出csv
    // exportCsv(fileName = 'sheet') {
    //   const targetTable = this.$XLSX.utils.table_to_book(document.querySelectorAll('.el-table__body-wrapper > table')[0])
    //   const writeTable = this.$XLSX.write(targetTable, { bookType: 'csv', bookSST: true, type: 'array' })
    //   try {
    //     FileSaver.saveAs(new Blob([writeTable], { type: 'application/octet-stream' }), `${fileName}.csv`)
    //   } catch (e) { if (typeof console !== 'undefined') console.log(e, writeTable) }
    //   return writeTable
    // },
  }
}
</script>

<style lang="scss" scoped>
  .lin-table {
    position: relative;
  }
  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 135px;
  }

  .cell-edit-input .el-input,
  .el-input__inner {
    width: 125px;
  }

  .cell-icon {
    cursor: pointer;
    color: #3963bc;
    margin-left: 5px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: 15px;
  }
</style>

<style>
  .lin-table .rowClassName{
    cursor:move !important;
  }
</style>
