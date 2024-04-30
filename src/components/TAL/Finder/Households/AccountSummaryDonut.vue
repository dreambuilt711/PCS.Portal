<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'accountSummary', 'totalAmount'],
  data() {
    return {
      width: 320,
      height: 200
    }
  },
  watch: {
    totalAmount: function () {
      this.loadAccountSummary()
    },
    liveWidth: function () {
      this.loadAccountSummary()
    },
    cashFlow: {
      handler() {
        this.loadAccountSummary()
      },
      deep: true
    },
    '$vuetify?.theme.dark': function () {
      this.loadAccountSummary()
    }
  },
  mounted() {
    this.loadAccountSummary()
  },
  methods: {
    loadAccountSummary() {
      let seedData

      seedData = this.accountSummary.map((res) => ({
        label: res.text,
        value: res.Amount ? res.Amount : 0
      }))
      let series
      series = this.accountSummary.map((res) => ({
        label: res.text + ' ' + ((res.Amount ? res.Amount / this.totalAmount : 0) * 100).toFixed(2) + '%'
      }))
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })

      var width = this.$vuetify?.breakpoint?.xs ? this.$el.offsetWidth : 320
      var height = this.$vuetify?.breakpoint?.smAndDown ? 300 : 296

      var radius = Math.min(width - 80, height - 80) / 2
      var donutWidth = 20
      var transformValue = 0
      if (this.$vuetify?.breakpoint?.xl) transformValue = 0
      if (this.$vuetify?.breakpoint?.lg) transformValue = 35
      //if (this.$vuetify?.breakpoint?.xl) transformValue = 0
      //if (this.$vuetify?.breakpoint?.lg) transformValue = 30
      var color = d3
        .scaleOrdinal()
        .range([
          this.$store.state.theme.accentColors[0],
          this.$store.state.theme.accentColors[1],
          this.$store.state.theme.accentColors[2],
          this.$store.state.theme.accentColors[3]
        ])
      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_accent'
      var legendRectSize = 18
      var legendSpacing = 4
      d3.select(this.$el).selectAll('svg').remove()
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height + 100)
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
        .attr('fill', function (d, i) {
          return color(i)
        })

      path.on('mouseover', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', '2px')
        tooltip.style('display', 'inline-block').style('position', 'absolute')
      })

      path.on('mouseout', function () {
        d3.select(this).attr('stroke', 'none').style('filter', 'none')
        tooltip.style('display', 'none')
      })

      path.on('mousemove', function (event, d) {
        tooltip
          .text(d.data.label + ' - ' + formatter.format(d.data.value))
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })
      var fontSize = this.$vuetify?.breakpoint?.xs ? '24px' : '24px'
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', 10)
        .attr('class', dark)
        .attr('font-weight', '500')

      var legend = svg
        .selectAll('.legend')
        .data(series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          var myheight = 0
          if (i === 0) myheight = 125
          if (i === 1) myheight = 150
          if (i === 2) myheight = 175
          if (i === 3) myheight = 200
          if (i === 4) myheight = 225
          if (i === 5) myheight = 250
          var mywidth = -80
          return 'translate(' + mywidth + ',' + myheight + ')'
        })

      legend
        .append('circle')
        .attr('cx', 10)
        .attr('cy', 10)
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
.fill_accent {
  fill: #0969b0;
}
</style>
