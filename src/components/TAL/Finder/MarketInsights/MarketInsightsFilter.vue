<template>
  <v-col>
    <v-row>
      <span v-for="(item, index) in filterButton[0].selectButton" :key="'filterkey' + index">
        <span>
          <v-menu v-model="item.model" open-on-click ripple :close-on-content-click="false">
            <template v-if="item.Id < 4" #activator="{ props }">
              <v-col>
                <v-btn v-bind="props" variant="outlined" :color="$vuetify?.theme.dark ? '' : 'accent'">{{ item.text }}</v-btn>
              </v-col>
            </template>
            <v-card :height="item.Id === 1 ? '300px' : ''">
              <v-list v-if="item.Id === 1" density="compact">
                <template v-for="(item, index) in filterButton[1].selectPlanType" :key="index">
                  <v-list-item>
                    <v-checkbox
                      v-model="item.model"
                      :label="item.text"
                      :ripple="false"
                      hide-details
                      class="ma-0"
                      @update:model-value="selectPlanType()"
                    />
                  </v-list-item>
                </template>
              </v-list>
              <v-list v-if="item.Id === 2" density="compact" class="pt-2">
                <template v-for="(item, index) in filterButton[2].assetsList" :key="`listplankey` + index">
                  <v-list-item v-if="index === 0" :key="'assestkey' + index">
                    <span>
                      <v-text-field
                        v-model="minAssets"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: ''
                        }"
                        density="compact"
                        placeholder="Min"
                        style="width: 100px !important"
                        variant="outlined"
                        :hide-details="!assetsError"
                        @change="minimumAssets()"
                      />
                    </span>
                    <span class="pl-1 pr-1 pb-3">-</span>
                    <span>
                      <v-text-field
                        v-model="maxAssets"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: ''
                        }"
                        placeholder="Max"
                        :error-messages="assetsErrorMsg"
                        :error="assetsError"
                        style="width: 100px !important"
                        density="compact"
                        variant="outlined"
                        :hide-details="!assetsError"
                        @change="maximumAssets()"
                      />
                    </span>
                  </v-list-item>
                  <v-list-item ripple :class="item.model === true ? 'selectedValue' : ''" @click="selectAsset(item.text)">
                    <v-label v-model="item.model">{{ item.text }}</v-label>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
            <v-list v-if="item.Id === 3" density="compact">
              <v-list-item>
                <v-autocomplete
                  v-model="industry"
                  :items="industries"
                  label="Industry"
                  persistent-hint
                  clearable
                  append-icon
                  hide-no-data
                  :menu-props="{ overflowY: true }"
                  variant="outlined"
                  density="compact"
                  :hide-details="true"
                  @update:model-value="getIndustriesList(), getPlanByIndustry(industry)"
                />
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </span>
    </v-row>
  </v-col>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
export default {
  data() {
    return {
      filterButton: planfinderlist.marketInsightFilterButtonList,
      industries: [],
      industry: '',
      minAssets: '',
      maxAssets: '',
      assetsError: false,
      assetsErrorMsg: ''
    }
  },
  methods: {
    selectPlanType() {
      this.$emit('callApplyFilter')
    },
    getIndustriesList: function () {
      this.$axios.get(`/api/v1/tal/plan/autocomplete/industry/${event.target.value}`).then((success) => {
        this.industries = success.data.d
      })
    },
    getPlanByIndustry(selectedIndustry) {
      if (selectedIndustry) {
        this.$emit('callApplyFilter')
      }
    },
    selectAsset(selectedAsset) {
      this.minAssets = ''
      this.maxAssets = ''
      this.filterButton[2].assetsList.forEach((element, index) => {
        if (element.text === selectedAsset) {
          this.filterButton[2].assetsList[index].model = true
        } else {
          this.filterButton[2].assetsList[index].model = false
        }
      })
      this.$emit('callApplyFilter')
    },
    minimumAssets() {
      this.filterButton[2].assetsList.forEach((a) => (a.model = false))
      if (Number(this.maxAssets) > 0) {
        if (Number(this.maxAssets) < Number(this.minAssets)) {
          this.assetsError = true
          this.assetsErrorMsg = 'Max less than Min'
          return
        } else {
          this.assetsErrorMsg = ''
          this.assetsError = false
        }
      }
    },
    maximumAssets() {
      this.filterButton[2].assetsList.forEach((a) => (a.model = false))
      if (this.minAssets && this.maxAssets) {
        if (Number(this.maxAssets) < Number(this.minAssets)) {
          this.assetsError = true
          this.assetsErrorMsg = 'Max less than Min'
          return
        } else {
          this.assetsErrorMsg = ''
          this.assetsError = false
        }
      } else {
        this.assetsErrorMsg = ''
        this.assetsError = false
      }
      if (!this.assetsError) {
        this.$emit('callApplyFilter')
      }
    }
  }
}
</script>
