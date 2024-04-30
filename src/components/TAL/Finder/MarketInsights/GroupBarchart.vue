<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'groupChart'],
  data() {
    return {
      width: 300,
      height: 50,
      margin: {
        top: 30,
        right: 5,
        bottom: 0,
        left: 5
      }
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    liveWidth: function (oldval, newVal) {
      this.drawGroupedBarChart()
    },
    groupChart: function () {
      this.drawGroupedBarChart()
    },
    '$vuetify?.theme.dark': function () {
      this.drawGroupedBarChart()
    },
    '$vuetify?.breakpoint': function () {
      this.drawGroupedBarChart()
    },
    fontSize: function (val) {
      if (val > 14) this.drawGroupedBarChart()
    }
  },
  mounted() {
    this.drawGroupedBarChart()
  },
  methods: {
    drawGroupedBarChart() {
      d3.select(this.$el).selectAll('svg').remove()

      var data = this.groupChart
      var margin = {
        top: 25,
        right: 10,
        bottom: 10,
        left: 10
      }

      var barDark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
      var defaultwidth = 350
      if (this.$vuetify?.breakpoint?.width < 2050 && this.$vuetify?.breakpoint?.width > 1599) {
        defaultwidth = 350
      }
      if (this.$vuetify?.breakpoint?.width < 1600 && this.$vuetify?.breakpoint?.width > 1399) {
        defaultwidth = this.$el.offsetWidth === 0 ? 350 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) {
        defaultwidth = this.$el.offsetWidth === 0 ? 349 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1250) {
        defaultwidth = this.$el.offsetWidth === 0 ? 304 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.mdOnly) {
        defaultwidth = this.$el.offsetWidth === 0 ? 261 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.smOnly && this.$vuetify?.breakpoint?.width > 700) {
        defaultwidth = this.$el.offsetWidth === 0 ? 350 : this.$el.offsetWidth
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

      var innerWidth = 0
      if (this.$vuetify?.breakpoint?.sm) {
        innerWidth = defaultwidth - margin.left - margin.right
      } else if (this.$vuetify?.breakpoint?.md) {
        innerWidth = defaultwidth - margin.left - margin.right
        innerWidth = defaultwidth - margin.left - margin.right
      } else if (this.$vuetify?.breakpoint?.lg) {
        innerWidth = defaultwidth + 7
      } else if (this.$vuetify?.breakpoint?.xs) {
        innerWidth = defaultwidth - 25
      } else if (this.$vuetify?.breakpoint?.xl) {
        innerWidth = defaultwidth + 90
      }

      var height = 170 - margin.top - margin.bottom
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('height', '200')
        .attr('width', innerWidth)
        .attr('class', 'background-style')

      if (this.$vuetify?.breakpoint?.xl) innerWidth -= 17
      else if (this.$vuetify?.breakpoint?.xs) innerWidth -= 35
      else if (this.$vuetify?.breakpoint?.sm) innerWidth -= 40
      else if (this.$vuetify?.breakpoint?.md) innerWidth -= 40
      else if (this.$vuetify?.breakpoint?.lg) innerWidth -= 40
      else margin.left

      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var x0 = d3.scaleBand().rangeRound([0, innerWidth]).paddingInner(0.4)

      var x1 = d3.scaleBand().padding(0)

      var y = d3.scaleLinear().rangeRound([height, 0])

      var z = d3.scaleOrdinal().range([this.$store.state.theme.accentColors[0], this.$store.state.theme.accentColors[2]])

      var subCategories = Object.keys(data[0]).slice(1)

      x0.domain(
        data.map(function (d) {
          return d.name
        })
      )
      x1.domain(subCategories).rangeRound([0, x0.bandwidth()])
      y.domain([
        0,
        d3.max(data, function (d) {
          return d3.max(subCategories, function (key) {
            return d[key]
          })
        })
      ]).nice()

      var selection = g
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', (d) => 'translate(' + x0(d.name) + ',0)')
      selection
        .selectAll('rect')
        //Use map function with the subCategories array and the Econ2 array
        .data(function (d) {
          return subCategories.map(function (key) {
            return { key: key, value: d[key] }
          })
        })
        .enter()
        .append('rect')
        .attr('x', (d) => x1(d.key))
        //If the value is negative, put the top left corner of the rect bar on the zero line
        .attr('y', (d) => (d.value < 0 ? y(0) : y(d.value)))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => Math.abs(y(d.value) - y(0)))
        .attr('fill', (d) => z(d.key))
      //can not nest the text element inside the rect element !
      selection
        .selectAll('text')
        .attr('class', barDark)
        .data(function (d) {
          return subCategories.map(function (key) {
            return { key: key, value: d[key] }
          })
        })
        .enter()
        .append('text')
        .attr('x', function (d) {
          return x1(d.key) + x1.bandwidth() / 2
        })
        //offset the position of the y value (positive / negative) to have the text over/under the rect bar
        .attr('y', (d) => (d.value < 0 ? y(0) - (y(4) - (Math.abs(y(d.value) - y(0)) + 20)) : y(d.value) - 10))

        .style('font-size', '10px')
        .style('fill', this.$vuetify?.theme.dark ? 'white' : 'black')
        .attr('text-anchor', 'middle')
        .text((d) => d.value)

      g.append('g')
        .attr('class', 'axis')
        .style('font-size', this.$vuetify?.breakpoint?.lgAndUp ? '13px' : '10px')
        .style('color', this.$vuetify?.theme.dark ? 'white' : '#000000')
        .attr('y', 6)
        .attr('class', 'axis axis-x')
        .attr('dy', '2.5em')
        .attr('transform', 'translate(0,' + (height + 10) + ')')
        .call(d3.axisBottom(x0).tickSize(0))

        .call((g) => g.select('.domain').remove())
    }
  }
}
</script>
<style>
.label {
  font-size: 11px !important;
  text-anchor: end !important;
}
.fill_white {
  fill: white !important;
}
</style>
