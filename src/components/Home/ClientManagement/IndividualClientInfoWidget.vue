<template>
  <div id="individualClientInfoWidget" />
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'individualClientDetails'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const individualClientList = ref(props.individualClientDetails)
    const divSize = ref(props.liveWidth)
    const isXsOnly = ref(false)
    const smOnly = ref(false)
    const mdOnly = ref(false)
    const screenWidth = ref(0)
    const width = ref(320)
    const height = ref(350)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      smOnly.value = display.sm.value
      divSize.value = props.liveWidth
      screenWidth.value = display.width.value
    })
    watch(divSize, () => {
      loadIndividualClientDetails()
    })
    watch(
      individualClientList,
      () => {
        loadIndividualClientDetails()
      },
      { deep: true }
    )
    onMounted(() => {
      loadIndividualClientDetails()
    })
    function loadIndividualClientDetails() {
      var participantPercent = parseFloat(
        ((individualClientList.value[0].PARTICRATE +
          individualClientList.value[1].PARTICRATE +
          individualClientList.value[2].PARTICRATE +
          individualClientList.value[3].PARTICRATE) /
          4) *
          100
      )
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
      let divWidth = document.getElementById('individualClientInfoWidget')
      var width = isXsOnly.value ? divWidth.offsetWidth : 320
      var height = 200
      var donutWidth = 20
      var radius = Math.min(width, height - 20) / 2
      var color = d3.scaleOrdinal().range([$store.state.theme.accentColors[0], $store.state.theme.accentColors[1]])
      //Draw legend
      var legendRectSize = 18
      var legendSpacing = 4
      d3.select('#individualClientInfoWidget').selectAll('svg').remove()

      if (isXsOnly.value) height = height + 100
      if (!isXsOnly.value) {
        if (screenWidth.value < 668 && screenWidth.value > 374) {
          height = height + 100
        } else {
          width = width + 80
        }
      }
      var transformHeight = height / 2
      var transformWidth = width / 2
      if (screenWidth.value > 1920) {
        transformWidth = 120
      } else if (screenWidth.value < 1600 && screenWidth.value > 1399) {
        transformWidth = 130
      } else if (screenWidth.value < 1400 && screenWidth.value > 1300) {
        transformWidth = 90
      } else if (screenWidth.value < 1400 && screenWidth.value > 1250) {
        transformWidth = 90
      } else if (mdOnly.value) {
        transformWidth = 145
      } else if (smOnly.value) {
        if (screenWidth.value < 668 && screenWidth.value > 374) {
          transformWidth = 120
          transformHeight = transformHeight - 40
        } else {
          transformWidth = 90
        }
      } else if (isXsOnly.value) {
        transformHeight = transformHeight - 40
      } else {
        transformWidth = 130
      }

      var svg = d3
        .select('#individualClientInfoWidget')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
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

      var tooltip = d3
        .select('#individualClientInfoWidget')
        .append('div')
        .attr('class', 'tooltip_total_asset')
        .style('display', 'none')

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
          if (i === 0) {
            if (isXsOnly.value) myheight = 120
            if (!isXsOnly.value) {
              if (screenWidth.value < 668 && screenWidth.value > 374) {
                myheight = 120
              } else {
                myheight = -25
              }
            }
          }
          if (i === 1) {
            if (isXsOnly.value) myheight = 150
            if (!isXsOnly.value) {
              if (screenWidth.value < 668 && screenWidth.value > 374) {
                myheight = 150
              } else {
                myheight = 0
              }
            }
          }
          if (i === 2) {
            if (isXsOnly.value) myheight = 180
            if (!isXsOnly.value) {
              if (screenWidth.value < 668 && screenWidth.value > 374) {
                myheight = 180
              } else {
                myheight = 25
              }
            }
          }
          var mywidth = 110
          if (isXsOnly.value) mywidth = mywidth - 160
          if (!isXsOnly.value) {
            if (screenWidth.value < 668 && screenWidth.value > 374) {
              mywidth = mywidth - 160
            }
          }
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
      individualClientList,
      loadIndividualClientDetails
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
