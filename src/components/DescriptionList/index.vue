<!--详情组件-->
<template>
  <div class="description_text">
    <div v-if="title" class="title">{{ title }}</div>
    <el-row :gutter="gutter" :class="{ border: border }">
      <el-col v-for="(item, key) in dataSource" :key="key" class="box" :span="+col">
        <div class="label">{{ item.label }}</div>
        <div class="detail">{{ item.detail }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const handleArrayObj = data => {
  return data.filter(item => item.tag === 'description').map(item => ({
    tag: item.tag,
    label: (item.data && item.data.attrs.label) || '暂无',
    detail: (item.children && item.children[0].text) || '暂无'
  }))
}
export default {
  name: 'DescriptionList',
  props: {
    title: String,
    content: [Object, Array],
    gutter: {
      type: [Number, String],
      default: 20
    },
    col: {
      type: [Number, String],
      default: 8
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSource: handleArrayObj(this.$slots.default || [])
    }
  },
  watch: {
    content() {
      this.dataSource = handleArrayObj(this.$slots.default || [])
    } // 监听重渲染
  }
}
</script>
<style lang="scss" scope>
  .description_text {
    padding: 0px 10px;
    .title {
      font-weight: 700;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.85);
    }
    .box{
      display:flex;
      padding:0px !important;
      flex-wrap: nowrap;
      .label {
        color: rgba(0,0,0,.85);
        font-weight: 400;
        font-size: 14px;
        line-height: 40px;
        white-space: nowrap;
        padding-left:10px;
        &:after {
          content: ":";
          margin: 0 8px 0 2px;
          position: relative;
          top: -0.5px;
        }
      }
      .detail {
        font-size: 14px;
        width: 100%;
        line-height: 40px;
        color: rgba(0, 0, 0, 0.65);
        padding-left:10px;
      }
    }
  }
  .border{
    border-bottom: 1px solid #d8e0e8;
    border-right: 1px solid #d8e0e8;
    .box{
      border-top: 1px solid #d8e0e8;
      border-left: 1px solid #d8e0e8;
      .label{
        border-right: 1px solid #d8e0e8;
        background: #eef4f9;
        min-width: 200px;
        max-width: 400px;
        &:after {
          content: "";
        }
      }
      .detail{
        background: #fff;
      }
    }
  }
</style>
