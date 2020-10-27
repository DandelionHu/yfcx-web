<template>
  <div class="app-container lin-tree">
    <div class="tree-left">
      <el-tree
        :style="{ borderColor:theme }"
        default-expand-all
        highlight-current
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="tree-right">
      <edit-form
        ref="dialogForm"
        :form-data-source="formDataSource"
        :form-width="formWidth"
        :label-width="labelWidth"
        :form-data-value="formData"
        @change="changeForm"
      >
        <template v-slot:extra>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button type="primary" plain @click="resetForm">重置</el-button>
          <el-button type="success" @click="onResetId">清除ID</el-button>
          <el-button type="warning" @click="onDelete">标记删除</el-button>
          <el-button type="danger" @click="onDeleteAll">物理删除</el-button>
        </template>
      </edit-form>
    </div>
    <!--返回顶部-->
    <back-to-top />
  </div>
</template>
<script>
import EditForm from '@/components/EditForm'
import BackToTop from '@/components/BackToTop'
import { baseAuthorityFindList, baseAuthoritySaveAuthority, baseAuthorityFindById, baseAuthorityDeleteAll, baseAuthorityDeleteRealById } from '@/api/yfcxApi'
export default {
  components: {
    EditForm,
    BackToTop
  },
  data() {
    return {
      formWidth: '100%',
      labelWidth: '120px',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      formDataSource: [
        {
          labelText: '类型',
          type: 'radio',
          fieldName: 'type',
          defaultValue: 1,
          options: [
            {
              label: '目录',
              value: 1
            },
            {
              label: '功能',
              value: 2
            }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '权限ID', // 控件显示的文本
          fieldName: 'id',
          placeholder: '请输入权限ID', // 默认控件的空值文本
          maxlength: '10',
          disabled: true
        },
        {
          type: 'text', // 控件类型
          labelText: '父级ID', // 控件显示的文本
          fieldName: 'pid',
          placeholder: '请输入父级ID', // 默认控件的空值文本
          maxlength: '10'
        },
        {
          type: 'text', // 控件类型
          labelText: '权限标题', // 控件显示的文本
          fieldName: 'name',
          placeholder: '请输入权限标题', // 默认控件的空值文本
          maxlength: '20'
        },
        {
          type: 'text', // 控件类型
          labelText: '路由路径', // 控件显示的文本
          fieldName: 'htmlurl',
          placeholder: '请输入路由路径', // 默认控件的空值文本
          show: true
        },
        {
          type: 'text', // 控件类型
          labelText: '路由key', // 控件显示的文本
          fieldName: 'namekey',
          placeholder: '请输入路由key', // 默认控件的空值文本
          show: true
        },
        {
          type: 'text', // 控件类型
          labelText: '路由访问路径', // 控件显示的文本
          fieldName: 'path',
          placeholder: '请输入路由访问路径', // 默认控件的空值文本
          show: true
        },
        {
          type: 'text', // 控件类型
          labelText: '路由重定向', // 控件显示的文本
          fieldName: 'redirect',
          placeholder: '请输入路由重定向', // 默认控件的空值文本
          show: true
        },
        {
          type: 'text', // 控件类型
          labelText: '路由图标', // 控件显示的文本
          fieldName: 'icon',
          placeholder: '请输入路由图标', // 默认控件的空值文本
          show: true
        },
        {
          labelText: '是否隐藏',
          type: 'radio',
          fieldName: 'showMenu',
          defaultValue: '0',
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ],
          show: true
        },
        {
          labelText: '是否隐藏子菜单',
          type: 'radio',
          fieldName: 'hideChildren',
          defaultValue: '0',
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ],
          show: true
        },
        {
          type: 'text', // 控件类型
          labelText: '权限级别', // 控件显示的文本
          fieldName: 'levels',
          placeholder: '请输入权限级别' // 默认控件的空值文本
        },
        {
          type: 'text', // 控件类型
          labelText: '权限排序', // 控件显示的文本
          fieldName: 'sortNo',
          placeholder: '请输入权限排序' // 默认控件的空值文本
        },
        {
          type: 'text', // 控件类型
          labelText: '权限按钮key', // 控件显示的文本
          fieldName: 'authKeys',
          placeholder: '请输入权限按钮' // 默认控件的空值文本
        },
        {
          type: 'text', // 控件类型
          labelText: '权限分组', // 控件显示的文本
          fieldName: 'groups',
          placeholder: '请输入权限分组' // 默认控件的空值文本
        },
        {
          type: 'text', // 控件类型
          labelText: '功能模块', // 控件显示的文本
          fieldName: 'module',
          placeholder: '请输入功能模块' // 默认控件的空值文本
        },
        {
          type: 'text', // 控件类型
          labelText: '记录日志', // 控件显示的文本
          fieldName: 'recordLog',
          placeholder: '请输入记录日志' // 默认控件的空值文本
        },
        {
          type: 'textarea', // 控件类型
          labelText: '请求接口', // 控件显示的文本
          fieldName: 'interfaceUrl',
          placeholder: '请输入请求接口' // 默认控件的空值文本
        }
      ],
      formData: {},
      selectedKeys: '' // 选中的key
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  mounted() {
    this.getAuthority()
  },
  methods: {
    // 表单改变
    changeForm(obj) {
      if (obj.type === 2) {
        this.formDataSource.forEach((v, i) => {
          if (v.show) {
            v.show = !v.show
          }
        })
      } else if (obj.type === 1) {
        this.formDataSource.forEach((v, i) => {
          if (v.show === false) {
            v.show = !v.show
          }
        })
      }
    },
    // 保存
    handleSubmit() {
      this.$refs.dialogForm.handleSubmit(async(queryParams) => {
        let data = {}
        if (queryParams.type === 2) {
          data = {
            type: queryParams.type,
            sortNo: queryParams.sortNo,
            pid: queryParams.pid,
            id: queryParams.id,
            name: queryParams.name,
            levels: queryParams.levels,
            groups: queryParams.groups,
            module: queryParams.module,
            recordLog: queryParams.recordLog,
            interfaceUrl: queryParams.interfaceUrl,
            authKeys: queryParams.authKeys
          }
        } else {
          data = queryParams
        }
        const { returnValue: res } = await baseAuthoritySaveAuthority(data)
        if (res) {
          this.$message.success('添加成功')
          this.getAuthority()
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs.dialogForm.resetForm(async(queryParams) => {
        if (queryParams.type === 2) {
          this.formDataSource.forEach((v, i) => {
            if (v.show) {
              v.show = !v.show
            }
          })
        } else if (queryParams.type === 1) {
          this.formDataSource.forEach((v, i) => {
            if (v.show === false) {
              v.show = !v.show
            }
          })
        }
      })
    },
    // 查询
    async getAuthority() {
      const { returnValue: res } = await baseAuthorityFindList({})
      const treeData = []
      res.forEach((v, i) => {
        if (v.pid === '0') {
          // 最高级
          const obj = {
            title: v.name,
            key: v.id,
            slots: {
              title: 'name'
            },
            children: []
          }
          obj.children = this.getchilds(v.id, res)// 获取子节点
          treeData.push(obj)
        }
      })
      console.log(treeData)
      this.treeData = treeData
    },
    // 获取子节点
    getchilds(id, array) {
      const childs = []
      // 循环获取子节点
      array.forEach((v, i) => {
        if (v.pid === id) {
          childs.push({
            title: v.name,
            key: v.id,
            slots: {
              title: 'name'
            },
            children: []
          })
        }
      })
      // 获取子节点的子节点
      childs.forEach((v, i) => {
        const childscopy = this.getchilds(v.key, array)// 递归获取子节点
        if (childscopy.length > 0) {
          v.children = childscopy
        }
      })
      return childs
    },
    // 点击树
    handleNodeClick(data) {
      this.selectedKeys = data.key
      this.getDetail(data.key)
    },
    // 改变显示问题
    changeDataSource(type) {
      if (type === 2) {
        this.formDataSource.forEach((v, i) => {
          if (v.show) {
            v.show = !v.show
          }
        })
      } else if (type === 1) {
        console.log(this.formDataSource)
        // this.formDataSource.forEach((v, i) => {
        //   if (v.show === false) {
        //     v.show = !v.show
        //   }
        // })
      }
    },
    // 获取详情
    async getDetail(id) {
      const { returnValue: res } = await baseAuthorityFindById({ id })
      this.formData = res
    },
    // 清除id
    onResetId() {
      this.formData.id = ''
    },
    // 标记删除
    async onDelete() {
      if (this.selectedKeys) {
        const id = this.selectedKeys
        const { returnValue: res } = await baseAuthorityDeleteAll({ id })
        if (res) {
          this.$message.success('删除成功')
          this.getAuthority()
        }
      } else {
        this.$message.info('请选择节点')
      }
    },
    // 物理删除
    async onDeleteAll() {
      if (this.selectedKeys) {
        const id = this.selectedKeys
        const { returnValue: res } = await baseAuthorityDeleteRealById({ id })
        if (res) {
          this.$message.success('删除成功')
          this.getAuthority()
        }
      } else {
        this.$message.info('请选择节点')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lin-tree{
  display: flex;
  .tree-left{
    width: 250px;
    margin-right: 20px;
    .el-tree{
      border: 1px solid #1890ff;
    }
    ::v-deep .el-tree-node__content{
      height: 32px;
    }
    ::v-deep .el-tree-node__label{
      font-size: 15px;
    }
  }
  .tree-right{
    width:50%;
  }
}
</style>
