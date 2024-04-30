/* eslint-disable no-unused-vars */
<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'benchmarkData'],
  data() {
    return {}
  },
  watch: {
    liveWidth: function () {
      this.drawBenchMarkBarChart()
    },
    '$vuetify?.theme.dark': function () {
      this.drawBenchMarkBarChart()
    },
    '$vuetify?.breakpoint': function () {
      this.drawBenchMarkBarChart()
    },
    benchmarkData: {
      handler() {
        this.drawBenchMarkBarChart()
      }
    }
  },
  mounted() {
    this.drawBenchMarkBarChart()
  },
  methods: {
    drawBenchMarkBarChart() {
      if (this.benchmarkData.length > 0) {
        var data = this.benchmarkData
        d3.select(this.$el).selectAll('svg').remove()

        var defaultwidth = 500
        if (this.$vuetify?.breakpoint?.width > 3700) {
          defaultwidth = this.$el.offsetWidth === 0 ? 1127 : this.$el.offsetWidth
        } /* else if (
          this.$vuetify?.breakpoint?.width > 3499 &&
          this.$vuetify?.breakpoint?.width <= 3700
        ) {
          defaultwidth =
            this.$el.offsetWidth === 0 ? 1093 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width >= 3300 &&
          this.$vuetify?.breakpoint?.width < 3500
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 993 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width >= 3000 &&
          this.$vuetify?.breakpoint?.width < 3300
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 893 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width > 2699 &&
          this.$vuetify?.breakpoint?.width < 3000
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 793 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width > 2399 &&
          this.$vuetify?.breakpoint?.width < 2700
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 690 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width < 2400 &&
          this.$vuetify?.breakpoint?.width >= 2200
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 650 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width < 2200 &&
          this.$vuetify?.breakpoint?.width > 2049
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 593 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width < 2050 &&
          this.$vuetify?.breakpoint?.width > 1599
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 553 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.width < 1600 &&
          this.$vuetify?.breakpoint?.width > 1399
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 368 : this.$el.offsetWidth
        } */ else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) {
          defaultwidth = this.$el.offsetWidth === 0 ? 349 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1250) {
          defaultwidth = this.$el.offsetWidth === 0 ? 304 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.mdOnly) {
          defaultwidth = this.$el.offsetWidth === 0 ? 261 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.smOnly && this.$vuetify?.breakpoint?.width > 700) {
          defaultwidth = this.$el.offsetWidth === 0 ? 326 : this.$el.offsetWidth
        } else if (
          this.$vuetify?.breakpoint?.xs &&
          !(this.$vuetify?.breakpoint?.width < 600 && this.$vuetify?.breakpoint?.width > 390)
        ) {
          defaultwidth = this.$el.offsetWidth === 0 ? 323 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.width < 600 && this.$vuetify?.breakpoint?.width > 390) {
          defaultwidth = this.$el.offsetWidth === 0 ? 323 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.width < 700 && this.$vuetify?.breakpoint?.width > 599) {
          defaultwidth = this.$el.offsetWidth === 0 ? 276 : this.$el.offsetWidth
        }
        var margin = {
            top: 20,
            right: 20,
            bottom: 10,
            left: 70
          },
          width = defaultwidth - margin.right,
          height = 110 - margin.top - margin.bottom

        if (this.$vuetify?.breakpoint?.width === 1024) margin.right = 10
        if (this.$vuetify?.breakpoint?.xs) width = width - 30
        if (this.$vuetify?.breakpoint?.xs) margin.left = margin.left + 30
        if (this.$vuetify?.breakpoint?.xlOnly) {
          width = width - 100
          margin.top += 10
        }
        if (this.$vuetify?.breakpoint?.mdOnly) margin.left = margin.left + 20

        var y = d3.scaleBand().range([height, 0]).padding(0.4)

        var x = d3
          .scaleLinear()
          .range([0, width - 150])
          .domain([0, 100])

        var svg = d3
          .select(this.$el)
          .append('svg')
          .attr('width', width)
          .attr('height', 210)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        y.domain(
          data.map(function (d) {
            return d.yAxis
          })
        )

        var legendPosition = 0
        var legend = svg
          .selectAll('.legend')
          .data(data)
          .enter()
          .append('g')
          .attr('transform', (d, i) => {
            if (i === 0) legendPosition += 20
            else legendPosition += 67
            return `translate(${-margin.left - 14},${legendPosition})`
          })

        var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
        legend
          .append('text')
          .attr('x', 30)
          .attr('y', function (d, i) {
            if (i === 0) return 0
            else return 10
          })
          .attr('dy', '0em')
          .attr('class', dark)
          .style('font-size', '1rem')
          .style('font-weight', '500')
          .text(function (d) {
            return d.name
          })

        var Xratio = 120
        if (this.$vuetify?.breakpoint?.xs) Xratio = 50
        if (this.$vuetify?.breakpoint?.smOnly) Xratio = 80
        if (this.$vuetify?.breakpoint?.mdOnly) Xratio = 70
        if (this.$vuetify?.breakpoint?.lgOnly) Xratio = 80

        // eslint-disable-next-line no-unused-vars
        var backgroundBar = svg
          .selectAll(null)
          .data(data)
          .enter()
          .append('rect')
          .attr('fill', '#f4f4f4')
          .attr('x', Xratio)
          .attr('y', function (d, i) {
            if (i === 0) return -2
            else return 75
          })
          .attr('height', 30)
          .attr('width', function () {
            return x(100)
          })

        // eslint-disable-next-line no-unused-vars
        var bar = svg
          .selectAll(null)
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', Xratio)
          .attr('y', function (d, i) {
            if (i === 0) return -2
            else return 75
          })
          .attr('dy', '.95em')
          .attr('height', 30)
          .transition()
          .duration(2000)
          .attr('width', function (d) {
            return x(d.xAxis)
          })
          .attr('fill', function (d) {
            return d.color
          })
      }
    }
  }
}
</script>
<style>
.fnt_size {
  font-size: 18px !important;
}
.main {
  fill: rgb(240, 234, 234);
}
.fill_white {
  fill: white;
}
.fill_black {
  fill: #25233a;
}
</style>
