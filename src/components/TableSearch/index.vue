<!--table搜素-->
<template>
  <div class="lin-table-search">
    <el-form
      ref="form"
      label-suffix=":"
      :inline="true"
      :model="formData"
    >
      <el-form-item
        v-for="(item, index) in renderDataSource"
        v-show="index < SearchGlobalOptions.maxItem || (index >= SearchGlobalOptions.maxItem && collapsed)"
        :key="index"
        :label="item.labelText"
        :prop="item.fieldName"
      >
        <!--文本框-->
        <el-input
          v-if="item.type === 'text' || item.type === 'chooseText'"
          v-model="formData[item.fieldName]"
          :disabled="item.type === 'chooseText'"
          clearable
          :placeholder="item.placeholder"
          @change="handleFiltrate"
        />
        <!--选择按钮-->
        <el-button
          v-if="item.type === 'chooseText'"
          type="primary"
          class="m-l10"
          @click="chooseChange(item)"
        >选择</el-button>
        <!--数字输入框-->
        <el-input-number
          v-if="item.type === 'number'"
          v-model="formData[item.fieldName]"
          :min="item.min ? item.min : 1"
          type="number"
          controls-position="right"
          :placeholder="item.placeholder"
          @change="handleFiltrate"
        />
        <!--下拉选择-->
        <el-select
          v-if="item.type === 'select'"
          v-model="formData[item.fieldName]"
          filterable
          clearable
          :multiple="item.multiple"
          :placeholder="item.placeholder"
          @change="handleFiltrate"
        >
          <el-option
            v-for="(itemoption, indexOption) in item.options"
            :key="indexOption"
            :value="itemoption.value"
            :label="itemoption.label"
          />
        </el-select>
        <!--单选-->
        <el-radio-group
          v-if="item.type === 'radio' && Array.isArray(item.options)"
          v-model="formData[item.fieldName]"
          @change="handleFiltrate"
        >
          <el-radio-button
            v-for="(itemRadio,indexRadio) in item.options"
            :key="indexRadio"
            :label="itemRadio.value"
          >{{ itemRadio.label }}
          </el-radio-button>
        </el-radio-group>
        <!--时间选择-->
        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="formData[item.fieldName]"
          :placeholder="item.placeholder"
          type="date"
          :picker-options="pickerOptions"
          @change="handleFiltrate"
        />
        <!--范围选择-->
        <el-date-picker
          v-if="item.type === 'datetimeRange'"
          v-model="formData[item.fieldName]"
          type="daterange"
          unlink-panels
          range-separator="至"
          :picker-options="pickerRangeOptions"
          :start-placeholder="item.placeholder[0]"
          :end-placeholder="item.placeholder[1]"
          @change="handleCreateDate"
        />
        <el-radio-group
          v-if="item.type === 'radioDate' && Array.isArray(item.options)"
          v-model="formData[item.fieldName]"
          @change="handleRadioDate"
        >
          <el-radio-button
            v-for="(itemRadio,indexRadio) in item.options"
            :key="indexRadio"
            :label="itemRadio.value"
          > {{ itemRadio.label }}
          </el-radio-button>
        </el-radio-group>
        <!--多选-->
        <el-checkbox-group
          v-if="item.type === 'checkbox'"
          v-model="formData[item.fieldName]"
          @change="handleFiltrate"
        >
          <el-checkbox
            v-for="(itemCheckBox,indexCheckBox) in item.options"
            :key="indexCheckBox"
            :label="itemCheckBox.value"
          > {{ itemCheckBox.label }}
          </el-checkbox>
        </el-checkbox-group>
        <!--级联选择-->
        <el-cascader
          v-if="item.type === 'cascader'"
          v-model="formData[item.fieldName]"
          clearable
          filterable
          :options="item.options"
          :placeholder="item.placeholder"
          @change="handleFiltrate"
        />
      </el-form-item>
      <el-form-item class="m-l10">
        <el-button type="primary" @click="handleSubmit">查询</el-button>
        <el-button type="primary" plain @click="resetSearchForm">重置</el-button>
        <!--其他按钮插槽-->
        <slot name="extra" />
        <template v-if="maxItem < renderDataSource.length">
          <a class="m-l10" @click="togglecollapsed">
            {{ collapsed ? '收起' : '展开' }}
            <i :class="collapsed ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          </a>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getTodayDate, getYesterdayDate, getCurrentWeekDate, getCurrentMonthDate, formatDate, DateToUnix } from '@/utils/dateFormat'
export default {
  props: {
    // 是否把时间控件的返回值全部转为时间戳
    datetimeTotimeStamp: {
      type: Boolean,
      default: false
    },
    // 超过多少个折叠
    maxItem: {
      type: Number,
      default: 3
    },
    // 就是需要渲染控件的数据源
    searchDataSource: {
      type: Array,
      default: function() {
        return [
          {
            type: 'text', // 控件类型
            labelText: '控件名称', // 控件显示的文本
            fieldName: 'formField1',
            placeholder: '文本输入区域' // 默认控件的空值文本
          },
          {
            labelText: '数字输入框',
            type: 'number',
            fieldName: 'formField2',
            placeholder: '这是一个数字输入框'
          },
          {
            labelText: '下拉框',
            type: 'select',
            fieldName: 'formField3',
            placeholder: '请选择',
            defaultValue: '0',
            multiple: false,
            options: [
              {
                label: '全部',
                value: '0'
              },
              {
                label: 'text1',
                value: '1'
              },
              {
                label: 'text2',
                value: '2'
              }
            ]
          },
          {
            labelText: '单选框',
            type: 'radio',
            fieldName: 'formField4',
            defaultValue: '1',
            options: [
              {
                label: '选项1',
                value: '0'
              },
              {
                label: '选项2',
                value: '1'
              }
            ]
          },
          {
            labelText: '日期选择',
            type: 'datetime',
            fieldName: 'formField5',
            placeholder: '选择日期'
          },
          {
            labelText: '日期范围',
            type: 'datetimeRange',
            fieldName: 'createDate', // 固定
            startName: 'startDate', // 开始日期字段
            endName: 'endDate', // 结束日期字段
            placeholder: ['开始日期', '选择日期']
          },
          {
            labelText: '',
            type: 'radioDate',
            fieldName: 'radioDate', // 固定
            startName: 'startDate', // 开始日期字段
            endName: 'endDate', // 结束日期字段
            defaultValue: '',
            options: [
              {
                label: '今天',
                value: 1
              },
              {
                label: '昨天',
                value: 2
              },
              {
                label: '本周',
                value: 3
              },
              {
                label: '本月',
                value: 4
              }
            ]
          },
          {
            labelText: '多选框',
            type: 'checkbox',
            fieldName: 'formField8',
            defaultValue: ['0', '1'],
            options: [
              {
                label: '选项1',
                value: '0'
              },
              {
                label: '选项2',
                value: '1'
              }
            ]
          },
          {
            labelText: '联动',
            type: 'cascader',
            fieldName: 'formField9',
            placeholder: '级联选择',
            options: [
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                      {
                        value: 'xihu',
                        label: 'West Lake'
                      },
                      {
                        value: 'xiasha',
                        label: 'Xia Sha',
                        disabled: true
                      }
                    ]
                  }
                ]
              },
              {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                  {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                      {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua men'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    // 选择的用户名
    chooseName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      pickerRangeOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      },
      // 高级搜索 展开/关闭
      collapsed: false
    }
  },
  computed: {
    SearchGlobalOptions() {
      // 全局配置
      return {
        maxItem: this.maxItem,
        immediate: this.datetimeTotimeStamp
      }
    },
    renderDataSource() {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.searchDataSource.map(item => ({ ...this.SearchGlobalOptions, ...item }))
    }
  },
  watch: {
    chooseName(val) {
      const { fieldName } = this.searchDataSource.filter(item => item.type === 'chooseText')[0]
      this.formData[fieldName] = val
      this.handleFiltrate()
    }
  },
  created() {
    this.addDefaultValue()
  },
  methods: {
    // 添加初始值
    addDefaultValue() {
      const obj = {}
      this.searchDataSource.forEach(v => {
        if (v.defaultValue !== undefined) {
          obj[v.fieldName] = v.defaultValue
        }
      })
      this.formData = obj
    },
    // 展开 收起
    togglecollapsed() {
      this.collapsed = !this.collapsed
    },
    // 处理表单数据
    handleParams(obj) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
        return {}
      }
      const tempObj = {}
      for (let [key, value] of Object.entries(obj)) {
        // 清除两边空格
        if (key && typeof key === 'string') {
          key = key.trim()
        }
        // 无值
        if (!value) continue
        // 空数组
        if (Array.isArray(value) && value.length <= 0) continue
        // 函数
        if (Object.prototype.toString.call(value) === '[object Function]') continue

        if (this.datetimeTotimeStamp) {
          // 若是为true,则转为时间戳
          if (Object.prototype.toString.call(value) === '[object Date]') {
            // 判断date
            value = DateToUnix(value)
          }
          if (Array.isArray(value) && Object.prototype.toString.call(value[0]) === '[object Date]' && Object.prototype.toString.call(value[1]) === '[object Date]') {
            // 判断date
            value = value.map(item => DateToUnix(item))
          }
        } else {
          // 格式化日期
          if (Object.prototype.toString.call(value) === '[object Date]') {
            // 判断moment
            value = formatDate(value)
          }
          if (Array.isArray(value) && Object.prototype.toString.call(value[0]) === '[object Date]' && Object.prototype.toString.call(value[1]) === '[object Date]') {
            // 判断moment
            value = value.map(item => formatDate(item))
          }
        }
        // 若是为字符串则清除两边空格
        if (value && typeof value === 'string') {
          value = value.trim()
        }
        if (key === 'createDate') {
          // 范围
          const { startName, endName } = this.searchDataSource.filter(item => item.fieldName === key)[0]
          tempObj[startName] = value[0]
          tempObj[endName] = value[1]
        } else if (key === 'radioDate' && value) {
          // 今天 昨天 本周 本月
          const { startName, endName } = this.searchDataSource.filter(item => item.fieldName === key)[0]
          let searchData = ''
          switch (value) {
            case 1:
              // 今天
              searchData = getTodayDate()
              break
            case 2:
              // 昨天
              searchData = getYesterdayDate()
              break
            case 3:
              // 本周
              searchData = getCurrentWeekDate()
              break
            case 4:
              // 本月
              searchData = getCurrentMonthDate()
              break
          }
          tempObj[startName] = searchData[0] || ''
          tempObj[endName] = searchData[1] || ''
        } else {
          tempObj[key] = value
        }
      }
      return tempObj
    },
    // 查询 触发表单提交，也就是搜索按钮
    handleSubmit(e) {
      e.preventDefault()
      console.log('处理前的表单数据', this.formData)
      const queryParams = this.handleParams(this.formData)
      this.$emit('change', { queryParams, type: 'submit' })
    },
    // 重置
    resetSearchForm() {
      // 重置整个查询表单
      this.addDefaultValue()
      console.log('处理前的表单数据', this.formData)
      const queryParams = this.handleParams(this.formData)
      this.$emit('change', { queryParams, type: 'reset' })
    },
    // 筛选
    handleFiltrate() {
      console.log('处理前的表单数据', this.formData)
      const queryParams = this.handleParams(this.formData)
      this.$emit('change', { queryParams, type: 'filtrate' })
    },
    // 本周
    handleRadioDate() {
      if (this.formData.createDate) {
        this.formData.createDate = null
      }
      this.handleFiltrate()
    },
    // 范围
    handleCreateDate() {
      if (this.formData.radioDate) {
        this.formData.radioDate = ''
      }
      this.handleFiltrate()
    },
    // 选择
    chooseChange(item) {
      this.$emit('chooseChange', item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .lin-table-search {
    .el-form-item{
      margin-bottom: 10px;
    }
  }
</style>
