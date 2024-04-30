<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'lowReturnValue'],
  data() {
    return {
      width: 320,
      height: 350
    }
  },
  watch: {
    liveWidth: function () {
      this.loadPipeline()
    },
    '$vuetify?.theme.dark': function () {
      this.loadPipeline()
    },
    pipelineValues: {
      handler() {
        this.loadPipeline()
      },
      deep: true
    }
  },
  mounted() {
    this.loadPipeline()
  },
  methods: {
    loadPipeline() {
      d3.select(this.$el).selectAll('svg').remove()

      let data = this.lowReturnValue
      var margin = { top: 10, right: 0, bottom: 10, left: 0 }
      if (this.$vuetify?.breakpoint?.xlOnly) {
        margin.left = 20
      }
      var height2 = this.$vuetify?.breakpoint?.mdOnly ? 160 : 200
      var height = height2 - margin.top - margin.bottom

      var defaultwidth = 500
      if (this.$vuetify?.breakpoint?.width > 3700) {
        defaultwidth = this.$el.offsetWidth === 0 ? 1127 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width > 3499 && this.$vuetify?.breakpoint?.width <= 3700) {
        defaultwidth = this.$el.offsetWidth === 0 ? 1093 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width >= 3300 && this.$vuetify?.breakpoint?.width < 3500) {
        defaultwidth = this.$el.offsetWidth === 0 ? 993 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width >= 3000 && this.$vuetify?.breakpoint?.width < 3300) {
        defaultwidth = this.$el.offsetWidth === 0 ? 893 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width > 2699 && this.$vuetify?.breakpoint?.width < 3000) {
        defaultwidth = this.$el.offsetWidth === 0 ? 793 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width > 2399 && this.$vuetify?.breakpoint?.width < 2700) {
        defaultwidth = this.$el.offsetWidth === 0 ? 690 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 2400 && this.$vuetify?.breakpoint?.width >= 2200) {
        defaultwidth = this.$el.offsetWidth === 0 ? 650 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 2200 && this.$vuetify?.breakpoint?.width > 2049) {
        defaultwidth = this.$el.offsetWidth === 0 ? 593 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 2050 && this.$vuetify?.breakpoint?.width > 1599) {
        defaultwidth = this.$el.offsetWidth === 0 ? 553 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 1600 && this.$vuetify?.breakpoint?.width > 1399) {
        defaultwidth = this.$el.offsetWidth === 0 ? 368 : this.$el.offsetWidth
      } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) {
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

      var width = defaultwidth - margin.left - margin.right
      var outerRadius = width / 2 - height
      var transformHeight = height - 20
      var transformWidth = width / 2

      if (this.$vuetify?.breakpoint?.width > 3700) {
        outerRadius = outerRadius - 270
      } else if (this.$vuetify?.breakpoint?.width > 3499 && this.$vuetify?.breakpoint?.width <= 3700) {
        outerRadius = outerRadius - 220
      } else if (this.$vuetify?.breakpoint?.width >= 3300 && this.$vuetify?.breakpoint?.width < 3500) {
        outerRadius = outerRadius - 170
      } else if (this.$vuetify?.breakpoint?.width >= 3000 && this.$vuetify?.breakpoint?.width < 3300) {
        outerRadius = outerRadius - 140
      } else if (this.$vuetify?.breakpoint?.width > 2699 && this.$vuetify?.breakpoint?.width < 3000) {
        outerRadius = outerRadius - 80
      } else if (this.$vuetify?.breakpoint?.width > 2399 && this.$vuetify?.breakpoint?.width < 2700) {
        outerRadius = outerRadius - 40
      } else if (this.$vuetify?.breakpoint?.width < 2400 && this.$vuetify?.breakpoint?.width >= 2200) {
        outerRadius = outerRadius - 10
      } else if (this.$vuetify?.breakpoint?.width < 2200 && this.$vuetify?.breakpoint?.width > 2049) {
        outerRadius = outerRadius + 30
      } else if (this.$vuetify?.breakpoint?.width < 2050 && this.$vuetify?.breakpoint?.width > 1599) {
        outerRadius = outerRadius + 70
      } else if (this.$vuetify?.breakpoint?.width < 2199 && this.$vuetify?.breakpoint?.width > 1599) {
        outerRadius = outerRadius + height - 80
      } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1250) {
        outerRadius = outerRadius + height - 60
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.width < 1600 && this.$vuetify?.breakpoint?.width >= 1400) {
        outerRadius = outerRadius + height - 80
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) {
        outerRadius = outerRadius + height - 60
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.mdOnly) {
        outerRadius = outerRadius + height - 40
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.smOnly && this.$vuetify?.breakpoint?.width > 700) {
        outerRadius = outerRadius + height - 50
        transformHeight = height - 50
      } else if (
        this.$vuetify?.breakpoint?.xs &&
        !(this.$vuetify?.breakpoint?.width < 600 && this.$vuetify?.breakpoint?.width > 390)
      ) {
        outerRadius = outerRadius + height - 50
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.width < 600 && this.$vuetify?.breakpoint?.width > 390) {
        outerRadius = outerRadius + height - 60
        transformHeight = height - 50
      } else if (this.$vuetify?.breakpoint?.width < 700 && this.$vuetify?.breakpoint?.width > 599) {
        height = 130
        outerRadius = outerRadius + height - 10
        transformHeight = height - 50
      }

      var innerRadius = outerRadius - 30
      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'

      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('display', 'flex')
        .style('justify-content', 'center')
        .append('g')
        .attr('transform', function () {
          return 'translate(' + transformWidth + ',' + transformHeight + ')'
        })

      var arcTween = function (transition, newAngle, arc) {
        transition.attrTween('d', function (d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle)

          return function (t) {
            d.endAngle = interpolate(t)
            return arc(d)
          }
        })
      }

      var createCircle = function (svg, outerRadius, innerRadius, color, percent) {
        var ratio = percent / 100

        var arcBackground = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(-90 * (Math.PI / 180))
          .endAngle(90 * (Math.PI / 180))

        svg.append('path').attr('d', arcBackground).style('fill', '#EEEFF7')

        var arcForeground = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(-90 * (Math.PI / 180))
          .endAngle(-(0.5 * Math.PI) + ratio * 2 * (0.5 * Math.PI))

        var pathForeground = svg
          .append('path')
          .datum({ endAngle: 0 })
          .attr('d', arcForeground)
          .style('fill', color)
          .transition()
          .duration(1500)
          .call(arcTween, -90 * (Math.PI / 180) * ratio, arcForeground)

        var chart = { path: pathForeground, arc: arcForeground }

        return chart
      }
      // Display Max value
      svg
        .append('text')
        .attr('transform', `translate(${outerRadius + 15},8)`)
        .attr('class', dark)
        .style('font-size', '0.81em')
        .style('opacity', '0.4')
        .text(100)

      // Display Min value
      svg
        .append('text')
        .attr('transform', `translate(${-outerRadius - 20},8)`)
        .attr('class', dark)
        .style('font-size', '0.81em')
        .style('opacity', '0.4')
        .text(0)

      for (var i = 0; i < data.length; ++i) {
        if (i > 0) outerRadius = innerRadius - 20
        innerRadius = outerRadius - 15

        data[i].chart = createCircle(svg, outerRadius, innerRadius, data[i].color, data[i].Plans)
      }

      var offset = 20
      if (this.$vuetify?.breakpoint?.xlOnly) offset = 50
      var showLegendvertical = false
      if (this.$vuetify?.breakpoint?.width < 1600 && this.$vuetify?.breakpoint?.width > 1250) {
        showLegendvertical = true
      }
      if (this.$vuetify?.breakpoint?.width <= 1500 && this.$vuetify?.breakpoint?.width > 1250) {
        showLegendvertical = true
      }
      if (this.$vuetify?.breakpoint?.mdAndDown) showLegendvertical = true

      var dataL = 0
      var legend = svg
        .selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          if (showLegendvertical) {
            if (i === 0) {
              return `translate(${-outerRadius - 40},15)`
            } else {
              return `translate(${-outerRadius - 40},40)`
            }
          } else {
            if (i === 0) {
              dataL = data.length + offset
              return `translate(${-outerRadius - 100},15)`
            } else {
              var newdataL = dataL
              dataL += data.length + offset
              return 'translate(' + newdataL + ',15)'
            }
          }
        })

      legend
        .append('circle')
        .attr('cx', 9)
        .attr('cy', 9)
        .attr('r', 5)
        .style('fill', function (d) {
          return d.color
        })
        .style('stroke', function (d) {
          return d.color
        })

      legend
        .append('text')
        .attr('x', 22)
        .attr('y', 14)
        .style('font-size', '0.91em')
        .attr('class', dark)
        .text(function (d) {
          return d.StageName + ' ' + d.Plans + '%'
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
  fill: #25233a;
}
</style>
