<template>
  <div />
</template>

<script>
import * as d3 from 'd3'
export default {
  props: ['liveWidth', 'holdingOverview'],
  data() {
    return {
      width: 320,
      height: 200
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    liveWidth: function () {
      this.assetHoldOverview()
    },
    cashFlow: {
      handler() {
        this.assetHoldOverview()
      },
      deep: true
    },
    '$vuetify?.theme.dark': function () {
      this.assetHoldOverview()
    },
    '$vuetify?.breakpoint': function () {
      this.assetHoldOverview()
    }
  },
  mounted() {
    this.assetHoldOverview()
  },
  methods: {
    assetHoldOverview() {
      d3.select(this.$el).selectAll('svg').remove()
      let seedData = this.holdingOverview.map((res) => ({
        label: res.AssetCatagory,
        value: res.PercentageAmount
      }))

      var width = this.$vuetify?.breakpoint?.xs ? this.$el.offsetWidth : this.$vuetify?.breakpoint?.lg ? 290 : 320
      width = this.$vuetify?.breakpoint?.width === 667 ? 278 : 320
      var height = this.$vuetify?.breakpoint?.lg ? 273 : 290
      var radius = Math.min(width - 80, height - 80) / 2
      var donutWidth = 20
      var transformValue = 0
      if (this.$vuetify?.breakpoint?.xl) transformValue = 5
      if (this.$vuetify?.breakpoint?.xs) transformValue = 5
      if (this.$vuetify?.breakpoint?.sm) transformValue = 7
      if (this.$vuetify?.breakpoint?.md) transformValue = 7
      if (this.$vuetify?.breakpoint?.lg) transformValue = 46
      var color = d3
        .scaleOrdinal()
        .range([
          this.$store.state.theme.accentColors[0],
          this.$store.state.theme.accentColors[3],
          this.$store.state.theme.accentColors[1],
          this.$store.state.theme.accentColors[2],
          '#ffbcc4',
          '#874594',
          '#d87c14',
          '#dc4a55',
          '#8676ad',
          '#cb3e70',
          '#004c91',
          '#ccaccb',
          '#e06138',
          '#b0bad9'
        ])
      var dark = this.$vuetify?.theme.dark ? 'fill_white' : 'fill_black'
      //Draw legend
      var svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', function () {
          var transformHeight = height / 2 - 15
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
          .text(d.data.label + ' - ' + d.data.value + '%')
          .style('left', event.layerX + 'px')
          .style('top', event.layerY + 'px')
      })
      var fontSize = '1em'
      if (this.fontsize >= 1 && this.fontSize <= 11) fontSize = '1.8em'
      if (this.fontSize >= 12 && this.fontSize <= 14) fontSize = '1.5em'
      if (this.fontSize >= 15) fontSize = '1.4em'

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('y', 10)
        .attr('class', dark)
        .attr('font-weight', '500')
        .text('Asset Category')
    }
  }
}
</script>

<style scoped>
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
