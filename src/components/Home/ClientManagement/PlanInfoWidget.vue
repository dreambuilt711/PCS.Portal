<template>
  <div id="companyInfoWidget" />
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'companyInfo', 'totalCompanyAssets'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const companyInfoList = ref(props.companyInfo)
    const divSize = ref(props.liveWidth)
    const totalAssets = ref(props.totalCompanyAssets)
    const isXsOnly = ref(false)
    const smOnly = ref(false)
    const mdAndUp = ref(false)
    const smAndDown = ref(false)
    const screenWidth = ref(0)
    const width = ref(320)
    const height = ref(350)
    //watch
    watchEffect(() => {
      mdAndUp.value = display.mdAndUp.value
      smOnly.value = display.sm.value
      isXsOnly.value = display.xs.value
      smAndDown.value = display.smAndDown.value
      divSize.value = props.liveWidth
      screenWidth.value = display.width.value
    })
    watch(divSize, () => {
      loadCompanyDetails()
    })
    watch(
      companyInfoList,
      () => {
        loadCompanyDetails()
      },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      loadCompanyDetails()
    })
    //methods
    function loadCompanyDetails() {
      let seedData
      if (!companyInfoList.value) return
      seedData = companyInfoList.value.map((res) => ({
        label: res.PlanType,
        value: res.PercentageAssets ? res.PercentageAssets : 0
      }))

      let divWidth = document.getElementById('companyInfoWidget')
      var width = 220
      if (isXsOnly.value) {
        width = divWidth && divWidth.offsetWidth ? divWidth.offsetWidth : 250
      } else if (smOnly.value) {
        width = 350
      } else if (mdAndUp.value && divWidth && divWidth.offsetWidth && divWidth.offsetWidth > 500) {
        width = 250
      } else {
        width = 220
      }
      if (!width) width = 220
      var height = 200
      var radius = Math.min(width, height - 20) / 2
      var donutWidth = 20
      var color = d3
        .scaleOrdinal()
        .range([
          $store.state.theme.accentColors[0],
          $store.state.theme.accentColors[3],
          $store.state.theme.accentColors[1],
          $store.state.theme.accentColors[2],
          '#ffbcc4',
          '#874594',
          '#d87c14',
          '#dc4a55',
          '#8676ad',
          '#cb3e70',
          '#004c91',
          '#ccaccb',
          '#c7cee5',
          '#e06138',
          '#b0bad9',
          '#564a98',
          '#f0854d',
          '#345d9d',
          '#06425b'
        ])
      //Draw legend
      var transformHeight = height / 2
      var transformWidth = smAndDown.value ? width / 2 : smOnly.value ? 200 : 100

      d3.select('#companyInfoWidget').selectAll('svg').remove()
      var svg = d3
        .select('#companyInfoWidget')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          return 'translate(' + transformWidth + ',' + transformHeight + ')'
        })
      var tooltip = d3.select('#companyInfoWidget').append('div').attr('class', 'tooltip_total_asset').style('display', 'none')

      var defs = svg.append('defs')
      var filter = defs.append('filter').attr('id', 'drop-shadow').attr('height', '130%')
      filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 3).attr('result', 'blur')
      filter.append('feOffset').attr('in', 'blur').attr('dx', 3).attr('dy', 3).attr('result', 'offsetBlur')
      let feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'offsetBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
      var arc = d3
        .arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius)

      var pie = d3
        .pie()
        .value(function (d) {
          return d.value < 0 ? -1 * d.value : d.value
        })
        .sort(null)

      var path = svg
        .selectAll('path')
        .data(pie(seedData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
          return color(d.data.label)
        })

      path.on('mouseover', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', '2px').style('filter', 'url(#drop-shadow)')
        tooltip.style('display', 'inline-block').style('position', 'absolute')
      })

      path.on('mouseout', function () {
        d3.select(this).attr('stroke', 'none').style('filter', 'none')
        tooltip.style('display', 'none')
      })

      path.on('mousemove', function (event, d) {
        tooltip
          .text(d.data.label + ', ' + d.data.value + '%')
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('y', -10)
        .attr('class', 'fill_black')
        .attr('font-weight', '500')
        .attr('word-break', 'break-all')
        .attr('width', '100')
        .text('All Plans')
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('y', 15)
        .attr('class', 'fill_black')
        .attr('word-break', 'break-all')
        .attr('width', '100')
        .text(formatter.format(totalAssets.value))
    }

    return {
      width,
      height,
      companyInfoList,
      divSize,
      totalAssets,
      loadCompanyDetails,
      smAndDown,
      screenWidth
    }
  }
}
</script>
<style scoped>
.legend {
  font-size: 12px;
}
rect {
  stroke-width: 2;
}
.fill_white {
  fill: white;
}
.fill_black {
  fill: black;
}
</style>
