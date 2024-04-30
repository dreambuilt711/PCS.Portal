<template>
  <div id="managedAssetWidgetNoData" />
</template>

<script>
import { ref, onMounted, watch, computed, watchEffect, inject } from 'vue'
import { useDisplay } from 'vuetify'
import * as d3 from 'd3'
export default {
  props: ['anualizeData', 'liveWidth'],
  setup(props) {
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
    watch(anualizeDataList, (val) => {
      drawNegativePositiveChart(val)
    })
    //mounted
    onMounted(() => {
      drawNegativePositiveChart()
    })
    function drawNegativePositiveChart() {
      if (Object.keys(anualizeDataList.value).length > 0) {
        d3.select('#managedAssetWidgetNoData').selectAll('svg').remove()
        var data = anualizeDataList
        let divWidth = document.getElementById('managedAssetWidgetNoData')
        var height2 = 170
        var margin = { top: 5, right: 0, bottom: 5, left: 120 }
        var height = height2 - margin.top - margin.bottom
        var width = divWidth.offsetWidth - margin.left - margin.right
        var barPadding = 0.2
        var checkIsNegative = data.value.filter((a) => a.Amount < 0)

        var svgPosition = 0
        if (isXsOnly.value) {
          svgPosition = width / 2 - 40
        } else {
          svgPosition = margin.left - 80
        }

        // Add svg to
        var svg = d3
          .select('#managedAssetWidgetNoData')
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
      mdOnly,
      smAndDown,
      isXsOnly,
      anualizeDataList,
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
