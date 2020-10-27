<template>
  <div>
    <el-page-header :style="{ color:theme }" class="m-b20" :content="this.editId?'编辑招聘':'添加招聘'" @back="goBack" />
    <div class="app-container">
      <edit-form ref="dialogForm" :form-width="formWidth" :form-data-source="formDataSource" :form-data-value="formDataValue">
        <template v-slot:extra>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button type="primary" plain @click="handleReset">重置</el-button>
        </template>
      </edit-form>
    </div>
  </div>
</template>
<script>
import EditForm from '@/components/EditForm'
import { baseRecruitSaveRecruit, baseFieldFindList, baseRecruitFindById } from '@/api/yfcxApi'
import { provinceJson } from '@/utils/province.js'
export default {
  name: 'AddRecruit',
  components: {
    EditForm
  },
  props: {
    editId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      formWidth: '40%',
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
          labelText: '招聘类型',
          type: 'select',
          fieldName: 'fieldId',
          placeholder: '请选择',
          defaultValue: '',
          multiple: false,
          options: [],
          rules: [
            { required: true, message: '请选择招聘类型', trigger: 'change' }
          ]
        },
        {
          labelText: '有效期',
          type: 'datetime',
          fieldName: 'effective',
          placeholder: '选择日期',
          rules: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '联系人', // 控件显示的文本
          fieldName: 'contact',
          placeholder: '请输入联系人', // 默认控件的空值文本
          maxlength: '10',
          rules: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '联系电话', // 控件显示的文本
          fieldName: 'tel',
          placeholder: '请输入联系电话', // 默认控件的空值文本
          maxlength: '11',
          rules: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { type: 'string', message: '联系电话格式有误', pattern: /^1[0-9]{10}$/ }
          ]
        },
        {
          type: 'cascader', // 控件类型
          labelText: '省市区', // 控件显示的文本
          fieldName: 'provinces',
          placeholder: '请选择省市区', // 默认控件的空值文本
          options: provinceJson,
          rules: [
            { required: true, message: '请选择省市区', trigger: 'change' }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '联系地址', // 控件显示的文本
          fieldName: 'address',
          placeholder: '请输入联系地址', // 默认控件的空值文本
          rules: [
            { required: true, message: '请输入联系地址', trigger: 'blur' }
          ]
        },
        {
          labelText: '状态',
          type: 'radio',
          fieldName: 'state',
          defaultValue: 1,
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
        },
        {
          labelText: '招聘内容',
          type: 'textarea',
          fieldName: 'content',
          maxlength: 100,
          placeholder: '请输入招聘内容',
          rules: [
            { required: true, message: '请输入联系地址', trigger: 'blur' }
          ]
        }
      ],
      formDataValue: {}
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  created() {
    this.getTag()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.editId) {
        // 编辑
        this.getInfo(this.editId)
      }
    })
  },
  methods: {
    // 获取招聘类型
    async getTag() {
      const requestParameters = Object.assign({}, { groups: this.groups })
      const { returnValue: res } = await baseFieldFindList(requestParameters)
      if (res) {
        res.forEach((v, i) => {
          this.formDataSource[1].options.push({
            label: v.title,
            value: v.id
          })
        })
      }
    },
    // 返回
    goBack() {
      this.$emit('editClose')
    },
    // 保存
    handleSave() {
      this.$refs.dialogForm.handleSubmit(async(data) => {
        data.id = this.editId || ''
        const { returnValue: res } = await baseRecruitSaveRecruit(data)
        if (res) {
          this.$message.success('操作成功')
          this.$emit('editClose')
        }
      })
    },
    // 重置
    handleReset() {
      this.$refs.dialogForm.resetForm()
    },
    // 详情
    async getInfo(id) {
      const { returnValue: res } = await baseRecruitFindById({ id })
      if (res) {
        res.provinces = [res.province, res.city, res.area]
        this.formDataValue = res
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
