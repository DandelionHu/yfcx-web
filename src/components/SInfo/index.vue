<template>
  <div class="alert-info m-b10">
    <div class="top">
      <i class="el-icon-info" />
      统计信息
      <span v-if="startDate">周期：{{ startDate }}<span v-if="endDate">至{{ endDate }}</span></span>
    </div>
    <div class="bottom">
      <div v-for="(item,index) in infoData" :key="index" class="box">
        <span>{{ item.name }}：</span>
        <span v-if="item.type==='money'" class="green">{{ item.value | rounded(3) | toThousandFilter }}</span>
        <span v-else-if="item.type==='number'" class="green">{{ item.value | toThousandFilter }}</span>
        <span v-else-if="item.type==='weight'" class="green">{{ item.value | KGTonne | toThousandFilter }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SInfo',
  props: {
    startDate: {
      type: String,
      default: '2012-01-01'
    },
    endDate: {
      type: String,
      default: '2014-02-04'
    },
    infoData: {
      type: Array,
      default() {
        return [
          {
            name: '销售吨数',
            value: '-1585.5',
            type: 'weight'
          },
          {
            name: '销售数量',
            value: '1000',
            type: 'number'
          },
          {
            name: '销售金额',
            value: '-1234.665',
            type: 'money'
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="scss">
.alert-info{
  background: #F6FFED;
  padding: 10px;
  border: 1px solid #B7EB8F;
  padding-bottom: 5px;
  .top{
    color: #333;
    font-size: 15px;
    i{
      color:#52C41A;
    }
  }
  .bottom{
    margin-top: 5px;
    .box{
      display: inline-block;
      line-height: 30px;
      font-size: 15px;
      margin-right: 20px;
      .green{
        color: #52c41a;
        font-weight: bold;
      }
    }
  }
}
</style>
