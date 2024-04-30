<template>
  <v-container fill-height :fluid="true">
    <v-col xs12 :class="$vuetify?.breakpoint?.xs ? 'pb-1' : ''">
      <v-row>
        <v-col :cols="$vuetify?.breakpoint?.mdAndUp ? '8' : '12'" class="pa-0">
          <span
            v-if="breadCrumb.parentName"
            class="text-capitalize font_12 cursor-pointer"
            :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
            @click="$router.push('/Home/ClientManagement').catch(() => {})"
            >Client Dashboard</span
          >
          <v-icon size="12" :color="!$vuetify?.theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
          <span
            v-if="breadCrumb.parentName"
            class="text-capitalize font_12"
            :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
            >{{ breadCrumb.pageName }}</span
          >
        </v-col>
        <v-col cols="12" class="pl-0 pt-2 pr-0 pb-2">
          <v-row class="align-self-center">
            <v-col sm="6" class="pa-0">
              <h1>Investments Overview</h1>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-row v-resize="onResize">
      <v-col xs12 mb-5>
        <v-tabs v-model="activeTab" class="notificationMenu" color="accent" height="30px" slider-size="3">
          <v-tab v-for="item in investmentOverviewTab" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col v-if="activeTab === 0" xs12 pa-3>
        <TopInvestmentWidget :live-width="100" />
      </v-col>
      <v-col v-if="activeTab === 1" xs12 pa-3>
        <IndividualRankingsWidget :live-width="100" />
      </v-col>
      <v-col v-if="activeTab === 2" xs12 pa-3>
        <PerformanceWidget :live-width="100" />
      </v-col>
      <v-col v-if="activeTab === 3" xs12 pa-3>
        <MarketValueWidget :live-width="100" />
      </v-col>
      <v-col v-if="activeTab === 4" xs12 pa-3>
        <AssetAllocationWidget :live-width="100" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import TopInvestmentWidget from '@/components/Home/ClientManagement/TopInvestmentWidget'
import IndividualRankingsWidget from '@/components/Home/ClientManagement/IndividualRankingsWidget'
import PerformanceWidget from '@/components/Home/ClientManagement/PerformanceWidget'
import MarketValueWidget from '@/components/Home/ClientManagement/MarketValueWidget'
import AssetAllocationWidget from '@/components/Home/ClientManagement/AssetAllocationWidget'
export default {
  components: {
    TopInvestmentWidget,
    IndividualRankingsWidget,
    PerformanceWidget,
    MarketValueWidget,
    AssetAllocationWidget
  },
  data() {
    return {
      activeTab: 0,
      investmentOverviewTab: ['Top Investments', 'Individual Rankings', 'Performance', 'Market Value', 'Asset Allocation']
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    breadCrumb() {
      return this.$route.meta
    }
  },
  methods: {
    onResize() {
      if (this.$el.offsetWidth) this.liveWidth = this.$el.offsetWidth
    }
  }
}
</script>
