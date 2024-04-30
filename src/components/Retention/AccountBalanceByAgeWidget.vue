<template>
  <div id="accountBalanceAgeWidget" />
</template>

<script>
import { onMounted, ref, watch, watchEffect } from 'vue'
import * as d3 from 'd3'
import { useTheme, useDisplay } from 'vuetify'
export default {
  props: ['liveWidth', 'accountBalanceByAge'],
  setup(props) {
    const accountBalanceByAgeList = ref(props.accountBalanceByAge)
    const divSize = ref(props.liveWidth)
    const width = ref(300)
    const display = useDisplay()
    const height = ref(150)
    const theme = useTheme()
    const screenWidth = ref(0)
    const lgOnly = ref(false)
    const xlOnly = ref(false)
    //watch
    watchEffect(() => {
      screenWidth.value = display.width.value
      lgOnly.value = display.lg.value
      xlOnly.value = display.xl.value
      divSize.value = props.liveWidth
    })
    watch(divSize, () => {
      accountBalanceByAgeGraph()
    })
    watch(
      accountBalanceByAgeList,
      () => {
        accountBalanceByAgeGraph()
      },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      accountBalanceByAgeGraph()
    })
    //methods
    function currencyFormat(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    function accountBalanceByAgeGraph() {
      if (accountBalanceByAgeList.value && accountBalanceByAgeList.value.length > 0) {
        var data = accountBalanceByAgeList
        d3.select('#accountBalanceAgeWidget').selectAll('svg').remove()
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
        var svg = d3.select('#accountBalanceAgeWidget').append('svg').attr('height', 300).attr('width', width)

        var x = d3.scaleBand().range([0, innerWidth]).padding(0.5)
        var y = d3.scaleLinear().range([height, 0])
        var color = d3.scaleOrdinal().range([theme.themes.value.light.colors.accent])
        var g = svg.append('g').attr('transform', 'translate(' + 50 + ',' + 20 + ')')
        var yAxisTickFormat = d3.format('.2s')
        x.domain(
          data.value.map(function (d) {
            return d.series
          })
        )
        y.domain([0, d3.max(data.value, (d) => d.balance)]).nice()
        var yAxis = d3.axisLeft(y).tickSize(-innerWidth).tickSizeOuter(0).tickFormat(yAxisTickFormat).ticks(8)
        var xAxis = d3.axisBottom(x).tickFormat('').tickSize(0)

        g.append('g')
          .attr('class', 'axisGrey')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)

        g.append('g').attr('class', 'axisGrey').call(yAxis)

        g.selectAll('.bar')
          .data(data.value)
          .enter()
          .append('rect')
          .attr('class', 'basgasdga')
          .attr('x', function (d) {
            return x(d.series) + 40
          })
          .attr('y', function (d) {
            return y(d.balance)
          })
          .attr('width', function () {
            return x.bandwidth()
          })
          .attr('height', function (d) {
            return height - y(d.balance)
          })
          .style('fill', function (d, i) {
            return color(i)
          })

        var legendSpacing = 40
        if (xlOnly.value) legendSpacing = 60
        else if (lgOnly.value && (screenWidth.value <= 1680 || screenWidth.value >= 1600)) legendSpacing = 55

        g.selectAll('.text')
          .data(data.value)
          .enter()
          .append('text')
          .attr('dy', '.75em')
          .attr('y', function (d) {
            return y(Math.max(0, d.balance)) - 15
          })
          .attr('x', function (d) {
            return x(d.series) + legendSpacing + x.bandwidth() / 4
          })
          .attr('text-anchor', 'middle')
          .text(function (d) {
            return d3.format('.2s')(d.balance)
          })
      }
    }
    return {
      width,
      height,
      accountBalanceByAgeList,
      theme,
      currencyFormat,
      accountBalanceByAgeGraph,
      screenWidth,
      lgOnly,
      xlOnly,
      divSize
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
