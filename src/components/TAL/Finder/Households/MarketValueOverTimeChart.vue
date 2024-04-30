<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'marketValueOverTimeData', 'LineChartListData'],
  data() {
    return {
      renderTime: 1000
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    liveWidth: function () {
      this.renderTime = 2000
      this.marketValueOverTimeGraph()
    }
  },
  mounted() {
    this.renderTime = 2000
    this.marketValueOverTimeGraph()
  },
  methods: {
    marketValueOverTimeGraph() {
      if (Object.keys(this.marketValueOverTimeData).length > 0) {
        var data = [
          {
            year: 'Apr 20',
            value: 220000
          },
          {
            year: 'May 20',
            value: 240000
          },
          {
            year: 'Jun 20',
            value: 230000
          },
          {
            year: 'Jul 20',
            value: 240000
          },
          {
            year: 'Aug 20',
            value: 245000
          },
          {
            year: 'Sept 20',
            value: 295000
          }
        ]
        var data1 = [
          {
            year: 'Apr 20',
            value: 26000
          },
          {
            year: 'May 20',
            value: 41500
          },
          {
            year: 'Jun 20',
            value: 39000
          },
          {
            year: 'Jul 20',
            value: 42000
          },
          {
            year: 'Aug 20',
            value: 49500
          },
          {
            year: 'Sept 20',
            value: 51000
          }
        ]

        var margin = { top: 10, right: 35, bottom: 30, left: 30 }
        var width = this.$el.offsetWidth - margin.left - margin.right
        var height = 300 - margin.top - margin.bottom

        if (this.$vuetify?.breakpoint?.width < 2050 && this.$vuetify?.breakpoint?.width > 1599) {
          width = this.$el.offsetWidth
        }
        if (this.$vuetify?.breakpoint?.width < 1600 && this.$vuetify?.breakpoint?.width > 1399) {
          width = this.$el.offsetWidth === 0 ? 350 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) {
          width = this.$el.offsetWidth === 0 ? 349 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1250) {
          width = this.$el.offsetWidth === 0 ? 304 : this.$el.offsetWidth
        } else if (this.$vuetify?.breakpoint?.mdOnly) {
          width = this.$el.offsetWidth - 400
        } else if (this.$vuetify?.breakpoint?.smOnly && this.$vuetify?.breakpoint?.width > 700) {
          width = this.$el.offsetWidth - 250
        } else if (this.$vuetify?.breakpoint?.width < 600 && this.$vuetify?.breakpoint?.width > 390) {
          width = this.$el.offsetWidth - 150
        }

        var innerWidth = 0
        if (this.$vuetify?.breakpoint?.sm) {
          innerWidth = this.$el.offsetWidth - 350
        } else if (this.$vuetify?.breakpoint?.md) {
          innerWidth = this.$el.offsetWidth - margin.left - margin.right - 450
        } else if (this.$vuetify?.breakpoint?.lg) {
          innerWidth = this.$el.offsetWidth - margin.left - margin.right + 50
        } else if (this.$vuetify?.breakpoint?.xs) {
          innerWidth = this.$el.offsetWidth - 60
        } else if (this.$vuetify?.breakpoint?.xl) {
          innerWidth = this.$el.offsetWidth - 90
        }

        d3.select(this.$el).selectAll('svg').remove()

        var svg = d3
          .select(this.$el)
          .append('svg')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
          .attr('class', 'background-style')

        var scale = d3
          .scaleBand()
          .domain([
            d3.min(data, function (d) {
              return d.year
            }),
            d3.max(data, function (d) {
              return d.year
            })
          ])
          .range([0, width])

        var x_axis = d3.axisBottom().scale(scale)

        var x = d3.scaleBand().range([
          0,
          data.map(function (d) {
            return d.year
          })
        ]) //width + margin.left + margin.right])

        var y = d3.scaleLinear().range([height, 0])

        var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        y.domain([
          0,
          d3.max(data, function (d) {
            return d.value
          })
        ])

        x.domain(
          data.map(function (d) {
            return d.year
          })
        )

        var yAxisTickFormat = (number) => d3.format('.2s')(number).replace('G', 'B')

        var dollarFormat = function (d) {
          return '$' + yAxisTickFormat(d)
        }

        var yAxis = d3.axisLeft(y).tickSize(-innerWidth).tickFormat(dollarFormat).tickSizeOuter(0).ticks(5)

        var area = d3
          .area()
          .x(function (d) {
            return x(d.year)
          })
          .y0(height)
          .y1(function (d) {
            return y(d.value)
          })

        var valueline = d3
          .line()
          .x(function (d) {
            return x(d.year)
          })
          .y(function (d) {
            return y(d.value)
          })

        g.append('path').data([data]).attr('class', 'area').attr('d', area).style('fill', this.$store.state.theme.accentColors[0])

        g.append('path').data([data]).attr('class', 'line').attr('d', valueline)

        g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(x_axis)
        g.append('g').call(yAxis)

        var area1 = d3
          .area()
          .x(function (d) {
            return x(d.year)
          })
          .y0(height)
          .y1(function (d) {
            return y(d.value)
          })

        var valueline1 = d3
          .line()
          .x(function (d) {
            return x(d.year)
          })
          .y(function (d) {
            return y(d.value)
          })
        //

        g.append('path')
          .data([data1])
          .attr('class', 'area')
          .attr('d', area1)
          .style('fill', this.$store.state.theme.accentColors[1])

        g.append('path').data([data1]).attr('class', 'line').attr('d', valueline1)
      }
    }
  }
}
</script>
<style>
.fill_white {
  fill: white;
}
.fill_black {
  fill: black;
}

.fill_grey {
  fill: #bfbdbf;
}

.tip {
  width: 150px;
  background-color: black;
  color: white;
  text-align: center;
  box-shadow: 0px 2px 10px -2px #aaa;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 5px !important;
  transition: all 160ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.tip::after {
  content: ' ';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  margin-left: 0px;
  border-style: solid;
  border-width: 0.5rem 0.5rem 0 0.5rem;
  border-color: black transparent;
}
.line {
  fill: none;
  stroke: #0969b0;
  stroke-width: 1;
}
</style>
