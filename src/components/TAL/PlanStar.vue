<template>
  <v-btn icon color="hyperlink" variant="text" @click="updateStarred()">
    <v-icon size="21" class="cursor-pointer icon-bookmark" :color="isStarred ? '#119944' : '#99CCEE'" />
  </v-btn>
</template>
<script>
import { ref, inject, getCurrentInstance, watch, onMounted } from 'vue'
export default {
  props: [
    'seinpno',
    'from',
    'callGetFavoritePlan',
    'schoolDistrictId',
    'householdId',
    'type',
    'prospectTab',
    'municipalId',
    'churchId',
    'taxExemptId'
  ],
  setup(props) {
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const einList = ref([])
    const savedStarredEINs = ref([])
    const isStarred = ref(false)
    const schoolIdList = ref([])
    const updateStarred = () => {
      if (props.from === 'TAL') {
        if (store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList === null) {
          store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList = []
        }
        if (props.seinpno) {
          var storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.einList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.einList.indexOf(props.seinpno)
              : -1
          if (storeIndex < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.einList.push(props.seinpno)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.einList.splice(storeIndex, 1)
            var storeProfitFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.seinpno)
                : -1
            if (storeProfitFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeProfitFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        //school points
        if (props.schoolDistrictId) {
          if (store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList === null) {
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList = []
          }
          var storeIndexSchool =
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.indexOf(props.schoolDistrictId)
              : -1
          if (storeIndexSchool < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.push(props.schoolDistrictId)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.schoolDistrictId)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.splice(storeIndexSchool, 1)
            var storeSchoolFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.schoolDistrictId)
                : -1
            if (storeSchoolFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeSchoolFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        //end
        //For individual
        if (props.householdId) {
          if (store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList === null) {
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList = []
          }
          var storeIndexIndividual =
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.indexOf(props.householdId)
              : -1
          if (storeIndexIndividual < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.push(props.householdId)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.householdId)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.splice(storeIndexIndividual, 1)
            var storeIndFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.householdId)
                : -1
            if (storeIndFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeIndFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        // end
        //For Municipal
        if (props.municipalId) {
          if (store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList === null) {
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList = []
          }
          var storeIndexMunicipal =
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.indexOf(props.municipalId)
              : -1
          if (storeIndexMunicipal < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.push(props.municipalId)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.municipalId)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.splice(storeIndexMunicipal, 1)
            var storeMunicipalFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.municipalId)
                : -1
            if (storeMunicipalFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeMunicipalFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        // end
        //For Church
        if (props.churchId) {
          if (store.state.starredPlansSearchRequest.planSearchRequest.churchIdList === null) {
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList = []
          }
          var storeIndexChurch =
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.indexOf(props.churchId)
              : -1
          if (storeIndexChurch < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.push(props.churchId)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.churchId)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.splice(storeIndexChurch, 1)
            var storeChurchFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.churchId)
                : -1
            if (storeChurchFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeChurchFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        // end
        //For Church
        if (props.taxExemptId) {
          if (store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList === null) {
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList = []
          }
          var storeIndexTaxExempt =
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.indexOf(props.taxExemptId)
              : -1
          if (storeIndexTaxExempt < 0) {
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.push(props.taxExemptId)
            store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.push(props.taxExemptId)
            isStarred.value = true
          } else {
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.splice(storeIndexTaxExempt, 1)
            var storeTaxFavIndex =
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
                ? store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.indexOf(props.taxExemptId)
                : -1
            if (storeTaxFavIndex > -1) {
              store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.splice(storeTaxFavIndex, 1)
            }
            isStarred.value = false
          }
        }
        // end
        if (props.prospectTab && props.prospectTab === '5') eventBus.emit('getStarredData')
        store.state.starredPlansSearchRequest.searchName = 'Starred'
        let starredSave = []
        starredSave.push(store.state.starredPlansSearchRequest)
        $axios.put(`/api/v1/tal/plan/searchrequests`, starredSave).then((success) => {
          if (!store.state.starredPlansSearchRequest.id) {
            store.state.starredPlansSearchRequest.id = success.data.id
            store.state.starredPlansSearchRequest.createdOn = success.data.createdOn
          }
        })
      } else if (props.from === 'ResourceCenter') {
        if (props.type === 'DocumentList') {
          var storeDocumentListIndex =
            store.state.starredResource.documentList.length > 0
              ? store.state.starredResource.documentList.indexOf(props.seinpno)
              : -1
          if (storeDocumentListIndex < 0) {
            store.state.starredResource.documentList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredResource.documentList.splice(storeDocumentListIndex, 1)
            isStarred.value = false
          }
        } else if (props.type === 'DocumentGallery') {
          var storeDocumentGalleryIndex =
            store.state.starredResource.documentGallery.length > 0
              ? store.state.starredResource.documentGallery.indexOf(props.seinpno)
              : -1
          if (storeDocumentGalleryIndex < 0) {
            store.state.starredResource.documentGallery.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredResource.documentGallery.splice(storeDocumentGalleryIndex, 1)
            isStarred.value = false
          }
        }
        store.state.starredResource.searchName = 'Starred'
        $axios.post(`/api/v1/sfdc/resourcecenter/resource/searchrequest/Starred`, store.state.starredResource).then((success) => {
          if (!store.state.starredResource.id) {
            store.state.starredResource.id = success.data.id
            store.state.starredResource.createdOn = success.data.createdOn
          }
        })
      } else {
        if (props.type === 'Employer Sponsored') {
          var storePlanIndex =
            store.state.starredLivePlans.planList.length > 0 ? store.state.starredLivePlans.planList.indexOf(props.seinpno) : -1
          if (storePlanIndex < 0) {
            store.state.starredLivePlans.planList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredLivePlans.planList.splice(storePlanIndex, 1)
            isStarred.value = false
          }
        } else if (props.type === 'School') {
          var storeSchoolIndex =
            store.state.starredLivePlans.schoolList.length > 0
              ? store.state.starredLivePlans.schoolList.indexOf(props.seinpno)
              : -1
          if (storeSchoolIndex < 0) {
            store.state.starredLivePlans.schoolList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredLivePlans.schoolList.splice(storeSchoolIndex, 1)
            isStarred.value = false
          }
        } else if (props.type === 'Municipality') {
          var storeMunicipalitiesIndex =
            store.state.starredLivePlans.municipalitiesList.length > 0
              ? store.state.starredLivePlans.municipalitiesList.indexOf(props.seinpno)
              : -1
          var storeMunicipalitiesIndex2 =
            store.state.starredLivePlans.planList.length > 0 ? store.state.starredLivePlans.planList.indexOf(props.seinpno) : -1
          if (storeMunicipalitiesIndex < 0) {
            store.state.starredLivePlans.municipalitiesList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredLivePlans.municipalitiesList.splice(storeMunicipalitiesIndex, 1)
            if (storeMunicipalitiesIndex2 > 0) {
              store.state.starredLivePlans.planList.splice(storeMunicipalitiesIndex2, 1)
            }
            isStarred.value = false
          }
        } else if (props.type === 'Individuals') {
          var storeIndividualIndex =
            store.state.starredLivePlans.participantList.length > 0
              ? store.state.starredLivePlans.participantList.indexOf(props.seinpno)
              : -1
          if (storeIndividualIndex < 0) {
            store.state.starredLivePlans.participantList.push(props.seinpno)
            isStarred.value = true
          } else {
            store.state.starredLivePlans.participantList.splice(storeIndividualIndex, 1)
            isStarred.value = false
          }
        }
        if (props.prospectTab && props.prospectTab === '4') eventBus.emit('getClientStarredData')
        if (store.state.user.reliusLoginId) {
          $axios.post(`/api/v1/retention/rbc/plan/searchrequest/Starred`, store.state.starredLivePlans).then((success) => {
            if (!store.state.starredLivePlans.id) {
              store.state.starredLivePlans.id = success.data.id
              store.state.starredLivePlans.createdOn = success.data.createdOn
            }
          })
        }
      }
    }
    const getStarIndicator = () => {
      var storeIndex = -1
      if (props.from === 'TAL') {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.einList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.einList.indexOf(props.seinpno)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      } else if (props.from === 'ResourceCenter') {
        if (Object.keys(store.state.starredResource).length > 0) {
          if (props.type === 'DocumentList') {
            var documentListIndex =
              store.state.starredResource.documentList.length > 0
                ? store.state.starredResource.documentList.indexOf(props.seinpno)
                : -1
            isStarred.value = documentListIndex < 0 ? false : true
          } else if (props.type === 'DocumentGallery') {
            var documentGalleryIndex =
              store.state.starredResource.documentGallery.length > 0
                ? store.state.starredResource.documentGallery.indexOf(props.seinpno)
                : -1
            isStarred.value = documentGalleryIndex < 0 ? false : true
          }
        }
      } else {
        if (Object.keys(store.state.starredLivePlans).length > 0) {
          if (props.type === 'Employer Sponsored') {
            var employeeIndex =
              store.state.starredLivePlans.planList.length > 0
                ? store.state.starredLivePlans.planList.indexOf(
                    props.seinpno //this will be passed as planId in RBC
                  )
                : -1
            isStarred.value = employeeIndex < 0 ? false : true
          } else if (props.type === 'Individuals') {
            var participantIndex =
              store.state.starredLivePlans.participantList.length > 0
                ? store.state.starredLivePlans.participantList.indexOf(
                    props.seinpno //this will be passed as planId in RBC
                  )
                : -1
            isStarred.value = participantIndex < 0 ? false : true
          } else if (props.type === 'School') {
            var schoolIndex =
              store.state.starredLivePlans.schoolList.length > 0
                ? store.state.starredLivePlans.schoolList.indexOf(
                    props.seinpno //this will be passed as planId in RBC
                  )
                : -1
            isStarred.value = schoolIndex < 0 ? false : true
          } else if (props.type === 'Municipality') {
            var municipalitiesIndex =
              store.state.starredLivePlans.municipalitiesList.length > 0
                ? store.state.starredLivePlans.municipalitiesList.indexOf(
                    props.seinpno //this will be passed as planId in RBC
                  )
                : -1
            isStarred.value = municipalitiesIndex < 0 ? false : true
          }
        }
      }
    }
    const getStarIndicatorForSchool = () => {
      var storeIndex = -1
      if (props.from === 'TAL' && props.schoolDistrictId !== '') {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList &&
            store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList.indexOf(props.schoolDistrictId)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      }
    }
    const getStarIndicatorForIndividual = () => {
      var storeIndex = -1
      if (props.from === 'TAL' && props.householdId !== '') {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList &&
            store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList.indexOf(props.householdId)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      }
    }
    const getStarIndicatorForMunicipal = () => {
      var storeIndex = -1
      if (props.from === 'TAL' && props.municipalId) {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList &&
            store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList.indexOf(props.municipalId)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      }
    }
    const getStarIndicatorForChurch = () => {
      var storeIndex = -1
      if (props.from === 'TAL' && props.churchId) {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList &&
            store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.churchIdList.indexOf(props.churchId)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      }
    }
    const getStarIndicatorForTaxExempt = () => {
      var storeIndex = -1
      if (props.from === 'TAL' && props.taxExemptId) {
        if (Object.keys(store.state.starredPlansSearchRequest).length > 0) {
          storeIndex =
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList &&
            store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.length > 0
              ? store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList.indexOf(props.taxExemptId)
              : -1
        }
        isStarred.value = storeIndex < 0 ? false : true
      }
    }
    watch(
      () => props.seinpno,
      () => {
        getStarIndicator()
      }
    )
    watch(
      () => props.schoolDistrictId,
      () => {
        getStarIndicatorForSchool()
      }
    )
    watch(
      () => props.householdId,
      () => {
        getStarIndicatorForIndividual()
      }
    )
    watch(
      () => props.municipalId,
      () => {
        getStarIndicatorForMunicipal()
      }
    )
    watch(
      () => props.churchId,
      () => {
        getStarIndicatorForChurch()
      }
    )
    watch(
      () => props.taxExemptId,
      () => {
        getStarIndicatorForTaxExempt()
      }
    )
    onMounted(() => {
      getStarIndicator()
      getStarIndicatorForSchool()
      getStarIndicatorForIndividual()
      getStarIndicatorForMunicipal()
      getStarIndicatorForChurch()
      getStarIndicatorForTaxExempt()
    })
    return {
      isStarred,
      updateStarred,
      einList,
      savedStarredEINs,
      schoolIdList
    }
  }
}
</script>
