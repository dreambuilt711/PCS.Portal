<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'assetsClass'],
  data() {
    return {
      width: 320,
      height: 200
    }
  },
  watch: {
    liveWidth: function () {
      this.loadAssetsClass()
    },
    cashFlow: {
      handler() {
        this.loadAssetsClass()
      },
      deep: true
    },
    '$vuetify?.theme.dark': function () {
      this.loadAssetsClass()
    }
  },
  mounted() {
    this.loadAssetsClass()
  },
  methods: {
    loadAssetsClass() {
      let seedData

      seedData = this.assetsClass.map((res) => ({
        label: res.GroupName,
        labelColor: res.GroupColor,
        value: res.GroupTotal
      }))

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })

      var width = this.$vuetify?.breakpoint?.xs ? this.$el.offsetWidth : 320
      if (width === 0) width = 320
      var height = 296
      var radius = Math.min(width - 80, height - 80) / 2
      var donutWidth = 20
      var transformValue = 0
      if (this.$vuetify?.breakpoint?.xl) transformValue = 0
      if (this.$vuetify?.breakpoint?.lg) transformValue = 30

      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
      //Draw legend
      var legendRectSize = 18
      var legendSpacing = 4
      d3.select(this.$el).selectAll('svg').remove()
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height - 46)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2 - 30
          var transformWidth = width / 2 - transformValue
          return 'translate(' + transformWidth + ',' + transformHeight + ')'
        })
      var tooltip = d3.select(this.$el).append('div').attr('class', 'tooltip_total_asset').style('display', 'none')

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
          return d.data.labelColor
        })

      path.on('mouseover', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', '2px')
        tooltip.style('display', 'inline-block').style('position', 'absolute')
      })

      path.on('mouseout', function () {
        d3.select(this).attr('stroke', 'none').style('filter', 'none')
        tooltip.style('display', 'none')
      })
      var addTop = 100
      var addLeft = 0
      if (this.$vuetify?.breakpoint?.mdOnly) addLeft = 300
      if (this.$vuetify?.breakpoint?.smOnly) addLeft = 200
      if (this.$vuetify?.breakpoint?.xs) addTop = 150
      path.on('mousemove', function (event, d) {
        tooltip
          .text(d.data.label + ' - ' + formatter.format(d.data.value))
          .style('left', event.layerX + addLeft + 'px')
          .style('top', event.layerY + addTop + 'px')
      })
      var fontSize = this.$vuetify?.breakpoint?.xs ? '18px' : '18px'
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', 10)
        .attr('class', dark)
        .text('Asset Class')
        .attr('font-weight', '500')
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
        // eslint-disable-next-line no-unused-vars
        .style('fill', function (d, i) {
          return d.data.labelColor
        })
        // eslint-disable-next-line no-unused-vars
        .style('stroke', function (d, i) {
          return d.data.labelColor
        })

      legend
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .style('font-size', '12px')
        .attr('class', dark)
        .text(function (d) {
          return d.label
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
.fill_white {
  fill: white;
}
.fill_black {
  fill: black;
}
</style>
