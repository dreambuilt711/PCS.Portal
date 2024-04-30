<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['data', 'liveWidth'],
  data() {
    return {
      width: 320,
      height: 200
    }
  },
  watch: {
    liveWidth: function () {
      this.drawAssets()
    },
    '$vuetify?.theme.dark': function () {
      this.drawAssets()
    }
  },
  mounted() {
    this.drawAssets()
  },
  methods: {
    drawAssets() {
      d3.select(this.$el).selectAll('svg').remove()
      var amount = 0
      this.data.forEach((element) => {
        amount = amount + element.DollarAmount
      })
      let seedData = this.data
      var width = this.$vuetify?.breakpoint?.xs ? this.$el.offsetWidth : 320
      var height = 296
      var radius = Math.min(width - 80, height - 80) / 2
      var donutWidth = 20
      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })
      var color = d3
        .scaleOrdinal()
        .range([
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

      var removeSpace = 5 //before 0 here
      if (this.$vuetify?.breakpoint?.md) removeSpace = 30
      if (this.$vuetify?.breakpoint?.sm) removeSpace = 30
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          var transformWidth = width / 2 - removeSpace
          return 'translate(' + transformWidth + ',' + height / 2 + ')'
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
          return d.DollarAmount
        })
        .sort(null)

      var tooltip = d3.select(this.$el).append('div').attr('class', 'tooltip_total_asset').style('display', 'none')
      var fontSize = this.$vuetify?.breakpoint?.xs ? '24px' : '24px' //32px previous value
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', 10)
        .attr('class', dark)
        .attr('font-weight', '500')
        .text(formatter.format(amount.toFixed(0)))
      var path = svg
        .selectAll('path')
        .data(pie(seedData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
          return color(d.data.AssetName)
        })

      path.on('mouseover', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', '2px').style('filter', 'url(#drop-shadow)')
        // tooltip.select('.label').html(d.data.AssetName)
        tooltip.style('display', 'inline-block').style('position', 'absolute')
      })
      path.on('mousemove', function (event, d) {
        tooltip
          .text(d.data.AssetName + ' - ' + formatter.format(d.data.DollarAmount))
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })

      path.on('mouseout', function () {
        d3.select(this).attr('stroke', 'none').style('filter', 'none')
        tooltip.style('display', 'none')
      })
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
</style>
<style>
.tooltip_total_asset {
  background-color: #616161;
  padding: 6px;
  border-radius: 2px;
  font-family: sans-serif;
  color: white;
  pointer-events: none;
  box-shadow: 0 0 5px #999999;
  z-index: 99999;
}
</style>
