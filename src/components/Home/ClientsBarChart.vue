<template>
  <div id="managedAssetWidget"></div>
</template>

<script>
import { onMounted, ref, watchEffect, getCurrentInstance, inject, computed, watch } from 'vue'
import * as d3 from 'd3'
import { useDisplay } from 'vuetify'
export default {
  props: ['anualizeData', 'liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const selectedBrand = inject('selectedBrand')
    const mdOnly = ref(false)
    const smAndDown = ref(false)
    const anualizeDataList = ref(props.anualizeData)
    const divSize = ref(props.liveWidth)
    const isXsOnly = ref(false)
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    //watch
    watchEffect(() => {
      mdOnly.value = display.md.value
      smAndDown.value = display.smAndDown.value
      isXsOnly.value = display.xs.value
      divSize.value = props.liveWidth
    })
    watch(divSize, (val) => {
      drawNegativePositiveChart(val)
    })
    watch(
      anualizeDataList,
      (val) => {
        drawNegativePositiveChart(val)
      },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      drawNegativePositiveChart()
    })
    function drawNegativePositiveChart() {
      if (Object.keys(anualizeDataList).length > 0) {
        d3.select('#managedAssetWidget').selectAll('svg').remove()
        var data = anualizeDataList
        let divWidth = document.getElementById('managedAssetWidget')
        var height2 = 170
        var margin = { top: 5, right: 0, bottom: 5, left: 120 }
        var height = height2 - margin.top - margin.bottom
        var width = divWidth.offsetWidth - margin.left - margin.right
        var barPadding = 0.2
        var checkIsNegative = data.value.filter((a) => a.Amount < 0)
        // Color scale
        var color = d3
          .scaleOrdinal()
          .range([
            $store.state.theme.accentColors[0],
            $store.state.theme.accentColors[1],
            $store.state.theme.accentColors[2],
            $store.state.theme.accentColors[3]
          ])

        var svgPosition = 0
        if (isXsOnly.value) {
          svgPosition = width / 2 - 40
        } else {
          svgPosition = margin.left - 80
        }

        // append the svg object to the body of the page
        var svg = d3
          .select('#managedAssetWidget')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom + 10)
          .append('g')
          .attr('transform', 'translate(' + svgPosition + ',' + margin.top + ')')

        var boxsize = 30
        if (mdOnly.value) boxsize = 50
        if (smAndDown.value) boxsize = 25
        // X scale
        var x2 = d3.scaleBand().range([boxsize, width]).padding(barPadding)
        var range = checkIsNegative.length > 0 ? height : height - 100
        //y scale
        var y2 = d3.scaleLinear().range([range, 0])
        x2.domain(
          data.value.map(function (d) {
            return d['Series']
          })
        )
        y2.domain(
          d3.extent(data.value, function (d) {
            return d['Amount']
          })
        )
        var yAxisTickFormat = d3.format('.2s')
        var xAxis = d3.axisBottom(x2).tickSize(0)
        var yAxis = d3.axisLeft(y2).ticks(5).tickFormat(yAxisTickFormat)

        svg
          .selectAll('.bar')
          .data(data.value)
          .enter()
          .append('rect')
          .attr('fill', function (d, i) {
            return color(i % data.value.length)
          })
          .attr('x', function (d) {
            return x2(d['Series'])
          })
          .attr('y', function (d) {
            return y2(Math.max(0, d['Amount']))
          })
          .attr('height', function (d) {
            return Math.abs(y2(d['Amount']) - y2(0))
          })
          .attr('width', x2.bandwidth())
        svg
          .append('g')
          .attr('class', 'x axis' + 'fill_black')
          .attr('transform', 'translate(0,' + y2(0) + ')')
          .call(xAxis)
          .selectAll('text')
          .remove()
          .attr('dy', function (d, i) {
            return data.value[i].Amount < 0 ? '-1em' : '1em'
          })
          .selectAll('.tick')
          .filter(function (d, i) {
            return data.value[i].Amount < 0
          })
        svg
          .append('g')
          .attr('transform', 'translate(30,0)')
          .call(yAxis)
          .select('.domain')
          .remove()
          .selectAll('ticks')
          .remove()
          .append('text')
      }
    }

    return {
      fontSize,
      smAndDown,
      mdOnly,
      anualizeDataList,
      divSize,
      isXsOnly,
      drawNegativePositiveChart
    }
  }
}
</script>

<style>
.bar--negative {
  fill: rgb(var(--v-theme-accent)) !important;
}
.bar--positive {
  fill: rgb(var(--v-theme-accent)) !important;
}
.v-theme--dark .fill_black {
  fill: white;
}
.v-theme--light .fill_black {
  fill: black;
}
</style>
