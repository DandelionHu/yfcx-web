<!--编辑form表单-->
<template>
  <div class="lin-edit-form">
    <el-form
      ref="editForm"
      label-suffix=":"
      :model="formData"
      :label-width="labelWidth"
      :style="{ width: formWidth }"
    >
      <el-col
        v-for="(item, index) in renderDataSource"
        :key="index"
        :span="12"
      >
        <el-form-item
          v-if="item.show"
          :label="item.labelText"
          :rules="item.rules"
          :prop="item.fieldName"
        >
          <!--文本框-->
          <el-input
            v-if="item.type === 'text' || item.type === 'chooseText'"
            v-model="formData[item.fieldName]"
            :disabled="item.type === 'chooseText' || item.disabled"
            :class="{ width74: item.type === 'chooseText' }"
            clearable
            :placeholder="item.placeholder"
            :maxlength="item.maxlength"
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
            <el-radio
              v-for="(itemRadio,indexRadio) in item.options"
              :key="indexRadio"
              :label="itemRadio.value"
            >{{ itemRadio.label }}
            </el-radio>
          </el-radio-group>
          <!--switch -->
          <el-switch
            v-if="item.type === 'switch'"
            v-model="formData[item.fieldName]"
            @change="handleFiltrate"
          />
          <!--时间选择-->
          <el-time-picker
            v-if="item.type === 'timePicker'"
            v-model="formData[item.fieldName]"
            :placeholder="item.placeholder"
            :picker-options="item.pickerOptions"
            @change="handleFiltrate"
          />
          <!--日期选择-->
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
            @change="handleFiltrate"
          />
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
          <!--多文本框-->
          <el-input
            v-if="item.type === 'textarea'"
            v-model="formData[item.fieldName]"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="item.placeholder"
            :maxlength="item.maxlength"
            @change="handleFiltrate"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item>
          <!--其他按钮插槽-->
          <slot name="extra" />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { isEqual } from 'lodash'
import { formatDate, DateToUnix } from '@/utils/dateFormat'
export default {
  props: {
    // 就是需要渲染控件的数据源
    formDataSource: {
      type: Array,
      default: function() {
        return [
          {
            type: 'text', // 控件类型
            labelText: '控件名称', // 控件显示的文本
            fieldName: 'formField1',
            placeholder: '文本输入区域', // 默认控件的空值文本
            maxlength: '10',
            rules: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]
          },
          {
            type: 'chooseText', // 控件类型
            labelText: '选择客户', // 控件显示的文本
            fieldName: 'formField10',
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
            labelText: '开关',
            type: 'switch',
            fieldName: 'formField11',
            defaultValue: false
          },
          {
            labelText: '时间选择',
            type: 'timePicker',
            fieldName: 'formField12',
            placeholder: '选择时间',
            pickerOptions: {
              selectableRange: '18:30:00 - 20:30:00'
            }
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
    // 是否把时间控件的返回值全部转为时间戳
    datetimeTotimeStamp: {
      type: Boolean,
      default: false
    },
    // 选择的用户名
    chooseName: {
      type: String,
      default: ''
    },
    // lable宽度
    labelWidth: {
      type: String,
      default: '100px'
    },
    // form宽度
    formWidth: {
      type: String,
      default: '50%'
    },
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },
    // formDataValue的值
    formDataValue: {
      type: Object,
      default: function() {
        return {}
      }
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
      }
    }
  },
  computed: {
    SearchGlobalOptions() {
      // 全局配置
      return {
        immediate: this.datetimeTotimeStamp,
        show: this.show
      }
    },
    renderDataSource() {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.formDataSource.map(item => ({ ...this.SearchGlobalOptions, ...item }))
    }
  },
  watch: {
    // 监听 formDataValue 改变
    'formDataValue': {
      handler() {
        if (!isEqual(this.formDataValue, this.formData)) {
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = this.formDataValue[key] || ''
          })
          const queryParams = this.handleParams(this.formData)
          this.$emit('change', queryParams)
        }
      },
      deep: true
    }
  },
  created() {
    this.addDefaultValue()
  },
  methods: {
    // 添加初始值
    addDefaultValue() {
      const obj = {}
      this.formDataSource.forEach(v => {
        obj[v.fieldName] = v.defaultValue || ''
      })
      this.formData = obj
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
          const { startName, endName } = this.formDataSource.filter(item => item.fieldName === key)[0]
          tempObj[startName] = value[0]
          tempObj[endName] = value[1]
        } else if (key === 'provinces') {
          tempObj.province = value[0]
          tempObj.city = value[1]
          tempObj.area = value[2]
        } else {
          tempObj[key] = value
        }
      }
      return tempObj
    },
    // 校验(给外部调用)
    handleSubmit(fun) {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const queryParams = this.handleParams(this.formData)
          fun && fun(queryParams)
        } else {
          console.log('校验不通过')
          return false
        }
      })
    },
    // 清空(给外部调用)
    resetForm(fun) {
      // 重置整个查询表单
      this.$refs.editForm.resetFields()
      // 初始值
      this.addDefaultValue()
      const queryParams = this.handleParams(this.formData)
      fun && fun(queryParams)
    },
    // 输入框值改变
    handleFiltrate() {
      const queryParams = this.handleParams(this.formData)
      this.$emit('change', queryParams)
    },
    // 选择
    chooseChange(item) {
      this.$emit('chooseChange', item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .lin-edit-form{
    display: flex;
    flex-wrap: wrap;
    .el-col-12{
      min-width: 425px;
    }
    .el-input-number{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 100%;
    }
    .el-cascader{
      width: 100%;
    }
    .width74{
      width: 74%;
    }
  }
</style>
