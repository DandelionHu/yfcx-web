<template>
  <div class="app-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <div class="line-chart m-b20">
      <line-chart :chart-data="lineChartData" />
    </div>
    <el-row class="m-b20" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="line-chart">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="line-chart">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="line-chart">
          <raddar-chart />
        </div>
      </el-col>
    </el-row>
    <div class="line-chart m-b20">
      <mix-chart id="mixChart" height="500px" width="100%" />
    </div>
    <div class="line-chart m-b20">
      <line-marker id="lineMarker" height="500px" width="100%" />
    </div>
    <div class="line-chart m-b20">
      <keyboard id="keyboard" height="500px" width="100%" />
    </div>
  </div>
</template>
<script>
import panelGroup from './panelGroup'
import lineChart from './lineChart'
import pieChart from './pieChart'
import barChart from './barChart'
import raddarChart from './raddarChart'
import MixChart from '@/components/Charts/MixChart'
import LineMarker from '@/components/Charts/LineMarker'
import Keyboard from '@/components/Charts/Keyboard'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'Dashboard',
  components: {
    panelGroup,
    lineChart,
    pieChart,
    barChart,
    raddarChart,
    MixChart,
    LineMarker,
    Keyboard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>
<style lang="scss" scoped>
  .line-chart{
    background: #fff;
    padding: 20px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }
</style>
