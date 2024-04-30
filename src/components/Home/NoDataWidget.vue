<template>
  <div :id="widgetId" />
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'totalPlan', 'displayText', 'percentValueRequired', 'type', 'divId'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const divSize = ref(props.liveWidth)
    const totalPlanVal = ref(props.totalPlan)
    const percentVal = ref(props.percentValueRequired)
    const displayTextVal = ref(props.displayText)
    const donutType = ref(props.type)
    const isXsOnly = ref(false)
    const smOnly = ref(false)
    const mdOnly = ref(false)
    const screenWidth = ref(0)
    const width = ref(320)
    const height = ref(350)
    const widgetId = ref(props.divId)

    //watch
    watchEffect(() => {
      mdOnly.value = display.md.value
      smOnly.value = display.sm.value
      isXsOnly.value = display.xs.value
      divSize.value = props.liveWidth
      screenWidth.value = display.width.value
    })
    watch(divSize, () => {
      loadIndividualClientDetails()
    })
    //mounted
    onMounted(() => {
      loadIndividualClientDetails()
    })
    function loadIndividualClientDetails() {
      var allReportSum = Number(totalPlanVal.value)
      var textToDisplay = displayTextVal.value
      var participantPercent = 100
      var width
      if (donutType.value === 'ClientsParticipant') {
        width = 200
      } else {
        let divWidth = document.getElementById(widgetId.value)
        width = divWidth.offsetWidth
      }

      var height = 190
      var radius = Math.min(width, height - 20) / 2
      var donutWidth = 20
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
      var color = d3.scaleOrdinal().range([$store.state.theme.accentColors[2]])

      d3.select(`#${widgetId.value}`).selectAll('svg').remove()

      var svg = d3
        .select(`#${widgetId.value}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2
          var transformWidth = width / 2
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

      svg
        .selectAll('path')
        .data(pie(seedData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
          return color(d.data.label)
        })

      var innerTextPosition = -5
      if (percentVal.value === 1) {
        innerTextPosition = innerTextPosition + 15
      }

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('y', innerTextPosition)
        .attr('class', 'fill_black')
        .text(allReportSum)
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('y', 20)
        .attr('class', 'fill_black')
        .text(textToDisplay)
    }

    return {
      width,
      height,
      totalPlanVal,
      displayTextVal,
      percentVal,
      donutType,
      loadIndividualClientDetails,
      widgetId
    }
  }
}
</script>

<style scoped>
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
