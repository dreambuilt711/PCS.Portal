<template>
  <div id="businessMatrixWidget" />
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'businessMatrix', 'businessMatrixType'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const businessMatrixList = ref(props.businessMatrix)
    const businessType = ref(props.businessMatrixType)
    const divSize = ref(props.liveWidth)
    const isXsOnly = ref(false)
    const smOnly = ref(false)
    const mdOnly = ref(false)
    const xlOnly = ref(false)
    const lgOnly = ref(false)
    const width = ref(320)
    const height = ref(200)
    //watch
    watchEffect(() => {
      mdOnly.value = display.md.value
      smOnly.value = display.sm.value
      isXsOnly.value = display.xs.value
      divSize.value = props.liveWidth
      xlOnly.value = display.xl.value
      lgOnly.value = display.lg.value
    })
    watch(divSize, () => {
      loadBusinessMatrix()
    })
    watch(
      businessMatrixList,
      () => {
        loadBusinessMatrix()
      },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      loadBusinessMatrix()
    })
    function loadBusinessMatrix() {
      let seedData
      if (!businessMatrixList.value) return
      seedData = businessMatrixList.value.map((res) => ({
        label: businessType.value === 0 ? res.PlanType : res.BusinessType,
        value: res.PercentageAssets
      }))
      let divWidth = document.getElementById('businessMatrixWidget')
      var width = isXsOnly.value ? divWidth.offsetWidth : smOnly.value || mdOnly ? 280 : 320
      var height = 296
      var radius = Math.min(width - 80, height - 80) / 2
      var donutWidth = 20
      var transformValue = 0
      if (xlOnly.value) transformValue = 0
      if (lgOnly.value) transformValue = 30
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
          '#e06138',
          '#b0bad9',
          '#564a98',
          '#f0854d',
          '#345d9d',
          '#e7cadd',
          '#c7cee5'
        ])

      //Draw legend
      var legendRectSize = 18
      var legendSpacing = 4
      d3.select('#businessMatrixWidget').selectAll('svg').remove()
      var svg = d3
        .select('#businessMatrixWidget')
        .append('svg')
        .attr('width', width)
        .attr('height', height + 24)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2 - 30
          var transformWidth = width / 2 - transformValue
          return 'translate(' + transformWidth + ',' + transformHeight + ')'
        })
      var tooltip = d3.select('#businessMatrixWidget').append('div').attr('class', 'tooltip_total_asset').style('display', 'none')

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
      var fontSize = isXsOnly.value ? '18px' : '18px'
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', 10)
        .attr('class', 'fill_black')
        .attr('font-weight', '500')
        .attr('word-break', 'break-all')
        .attr('width', '100')
        .text(businessType.value === 0 ? 'PlanType' : 'BusinessType')
      var legend = svg
        .selectAll('.legend')
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          var myheight = 0
          if (i === 0) myheight = 130
          if (i === 1) myheight = 155
          if (i === 2) myheight = 180
          var mywidth = -40
          return 'translate(' + mywidth + ',' + myheight + ')'
        })

      legend
        .append('circle')
        .attr('cx', 9)
        .attr('cy', 9)
        .attr('r', 5)
        .style('fill', function (d, i) {
          return color(i)
        })
        .style('stroke', function (d, i) {
          return color(i)
        })

      legend
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .style('font-size', '12px')
        .attr('class', 'fill_black')
        .text(function (d) {
          return d.label
        })
    }
    return {
      width,
      height,
      businessMatrixList,
      loadBusinessMatrix
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
.v-theme--dark .fill_black {
  fill: white;
}
.v-theme--light .fill_black {
  fill: black;
}
</style>
