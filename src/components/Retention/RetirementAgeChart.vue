<template>
  <div id="retirementAgeWidget" />
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { useTheme } from 'vuetify'
export default {
  props: ['liveWidth', 'retirementData'],
  setup(props) {
    const retirementDataList = ref(props.retirementData)
    const divSize = ref(props.liveWidth)
    const width = ref(300)
    const height = ref(150)
    const theme = useTheme()
    //watch
    watch(divSize, () => {
      retirementAgeGraph()
    })
    watch(
      retirementDataList,
      () => {
        retirementAgeGraph()
      },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      retirementAgeGraph()
    })
    function retirementAgeGraph() {
      if (retirementDataList.value && retirementDataList.value.length > 0) {
        var data = [
          {
            year: '1 Year',
            value: retirementDataList.value[0]
              ? retirementDataList.value.find((a) => a.YearsToRetirement === '1 Year').NumberOfIndividuals
              : 0
          },
          {
            year: '2 Yrs',
            value: retirementDataList.value[1]
              ? retirementDataList.value.find((a) => a.YearsToRetirement === '2 Years').NumberOfIndividuals
              : 0
          },
          {
            year: '3 Yrs',
            value: retirementDataList.value[2]
              ? retirementDataList.value.find((a) => a.YearsToRetirement === '3 Years').NumberOfIndividuals
              : 0
          },
          {
            year: '5 Yrs',
            value: retirementDataList.value[3]
              ? retirementDataList.value.find((a) => a.YearsToRetirement === '5 Years').NumberOfIndividuals
              : 0
          },
          {
            year: '10 Yrs',
            value: retirementDataList.value[4]
              ? retirementDataList.value.find((a) => a.YearsToRetirement === '10 Years').NumberOfIndividuals
              : 0
          }
        ]
        d3.select('#retirementAgeWidget').selectAll('svg').remove()

        let divWidth = document.getElementById('retirementAgeWidget')
        var width = divWidth.offsetWidth
        var margin = {
          top: 20,
          right: 10,
          bottom: 10,
          left: 50
        }

        var innerWidth = divWidth.offsetWidth - margin.left - margin.right
        var height = 300 - margin.top - margin.bottom
        var svg = d3.select('#retirementAgeWidget').append('svg').attr('height', 300).attr('width', width)

        var x = d3.scaleBand().range([0, innerWidth]).padding(0.5)
        var y = d3.scaleLinear().range([height, 0])
        var color = d3.scaleOrdinal().range([theme.themes.value.light.colors.accent])
        var g = svg.append('g').attr('transform', 'translate(' + 50 + ',' + 20 + ')')

        x.domain(
          data.map(function (d) {
            return d.year
          })
        )
        y.domain([0, d3.max(data, (d) => d.value + 1000)])
        var yAxis = d3.axisLeft(y).tickSize(-innerWidth).tickSizeOuter(0).ticks(5)

        var xAxis = d3.axisBottom(x).tickFormat('').tickSize(0)

        g.append('g')
          .attr('class', 'axisGrey')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)

        g.append('g').attr('class', 'axisGrey').call(yAxis)

        g.selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'basgasdga')
          .attr('x', function (d) {
            return x(d.year) + 40
          })
          .attr('y', function (d) {
            return y(d.value)
          })
          .attr('width', function () {
            return x.bandwidth()
          })
          .attr('height', function (d) {
            return height - y(d.value)
          })
          .style('fill', function (d, i) {
            return color(i)
          })
      }
    }
    return {
      width,
      height,
      retirementDataList,
      retirementAgeGraph,
      theme
    }
  }
}
</script>
<style>
.basgasdga {
  transition: all 150ms ease;
}
.tick line {
  opacity: 0.7;
  stroke: darkgrey;
  stroke-dasharray: 8 8;
}
.axisGrey path {
  color: darkgrey;
}
</style>
