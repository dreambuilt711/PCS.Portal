<template>
  <v-card class="elevation-3 border-eadius-10" height="100%">
    <v-card-title class="pt-3 pb-0">
      <v-col xs12>
        <v-row>
          <v-col xs12>
            <v-row>
              <v-col xl11 lg11 sm11 md11 xs11 class="align-self" />
              <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
                <v-icon color="accent" @click="closeDialog()"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-card-title>
    <v-card-text>
      <Loader :loading-text="`Loading plans with Low returns`" :loading="showLoader" />
      <v-col v-show="!showLoader">
        <ProspectResultAddColumns
          :key="componentRefresh"
          :vspeer-group="vspeerGroup"
          :vsindustry-group="vsindustryGroup"
          :PlanResult="finalPlanResultData"
          :WidgetName="WidgetName"
          :selected-group="selectedGroup"
          :selected-plan="selectedPlan"
          @close-plan-dialog="closeDialog"
        />
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import Loader from '@/components/NewLoader'
import ProspectResultAddColumns from '@/components/TAL/Finder/MarketInsights/ProspectResultAddColumns'
export default {
  components: {
    Loader,
    ProspectResultAddColumns
  },
  props: [
    'showLoader',
    'componentKeyResult',
    'PlanResult',
    'WidgetName',
    'vspeerGroup',
    'vsindustryGroup',
    'selectedGroup',
    'selectedPlan'
  ],
  data() {
    return {
      finalPlanResultData: [],
      componentRefresh: 0
    }
  },
  watch: {
    PlanResult: {
      handler() {
        this.finalPlanResultData = this.$store.state.marketInsight.PlanResult
        this.componentRefresh += 1
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeMarketInsightPlans')
    }
  }
}
</script>
