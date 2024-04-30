<template>
  <v-col class="pa-5" cols="12">
    <v-col cols="12" class="pa-0">
      <h3>
        It is important to provide relevant information to plan sponsors and participants to keep them up to date on their
        retirement account, market insights and the principles of prudent investment - and we are here to help!
      </h3>
    </v-col>
    <v-col cols="12" class="pa-0">
      <h3>This is your central hub for engaging with plan participants and providing educational and informative content.</h3>
    </v-col>
    <v-col cols="12" class="pa-0">
      <v-col class="pt-5 pb-0 pl-0 pr-0" cols="12">
        <h2>Request Customer Communication</h2>
      </v-col>
      <v-row>
        <v-col cols="12" md="9" xl="8" class="pa-0">
          <div>
            <h3>
              Submit a request for customer communication with your plan participants in email and/or message formats. All
              previously submitted requests are documented below.
            </h3>
          </div>
          <div class="mt-1">
            <h3>Have questions? Please contact your PCS Retirement client service or sales representative.</h3>
          </div>
        </v-col>
        <v-col cols="12" md="3" xl="2" class="text-right pa-0">
          <v-btn color="accent" size="large" @click="submitRequest()"> Request New Communication </v-btn>
        </v-col>
      </v-row>
      <v-col v-if="false" cols="12" class="pt-3 pl-0 pr-0 pb-0">
        <v-data-table
          :headers="header"
          :items="customerCommunicationDataList"
          item-key="DocumentId"
          :class="[smAndDown ? 'elevation-0 mb-0' : 'elevation-3 mb-0']"
          mobile-breakpoint="0"
          :loading="loading"
          :fixed-header="xsOnly"
          :hide-default-header="xsOnly"
        >
          <template #item="{ item }">
            <tr v-if="xsOnly">
              <td class="text-hyperlink">
                {{ item.subject ? item.subject : '' }}
              </td>
              <td>{{ item.typeofCommunication ? item.typeofCommunication : '' }}</td>
              <td>{{ item.expirationOfPost ? item.expirationOfPost : '' }}</td>
              <td>{{ item.dateSubmitted ? item.dateSubmitted : '' }}</td>
              <td>{{ item.currentStatus ? item.currentStatus : '' }}</td>
              <td class="text-center">
                <v-col xs6 class="flex_none">
                  <v-btn icon variant="text" color="accent" @click.stop="$set(deleteCommunicationCenter, item.ID, true)">
                    <v-icon size="small"> fas fa-trash </v-icon>
                  </v-btn>
                </v-col>
              </td>
            </tr>
            <tr v-else>
              <td class="pr-3 pl-3">
                <v-row>
                  <v-col xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Subject of Request</span>
                    </h5>
                    <h4>
                      <span class="text-hyperlink"> {{ item.subject ? item.subject : '' }}</span>
                    </h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Type of Communication</span>
                    </h5>
                    <h4>{{ item.typeofCommunication ? item.typeofCommunication : '' }}</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Expiration of Post</span>
                    </h5>
                    <h4>{{ item.expirationOfPost ? item.expirationOfPost : '' }}</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Date Submitted</span>
                    </h5>
                    <h4>{{ item.dateSubmitted ? item.dateSubmitted : '' }}</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Current Status</span>
                    </h5>
                    <h4>{{ item.currentStatus ? item.currentStatus : '' }}</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Action</span>
                    </h5>
                    <h4>
                      <v-col xs6 class="flex_none">
                        <v-btn icon variant="text" color="accent" @click.stop="$set(deleteCommunicationCenter, item.ID, true)">
                          <v-icon size="small"> fas fa-trash </v-icon>
                        </v-btn>
                      </v-col>
                    </h4>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-col>
    <v-col cols="12" class="pa-0">
      <v-col class="pt-5 pb-0 pl-0 pr-0" cols="12">
        <h2>Helpful Articles</h2>
      </v-col>
      <div>
        <h3>
          Below are links to sample template and articles you can use as educational communication with your plan participants -
          subject to your firm's compliance approval.
        </h3>
      </div>
      <v-col class="pt-5 pl-5 pb-0 pr-0" cols="12">
        <v-col cols="12" class="pa-0">
          <v-row>
            <v-col cols="12" lg="5" xl="4" class="pa-0">
              <v-col cols="12" class="pa-0">
                <h3><b>Financial & Economic</b></h3>
              </v-col>
              <v-col v-for="(item, index) in financialEconomicData" :key="index" cols="12" class="pt-5 pr-1 pb-0 pl-0">
                <v-col class="pt-0 pb-0 pl-2" cols="12">
                  <h3>
                    <a :href="item.href" class="text-hyperlink" target="_blank">
                      <v-icon size="20" :style="item.style" class="pr-5" :icon="item.icon"></v-icon>
                      {{ item.text }}</a
                    >
                  </h3>
                </v-col>
              </v-col>
            </v-col>
            <v-col cols="12" lg="6" xl="4" :class="mdAndDown ? 'mt-5 pa-0' : 'pa-0'">
              <v-col class="pa-0" cols="12">
                <h3><b>Wealth Management</b></h3>
              </v-col>
              <v-col v-for="(item, index) in wealthManagementData" :key="index" class="pt-5 pr-1 pl-0 pb-0" cols="12">
                <v-col class="pt-0 pb-0 pl-2">
                  <h3>
                    <a :href="item.href" class="text-hyperlink" target="_blank">
                      <v-icon size="20" :style="item.style" class="pr-5" :icon="item.icon"></v-icon>
                      {{ item.text }}</a
                    >
                  </h3>
                </v-col>
              </v-col>
            </v-col>
            <v-col v-if="false" cols="12" md="4" class="pa-0">
              <v-col class="pa-0" cols="12">
                <h3><b>Other</b></h3>
              </v-col>
              <v-col v-for="(item, index) in OtherDocData" :key="index" class="pt-5 pb-0 pl-0 pr-0" cols="12">
                <v-col class="pt-0 pb-0 pl-2" cols="12">
                  <h3>
                    <a :href="item.href" class="text-hyperlink" target="_blank">
                      <v-icon size="20" :style="item.style" class="pr-5" :icon="item.icon"></v-icon>
                      {{ item.text }}</a
                    >
                  </h3>
                </v-col>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-col>
    <v-dialog v-model="filterDialog" persistent class="elevation-3" content-class="elevation-3" scrollable max-width="730px">
      <v-card>
        <v-card-title class="pt-3 pb-2 bg-accent">
          <v-layout row wrap>
            <v-col cols="12" class="pa-0">
              <v-layout row wrap>
                <v-col xl="11" lg="11" sm="11" md="11" xs="11" class="align-self pa-0">
                  <v-layout row wrap>
                    <span class="fontweight_500 font_size_label text-upper-case text-secondary ml-2 pt-1"
                      >Customer Communication Request</span
                    >
                  </v-layout>
                </v-col>
                <v-col xl="1" lg="1" sm="1" md="1" xs="1" class="text-right pa-0">
                  <v-icon color="secondary" @click="filterDialog = false"> close </v-icon>
                </v-col>
              </v-layout>
            </v-col>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-col class="pa-0" cols="12">
            <h2 class="font_17">
              Use the form below to request a custom message posted to participant website, email sent to individual participants,
              or both.
            </h2>
          </v-col>
          <iframe
            id="ft1596807852547-906-11"
            onload="window.parent.scrollTo(0,0)"
            allowtransparency="true"
            :src="formTitanUrl"
            frameborder="0"
            width="100%"
            height="1200"
            scrolling="no"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  setup() {
    const display = useDisplay()
    const xsOnly = ref(false)
    const mdAndDown = ref(false)
    const smAndDown = ref(false)
    const financialEconomicData = ref([
      {
        text: 'Focus on the long term',
        value: 0,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/focus-on-the-long-term.docx?sfvrsn=2'
      },
      {
        text: 'Focus on the long term',
        value: 1,
        icon: 'fa:far fa-file-pdf',
        style: 'color:red',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/focus-on-the-long-term_for-participant-website.pdf?sfvrsn=2'
      },
      {
        text: 'Making Sense of Inexplicable Market Moves',
        value: 2,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/making-sense-of-inexplicable-market-moves.docx?sfvrsn=2'
      },
      {
        text: 'What the behavior of monkeys can teach us about investing bias',
        value: 3,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/what-the-behavior-of-monkeys-can-teach-us-about-investing-bias.docx?sfvrsn=2'
      },
      {
        text: 'A market correction does not mean a negative year',
        value: 4,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/a-market-correction-does-not-mean-a-negative-market-year.docx?sfvrsn=2'
      },
      {
        text: 'Interest rates take a hike - should you from the stock market?',
        value: 5,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/interest-rates-take-a-hike---should-you-from-the-stock-market.docx?sfvrsn=2'
      },
      {
        text: 'Recessions happen',
        value: 6,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/recessions-happen.docx?sfvrsn=2'
      }
    ])
    const wealthManagementData = ref([
      {
        text: 'The Things You Should Always Tell Your Financial Advisor',
        value: 0,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/the-things-you-should-always-tell-your-financial-advisor.docx?sfvrsn=2'
      },
      {
        text: 'Avoid The Added Risks Of Helicopter Investing',
        value: 1,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/avoid-the-added-risks-of-helicopter-investing.docx?sfvrsn=2'
      },
      {
        text: 'Forecasts Interesting To Read But So Unreliable',
        value: 2,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/forecasts-interesting-to-read-but-so-unreliable.docx?sfvrsn=2'
      },
      {
        text: "Sometimes You're Better Off Knowing Less",
        value: 3,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/sometimes-you-39-re-better-off-knowing-less.docx?sfvrsn=2'
      },
      {
        text: 'The Importance of First Having a Plan',
        value: 4,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/the-importance-of-first-having-a-plan.docx?sfvrsn=2'
      },
      {
        text: "When Diversification Means You Don't Know What You're Doing",
        value: 5,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/when-diversification-means-you-don-39-t-know-what-you-39-re-doing.docx?sfvrsn=2'
      },
      {
        text: 'Why Getting Your Money to Serve You (Rather Than the Other Way Around)',
        value: 6,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/why-getting-your-money-to-serve-you-(rather-than-the-other-way-around)-helps-make-you-happier.docx?sfvrsn=2'
      },
      {
        text: "Why It's So Important To Talk To Your Elderly Parents About Money",
        value: 7,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/why-its-so-important-to-talk-to-your-elderly-parents-about-money.docx?sfvrsn=2'
      }
    ])
    const OtherDocData = ref([
      {
        text: 'When taking action makes things worse',
        value: 0,
        icon: 'fa:far fa-file-word',
        style: 'color:#0077CC',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/when-taking-action-makes-things-worse.docx?sfvrsn=2'
      },
      {
        text: 'When taking action makes things worse',
        value: 1,
        icon: 'fa:far fa-file-pdf',
        style: 'color:red',
        href: 'https://www.aspireonline.com/docs/default-source/covid-19/when-taking-action-makes-things-worse_for-participant-website.pdf?sfvrsn=2'
      }
    ])
    const header = ref([
      {
        title: 'Subject of Request',
        align: 'start',
        sortable: false,
        value: 'Name',
        class: 'font-weight-bold'
      },
      {
        title: 'Type of Communication',
        align: 'start',
        sortable: false,
        value: 'Description',
        class: 'font-weight-bold'
      },
      {
        title: 'Expiration of Post',
        align: 'start',
        sortable: false,
        value: 'Activity',
        class: 'font-weight-bold'
      },
      {
        title: 'Date Submitted',
        align: 'start',
        sortable: false,
        value: '',
        class: 'font-weight-bold'
      },
      {
        title: 'Current Status',
        align: 'start',
        sortable: false,
        value: '',
        class: 'font-weight-bold'
      },
      {
        title: 'Action',
        align: 'Center',
        sortable: false,
        value: '',
        class: 'font-weight-bold'
      }
    ])
    const customerCommunicationDataList = ref([
      {
        ID: 0,
        subject: '401 (k) Simplified PEP Plan Design Questionnaire',
        typeofCommunication: 'Email Only',
        expirationOfPost: '11/11/2021',
        dateSubmitted: '11/11/2021',
        currentStatus: 'Request Received'
      },
      {
        ID: 1,
        subject: '403 Simplified Advisor',
        typeofCommunication: 'Email and Message',
        expirationOfPost: '05/25/2021',
        dateSubmitted: '05/25/2021',
        currentStatus: 'Request Received'
      },
      {
        ID: 2,
        subject: 'About PCS Plan Sponsors and Advisors',
        typeofCommunication: 'Email Only',
        expirationOfPost: '05/14/2021',
        dateSubmitted: '05/14/2021',
        currentStatus: 'Request Received'
      },
      {
        ID: 3,
        subject: 'AdvisorLab Teaser',
        typeofCommunication: 'Message Only',
        expirationOfPost: '11/11/2021',
        dateSubmitted: '11/11/2021',
        currentStatus: 'Request Complete'
      },
      {
        ID: 4,
        subject: 'Morningstar AMA HUB',
        typeofCommunication: 'Email and Message',
        expirationOfPost: '11/11/2021',
        dateSubmitted: '11/11/2021',
        currentStatus: 'Request Complete'
      },
      {
        ID: 5,
        subject: 'AdvisorLab Teaser',
        typeofCommunication: 'Message Only',
        expirationOfPost: '11/11/2021',
        dateSubmitted: '11/11/2021',
        currentStatus: 'Request Complete'
      },
      {
        ID: 6,
        subject: 'Morningstar AMA HUB',
        typeofCommunication: 'Message Only',
        expirationOfPost: '11/11/2021',
        dateSubmitted: '11/11/2021',
        currentStatus: 'Request Complete'
      }
    ])
    const loading = ref(false)
    const filterDialog = ref(false)
    const deleteCommunicationCenter = ref({})
    //watch
    watchEffect(() => {
      xsOnly.value = display.xs.value
      mdAndDown.value = display.mdAndDown.value
      smAndDown.value = display.smAndDown.value
    })
    //computed
    const formTitanUrl = computed(() => {
      return 'https://pcsretirement.formtitan.com/ftfb470cec1584993128686_copy?ftembedform=https%3A%2F%2Fwww.aspireonline.com%2Falert&ftopenerref=https%3A%2F%2Fcommunicationresourcecenter.invlink.com%2F'
    })
    function submitRequest() {
      filterDialog.value = true
    }
    return {
      financialEconomicData,
      wealthManagementData,
      OtherDocData,
      header,
      customerCommunicationDataList,
      loading,
      filterDialog,
      deleteCommunicationCenter,
      mdAndDown,
      xsOnly,
      smAndDown,
      formTitanUrl,
      submitRequest
    }
  }
}
</script>
