<template>
  <div>
    <el-page-header :style="{ color:theme }" class="m-b20" content="查看招聘" @back="goBack" />
    <div class="app-container">
      <description-list col="12" :content="info" border>
        <description label="标题">{{ info.title }}</description>
        <description label="招聘类型">{{ info.fieldName }}</description>
        <description label="有效期">{{ info.effective }}</description>
        <description label="联系人">{{ info.contact }}</description>
        <description label="联系电话">{{ info.tel }}</description>
        <description label="联系地址">{{ info.province + info.city + info.area + info.address }}</description>
        <description label="状态">{{ info.state | state }}</description>
        <description label="招聘内容">{{ info.content }}</description>
      </description-list>
    </div>
  </div>
</template>
<script>
import DescriptionList from '@/components/DescriptionList'
import { baseRecruitFindById } from '@/api/yfcxApi'
export default {
  name: 'RecruitInfo',
  components: {
    DescriptionList
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
    editId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      info: {}
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
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
    // 返回
    goBack() {
      this.$emit('editClose')
    },
    // 详情
    async getInfo(id) {
      const { returnValue: res } = await baseRecruitFindById({ id })
      if (res) {
        this.info = res
      }
    }
  }
}
</script>
<style lang="scss" scope>

</style>
