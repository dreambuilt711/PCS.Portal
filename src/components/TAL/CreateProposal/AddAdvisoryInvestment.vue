<template>
  <v-col>
    <v-col :class="display.smAndDown.value ? 'mb-5' : ''">
      <v-col>
        <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left pl-2">
          <v-col v-show="investmentList.length > 0" cols="12" xs="12">
            <v-data-table
              class="elevation-0"
              :class="display.xl.value || (display.width.value === 1280 && display.height.value === 768) ? '' : 'fixHeader'"
              :headers="headers"
              :items="investmentList"
              item-key="Symbol"
              :sort-by="investmentPagination.sortBy"
              :hide-default-header="display.smAndDown.value"
              :options="investmentPagination"
              style="backface-visibility: hidden"
              :fixed-header="true"
              :footer-props="{ 'items-per-page-options': [10, 50, 100] }"
            >
              <template #item="{ item, isExpanded, expand }">
                <tr v-if="!display.smAndDown.value">
                  <td class="text-left pl-2 pr-2">
                    <a
                      class="cursor-pointer text-decoration"
                      target="_blank"
                      :href="`https://www.morningstar.com/search?query=${item.Symbol}`"
                      >{{ item.Symbol }}
                      <v-icon size="18" class="icon-modal-light" :class="!theme.dark ? 'text-hyperlink' : 'text-white'" />
                    </a>
                  </td>
                  <td class="text-left pl-2 pr-2">
                    {{ item.Name }}
                  </td>
                  <td class="text-right pl-2 pr-2">{{ formatPercent(item.mgmt) }}%</td>
                  <td class="text-right pl-2 pr-2">{{ formatPercent(item.tload) }}%</td>
                  <td class="text-right pl-2 pr-2">{{ formatPercent(item.SubTA) }}%</td>
                  <td class="text-right pl-2 pr-2">{{ parseFloat(item.Total).toFixed(2) }}%</td>
                </tr>
                <tr v-else :class="[isExpanded ? 'border_bottom_none' : '']">
                  <td class="pr-3 pl-3">
                    <v-col cols="12" xs="12">
                      <v-row>
                        <v-col cols="10" xl="10" lg="10" md="10" sm="10" xs="10">
                          <h5 class="pt-1">
                            <span class="text-grey">Name</span>
                          </h5>
                          <h4 class="text-uppercase">
                            {{ item.Name }}
                          </h4>
                        </v-col>
                        <v-col cols="2" xl="2" lg="2" md="2" sm="2" xs="2" class="text-right cursor-pointer">
                          <v-btn v-if="selected.length == 0" icon variant="text" @click="expand(!isExpanded)">
                            <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="12" xl="10" lg="10" md="10" sm="10" xs="12">
                          <h5 class="pt-1">
                            <span class="text-grey">Symbol</span>
                          </h5>
                          <h4>
                            <a
                              class="cursor-pointer text-decoration"
                              target="_blank"
                              :href="`https://www.morningstar.com/search?query=${item.Symbol}`"
                              >{{ item.Symbol }}
                              <v-icon size="18" class="icon-modal-light" :class="!theme.dark ? 'text-hyperlink' : 'text-white'" />
                            </a>
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                </tr>
              </template>
              <template v-if="display.smAndDown.value" #expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-card flat :class="theme.dark ? '' : 'expandable_background'">
                    <v-card-text>
                      <v-row>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 class="pl-0 pb-0 text-grey">Mgmt</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ formatPercent(item.mgmt) }}%</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 class="pl-0 pb-0 text-grey">12b-1</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ formatPercent(item.tload) }}%</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 class="pl-0 pb-0 text-grey">SubTA</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ formatPercent(item.SubTA) }}%</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 class="pl-0 pb-0 text-grey">Total Fees</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ parseFloat(item.Total).toFixed(2) }}%</h4>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-show="investmentList.length === 0" cols="12" xs="12" class="pt-8">
            <v-card class="nonSelectedBackground" :class="!display.xs.value ? 'pa-16 ma-16' : 'pa-12'">
              <v-col class="text-h5 text-center">
                <h5>No Data Available</h5>
              </v-col>
            </v-card>
          </v-col>
        </v-col>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
import { ref } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
export default {
  props: ['investmentList'],
  setup() {
    const theme = useTheme()
    const display = useDisplay()
    const headers = ref([
      {
        title: 'Symbol',
        value: 'Symbol',
        sortable: true,
        align: 'start',
        width: '60px',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '150px',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: true,
        width: '45px',
        align: 'end',
        class: 'pl-2 pr-2'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: true,
        width: '45px',
        align: 'end',
        class: 'pl-2 pr-2'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: true,
        width: '45px',
        align: 'end',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Total Fees',
        value: 'Total',
        sortable: true,
        width: '75px',
        align: 'end',
        class: 'pl-2 pr-2'
      }
    ])
    const selected = ref([])
    const investmentPagination = ref({
      itemsPerPage: 10,
      sortBy: [{ key: 'Symbol', order: 'desc' }]
    })
    const formatPercent = (val) => {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    return {
      theme,
      display,
      headers,
      investmentPagination,
      selected,
      formatPercent
    }
  }
}
</script>
<style scoped>
div.norecords {
  text-align: center;
  color: #333333;
  text-rendering: optimizeLegibility;
}
.nonSelectedBackground {
  background-color: #dddddd !important;
}
</style>
