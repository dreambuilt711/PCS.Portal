<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'pipelineValues', 'totalPlan'],
  data() {
    return {
      width: 320,
      height: 350
    }
  },
  watch: {
    liveWidth: function () {
      this.loadIndividualPipeline()
    },
    '$vuetify?.theme.dark': function () {
      this.loadIndividualPipeline()
    },
    pipelineValues: {
      handler() {
        this.loadIndividualPipeline()
      },
      deep: true
    }
  },
  mounted() {
    this.loadIndividualPipeline()
  },
  methods: {
    loadIndividualPipeline() {
      let seedData = this.pipelineValues
      var allReportSum = Number(this.totalPlan)
      var width = this.$el.offsetWidth
      var height = 190
      var radius = Math.min(width, height - 20) / 2
      var donutWidth = 20
      var color = d3
        .scaleOrdinal()
        .range([
          this.$store.state.theme.accentColors[0],
          this.$store.state.theme.accentColors[1],
          this.$store.state.theme.accentColors[2],
          this.$store.state.theme.accentColors[3]
        ])
      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
      d3.select(this.$el).selectAll('svg').remove()
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2
          var transformWidth = width / 2
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

      var planCount = 0
      for (var i = 0; i < seedData.length; i++) {
        if (seedData[i].Count > 0) planCount++
      }

      var angle = planCount > 1 ? 0.01 : 0
      var pie = d3
        .pie()
        .padAngle(angle)
        .value(function (d) {
          return d.Count < 0 ? -1 * d.Count : d.Count
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
          return color(d.data.Status)
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
          .text(d.data.Status + ' - ' + d.data.Count)
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('y', -5)
        .attr('class', dark)
        .text(allReportSum)
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('y', 20)
        .attr('class', dark)
        .text('Prospects')
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
