<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'prospectValues', 'totalPlan'],
  data() {
    return {
      width: 190,
      height: 180
    }
  },
  watch: {
    liveWidth: function () {
      this.loadPlanWithCompliance()
    },
    '$vuetify?.theme.dark': function () {
      this.loadPlanWithCompliance()
    },
    '$vuetify?.breakpoint': function () {
      this.loadPlanWithCompliance()
    },
    prospectValues: {
      handler() {
        this.loadPlanWithCompliance()
      },
      deep: true
    }
  },
  mounted() {
    this.loadPlanWithCompliance()
  },
  methods: {
    loadPlanWithCompliance() {
      let seedData = [
        {
          label: '1 Compliance Issue',
          value:
            this.prospectValues.marketInsightsData[0].HaveOneComplianceIssue === undefined
              ? 0
              : this.prospectValues.marketInsightsData[0].HaveOneComplianceIssue
        },
        {
          label: '2 Compliance Issues',
          value:
            this.prospectValues.marketInsightsData[0].HaveTwoComplianceIssues === undefined
              ? 0
              : this.prospectValues.marketInsightsData[0].HaveTwoComplianceIssues
        },
        {
          label: '3+ Compliance Issues',
          value:
            this.prospectValues.marketInsightsData[0].HaveThreePlusComplianceIssues === undefined
              ? 0
              : this.prospectValues.marketInsightsData[0].HaveThreePlusComplianceIssues
        }
      ]
      var allReportSum = Number(
        this.prospectValues.marketInsightsData[0].TotalPlans === undefined
          ? 0
          : this.prospectValues.marketInsightsData[0].TotalPlans
      )
      var width = this.$el.offsetWidth === 0 ? 320 : this.$el.offsetWidth
      var height = 280
      var radius = Math.min(width - 80, height - 120) / 2
      var donutWidth = 20
      var transformValue = 0

      var color = d3
        .scaleOrdinal()
        .range([
          this.$store.state.theme.accentColors[0],
          this.$store.state.theme.accentColors[2],
          this.$store.state.theme.accentColors[3] === '#FFFFFF' ? '#cccccc' : this.$store.state.theme.accentColors[3]
        ])
      var darkvalue = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_#000000'
      d3.select(this.$el).selectAll('svg').remove()
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', 220)
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
      filter.append('feOffset').attr('in', 'blur').attr('dx', 3).attr('dy', 4).attr('result', 'offsetBlur')
      let feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'offsetBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
      var arc = d3
        .arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius)

      var pie = d3
        .pie()
        .padAngle(0.01)
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
        .attr('style', 'cursor:pointer')
        .attr('fill', function (d) {
          return color(d.data.label)
        })

      path.on('mouseover', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', '2px').style('filter', 'url(#drop-shadow)')
        tooltip.style('display', 'inline-block').style('position', 'absolute')
      })

      path.on('mouseout', function () {
        d3.select(this).attr('stroke', 'none').style('filter', 'none')
        tooltip.style('display', 'none')
      })

      path.on('mousemove', function (event, d) {
        tooltip
          .text(d.data.label + ' - ' + d.data.value)
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('y', -5)
        .attr('class', darkvalue)
        .text(allReportSum)
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('y', 20)
        .attr('class', darkvalue)
        .text('Plans')
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
