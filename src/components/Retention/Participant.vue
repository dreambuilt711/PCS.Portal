<template>
  <div id="participantWidget" />
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'participant'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const participantList = ref(props.participant)
    const divSize = ref(props.liveWidth)
    const isXsOnly = ref(false)
    const lgOnly = ref(false)
    const xlOnly = ref(false)
    const screenWidth = ref(0)
    const width = ref(320)
    const height = ref(320)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      xlOnly.value = display.xl.value
      lgOnly.value = display.lg.value
      divSize.value = props.liveWidth
      screenWidth.value = display.width.value
    })
    watch(divSize, () => {
      loadParticipants()
    })
    watch(
      participantList,
      () => {
        loadParticipants()
      },
      { deep: true }
    )
    onMounted(() => {
      loadParticipants()
    })
    function loadParticipants() {
      var participantPercent = parseFloat(participantList.value[0].PARTICRATE * 100)
      if (isNaN(participantPercent)) participantPercent = 0
      var seedData = [
        {
          label: 'Participating',
          value: participantPercent
        },
        {
          label: 'Not Participating',
          value: 100 - (participantPercent === 0 ? 100 : participantPercent)
        }
      ]
      var series = [
        {
          label: 'Participating'
        },
        {
          label: 'Not Participating'
        }
      ]
      let divWidth = document.getElementById('participantWidget')
      var width = isXsOnly.value ? divWidth.offsetWidth : 320
      var height = 296
      var donutWidth = 20
      var radius = Math.min(width - 80, height - 80) / 2
      var color = d3.scaleOrdinal().range([$store.state.theme.accentColors[0], $store.state.theme.accentColors[1]])
      var transformValue = 0
      if (xlOnly.value) transformValue = 0
      if (lgOnly.value) transformValue = 30
      //Draw legend
      var legendRectSize = 18
      var legendSpacing = 4
      d3.select('#participantWidget').selectAll('svg').remove()
      var svg = d3
        .select('#participantWidget')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2 - 30
          var transformWidth = width / 2 - transformValue
          return 'translate(' + transformWidth + ',' + transformHeight + ')'
        })
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
          return d.value
        })
        .sort(null)

      var tooltip = d3.select('#participantWidget').append('div').attr('class', 'tooltip_total_asset').style('display', 'none')

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
          .text(d.data.label + ' - ' + parseFloat(d.data.value).toFixed(2) + '%')
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '24px')
        .attr('y', 10)
        .attr('class', 'fill_black')
        .attr('font-weight', '500')
        .text(participantPercent.toFixed(2) + '%')
      var legend = svg
        .selectAll('.legend')
        .data(series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          var myheight = 0
          if (i === 0) myheight = 120
          if (i === 1) myheight = 150
          if (i === 2) myheight = 170
          var mywidth = -70
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
        // .attr('class', 'legend')
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
      participantList,
      divSize,
      isXsOnly,
      lgOnly,
      xlOnly,
      screenWidth,
      loadParticipants
    }
  }
}
</script>

<style scoped>
.tooltip {
  color: #333;
  font-size: 12px;
  left: 10px;
  padding: 10px;
  position: absolute;
  text-align: center;
  top: 0px;
  width: 80px;
}
.legend {
  font-size: 12px;
}
rect {
  stroke-width: 2;
}
.label {
  margin-top: -40px;
}
.v-theme--dark .fill_black {
  fill: white;
}
.v-theme--light .fill_black {
  fill: black;
}
</style>
