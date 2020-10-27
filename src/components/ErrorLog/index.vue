<!--错误日志-->
<template>
  <div v-if="errorLogs.length>0">
    <!--按钮 -->
    <el-badge :is-dot="true" class="badge" @click.native="dialogTableVisible=true">
      <el-button class="btn-icon" size="small" type="danger">
        <svg-icon icon-class="bug" />
      </el-button>
    </el-badge>
    <!--弹框 -->
    <el-dialog :visible.sync="dialogTableVisible" width="80%" append-to-body>
      <div slot="title">
        <span class="p-r10">错误日志</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAll">清除全部</el-button>
      </div>
      <el-table :data="errorLogs" border>
        <el-table-column label="信息">
          <template slot-scope="{row}">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title">Info: </span>
              <el-tag type="warning">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title">Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常">
          <template slot-scope="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ErrorLog',
  data() {
    return {
      dialogTableVisible: false
    }
  },
  computed: {
    errorLogs() {
      return this.$store.getters.errorLogs
    }
  },
  methods: {
    clearAll() {
      this.dialogTableVisible = false
      this.$store.dispatch('errorLog/clearErrorLog')
    }
  }
}
</script>

<style scoped>
.badge{
  line-height: 25px;
  margin-top: -5px;
}
.btn-icon{
  padding: 8px 10px;
}
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
