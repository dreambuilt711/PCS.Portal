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
    '$vuetify?.breakpoint': function () {
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
        .attr('class', 'c_svg')
        .style('width', '100%')
        .style('height', '180px')
        .style('margin', '0 auto')
        .style('display', 'flex')
        .style('margin-bottom', '1rem')
        .append('g')
      var legendwidth = 0
      var legendHeight = 0
      var val = 0
      var legend = svg
        .selectAll('.legend')
        .data(seedData)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
          if (i % 2 === 0 && val > 1) {
            if (this.type !== 'count') {
              var space = this.$vuetify?.breakpoint?.xs ? 145 : 180
              if (innerWidth > 350 && innerWidth < 425) space = 140
              if (innerWidth > 400 && innerWidth < 425) space = 180
              if (innerWidth > 760 && innerWidth < 1000) space = 160
              if (innerWidth > 1000 && innerWidth < 1250) space = 220
              if (innerWidth > 1250 && innerWidth < 1900) space = 0
              if (innerWidth > 1900 && innerWidth < 2500) space = 220
              legendwidth = legendwidth + space
            } else {
              legendwidth = legendwidth + 160
            }

            legendHeight += 1
            val = 0
          } else {
            val++
            legendHeight++
          }
          return `translate(${0},${legendHeight * 30})`
        })

      legend
        .append('circle')
        .attr('cx', 15)
        .attr('cy', 14)
        .attr('r', 5)
        .style('fill', function (d, i) {
          return color(i)
        })
        .style('stroke', function (d, i) {
          return color(i)
        })

      var legendName = this.$vuetify?.theme.dark ? 'fill_white cursor-pointer' : 'fill_accent cursor-pointer'
      var that = this

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 14)
        .attr('dy', '0.35em')
        .style('font-size', '1em')
        .attr('class', legendName)
        .text(function (d) {
          return d.Status
        })
        .on('click', function (d) {
          that.$router.push({
            name: 'TALProspectPlans',
            query: {
              Individuals: 'individuals',
              statusType: d.Status
            }
          })
        })

      legend
        .append('text')
        .attr('x', 130)
        .attr('y', 14)
        .attr('dy', '0.35em')
        .style('font-size', '1em')
        .style('font-weight', '500')
        .attr('class', dark)
        .text(function (d) {
          return d.Count
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
  fill: rgb(var(--v-theme-accent)) !important;
}
</style>
<style>
@media (max-width: 600px) {
  .c_svg {
    width: 50% !important;
  }
}
</style>
