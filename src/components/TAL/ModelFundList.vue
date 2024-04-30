<template>
  <v-row>
    <v-col v-show="!modelDialog && !fundDialog">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col v-if="reports === 'RPEA'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left pt-2">
            <v-row>
              <span>
                Please note, investments (including those used in model portfolios, if applicable) must be available and approved
                by the custodian prior to use. To the extent an investment you have selected is not available, you will be
                notified to discuss alternative investment options.
              </span>
            </v-row>
          </v-col>
          <v-col v-if="reports === 'Proposal'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left">
            <v-row>
              <h2 class="font-weight-normal">Add Investments to your lineup from</h2>
              <v-col cols="12" xs="12" class="mt-3 mb-2">
                <v-radio-group v-model="investmentLineupType" inline>
                  <v-radio
                    :color="theme.dark ? '' : 'accent'"
                    label="Investment Models"
                    value="Investment Models"
                    class="mr-15"
                  />
                  <v-radio :color="theme.dark ? '' : 'accent'" label="Supplemental Funds List" value="Supplemental Funds List" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="reports != 'Proposal'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left pt-2">
            <v-row>
              <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-left align-self">
                <h2 class="font-weight-normal">Models</h2>
              </v-col>
              <v-col v-if="showModel" cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-right">
                <v-btn size="small" :color="theme.dark ? '' : 'accent'" @click="showModelDialog()"> New Model </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-show="reports === 'Proposal' ? investmentLineupType === 'Investment Models' : true"
            cols="12"
            xl="12"
            lg="12"
            md="12"
            sm="12"
            xs="12"
          >
            <v-data-table
              v-model="selected"
              :headers="currentModelHeaders"
              :items="currentModelList"
              item-key="ModelID"
              hide-default-footer
              :disable-pagination="true"
              show-select
              class="elevation-0 fixHeader"
              :fixed-header="true"
              style="backface-visibility: hidden"
              :mobile-breakpoint="0"
              density="compact"
            >
              <template #body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.ModelID">
                    <td width="2%">
                      <v-checkbox
                        v-model="selected"
                        :color="theme.dark ? '' : 'accent'"
                        :value="item"
                        class="mt-2 mb-2"
                        small
                        hide-details
                        @click="checkedChangeModal()"
                      />
                    </td>
                    <td class="text-left">
                      <v-row>
                        <div>
                          <h4 :class="hover ? 'text-decoration-underline' : ''">
                            <a
                              :class="theme.dark ? 'text-white' : 'text-accent'"
                              class="text_decoration"
                              @click="editModel(item)"
                            >
                              {{ item.Name }}
                            </a>
                          </h4>
                        </div>
                      </v-row>
                    </td>
                    <td class="text-wrap wrapword">
                      {{ item.Description }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-col>
          <v-col
            v-show="reports === 'Proposal' ? investmentLineupType === 'Investment Models' : false"
            cols="12"
            xs="12"
            class="mt-3"
          >
            <v-btn
              :color="!theme.dark ? 'accent' : ''"
              :loading="saveLoading"
              :disabled="selected && selected.length > 0 ? false : true"
              @click="saveProposalModel(true)"
            >
              Add To Lineup
              <template #saveLoading>
                <span class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </template>
            </v-btn>
            <v-divider class="my-2" />
            <h2 class="pt-4 pb-2 font-weight-medium">Investments Lineup</h2>
            <v-data-table
              v-if="modelSelected.length > 0"
              :headers="currentModelHeaders"
              :items="modelSelected"
              item-key="ModelID"
              hide-default-footer
              :disable-pagination="true"
              class="elevation-0 fixHeader"
              :fixed-header="true"
              style="backface-visibility: hidden"
              :mobile-breakpoint="0"
              density="compact"
            >
              <template #item="{ item }">
                <tr>
                  <td class="text-left">
                    {{ item.Name }}
                  </td>
                  <td class="text-left">
                    {{ item.Description }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-if="reports != 'Proposal'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left pt-2">
            <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mt-6">
              <v-row>
                <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-left align-self">
                  <h2 class="font-weight-normal">Investment List</h2>
                </v-col>
                <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-right">
                  <!-- EXAMPLE: <v-btn
                  v-if="$authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.ViewOnly)" />-->
                  <v-btn v-if="showFund" size="small" :color="theme.dark ? '' : 'accent'" @click="showFundDialog()">
                    New Investment
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col v-if="reports != 'Proposal'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left">
            <v-data-table
              v-model="selectedFund"
              :headers="currentFundHeaders"
              :items="currentFundList"
              item-key="ListID"
              default-sort-by
              hide-default-footer
              show-select
              :disable-pagination="true"
              class="elevation-0 fixHeader"
              :fixed-header="true"
              style="backface-visibility: hidden"
              :mobile-breakpoint="0"
            >
              <template #body="{ items }">
                <tbody>
                  <tr v-for="fundItem in items" :key="fundItem.ListID">
                    <td width="2%">
                      <v-checkbox
                        v-model="selectedFund"
                        :value="fundItem"
                        class="ma-0"
                        small
                        hide-details
                        :color="theme.dark ? '' : 'accent'"
                        @click="checkedChangeFund()"
                      />
                    </td>
                    <td class="text-left">
                      <v-row>
                        <div>
                          <h4 :class="hover ? 'text-decoration-underline' : ''">
                            <a
                              :class="theme.dark ? 'text-white' : 'text-accent'"
                              class="text_decoration"
                              @click="editFund(fundItem)"
                            >
                              {{ fundItem.Name }}
                            </a>
                          </h4>
                        </div>
                      </v-row>
                    </td>
                    <td class="pa-1 text-left text-wrap wrapword">
                      {{ fundItem.Description }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-if="reports === 'RPEA'" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="text-left pl-2">
            <v-row>
              <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-left mt-6 pb-2 align-self">
                <h2 class="font-weight-normal">Include Options</h2>
              </v-col>
              <v-col cols="12" xs="12" class="mb-2">
                <v-data-table
                  v-model="optionSelected"
                  :headers="optionHeader"
                  :items="optionList"
                  item-key="ID"
                  hide-default-footer
                  show-select
                  class="elevation-0"
                  :mobile-breakpoint="0"
                >
                  <template #body="{ items }">
                    <tbody>
                      <tr v-for="optionItem in items" :key="optionItem.ID">
                        <td width="2%">
                          <v-checkbox
                            v-model="optionSelected"
                            :value="optionItem"
                            class="ma-0"
                            small
                            hide-details
                            :color="theme.dark ? '' : 'accent'"
                            @update:model-value="optionItem && optionItem.ID === 2 ? showWeightAverage() : ''"
                          />
                        </td>
                        <td class="text-left">
                          {{ optionItem.Name }}
                        </td>
                        <td class="text-left">
                          {{ optionItem.Description }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-show="reports === 'Proposal' && investmentLineupType === 'Supplemental Funds List'"
            cols="12"
            xl="12"
            lg="12"
            md="12"
            sm="12"
            xs="12"
          >
            <v-row>
              <v-col cols="12" xl="3" lg="3" md="8" sm="9" xs="12">
                <v-select
                  v-model="proposalFund"
                  hide-details
                  label="Select Funds List"
                  :items="currentFundList"
                  :return-object="true"
                  item-title="Name"
                  item-value="ListID"
                  auto-select-first
                  class="pa-0"
                  variant="outlined"
                  density="compact"
                  append-icon="icon-chevron-down"
                  @update:model-value="checkFundList()"
                />
              </v-col>
              <v-col
                cols="12"
                xl="1"
                lg="1"
                md="1"
                sm="2"
                xs="12"
                class="text-right align-self-flexend"
                :class="display.xs.value ? 'mt-2' : 'ml-4'"
              >
                <v-btn
                  :color="theme.dark ? '' : 'accent'"
                  :disabled="!disableAdd"
                  class="ma-0"
                  @click="addLoadInvestmentFromFund(proposalFund)"
                >
                  Add to Lineup
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="reports === 'Proposal' && investmentLineupType === 'Supplemental Funds List'"
            cols="12"
            xl="12"
            lg="12"
            md="12"
            sm="12"
            xs="12"
            class="text-left"
          >
            <v-row>
              <v-col cols="12" xs="12" class="mt-5 mb-2">
                <h2>-OR-</h2>
              </v-col>
              <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="modelClass">
                <AddInvestment
                  ref="fundInvestment"
                  :reports="'Proposal_Fund'"
                  :investment-list="fundInvestmentList"
                  :plan-id="planProposalID"
                  :proposal-plan-id="proposalPlanID"
                  :additional-investment="true"
                  :reset-form="false"
                  :model-i-d="fundID"
                  :hide-from-fund="fundEditable"
                  @get-investment="getProposalPlanInvestments"
                  @update-investment="updateInvestmentCount"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-col
          v-if="reports === 'RPEA' && showInvestmentWeight === true"
          cols="12"
          xl="12"
          lg="12"
          md="12"
          sm="12"
          xs="12"
          class="text-left pl-2"
        >
          <v-row>
            <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6" class="text-left mt-6 pb-2 align-self">
              <h2 class="font-weight-normal">Investments Weighting</h2>
            </v-col>
            <v-col cols="12" xs="12">
              <v-col cols="12" xs="12" class="mb-2">
                <h3 class="font-weight-normal">Current Menu</h3>
              </v-col>
              <v-col cols="12" xs="12" class="mb-2">
                <v-data-table
                  density="compact"
                  :headers="currentWeightHeader"
                  :items="currentWeightList"
                  item-key="ID"
                  hide-default-footer
                  :disable-pagination="true"
                  class="elevation-0"
                  :loading="loadCurrentWeight"
                >
                  <template #header="props">
                    <th
                      v-for="header in props.headers"
                      v-show="header.text != ''"
                      :key="header.text"
                      :align="header.align"
                      :width="header.width"
                    >
                      {{ header.text }}
                    </th>
                  </template>
                  <template #item="props">
                    <tr>
                      <td class="text-left">
                        {{ props.item.Name }}
                      </td>
                      <td class="text-left">
                        {{ props.item.Ticker }}
                      </td>
                      <td class="pa-1">
                        <v-text-field
                          v-model="props.item.newWeight"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          class="font_12 pa-0 text-right"
                          hide-details
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          @blur="currentWeightPercent(props.item, 'CurrentMenu')"
                        />
                      </td>
                      <td class="pa-1">
                        <v-text-field
                          v-model="props.item.Dollar"
                          v-input-mask="{
                            alias: 'currency',
                            digits: '2',
                            rightAlign: false,
                            placeholder: '0.00',
                            allowMinus: false,
                            autoUnmask: true
                          }"
                          prefix="$"
                          class="font_12 pa-0 text-right"
                          hide-details
                          maxlength="13"
                          variant="outlined"
                          density="compact"
                          @blur="currentWeightDollar(props.item, 'CurrentMenu')"
                        />
                      </td>
                    </tr>
                  </template>
                  <template v-slot:body.append>
                    <tr>
                      <td class="text-left">
                        <span class="font-weight-medium">Total Current Weighted Percentage:</span>
                      </td>
                      <td />
                      <td class="text-right">
                        <span class="font-weight-medium"> {{ parseFloat(totalCurrentWeightPercentage).toFixed(2) }}%</span>
                      </td>
                      <td class="text-right">
                        <span class="font-weight-medium">{{ formatPrice(totalCurrentWeightDollar, 2) }}</span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-col>
            <v-col cols="12" xs="12">
              <v-row>
                <v-col cols="12" xs="12" class="mb-2">
                  <h3 class="font-weight-normal">Proposed Menu : Models</h3>
                </v-col>
                <v-col cols="12" xs="12" class="mb-2">
                  <v-data-table
                    density="compact"
                    :headers="proposedMenuHeader"
                    :items="proposedModelList"
                    item-key="ID"
                    hide-default-footer
                    :disable-pagination="true"
                    class="elevation-0"
                    :loading="loadProposedModel"
                  >
                    <template #header="props">
                      <th
                        v-for="header in props.headers"
                        v-show="header.text != ''"
                        :key="header.text"
                        :align="header.align"
                        :width="header.text == 'Name' ? (display.smAndDown.value ? '40%' : '70%') : ''"
                      >
                        {{ header.text }}
                      </th>
                    </template>
                    <template #item="props">
                      <tr>
                        <td class="text-left">
                          {{ props.item.Name }}
                        </td>
                        <td class="pa-1">
                          <v-text-field
                            v-model="props.item.newWeight"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '2',
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            suffix="%"
                            class="font_12 pa-0 text-right"
                            hide-details
                            maxlength="5"
                            variant="outlined"
                            density="compact"
                            @blur="currentWeightPercent(props.item, 'ProposedMenu')"
                          />
                        </td>
                        <td class="pa-1">
                          <v-text-field
                            v-model="props.item.Dollar"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '2',
                              rightAlign: false,
                              placeholder: '0.00',
                              allowMinus: false,
                              autoUnmask: true
                            }"
                            prefix="$"
                            class="font_12 pa-0 text-right"
                            hide-details
                            maxlength="13"
                            variant="outlined"
                            density="compact"
                            @blur="currentWeightDollar(props.item, 'ProposedMenu')"
                          />
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xs="12" class="mb-2">
                  <h3 class="font-weight-normal">Proposed Menu : Funds</h3>
                </v-col>
                <v-col cols="12" xs="12" class="mb-2">
                  <v-data-table
                    density="compact"
                    :headers="proposedMenuHeader"
                    :items="proposedFundList"
                    item-key="ID"
                    hide-default-footer
                    :disable-pagination="true"
                    class="elevation-0"
                    :loading="loadProposedFund"
                  >
                    <template #header="props">
                      <th
                        v-for="header in props.headers"
                        v-show="header.text != ''"
                        :key="header.text"
                        :align="header.align"
                        :width="header.text == 'Name' ? (display.smAndDown.value ? '40%' : '70%') : ''"
                      >
                        {{ header.text }}
                      </th>
                    </template>
                    <template #item="props">
                      <tr>
                        <td class="text-left">
                          {{ props.item.Name }}
                        </td>
                        <td class="pa-1">
                          <v-text-field
                            v-model="props.item.newWeight"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '2',
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            suffix="%"
                            class="font_12 pa-0 text-right"
                            hide-details
                            maxlength="5"
                            variant="outlined"
                            density="compact"
                            @blur="currentWeightPercent(props.item, 'ProposedMenu')"
                          />
                        </td>
                        <td class="pa-1">
                          <v-text-field
                            v-model="props.item.Dollar"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '2',
                              rightAlign: false,
                              placeholder: '0.00',
                              allowMinus: false,
                              autoUnmask: true
                            }"
                            prefix="$"
                            class="font_12 pa-0 text-right"
                            hide-details
                            maxlength="13"
                            variant="outlined"
                            density="compact"
                            @blur="currentWeightDollar(props.item, 'ProposedMenu')"
                          />
                        </td>
                      </tr>
                    </template>
                    <template v-slot:body.append>
                      <tr>
                        <td class="text-left">
                          <span class="font-weight-medium">Total Proposed Weighted Percentage:</span>
                        </td>
                        <td class="text-right">
                          <span class="font-weight-medium"> {{ parseFloat(totalProposedWeightPercentage).toFixed(2) }}%</span>
                        </td>
                        <td class="text-right">
                          <span class="font-weight-medium">{{ formatPrice(totalProposedWeightDollar, 2) }}</span>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" xs="12">
          <v-col
            v-if="reports === 'RPEA' && showInvestmentWeight === true"
            cols="12"
            xs="12"
            :class="display.xs.value ? 'text-left' : 'text-right'"
          >
            <div class="pr-1">
              <h4>You cannot proceed until the Current and Proposed Menus equal 100 %.</h4>
            </div>
          </v-col>
        </v-col>
      </v-form>
    </v-col>
    <v-col v-show="fundDialog" cols="12" xs="12">
      <v-col>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pb-3">
            <h2 class="font-weight-normal">Investment Details</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2">
            <v-text-field
              v-model="fundName"
              label="Investment Name"
              :error="modelfunderror"
              :error-messages="modelFundMsg"
              variant="outlined"
              density="compact"
              :disabled="fundEditable"
              @blur="checkFundName()"
            />
          </v-col>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2">
            <v-text-field
              v-model="fundDescription"
              label="Description"
              maxlength="250"
              counter="250"
              variant="outlined"
              density="compact"
              :disabled="fundEditable"
            />
          </v-col>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pt-3 pb-2">
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
            <h2>Add Investments</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="modelClass">
            <AddInvestment
              ref="fundInvestment"
              :reports="'RPEA_Fund'"
              :investment-list="fundInvestmentList"
              :additional-investment="true"
              :plan-id="planProposalID"
              :reset-form="fundDialog"
              :model-i-d="fundID"
              :hide-from-fund="fundEditable"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" class="mt-5">
        <v-btn
          v-if="!fundEditable"
          :color="theme.dark ? '' : 'accent'"
          class="elevation-0"
          :disable="!valid"
          @click="saveFundInvestment()"
        >
          Save Investment
        </v-btn>
        <v-btn :color="theme.dark ? '' : 'accent'" :disable="!valid" @click="resetFund()"> Back </v-btn>
      </v-col>
    </v-col>
    <v-col v-show="modelDialog" cols="12" xs="12">
      <v-col>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pb-3">
            <h2 class="font-weight-normal pb-2">Model Details</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2">
            <v-text-field
              v-model="modelName"
              variant="outlined"
              density="compact"
              label="Model Name"
              :error="modelfunderror"
              :error-messages="modelMessage"
              :disabled="modelID < 0"
              @blur="checkModelName()"
            />
          </v-col>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2">
            <v-text-field
              v-model="modelDescription"
              label="Description"
              maxlength="250"
              counter="250"
              variant="outlined"
              density="compact"
              :disabled="modelID < 0"
            />
          </v-col>
          <v-col xl="12" lg="12" md="12" sm="12" xs="12" class="pt-3 pb-2">
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
            <h2>Add Investments</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="modelClass">
            <AddInvestment
              ref="modelInvestment"
              :reports="'RPEA_Model'"
              :investment-list="modelInvestmentList"
              :additional-investment="true"
              :plan-id="planID"
              :reset-form="modelDialog"
              :model-i-d="modelID"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" class="mt-5">
        <v-btn v-if="modelID >= 0" :color="theme.dark ? '' : 'accent'" :disable="!valid" @click="saveModelInvestment()">
          Save Model
        </v-btn>
        <v-btn :color="theme.dark ? '' : 'accent'" :disable="!valid" @click="resetModel()"> Back </v-btn>
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
import { ref, getCurrentInstance, computed, watch, inject, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import AddInvestment from '@/components/TAL/AddInvestment'
export default {
  components: {
    AddInvestment
  },
  props: ['seinpno', 'reports', 'planID', 'getModelId', 'proposalPlan'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const $route = useRoute()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $toast = instance.appContext.config.globalProperties.$toast
    const $axios = instance.appContext.config.globalProperties.$axios
    const saveLoading = ref(false)
    const asset = ref('')
    const fundEditable = ref(false)
    const assetlist = ref([])
    const hover = ref(true)
    const currentModelList = ref([])
    const currentFundList = ref([])
    const modelInvestmentList = ref([])
    const fundInvestmentList = ref([])
    const headers = ref([
      {
        title: 'Type',
        value: 'Type',
        sortable: true,
        align: 'start',
        width: '20px',
        hide: props.reports !== 'Proposal_Fund'
      },
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: true,
        align: 'start',
        width: '60px'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '150px'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'FER',
        value: 'expratio',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Platform',
        value: 'AMC',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Offset',
        value: 'amcOffset',
        sortable: false,
        width: '25px',
        align: 'end'
      },
      {
        title: 'Advisor',
        value: 'SSF',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Offset',
        value: 'ssfOffset',
        sortable: false,
        width: '25px',
        align: 'end'
      },
      {
        title: 'Total Fees',
        value: props.reports === 'Proposal_Fund' ? 'expratio' : 'Total',
        sortable: true,
        width: '65px',
        align: 'end'
      }
    ])
    const selected = ref([])
    const selectedFund = ref([])
    const currentModelDisableSort = ref(true)
    const currentFundDisableSort = ref(true)
    const currentLoader = ref(true)
    const modelLoader = ref(true)
    const investmentType = ref('Asset')
    const valid = ref(true)
    const modelFundMsg = ref('')
    const modelMessage = ref('')
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewExpratio = ref(0)
    const totalNewAMC = ref(0)
    const totalNewSSF = ref(0)
    const totalNewFees = ref(0)
    const modelDialog = ref(false)
    const fundDialog = ref(false)
    const modelID = ref(0)
    const modelName = ref('')
    const fundID = ref(0)
    const fundName = ref('')
    const modelDescription = ref('')
    const fundDescription = ref('')
    const currentModelHeaders = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '25px'
      },
      {
        title: 'Description',
        value: 'Description',
        sortable: true,
        align: 'start',
        width: '25px'
      }
    ])
    const currentFundHeaders = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '25px'
      },
      {
        title: 'Description',
        value: 'Description',
        sortable: true,
        align: 'start',
        width: '25px'
      }
    ])
    const planProposalID = ref(0)
    const modelfunderror = ref(false)
    const proposalPlanID = ref(0)
    const savedmodelfund = ref([])
    const modelFundObject = ref([])
    const successLoad = ref(false)
    const proposalFund = ref('')
    const currentWeightHeader = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: false,
        align: 'start',
        width: '50%'
      },
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: false,
        width: '20%',
        align: 'start'
      },
      {
        title: 'Weight',
        value: 'Weight',
        sortable: false,
        width: '15%',
        align: 'center'
      },
      {
        title: 'Dollar',
        value: 'Dollar',
        sortable: false,
        width: '15%',
        align: 'center'
      }
    ])
    const optionList = ref([
      {
        ID: 1,
        Name: 'Model Performance',
        Description: 'Calculate historical performance for your models based on your current allocation.'
      },
      {
        ID: 2,
        Name: 'Weighted Average Comparison',
        Description:
          'Enter specific percentages for the current holdings and your proposed investments. If unchecked, the system will assume an even distribution among each investment option.'
      },
      {
        ID: 3,
        Name: 'Implicit Costs',
        Description: 'Exclude estimated implicit costs from the report.'
      },
      {
        ID: 4,
        Name: 'Current Investments',
        Description: 'Include Current Investments in the report.'
      },
      {
        ID: 5,
        Name: 'FINRA',
        Description: 'Include FINRA response letter at end of Report.'
      }
    ])
    const optionHeader = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: false,
        align: 'start',
        width: '25px'
      },
      {
        title: 'Description',
        value: 'Description',
        sortable: false,
        align: 'start',
        width: '25px'
      }
    ])
    const optionSelected = ref([
      {
        ID: 1,
        Name: 'Model Performance',
        Description: 'Calculate historical performance for your models based on your current allocation.'
      }
    ])
    const advisorplan = ref({})
    const showInvestmentWeight = ref(false)
    const currentWeightList = ref([])
    const proposedMenuHeader = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: false,
        width: '70%'
      },
      {
        title: 'Weight',
        value: 'newWeight',
        sortable: false,
        align: 'center',
        width: '15%'
      },
      {
        title: 'Dollar',
        value: 'Dollar',
        sortable: false,
        align: 'center',
        width: '15%'
      }
    ])
    const proposedModelList = ref([])
    const proposedFundList = ref([])
    const totalCurrentWeightPercentage = ref(0)
    const totalCurrentWeightDollar = ref(0)
    const totalProposedWeightPercentage = ref(0)
    const totalProposedWeightDollar = ref(0)
    const oldSelected = ref([])
    const oldSelectedFund = ref([])
    const oldSelectedOptions = ref({})
    const oldFundInvestmentList = ref([])
    const rpeaLoading = ref(false)
    const loadCurrentWeight = ref(false)
    const loadProposedModel = ref(false)
    const loadProposedFund = ref(false)
    const disableAdd = ref(false)
    const planType = ref('')
    const investmentLineupType = ref('Investment Models')
    const modelSelected = ref([])
    const modelFund = ref(null)
    const fundInvestment = ref(null)
    const modelInvestment = ref(null)
    function callProposalMethod() {
      getProposalID('load')
    }
    function updateInvestmentCount(val) {
      if (val === 'Proposal_Fund') {
        emit('selectedFundList', fundInvestmentList.value)
      }
    }
    function abondonModelFund() {
      if (props.reports === 'RPEA') {
        selected.value = oldSelected.value
        selectedFund.value = oldSelectedFund.value
        optionSelected.value = oldSelectedOptions.value
        if (optionSelected.value) {
          let investmentWeight = optionSelected.value.find((a) => a.ID === 2)
          if (investmentWeight) showInvestmentWeight.value = true
          else showInvestmentWeight.value = false
        } else showInvestmentWeight.value = false
        resetModel()
        resetFund()
        if (modelFund.value) {
          modelFund.value.clearFilter('blur')
          modelFund.value.asset = ''
          modelFund.value.asseterror = false
          modelFund.value.assetMsg = ''
        }
      }
      if (props.reports === 'Proposal') {
        selected.value = oldSelected.value
        if (fundInvestment.value) {
          fundInvestment.value.clearFilter('blur')
          fundInvestment.value.asset = ''
          fundInvestment.value.asseterror = false
          fundInvestment.value.assetMsg = ''
        }
      }
    }
    function checkFundList() {
      disableAdd.value = proposalFund.value ? true : false
    }
    function toggleModelAll() {
      if (selected.value.length) {
        checkedChangeModal()
        selected.value = []
      } else selected.value = currentModelList.value.slice()
    }
    function toggleFundAll() {
      if (selectedFund.value.length) {
        checkedChangeFund()
        selectedFund.value = []
      } else selectedFund.value = currentFundList.value.slice()
    }
    function selectAllOption() {
      if (optionSelected.value.length) optionSelected.value = []
      else optionSelected.value = optionList.value.slice()
    }
    function checkedChangeModal() {
      if (selected.value.length <= 0 || selectedFund.value.length <= 0) {
        var optionSelected = optionSelected.value.filter((x) => x.ID === 2)
        if (optionSelected.length > 0 && typeof optionSelected !== 'undefined') {
          // eslint-disable-next-line prettier/prettier
          var selectedIndex = optionSelected.value.map((item) => item.ID).indexOf(optionSelected.value) // find index of your object
          optionSelected.value.splice(selectedIndex, 1)
        }
      }
    }
    function checkedChangeFund() {
      if (selectedFund.value.length <= 0 || selected.value.length <= 0) {
        var optionSelected = optionSelected.value.filter((x) => x.ID === 2)
        if (optionSelected.length > 0) {
          // eslint-disable-next-line prettier/prettier
          var selectedIndex = optionSelected.value.map((item) => item.ID).indexOf(optionSelected.value) // find index of your object
          optionSelected.value.splice(selectedIndex, 1)
        }
      }
    }
    function saveModelInvestment() {
      modelfunderror.value = false
      modelMessage.value = ''
      if (modelName.value === '') {
        modelfunderror.value = true
        modelMessage.value = 'Model name required'
        return
      }
      if (modelInvestmentList.value.length === 0) {
        $toast?.destroy()
        $toast.error('Asset / cash item does not exist', '')
        return
      }
      if (props.reports === 'RPEA' && parseFloat(Number(finalModelPercent.value)) !== 100) {
        $toast?.destroy()
        $toast.error('Total Percentage value should be 100%', '')
        return
      }
      if (modelInvestmentList.value.length > 0) {
        modelInvestmentList.value.sort(function (a, b) {
          return b.index - a.index
        })
      }
      var investList = modelInvestmentList.value.map((rec) => {
        return {
          Id: rec.ID === undefined ? 0 : rec.ID,
          Type: rec.Type,
          Ticker: rec.Ticker,
          Name: rec.Name,
          Amount: Number(rec.Amount) > 0 ? Number(parseFloat(rec.Amount / 100).toFixed(4)) : 0,
          Code: rec.Code === undefined ? '' : rec.Code,
          Taxable: rec.Taxable === undefined ? false : rec.Taxable
        }
      })
      var modelInvestment = {
        Id: modelID.value,
        Name: modelName.value,
        Description: modelDescription.value,
        Investments: investList
      }
      if (modelInvestment.Name !== '') {
        $axios.put(`/api/v1/tal/model`, modelInvestment).then((success) => {
          if (success.data.d != null) {
            resetModel()
            if (props.reports === 'RPEA') getPlanModels(false)
            $toast?.destroy()
            $toast.success('Model Investments Saved Successfully', '')
          }
        })
      }
    }
    function editModel(modelItem) {
      if (modelItem !== null && modelItem.ModelID != null) {
        modelDialog.value = false
        resetModel()
        $axios.get(`/api/v1/tal/model/${modelItem.ModelID}`).then((success) => {
          if (success.data.d !== null) {
            modelName.value = modelItem.Name
            modelID.value = modelItem.ModelID
            modelDescription.value = modelItem.Description
            success.data.d.map(function (item) {
              item.Amount = Number(parseFloat(item.Amount * 100).toFixed(4))
            })
            modelInvestmentList.value = success.data.d
            if (modelInvestmentList.value.length > 0) {
              modelInvestmentList.value.forEach((element, index) => {
                element.index = index + 1
                element.mgmt = element.mgmt * 100
                element.tload = element.tload * 100
                element.SubTA = element.SubTA * 100
                element.expratio = element.expratio * 100
                element.Total = element.Total * 100
              })
            }
            emit('showModelCount', false)
            modelDialog.value = true
            modelfunderror.value = false
          }
        })
      }
    }
    function saveFundInvestment() {
      if (fundName.value === '') {
        modelfunderror.value = true
        modelFundMsg.value = 'Investment name is required'
        return
      } else {
        modelfunderror.value = false
        modelFundMsg.value = ''
      }
      if (fundInvestmentList.value.length === 0) {
        $toast?.destroy()
        $toast.error('Asset / cash item does not exist', '')
        return
      }
      if (fundInvestmentList.value.length > 0) {
        fundInvestmentList.value.sort(function (a, b) {
          return b.index - a.index
        })
      }
      var investList = fundInvestmentList.value.map((rec) => {
        return {
          Id: rec.ID === undefined ? 0 : rec.ID,
          Type: rec.Type,
          Ticker: rec.Ticker,
          Name: rec.Name,
          Amount: 1,
          Code: rec.Code,
          Taxable: rec.Taxable === undefined ? false : rec.Taxable
        }
      })
      var fundInvestment = {
        Id: fundID.value,
        Name: fundName.value,
        Description: fundDescription.value,
        Investments: investList
      }
      if (fundInvestment.Name !== '') {
        $axios.put(`/api/v1/tal/fund`, fundInvestment).then((success) => {
          if (success.data.d != null) {
            resetFund()
            getPlanFunds(false)
            $toast?.destroy()
            $toast.success('Fund Investments Saved Successfully', '')
          }
        })
      }
    }
    function editFund(fundItem) {
      if (fundItem !== undefined && fundItem.ListID !== 0) {
        fundDialog.value = false
        fundEditable.value = fundItem.HideDelete === 0 ? false : true
        resetFund()
        $axios.get(`/api/v1/tal/fund/${fundItem.ListID}`).then((success) => {
          if (success.data.d !== null) {
            fundInvestmentList.value = success.data.d
            if (fundInvestmentList.value.length > 0) {
              fundInvestmentList.value.forEach((element, index) => {
                element.index = index + 1
                element.mgmt = element.mgmt * 100
                element.tload = element.tload * 100
                element.SubTA = element.SubTA * 100
                element.expratio = element.expratio * 100
                element.Total = element.Total * 100
              })
            }
            fundName.value = fundItem.Name
            fundDescription.value = fundItem.Description
            fundDialog.value = true
            fundID.value = fundItem.ListID
            modelfunderror.value = false
            emit('showModelCount', false)
          }
        })
      }
    }
    function getProposalID() {
      var seinpno = ''
      if (props.reports === 'RPEA' && !props.seinpno) {
        seinpno = $route.params.id
      } else seinpno = props.seinpno
      if (!planProposalID.value) {
        $axios.post(`/api/v1/tal/proposal/generateid?seinpno=${seinpno}`).then((success) => {
          if (success.data.d !== null) {
            planProposalID.value = success.data.d
            getProposalPlanID()
          }
        })
      }
    }
    function getPlanModels(isStepper) {
      if (planProposalID.value !== 0) {
        if (props.reports === 'Proposal') rpeaLoading.value = true
        $axios
          .get(`/api/v1/tal/proposal/${planProposalID.value}/models`)
          .then((success) => {
            if (success.data.d !== null) {
              if (props.reports !== 'Proposal') {
                currentModelList.value = success.data.d.length > 0 ? success.data.d : []
                selected.value = currentModelList.value.filter(function (n) {
                  return n.Selected
                })
                oldSelected.value = selected.value.slice(0)
              } else {
                selected.value = success.data.d.length > 0 ? success.data.d : []
                rpeaLoading.value = false
              }
              if (isStepper) {
                successLoad.value = true
              }
            }
            if (props.reports === 'RPEA') emit('showModelCount', true)
          })
          .catch(() => {
            successLoad.value = true
          })
      }
    }
    const getPlanFunds = async (isStepper) => {
      if (planProposalID.value !== 0) {
        await $axios
          .get(`/api/v1/tal/proposal/${planProposalID.value}/funds?forProposal=${props.reports === 'Proposal'}`)
          .then((success) => {
            if (success.data.d !== null) {
              currentFundList.value = success.data.d.length > 0 ? success.data.d : []
              selectedFund.value = currentFundList.value.filter((n) => n.Selected)
              oldSelectedFund.value = selectedFund.value.slice(0)
              if (isStepper) {
                if (props.reports !== 'Proposal') successLoad.value = true
              }
              if (props.reports === 'RPEA') emit('showModelCount', true)
            }
          })
          .catch(() => {
            successLoad.value = true
          })
      }
    }
    const saveProposalHoldings = async () => {
      if (planProposalID.value !== 0) {
        var holdings = {
          models: selected.value.map((a) => a.ModelID),
          funds: selectedFund.value.map((a) => a.ListID)
        }
        savedmodelfund.value.modelsCount = holdings.models.length
        savedmodelfund.value.fundsCount = holdings.funds.length
        savedmodelfund.value.CurrentmodelsCount = currentModelList.value.length
        savedmodelfund.value.CurrentfundsCount = currentFundList.value.length
        await $axios.put(`/api/v1/tal/proposal/${planProposalID.value}/holdings`, holdings)
        var success = await $axios.put(`/api/v1/tal/proposal/${planProposalID.value}/proposedplanid`)
        if (success.data.d != null) {
          proposalPlanID.value = success.data.d.proposedPlanId
          eventBus.emit('updateTrusteeFee')
        }
        emit('modelfundDetails', savedmodelfund.value, 'Save')
        if (props.reports === 'RPEA') {
          var options = {}
          if (optionSelected.value.length > 0) {
            var performance = optionSelected.value.find((obj) => {
              return obj.ID === 1
            })
            var weightedAverageComparison = optionSelected.value.find((obj) => {
              return obj.ID === 2
            })
            var implicit = optionSelected.value.find((obj) => {
              return obj.ID === 3
            })
            var includeCurrent = optionSelected.value.find((obj) => {
              return obj.ID === 4
            })
            var finra = optionSelected.value.find((obj) => {
              return obj.ID === 5
            })
            options = {
              performance: performance !== null && performance !== undefined ? true : false,
              weightedAverageComparison:
                weightedAverageComparison !== null && weightedAverageComparison !== undefined ? true : false,
              implicit: implicit ? true : false,
              includeCurrent: includeCurrent ? true : false,
              finra: finra !== null && finra !== undefined ? true : false,
              proposalPlanID: proposalPlanID.value,
              proposalID: planProposalID.value
            }
          }
          advisorplan.value.PlanID = props.planID
          advisorplan.value.AdvisorID = $store.state.user.id
          advisorplan.value.implicit = implicit ? true : false
          advisorplan.value.includeCurrent = includeCurrent ? true : false
          await $axios.put(`/api/v1/diagnostic/advisor/modelfund`, advisorplan.value)
          emit('includeOptionSelected', options)
        }
        if (showInvestmentWeight.value === true) {
          updateWeights()
          updateHoldings()
          createWeightedPlan()
        }
        oldSelected.value = selected.value.slice(0)
        oldSelectedFund.value = selectedFund.value.slice(0)
        oldSelectedOptions.value = optionSelected.value
      }
    }
    const saveProposalModelInvestment = async () => {
      saveProposalModel(false)
      props.getModelId()
      modelFundObject.value.modelsCount = selected.value.length
      modelFundObject.value.fundsCount = fundInvestmentList.value.length
      oldSelected.value = selected.value.slice(0)
      modelFundMsg.value = ''
      emit('modelfundDetails', modelFundObject.value, 'Save')
      oldFundInvestmentList.value = fundInvestmentList.value.slice(0)
    }
    const saveProposalModel = async (val) => {
      if (val) saveLoading.value = true
      var models = selected.value.map((a) => a.ModelID)
      var success = await $axios.put(`/api/v1/tal/proposal/${props.planID}/models`, models)
      if (success.data.message === null) {
        $axios
          .get(`/api/v1/tal/proposal/${props.planID}/advisor/models`)
          .then((success) => {
            if (success.data.d !== null) {
              modelSelected.value = success.data.d.filter(function (n) {
                return n.Selected !== 0
              })
              if (val) {
                oldSelected.value = selected.value.slice(0)
                modelFundObject.value.modelsCount = selected.value.length
                emit('modelfundDetails', modelFundObject.value, 'Save')
                props.getModelId()
              }
            }
          })
          .finally(() => {
            saveLoading.value = false
          })
      }
    }
    function resetModel() {
      modelName.value = ''
      modelID.value = 0
      modelDescription.value = ''
      modelInvestmentList.value = []
      modelFundMsg.value = ''
      emit('showModelCount', true)
      modelfunderror.value = false
      modelDialog.value = false
    }
    function resetFund() {
      fundName.value = ''
      fundID.value = 0
      fundDescription.value = ''
      fundInvestmentList.value = []
      fundDialog.value = false
      modelFundMsg.value = ''
      modelfunderror.value = false
      emit('showModelCount', true)
    }
    function showModelDialog() {
      resetModel()
      modelDialog.value = true
      modelfunderror.value = false
      modelMessage.value = ''
      emit('showModelCount', false)
    }
    function showFundDialog() {
      resetFund()
      fundDialog.value = true
      fundEditable.value = false
      modelfunderror.value = false
      modelFundMsg.value = ''
      emit('showModelCount', false)
    }
    function getProposalPlanModelInvestments(isStepper) {
      if (planProposalID.value !== 0 && props.planID !== 0) {
        $axios
          .get(`/api/v1/tal/proposal/${props.planID}/advisor/models`)
          .then((success) => {
            if (success.data.d !== null) {
              currentModelList.value = success.data.d.length > 0 ? success.data.d : []
              selected.value = currentModelList.value.filter(function (n) {
                return n.Selected !== 0
              })
              modelSelected.value = currentModelList.value.filter(function (n) {
                return n.Selected !== 0
              })
            }
            if (isStepper) {
              oldSelected.value = selected.value.slice(0)
              successLoad.value = true
            }
          })
          .catch(() => {
            successLoad.value = true
          })
      }
      props.getModelId()
    }
    function getProposalPlanInvestments(isStepper) {
      if (planProposalID.value !== 0 && props.planID !== 0) {
        $axios
          .get(`/api/v1/tal/proposal/${props.planID}/investments`)
          .then((success) => {
            if (success.data.d !== null) {
              fundInvestmentList.value = success.data.d.length > 0 ? success.data.d : []
              if (fundInvestmentList.value.length) {
                fundInvestmentList.value.forEach((element, index) => {
                  element.index = index + 1
                  element.mgmt = element.mgmt * 100
                  element.tload = element.tload * 100
                  element.SubTA = element.SubTA * 100
                  element.expratio = element.expratio * 100
                })
              }
              emit('selectedFundList', fundInvestmentList.value)
            }
            if (isStepper) {
              successLoad.value = true
              oldFundInvestmentList.value = fundInvestmentList.value.slice(0)
            }
          })
          .catch(() => {
            successLoad.value = true
          })
      }
    }
    function addLoadInvestmentFromFund(fundItem) {
      $axios.post(`/api/v1/tal/proposal/${props.planID}/fund/${fundItem.ListID}/investments`).then((success) => {
        if (success.data.message == null) {
          getProposalPlanInvestments(false)
          var count = success.data.d
          $toast?.destroy()
          $toast.success(`Fund Investments  ${count}  added and loaded successfully`, '')
          proposalFund.value = ''
          disableAdd.value = false
        }
      })
    }
    function getProposalPlanID() {
      if (planProposalID.value !== 0 && !proposalPlanID.value) {
        $axios.get(`/api/v1/tal/proposal/id?seinpno=${planProposalID.value}`).then((success) => {
          if (success.data.d !== null) {
            proposalPlanID.value = success.data.d
            if (props.reports === 'RPEA') getAdvisorPlan()
          }
        })
      }
    }
    function getAdvisorPlan() {
      $axios.get(`/api/v1/plan/${props.planID}`).then((success) => {
        advisorplan.value = success.data.d
        if (success.data.d !== null) {
          if (optionList.value.length > 0) {
            if (success.data.d.implicit === true) {
              var implicit = optionList.value.find((obj) => {
                return obj.ID === 3
              })
              if (implicit !== null && implicit !== undefined) {
                if (!optionSelected.value.some((a) => a.ID === 3)) {
                  optionSelected.value.push(implicit)
                }
              }
            }
            if (success.data.d.includeCurrent === true) {
              var includeCurrent = optionList.value.find((obj) => {
                return obj.ID === 4
              })
              if (includeCurrent !== null && includeCurrent !== undefined) {
                if (!optionSelected.value.some((a) => a.ID === 4)) {
                  optionSelected.value.push(includeCurrent)
                }
              }
            }
            oldSelectedOptions.value = optionSelected.value
            var options = {
              performance: true,
              weightedAverageComparison: false,
              implicit: implicit ? true : false,
              includeCurrent: includeCurrent ? true : false,
              finra: false,
              proposalPlanID: proposalPlanID.value,
              proposalID: planProposalID.value
            }
            emit('includeOptionSelected', options)
          }
        }
      })
    }
    function showWeightAverage() {
      if (optionSelected.value) var investmentWeight = optionSelected.value.find((a) => a.ID === 2)
      if (investmentWeight) {
        if (selected.value.length === 0 && selectedFund.value.length === 0) {
          var checkedArray = []
          optionSelected.value.forEach((element) => {
            if (element.ID !== 2) checkedArray.push(element)
          })
          $toast?.destroy()
          $toast.error('Please select your proposed investments in order to continue', '')
          return (optionSelected.value = checkedArray)
        }
        var holdings = {
          models: selected.value.map((a) => a.ModelID),
          funds: selectedFund.value.map((a) => a.ListID)
        }
        $axios.put(`/api/v1/tal/proposal/${planProposalID.value}/holdings`, holdings).then(() => {
          saveProposedWeight()
        })
        showInvestmentWeight.value = true
        loadProposedModel.value = true
        loadCurrentWeight.value = true
        loadProposedFund.value = true
      } else {
        showInvestmentWeight.value = false
        loadProposedModel.value = false
        loadCurrentWeight.value = false
        loadProposedFund.value = false
      }
    }
    function getCurrentWeight() {
      var totalCurrentWeight = 0
      $axios
        .get(`/api/v1/weights/currentmenu/${props.planID}`)
        .then((success) => {
          var currentWeight = success.data.d
          for (var i = 0; i < currentWeight.length; i++) {
            currentWeight[i].newWeight = parseFloat(parseFloat(parseFloat(currentWeight[i].Weight) * 100).toFixed(2))
            currentWeight[i].Weight = parseFloat(parseFloat(currentWeight[i].Weight).toFixed(4))
            currentWeight[i].Dollar = 0
            totalCurrentWeight += parseFloat(currentWeight[i].newWeight)
          }
          currentWeightList.value = currentWeight
          totalCurrentWeightPercentage.value = parseFloat(parseFloat(totalCurrentWeight).toFixed(2))
        })
        .finally(() => {
          loadCurrentWeight.value = false
        })
    }
    const getProposedModelandFund = async () => {
      var totalModelWeight = 0
      var totalFundWeight = 0
      var proposedWeightPromises = []
      proposedWeightPromises.push(
        $axios
          .get(`/api/v1/weights/proposedmenu/model/${planProposalID.value}`)
          .then((success) => {
            var proposedModel = success.data.d
            for (var i = 0; i < proposedModel.length; i++) {
              proposedModel[i].newWeight = parseFloat(parseFloat(parseFloat(proposedModel[i].Weight) * 100).toFixed(2))
              proposedModel[i].Weight = parseFloat(parseFloat(proposedModel[i].Weight).toFixed(4))
              proposedModel[i].Dollar = 0
              totalModelWeight += parseFloat(proposedModel[i].newWeight)
            }
            proposedModelList.value = proposedModel
          })
          .finally(() => {
            loadProposedModel.value = false
          })
      )
      proposedWeightPromises.push(
        $axios
          .get(`/api/v1/weights/proposedmenu/fund/${planProposalID.value}`)
          .then((success) => {
            var proposedFund = success.data.d
            for (var i = 0; i < proposedFund.length; i++) {
              proposedFund[i].newWeight = parseFloat(parseFloat(parseFloat(proposedFund[i].Weight) * 100).toFixed(2))
              proposedFund[i].Weight = parseFloat(parseFloat(proposedFund[i].Weight).toFixed(4))
              proposedFund[i].Dollar = 0
              totalFundWeight += parseFloat(proposedFund[i].newWeight)
            }
            proposedFundList.value = proposedFund
          })
          .finally(() => {
            loadProposedFund.value = false
          })
      )
      await Promise.allSettled(proposedWeightPromises)
      totalProposedWeightPercentage.value =
        parseFloat(parseFloat(totalFundWeight).toFixed(2)) + parseFloat(parseFloat(totalModelWeight).toFixed(2))
    }
    function createWeightedPlan() {
      $axios.post(`/api/v1/weights/holding/${props.planID * -1}`)
    }
    const saveProposedWeight = async () => {
      var promise = []
      promise.push($axios.post(`/api/v1/weights/proposedmenu/model/${planProposalID.value}`))
      promise.push($axios.post(`/api/v1/weights/proposedmenu/fund/${planProposalID.value}`))
      await Promise.allSettled(promise)
      getCurrentWeight()
      getProposedModelandFund()

      var success = await $axios.get(`/api/v1/proposal/${planProposalID.value}`)
      var idString = success.data.d !== null ? (success.data.d.length > 0 ? success.data.d[0].IDString : '') : ''
      $axios.post(`/api/v1/proposal/${planProposalID.value}/${idString}`)
    }
    const currentWeightPercent = (itemData, table) => {
      modelFundMsg.value = ''
      if (itemData.newWeight) {
        if (isNaN(parseFloat(itemData.newWeight))) {
          itemData.newWeight = 0
          itemData.Weight = 0
        }
        if (parseFloat(itemData.newWeight) <= 0) {
          $toast?.destroy()
          $toast.error('Weight should be greater then zero', '')
          return
        }
        if (parseFloat(itemData.newWeight) > 100) {
          $toast?.destroy()
          $toast.error('Weight should be less then 100', '')
          return
        }

        var weight = parseFloat(itemData.newWeight) > 0 ? parseFloat(itemData.newWeight) / 100 : 0
        itemData.Weight = parseFloat(parseFloat(weight).toFixed(4))

        if (table === 'CurrentMenu') {
          var sumPercentage = 0
          for (var i = 0; i < currentWeightList.value.length; i++) {
            sumPercentage += !(currentWeightList.value[i].newWeight === -999)
              ? parseFloat(parseFloat(currentWeightList.value[i].newWeight).toFixed(2))
              : Number(0)
          }
          totalCurrentWeightPercentage.value = parseFloat(parseFloat(sumPercentage).toFixed(2))
        } else {
          var modelPercentage = 0
          var fundPercentage = 0
          for (var j = 0; j < proposedModelList.value.length; j++) {
            modelPercentage += !(proposedModelList.value[j].newWeight === -999)
              ? parseFloat(parseFloat(proposedModelList.value[j].newWeight).toFixed(2))
              : Number(0)
          }
          for (var k = 0; k < proposedFundList.value.length; k++) {
            fundPercentage += !(proposedFundList.value[k].newWeight === -999)
              ? parseFloat(parseFloat(proposedFundList.value[k].newWeight).toFixed(2))
              : Number(0)
          }
          totalProposedWeightPercentage.value =
            parseFloat(parseFloat(modelPercentage).toFixed(2)) + parseFloat(parseFloat(fundPercentage).toFixed(2))
        }
        return itemData
      } else return 0
    }
    const currentWeightDollar = (itemData, table) => {
      if (isNaN(parseFloat(itemData.Dollar))) itemData.Dollar = 0
      modelFundMsg.value = ''
      if (table === 'CurrentMenu') {
        var sumDollar = 0
        for (var i = 0; i < currentWeightList.value.length; i++) {
          sumDollar += !(currentWeightList.value[i].Dollar === '')
            ? parseFloat(parseFloat(currentWeightList.value[i].Dollar).toFixed(2))
            : Number(0)
        }
        totalCurrentWeightDollar.value = parseFloat(parseFloat(sumDollar).toFixed(2))
        updateCurrentPercent()
      } else {
        var modelDollar = 0
        var fundDollar = 0
        for (var j = 0; j < proposedModelList.value.length; j++) {
          modelDollar += !(proposedModelList.value[j].Dollar === '')
            ? parseFloat(parseFloat(proposedModelList.value[j].Dollar).toFixed(2))
            : Number(0)
        }
        for (var k = 0; k < proposedFundList.value.length; k++) {
          fundDollar += !(proposedFundList.value[k].Dollar === '')
            ? parseFloat(parseFloat(proposedFundList.value[k].Dollar).toFixed(2))
            : Number(0)
        }
        totalProposedWeightDollar.value =
          parseFloat(parseFloat(modelDollar).toFixed(2)) + parseFloat(parseFloat(fundDollar).toFixed(2))
        updateProposedPercent()
      }
    }
    function updateCurrentPercent() {
      var currentPercentList = currentWeightList.value
      var sumPercentage = 0
      for (var i = 0; i < currentPercentList.length; i++) {
        var weight = (parseFloat(currentPercentList[i].Dollar) / parseFloat(totalCurrentWeightDollar.value)) * 100
        if (isNaN(weight)) {
          currentPercentList[i].Weight = 0
          currentPercentList[i].newWeight = 0
        } else {
          let currentWeight = parseFloat(weight) > 0 ? parseFloat(parseFloat(weight).toFixed(4)) / 100 : 0
          currentPercentList[i].Weight = parseFloat(parseFloat(currentWeight).toFixed(4))
          currentPercentList[i].newWeight = parseFloat(parseFloat(weight).toFixed(2))
        }
        sumPercentage += !(currentPercentList[i].newWeight === -999)
          ? parseFloat(parseFloat(currentPercentList[i].newWeight).toFixed(2))
          : Number(0)
      }
      currentWeightList.value = currentPercentList
      totalCurrentWeightPercentage.value = parseFloat(parseFloat(sumPercentage).toFixed(2))
    }
    function updateProposedPercent() {
      var proposedModelPercentList = proposedModelList.value
      var proposedFundPercentList = proposedFundList.value
      var sumModelPercentage = 0
      var sumFundPercentage = 0
      for (var i = 0; i < proposedModelPercentList.length; i++) {
        var proposedWeight = (parseFloat(proposedModelPercentList[i].Dollar) / parseFloat(totalProposedWeightDollar.value)) * 100
        if (isNaN(proposedWeight)) {
          proposedModelPercentList[i].Weight = 0
          proposedModelPercentList[i].newWeight = 0
        } else {
          let proposedWeightOld = parseFloat(proposedWeight) > 0 ? parseFloat(parseFloat(proposedWeight).toFixed(4)) / 100 : 0
          proposedModelPercentList[i].Weight = parseFloat(parseFloat(proposedWeightOld).toFixed(4))

          proposedModelPercentList[i].newWeight = parseFloat(parseFloat(proposedWeight).toFixed(2))
        }
        sumModelPercentage += !(proposedModelPercentList[i].newWeight === -999)
          ? parseFloat(parseFloat(proposedModelPercentList[i].newWeight).toFixed(2))
          : Number(0)
      }
      for (var j = 0; j < proposedFundPercentList.length; j++) {
        var proposedWeight1 = (parseFloat(proposedFundPercentList[j].Dollar) / parseFloat(totalProposedWeightDollar.value)) * 100
        if (isNaN(proposedWeight1)) {
          proposedFundPercentList[j].Weight = 0
          proposedFundPercentList[j].newWeight = 0
        } else {
          let proposedFundWeightOld =
            parseFloat(proposedWeight1) > 0 ? parseFloat(parseFloat(proposedWeight1).toFixed(4)) / 100 : 0
          proposedFundPercentList[j].Weight = parseFloat(parseFloat(proposedFundWeightOld).toFixed(4))
          proposedFundPercentList[j].newWeight = parseFloat(parseFloat(proposedWeight1).toFixed(2))
        }
        sumFundPercentage += !(proposedFundPercentList[j].newWeight === -999)
          ? parseFloat(parseFloat(proposedFundPercentList[j].newWeight).toFixed(2))
          : Number(0)
      }
      proposedModelList.value = proposedModelPercentList
      proposedFundList.value = proposedFundPercentList
      totalProposedWeightPercentage.value =
        parseFloat(parseFloat(sumModelPercentage).toFixed(2)) + parseFloat(parseFloat(sumFundPercentage).toFixed(2))
    }
    const updateHoldings = () => {
      $axios.get(`/api/v1/weights/merge/${planProposalID.value}/${proposalPlanID.value}`)
    }
    function updateWeights() {
      if (proposedModelList.value.length > 0) {
        $axios.post(`/api/v1/weights/model`, proposedModelList.value)
      }
      if (proposedFundList.value.length > 0) {
        $axios.post(`/api/v1/weights/fund`, proposedFundList.value)
      }
      if (currentWeightList.value.length > 0) {
        $axios.post(`/api/v1/diagnostic/plan/${props.planID}/investments`, currentWeightList.value)
      }
    }
    function compareModelFundList() {
      if (!Object.compare(selected.value, oldSelected.value) || !Object.compare(selectedFund.value, oldSelectedFund.value)) {
        return true
      } else return false
    }
    function compareProposalInvestment() {
      if (
        !Object.compare(selected.value, oldSelected.value) ||
        !Object.compare(fundInvestmentList.value, oldFundInvestmentList.value)
      ) {
        return true
      } else return false
    }
    const formatPrice = (value, digitValue) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digitValue,
        maximumFractionDigits: digitValue
      })
      return formatter.format(value)
    }
    function validateModelFundList() {
      if (showInvestmentWeight.value === true) {
        if (parseFloat(totalCurrentWeightPercentage.value) !== 100) {
          $toast?.destroy()
          $toast.error('Total Current Weighted Percentage should be 100 %', '')
          return false
        }
        if (parseFloat(totalProposedWeightPercentage.value) !== 100) {
          $toast?.destroy()
          $toast.error('Total Proposed Weighted Percentage should be 100 %', '')
          return false
        }
        modelFundMsg.value = ''
        return true
      } else return true
    }
    function checkModelName() {
      if (modelName.value !== '') {
        modelfunderror.value = false
        modelMessage.value = ''
      }
    }
    function checkFundName() {
      if (fundName.value !== '') {
        modelfunderror.value = false
        modelFundMsg.value = ''
      }
    }
    const finalModelPercent = computed(() => {
      var finalPercent = 0
      for (var i = 0; i < modelInvestmentList.value.length; i++) {
        finalPercent += !(modelInvestmentList.value[i].Amount === -999) ? Number(modelInvestmentList.value[i].Amount) : Number(0)
      }
      return parseFloat(finalPercent).toFixed(2)
    })
    const showModel = computed(() => {
      return $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)
    })
    const showFund = computed(() => {
      return $authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full)
    })
    watch(
      () => planProposalID.value,
      async () => {
        if (planProposalID.value) {
          await getPlanFunds(true)
          if (props.reports === 'Proposal') {
            getProposalPlanModelInvestments(true)
            getProposalPlanInvestments(true)
          } else {
            getPlanModels(true)
            getProposalPlanID()
          }
        }
      }
    )
    watch(
      () => modelName.value,
      () => {
        if (modelDialog.value && modelName.value === '') modelfunderror.value = true
        else modelfunderror.value = false
      }
    )
    watch(
      () => fundName.value,
      () => {
        if (fundDialog.value && fundName.value === '') modelfunderror.value = true
        else modelfunderror.value = false
      }
    )
    watch(
      () => successLoad.value,
      (val) => {
        if (val) {
          modelFundObject.value.modelsCount = 0
          modelFundObject.value.fundsCount = 0
          modelFundObject.value.CurrentmodelsCount = 0
          modelFundObject.value.CurrentfundsCount = 0
          successLoad.value = false
          if (props.reports === 'RPEA') {
            if (currentModelList.value.length > 0 || currentFundList.value.length > 0) {
              if (currentModelList.value.length > 0 && currentFundList.value.length > 0) {
                modelFundObject.value.modelsCount = selected.value.length
                modelFundObject.value.fundsCount = selectedFund.value.length
                modelFundObject.value.CurrentmodelsCount = currentModelList.value.length
                modelFundObject.value.CurrentfundsCount = currentFundList.value.length
              } else if (currentModelList.value.length > 0 && currentFundList.value.length === 0) {
                modelFundObject.value.modelsCount = selected.value.length
                modelFundObject.value.fundsCount = 0
                modelFundObject.value.CurrentmodelsCount = currentModelList.value.length
                modelFundObject.value.CurrentfundsCount = 0
              } else if (currentFundList.value.length > 0 && currentModelList.value.length === 0) {
                modelFundObject.value.modelsCount = 0
                modelFundObject.value.fundsCount = selectedFund.value.length
                modelFundObject.value.CurrentmodelsCount = 0
                modelFundObject.value.CurrentfundsCount = currentFundList.value.length
              }
            }
            emit('modelfundDetails', modelFundObject.value, 'load')
          } else {
            modelFundObject.value.modelsCount = selected.value.length
            modelFundObject.value.fundsCount = fundInvestmentList.value.length
            emit('modelfundDetails', modelFundObject.value, 'load')
          }
        }
      }
    )
    watch(
      () => $route,
      () => {
        if ($route.params.id) {
          if ($route.query.planId !== undefined && $route.query.planId < 0) {
            planProposalID.value = 0
            getProposalID('load')
          }
        }
      }
    )
    watch(
      () => selected.value,
      (val) => {
        emit('selectedModelList', val)
      }
    )
    watch(
      () => selectedFund.value,
      (val) => {
        emit('selectedFundList', val)
      }
    )
    onMounted(() => {
      oldSelected.value = Object.assign([], selected.value)
      oldSelectedFund.value = Object.assign([], selectedFund.value)
      oldSelectedOptions.value = Object.assign({}, optionSelected.value)
      if (props.reports === 'RPEA') {
        planProposalID.value = 0
        getProposalID('load')
      }
    })
    return {
      theme,
      display,
      modelDialog,
      fundDialog,
      investmentLineupType,
      showModel,
      selected,
      currentModelHeaders,
      currentModelList,
      saveLoading,
      modelSelected,
      showFund,
      selectedFund,
      currentFundHeaders,
      currentFundList,
      optionSelected,
      optionHeader,
      optionList,
      proposalFund,
      fundInvestmentList,
      fundInvestment,
      proposalPlanID,
      planProposalID,
      fundEditable,
      showInvestmentWeight,
      currentWeightHeader,
      currentWeightList,
      loadCurrentWeight,
      formatPrice,
      proposedMenuHeader,
      proposedModelList,
      loadProposedModel,
      proposedFundList,
      loadProposedFund,
      fundName,
      modelfunderror,
      modelFundMsg,
      fundDescription,
      valid,
      modelName,
      modelMessage,
      modelDescription,
      modelID,
      modelInvestment,
      modelInvestmentList,
      asset,
      assetlist,
      hover,
      headers,
      currentModelDisableSort,
      currentFundDisableSort,
      currentLoader,
      modelLoader,
      investmentType,
      totalNewMgmt,
      totalNewLoad,
      totalNewSubta,
      totalNewExpratio,
      totalNewAMC,
      totalNewSSF,
      totalNewFees,
      planType,
      callProposalMethod,
      abondonModelFund,
      toggleModelAll,
      toggleFundAll,
      selectAllOption,
      saveProposalHoldings,
      saveProposalModelInvestment,
      compareModelFundList,
      compareProposalInvestment,
      validateModelFundList,
      saveProposalModel,
      showModelDialog,
      checkedChangeModal,
      editModel,
      showFundDialog,
      checkedChangeFund,
      editFund,
      showWeightAverage,
      checkFundList,
      addLoadInvestmentFromFund,
      getProposalPlanInvestments,
      updateInvestmentCount,
      currentWeightPercent,
      currentWeightDollar,
      parseFloat,
      checkFundName,
      saveFundInvestment,
      resetFund,
      checkModelName,
      saveModelInvestment,
      resetModel
    }
  }
}
</script>
