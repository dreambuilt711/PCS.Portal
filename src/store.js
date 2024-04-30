import { createStore } from 'vuex'
import moment from 'moment'
import axios from 'axios'

export default createStore({
  state: {
    user: {},
    isImpersonating: false,
    menu: {},
    starredPlansSearchRequest: {},
    finderList: {},
    planProspect: {},
    lowReturnPlans: {},
    planLowParticipate: {},
    benchmarks: {},
    planCount: 0,
    starredLivePlans: {},
    rbcTotalAssets: [],
    rbcModels: [],
    zipcode: 0,
    isIndividualCheck: true,
    school: 0,
    schoolDistricts: 0,
    clientInvestments: {},
    participantChange: {},
    cashFlowChange: [],
    clientCashFlow: [],
    clientNetCharges: 0,
    companyOnboarding: [],
    globalFilter: {},
    planProgress: [],
    isEmpSponsorCheck: true,
    isSchoolCheck: true,
    isMunicipalitiesCheck: true,
    isIndividualFinderCheck: true,
    clientOverview: [],
    theme: {},
    advisorAccountId: 0,
    advisorContactId: 0,
    advisorWebsiteCredentialId: 0,
    holdingoverviewChange: [],
    lastUpdatedBrand: {},
    avgAccountBalanceChange: [],
    defaultProgram: {},
    accountList: [],
    businessMatrix: [],
    individualOnboarding: [],
    clientPlan: {},
    disclosure: false,
    marketInsight: {},
    sitePreferences: {},
    planTypes: [],
    advisorSetFeeSchedule: [],
    advisorSetModel: [],
    advisorSetInvestment: [],
    contactPreferences: null,
    pipelineList: {},
    pipelinePlanSponsor: [],
    finderPlanType: [],
    finderSchoolFilter: {},
    finderEmploymentStatus: [],
    finderPlanStatus: [],
    planStatus: [],
    openAccountDetail: {},
    pipelineIndividualSponsor: [],
    advisorExportPermission: '',
    clientFilter: {},
    retirement: {},
    hidePendingReview: false,
    leadSearch: {},
    reportUri: '',
    showNotification: false,
    participantsContribution: {},
    participantsEnrollment: {},
    donutCenterDetails: {},
    planWidget: {},
    fund: [],
    model: [],
    starredResource: {},
    soloKOpenAccountDetail: {}
  },
  mutations: {
    setUser(state, value) {
      state.user = value
    },
    setMenu(state, value) {
      state.menu = value
    },
    setStarredPlans(state, value) {
      state.starredPlansSearchRequest = value
    },
    setStarredRbcPlans(state, value) {
      state.starredLivePlans = value
    },
    setRbcTotalAssets(state, value) {
      state.rbcTotalAssets = value
    },
    setRbcModels(state, value) {
      state.rbcModels = value
    },
    setClientInvestments(state, value) {
      state.clientInvestments = value
    },
    setParticipantChange(state, value) {
      state.participantChange = value
    },
    setCashFlow(state, value) {
      state.cashFlowChange = value
    },
    setCompanyOnboarding(state, value) {
      state.companyOnboarding = value
    },
    setIsImpersonating(state, value) {
      state.isImpersonating = value
    },
    setDefaultBranding(state, value) {
      state.defaultProgram = value
    },
    setClientOverview(state, value) {
      state.clientOverview = value
    },
    setHoldingOverview(state, value) {
      state.holdingoverviewChange = value
    },
    setAvgAccountBalance(state, value) {
      state.avgAccountBalanceChange = value
    },
    setFirms(state, value) {
      state.accountList = value
    },
    setBusinessMatrix(state, value) {
      state.businessMatrix = value
    },
    setPlanWidget(state, value) {
      state.planWidget = value
    },
    setIndividualOnboarding(state, value) {
      state.individualOnboarding = value
    },
    setDisclosure(state, value) {
      state.disclosure = value
    },
    setSitePreferences(state, value) {
      state.sitePreferences = value
    },
    setPlanTypes(state, value) {
      state.planTypes = value
    },
    setAdvisorSetFeeSchedule(state, value) {
      state.advisorSetFeeSchedule = value
    },
    setAdvisorSetModel(state, value) {
      state.advisorSetModel = value
    },
    setAdvisorSetInvestment(state, value) {
      state.advisorSetInvestment = value
    },
    setContactPreferences(state, value) {
      state.contactPreferences = value
    },
    setPipelinePlanSponsor(state, value) {
      state.pipelinePlanSponsor = value
    },
    setFinderPlanType(state, value) {
      state.finderPlanType = value
    },
    setFinderSchoolFilter(state, value) {
      state.finderSchoolFilter = value
    },
    setFinderEmploymentStatus(state, value) {
      state.finderEmploymentStatus = value
    },
    setFinderPlanStatus(state, value) {
      state.finderPlanStatus = value
    },
    setAdvisorPrintLogo(state, value) {
      var selectedProgram = state.user.selectedProgram
      if (selectedProgram) {
        if (selectedProgram.selectedAccount) {
          if (selectedProgram.selectedAccount.brand) {
            selectedProgram.selectedAccount.brand.print_Logo__c = value.request.responseURL
          } else selectedProgram.brand.print_Logo__c = value.request.responseURL
        } else {
          if (selectedProgram.brand) selectedProgram.brand.print_Logo__c = value.request.responseURL
        }
      }
    },
    setPipelineIndividualSponsor(state, value) {
      state.pipelineIndividualSponsor = value
    },
    setAdvisorExportPermission(state, value) {
      state.advisorExportPermission = value
    },
    setClientFilter(state, value) {
      state.clientFilter = value
    },
    setRetirementByAge(state, value) {
      state.retirement = value
    },
    setParticipantsContribution(state, value) {
      state.participantsContribution = value
    },
    setParticipantsEnrollment(state, value) {
      state.participantsEnrollment = value
    },
    setdonutCenterDetails(state, value) {
      state.donutCenterDetails = value
    },
    setModel(state, value) {
      state.model = value
    },
    setFund(state, value) {
      state.fund = value
    },
    setStarredResource(state, value) {
      state.starredResource = value
    }
  },
  actions: {
    getUser({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.user).length) {
          resolve()
        } else {
          axios.get('/api/v1/user').then(
            (success) => {
              commit('setUser', success.data)
              resolve()
            },
            (error) => {
              if (error.response) {
                if (error.response.status === 400 && error.response.data.redirectUrl) {
                  window.location.assign(error.response.data.redirectUrl)
                  return
                }
              }
              reject(error)
            }
          )
        }
      })
    },
    getIsImpersonating({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.isImpersonating).length) {
          resolve()
        } else {
          axios.get(`/api/v1/user/impersonation`).then(
            (success) => {
              commit('setIsImpersonating', success.data.isImpersonating)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getDefaultBranding({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.defaultProgram).length) {
          resolve()
        } else {
          axios.get(`/api/v1/program`).then(
            (success) => {
              commit('setDefaultBranding', success.data)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.menu).length) {
          resolve()
        } else {
          axios.get(`/api/v1/user/menu`).then(
            (success) => {
              commit('setMenu', success.data)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getStarredPlans({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.starredPlansSearchRequest).length) {
          resolve()
        } else {
          axios.get(`/api/v1/tal/plan/searchrequests`).then(
            (success) => {
              var starredIndex = success.data.findIndex((i) => i.searchName === 'Starred')
              var starredPlans = {
                createdOn: new Date(),
                id: null,
                platformId: null,
                planSearchRequest: {
                  einList: [],
                  schoolIdList: [],
                  houseHoldIdList: [],
                  municipalIdList: [],
                  churchIdList: [],
                  taxExemptIdList: [],
                  favoriteIdList: []
                },
                schoolSearchRequest: {},
                individualSearchRequest: {
                  equityAllocation: 0
                }
              }
              if (starredIndex > -1) starredPlans = success.data[starredIndex]
              if (starredPlans.planSearchRequest === null) {
                starredPlans.planSearchRequest = {
                  einList: [],
                  schoolIdList: [],
                  houseHoldIdList: [],
                  municipalIdList: [],
                  churchIdList: [],
                  taxExemptIdList: [],
                  favoriteIdList: []
                }
              }
              if (starredPlans.schoolSearchRequest === null) starredPlans.schoolSearchRequest = {}
              if (starredPlans.individualSearchRequest === null) {
                starredPlans.individualSearchRequest = {
                  equityAllocation: 0
                }
              }
              if (starredPlans.planSearchRequest.einList === null) {
                starredPlans.planSearchRequest.einList = []
              }
              if (starredPlans.planSearchRequest.schoolIdList === null) {
                starredPlans.planSearchRequest.schoolIdList = []
              }
              if (starredPlans.planSearchRequest.houseHoldIdList === null) {
                starredPlans.planSearchRequest.houseHoldIdList = []
              }
              if (starredPlans.planSearchRequest.municipalIdList === null) {
                starredPlans.planSearchRequest.municipalIdList = []
              }
              if (starredPlans.planSearchRequest.churchIdList === null) {
                starredPlans.planSearchRequest.churchIdList = []
              }
              if (starredPlans.planSearchRequest.taxExemptIdList === null) {
                starredPlans.planSearchRequest.taxExemptIdList = []
              }
              if (starredPlans.planSearchRequest.favoriteIdList === null) {
                starredPlans.planSearchRequest.favoriteIdList = []
              }
              commit('setStarredPlans', starredPlans)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getStarredRbcPlans({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.starredLivePlans).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/retention/rbc/plan/searchrequests`).then(
              (success) => {
                var starredIndex = success.data.findIndex((i) => i.searchName === 'Starred')
                var starredPlan = {
                  planList: [],
                  schoolList: [],
                  individualList: [],
                  participantList: [],
                  municipalitiesList: []
                }
                if (starredIndex > -1) starredPlan = success.data[starredIndex]
                if (!starredPlan.planList) {
                  starredPlan.planList = []
                }
                if (!starredPlan.schoolList) {
                  starredPlan.schoolList = []
                }
                if (!starredPlan.individualList) {
                  starredPlan.individualList = []
                }
                if (!starredPlan.municipalitiesList) {
                  starredPlan.municipalitiesList = []
                }
                if (!starredPlan.participantList) {
                  starredPlan.participantList = []
                }
                commit('setStarredRbcPlans', starredPlan)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getRbcTotalAssetsAndModels({ commit, state }) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(async (resolve, reject) => {
        if (Object.keys(state.rbcTotalAssets).length) {
          resolve()
        } else {
          var promises = []
          var rbcassets = []
          var tsmassets = []
          var rbcmodel = []
          var tsmmodel = []
          if (state.user.reliusLoginId) {
            promises.push(
              axios.get('/api/v1/retention/rbc/assets/3').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  rbcassets.push({
                    value: amount,
                    date: moment().subtract(12, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get(`/api/v1/retention/rbc/assets/2`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  rbcassets.push({
                    value: amount,
                    date: moment().subtract(6, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get(`/api/v1/retention/rbc/assets/1`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  rbcassets.push({
                    value: amount,
                    date: moment().subtract(3, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get(`/api/v1/retention/rbc/assets/4`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  rbcassets.push({
                    value: amount,
                    date: moment().subtract(1, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get(`/api/v1/retention/rbc/assets/0`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  rbcmodel = success.data.d
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  rbcassets.push({
                    value: amount,
                    date: moment().format('YYYY-MM') + '-01'
                  })
                }
              })
            )
          }
          if (state.user.tsmLoginId) {
            promises.push(
              axios.get('/api/v1/retention/tsm/assets/3').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  tsmassets.push({
                    value: amount,
                    date: moment().subtract(12, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get('/api/v1/retention/tsm/assets/2').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  tsmassets.push({
                    value: amount,
                    date: moment().subtract(6, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get('/api/v1/retention/tsm/assets/1').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  tsmassets.push({
                    value: amount,
                    date: moment().subtract(3, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get('/api/v1/retention/tsm/assets/4').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  tsmassets.push({
                    value: amount,
                    date: moment().subtract(1, 'months').format('YYYY-MM') + '-01'
                  })
                }
              })
            )
            promises.push(
              axios.get(`/api/v1/retention/tsm/assets/0`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  tsmmodel = success.data.d
                  var amount = 0
                  success.data.d.forEach((element) => {
                    amount = amount + element.DollarAmount
                  })
                  tsmassets.push({
                    value: amount,
                    date: moment().format('YYYY-MM') + '-01'
                  })
                }
              })
            )
          }
          await Promise.allSettled(promises)

          if (rbcassets.length > 0 && tsmassets.length > 0) {
            rbcassets.forEach((element, index) => {
              element = element + tsmassets[index]
            })
          }

          if (rbcassets.length === 0 && tsmassets.length > 0) {
            rbcassets = tsmassets
          }
          if (rbcmodel.length > 0 && tsmmodel.length > 0) {
            rbcmodel.forEach((element, index) => {
              element = element + tsmmodel[index]
            })
          }
          if (rbcmodel.length === 0 && tsmmodel.length > 0) {
            rbcmodel = tsmmodel
          }
          commit('setRbcTotalAssets', rbcassets)
          commit('setRbcModels', rbcmodel)
          resolve()
        }
      })
    },
    getClientInvestments({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.clientInvestments).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/clientinvestments`).then(
              (success) => {
                commit('setClientInvestments', success.data)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getParticipantsData({ commit, state }) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(async (resolve, reject) => {
        if (Object.keys(state.participantChange).length) {
          resolve()
        } else {
          var rbcParticipantData = []
          var tsmParticipantData = []
          var promises = []
          if (state.user.reliusLoginId) {
            promises.push(
              axios.get('/api/v1/retention/rbc/participation/0').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  rbcParticipantData = success.data.d
                }
              })
            )
          }
          if (state.user.tsmLoginId) {
            promises.push(
              axios.get(`/api/v1/retention/tsm/participation/0`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  tsmParticipantData = success.data.d
                }
              })
            )
          }
          const result = await Promise.allSettled(promises)
          var successParticipantCount = result.filter((x) => x.status === 'fulfilled')
          if (successParticipantCount.length === 0) {
            reject()
            return
          }

          if (rbcParticipantData.length > 0 && tsmParticipantData.length > 0) {
            rbcParticipantData.forEach((element, index) => {
              element.Number = element.Number + tsmParticipantData[index].Number
            })
          }
          var participant = rbcParticipantData
          commit('setParticipantChange', participant)
          resolve()
        }
      })
    },
    getCashFlowData({ commit, state }) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(async (resolve, reject) => {
        if (Object.keys(state.cashFlowChange).length) {
          resolve()
        } else {
          var rbcCashFlowData = []
          var tsmCashFlowData = []
          var cashFlowPromises = []
          if (state.user.reliusLoginId) {
            cashFlowPromises.push(
              axios.get('/api/v1/retention/rbc/cashflowsum/0').then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  rbcCashFlowData = success.data.d
                }
              })
            )
          }
          if (state.user.tsmLoginId) {
            cashFlowPromises.push(
              axios.get(`/api/v1/retention/tsm/cashflowsum/0`).then((success) => {
                if (success.data.d !== null && success.data.d.length > 0) {
                  tsmCashFlowData = success.data.d
                }
              })
            )
          }
          var cashflowResult = await Promise.allSettled(cashFlowPromises)
          var successCount = cashflowResult.filter((x) => x.status === 'fulfilled')
          if (successCount.length === 0) {
            reject()
            return
          }
          var cashFlowSum = []
          if (rbcCashFlowData.length > 0 && tsmCashFlowData.length === 0) {
            cashFlowSum = rbcCashFlowData
          } else if (tsmCashFlowData.length > 0 && rbcCashFlowData.length === 0) {
            cashFlowSum = tsmCashFlowData
          } else {
            cashFlowSum = rbcCashFlowData
          }
          commit('setCashFlow', cashFlowSum)
          resolve()
        }
      })
    },
    getCompanyOnboarding({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.companyOnboarding).length) {
          resolve()
        } else {
          axios.get(`/api/v1/tal/advisor/wins/plans/3`).then(
            (success) => {
              var companyOnBoard = success.data.d && success.data.d.length > 0 ? success.data.d : []
              commit('setCompanyOnboarding', companyOnBoard)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getClientOverview({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.clientOverview).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/clientoverview`).then(
              (success) => {
                commit('setClientOverview', success.data.d)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getHoldingsOverview({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.holdingoverviewChange).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/holdingoverview`).then(
              (success) => {
                var rbcHoldingoverviewData = success.data.d && success.data.d.length > 0 ? success.data.d : []
                commit('setHoldingOverview', rbcHoldingoverviewData)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getAccountBalance({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.avgAccountBalanceChange).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/averageaccountbalancebyage`).then(
              (success) => {
                var avgAccountBalanceList = {
                  averageAccountBalanceByAgeData: [],
                  yearsData: []
                }
                if (success.data.d) {
                  avgAccountBalanceList.averageAccountBalanceByAgeData = success.data.d.length > 0 ? success.data.d : []
                  avgAccountBalanceList.yearsData = []
                }
                commit('setAvgAccountBalance', avgAccountBalanceList)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getRetirementByAge({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.retirement).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/participantsretirementage`).then(
              (success) => {
                var retirement = success.data.d ? success.data.d : {}
                commit('setRetirementByAge', retirement)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getPlanWidget({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.planWidget).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/plan/overview`).then(
              (success) => {
                let planList = success.data.d ? success.data.d : {}
                commit('setPlanWidget', planList)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getBusinessMatrix({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.businessMatrix).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/businessMatrix`).then(
              (success) => {
                var businessMatrixList = success.data.d ? success.data.d : []
                commit('setBusinessMatrix', businessMatrixList)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getAccountList({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.accountList).length) {
          resolve()
        } else {
          var accounts = []
          axios.get(`/api/v1/program/accounts`).then(
            (success) => {
              if (success.data.d && success.data.d.length > 0) {
                accounts = success.data.d.map(function (element) {
                  return {
                    accountId: element.AccountId,
                    accountName: element.AccountName
                  }
                })
              }
              commit('setFirms', accounts)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getIndividualOnboarding({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.individualOnboarding).length) {
          resolve()
        } else {
          axios.get(`/api/v1/tal/advisor/wins/individuals/3?individual=${true}`).then(
            (success) => {
              var individualOnboard = success.data.d && success.data.d.length > 0 ? success.data.d : []
              commit('setIndividualOnboarding', individualOnboard)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getDisclosure({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.disclosure).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/disclosureAgreement`).then(
            (success) => {
              var disclosureValue = success.data.d !== null ? true : false
              commit('setDisclosure', disclosureValue)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getSitePreferences({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.sitePreferences).length) {
          resolve()
        } else {
          axios.get(`/api/v1/user/site/preferences`).then(
            (success) => {
              var sitePreferencesValue = success.data ? success.data : {}
              commit('setSitePreferences', sitePreferencesValue)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getPlanTypes({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.planTypes).length) {
          resolve()
        } else {
          axios.get(`/api/v1/program/plantypes`).then(
            (success) => {
              var planTypes = success.data.d ? success.data.d : []
              commit('setPlanTypes', planTypes)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getFeeSchedule({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.advisorSetFeeSchedule).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/setup/feeschedules`).then(
            (success) => {
              var feeSchedule = success.data.d && success.data.d.length > 0 ? success.data.d : []
              commit('setAdvisorSetFeeSchedule', feeSchedule)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getModel({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.advisorSetModel).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/setup/model`).then(
            (success) => {
              var model = success.data.d && success.data.d.length > 0 ? success.data.d : []
              commit('setAdvisorSetModel', model)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getInvestment({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.advisorSetInvestment).length) {
          resolve()
        } else {
          axios.get(`/api/v1/tal/proposal/0/funds`).then(
            (success) => {
              var investment = success.data.d && success.data.d.length > 0 ? success.data.d : []
              commit('setAdvisorSetInvestment', investment)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getContactPreferences({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.contactPreferences) {
          resolve()
        } else {
          axios.get(`/api/v1/user/contact/preferences`).then(
            (success) => {
              var preferences = {
                hideFirstTimeUX: false
              }
              if (success.data) {
                preferences.hideFirstTimeUX = success.data.hideFirstTimeUX
              }
              commit('setContactPreferences', preferences)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getPipelinePlanSponsor({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.pipelinePlanSponsor).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/prospects`).then(
            (success) => {
              commit('setPipelinePlanSponsor', success.data.d)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getFinderPlanType({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.finderPlanType).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/plantypefilters`).then(
            (success) => {
              var planTypeList =
                success.data.d && success.data.d.length > 0 ? success.data.d.filter((e) => e.PlanType !== null) : []
              commit('setFinderPlanType', planTypeList)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getFinderSchoolFilter({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.finderSchoolFilter).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/schoolfilters`).then(
            (success) => {
              var schoolFilter = {}
              schoolFilter.schoolTypeList =
                success.data.d.schoolType && success.data.d.schoolType.length > 0
                  ? success.data.d.schoolType.filter((e) => e.SchoolType !== null)
                  : []
              schoolFilter.tpaList =
                success.data.d.tpa && success.data.d.tpa.length > 0 ? success.data.d.tpa.filter((e) => e.TPA !== null) : []
              schoolFilter.payrollList =
                success.data.d.payrollSlot && success.data.d.payrollSlot.length > 0
                  ? success.data.d.payrollSlot.filter((e) => e.PayrollSlot !== null)
                  : []
              schoolFilter.payrollSlotNamesList =
                success.data.d.payrollSlotNames && success.data.d.payrollSlotNames.length > 0
                  ? success.data.d.payrollSlotNames.filter((e) => e.PayrollslotName !== null)
                  : []
              commit('setFinderSchoolFilter', schoolFilter)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getFinderEmploymentStatus({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.finderEmploymentStatus).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/individuals/EmploymentStatus/householdparticipantdetails`).then(
              (success) => {
                var employmentList =
                  success.data.d && success.data.d.length > 0 ? success.data.d.filter((e) => e.EmploymentStatus !== null) : []
                commit('setFinderEmploymentStatus', employmentList)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getFinderPlanStatus({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.finderPlanStatus).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/individuals/PlanStatus/householdparticipantdetails`).then(
              (success) => {
                var planStatusList =
                  success.data.d && success.data.d.length > 0 ? success.data.d.filter((e) => e.PlanStatus !== null) : []
                commit('setFinderPlanStatus', planStatusList)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getAdvisorPrintLogo({ commit, state }) {
      return new Promise((resolve, reject) => {
        var selectedRelationship = state.user.selectedProgram.selectedRelationship
        if (selectedRelationship) {
          if (selectedRelationship.fsgId) {
            axios.get(`/brandapi/GetCascade/${selectedRelationship.fsgId}`).then(
              (success) => {
                commit('setAdvisorPrintLogo', success)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getPipelineIndividualSponsor({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.pipelineIndividualSponsor).length) {
          resolve()
        } else {
          axios.get(`/api/v1/advisor/prospects?individual=${true}`).then(
            (success) => {
              commit('setPipelineIndividualSponsor', success.data.d)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getAdvisorExportDetail({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.advisorExportPermission).length) {
          resolve()
        } else {
          axios.get(`/api/v1/tal/advisor/export`).then(
            (success) => {
              var exportPermission = success.data.d ? success.data.d : ''
              commit('setAdvisorExportPermission', exportPermission)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    },
    getClientFilterValue({ commit, state }) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(async (resolve, reject) => {
        if (Object.keys(state.clientFilter).length) {
          resolve()
        } else {
          var promises = []
          var clientFilterList = {}
          if (state.user.reliusLoginId) {
            promises.push(
              axios.get('/api/v1/rbc/individuals/AccountType/householdparticipantdetails').then((success) => {
                clientFilterList.accountTypeList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/individuals/EmploymentStatus/householdparticipantdetails`).then((success) => {
                clientFilterList.employmentStatusList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/individuals/PlanName/householdparticipantdetails`).then((success) => {
                clientFilterList.planNameList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/individuals/PlanStatus/householdparticipantdetails`).then((success) => {
                clientFilterList.planStatusList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/companies/RelationshipManager/filter`).then((success) => {
                clientFilterList.relationshipManagerList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/companies/PlanYear/filter`).then((success) => {
                clientFilterList.planYearList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/companies/TPA/filter`).then((success) => {
                clientFilterList.tpaList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/companies/PlanType/filter`).then((success) => {
                clientFilterList.employeePlanList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
            promises.push(
              axios.get(`/api/v1/rbc/companies/SchoolDistrict/filter`).then((success) => {
                clientFilterList.schoolDistrictList = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
            )
          }
          await Promise.allSettled(promises)
          commit('setClientFilter', clientFilterList)
          resolve()
        }
      })
    },
    getParticipantsContributionData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.participantsContribution).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/contribution`).then(
              (success) => {
                var participantsContribution = success.data.d ? success.data.d : {}
                commit('setParticipantsContribution', participantsContribution)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getParticipantsEnrollmentData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.participantsEnrollment).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/enrollment`).then(
              (success) => {
                var participantsEnrollment = success.data.d ? success.data.d : {}
                commit('setParticipantsEnrollment', participantsEnrollment)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getInvestmentFundData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.fund).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/Fund/investment`).then(
              (success) => {
                let fund = success.data.d && success.data.d.length > 0 ? success.data.d : []
                commit('setFund', fund)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getInvestmentModelData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.model).length) {
          resolve()
        } else {
          if (state.user.reliusLoginId) {
            axios.get(`/api/v1/rbc/participant/Model/investment`).then(
              (success) => {
                let model = success.data.d && success.data.d.length > 0 ? success.data.d : []
                commit('setModel', model)
                resolve()
              },
              (error) => {
                reject(error)
              }
            )
          }
        }
      })
    },
    getStarredResource({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.starredResource).length) {
          resolve()
        } else {
          axios.get(`/api/v1/sfdc/resourcecenter/resource/searchrequests`).then(
            (success) => {
              let starredIndex = success.data.findIndex((i) => i.searchName === 'Starred')
              let starredResource = {
                documentList: [],
                documentGallery: []
              }
              if (starredIndex > -1) starredResource = success.data[starredIndex]
              if (!starredResource.documentList) {
                starredResource.documentList = []
              }
              if (!starredResource.documentGallery) {
                starredResource.documentGallery = []
              }
              commit('setStarredResource', starredResource)
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
        }
      })
    }
  }
})
