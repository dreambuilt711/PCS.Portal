<template>
  <v-col>
    <v-col>
      <v-divider class="my-2 divider" />
      <v-col :class="$vuetify?.breakpoint?.smAndDown ? 'caption' : ''">
        <span :class="$vuetify?.theme.dark ? 'text-white' : ''" class="mr-1">Read Advisor Lab's</span>
        <a :color="$vuetify?.theme.dark ? '' : 'hyperlink'" flat small @click="legalShow = true"
          >WHITE LABEL TERMS AND AGREEMENT</a
        >
      </v-col>
    </v-col>
    <v-dialog v-model="legalShow" persistent scrollable max-width="1000px" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="pt-3 pb-2 pl-4" fixed :class="$vuetify?.theme.dark ? '' : 'accent'">
          <v-row>
            <v-col xl11 lg11 sm11 md11 xs11 class="align-self">
              <v-icon size="small" :class="$vuetify?.theme.dark ? '' : 'text-white'"> fas fa-user-friends </v-icon>
              <span class="font_14 text-uppercase text-secondary ml-2">WHITE LABEL OPTION AGREEMENT</span>
            </v-col>
            <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
              <v-icon v-if="isAgreed" color="secondary" @click="close()"> close </v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text id="headerContainer" class="pt-0 leagal_min_height">
          <v-container class="pt-3 pb-2 pl-3 pr-3">
            <h2 :class="$vuetify?.theme.dark ? '' : 'text-accent'">AGREEMENT</h2>
            <v-col xs12 sm12 md12 lg12 xl12 pa-3 class="border">
              <p>PCS Retirement. LLC. | WHITE LABEL OPTION AGREEMENT</p>
              <ol class="agreementPadding">
                <li>
                  Scope of Agreement.
                  <p>
                    Customer engages PCS as an independent contractor, for the purpose of providing the white label options for
                    the Customer’s branding on digital portals, client reports, notifications and communications, and account
                    acquisition tools.
                  </p>
                </li>
                <li>
                  Necessary Elements.
                  <p>
                    Customer agrees to provide PCS with all text, graphics, photographs, designs, artwork, trademarks, service
                    marks, trade names, service names, logos, labels, and other elements (“Elements”) necessary for PCS to provide
                    the white label options. PCS will use its self-service digital systems to provide white label options and the
                    reflection of the Customer’s branding is conditioned upon the receipt of necessary Elements.
                  </p>
                  <p>
                    Customer represents and warrants that, for all purposes described in this Agreement, Customer owns all
                    Elements (or has all necessary permissions from the rightful owner of all Elements) that Customer provides to
                    PCS for use in the white label options. Customer agrees to indemnify and hold harmless PCS, its affiliates,
                    and the shareholders, directors, officers, employees, agents, successors, assigns, and subcontractors of each
                    (“PCS Indemnified Parties”) from any claims (threatened or actual), liabilities, losses, damages, and expenses
                    (including without limitation, all reasonable legal and expert witness fees and expenses and all costs of
                    investigation) (“Liabilities”) directly or indirectly related to or arising from or in connection with use of
                    the Elements furnished by Customer. This paragraph shall survive termination of the Agreement.
                  </p>
                </li>
                <li>
                  Rights to Works.
                  <p>
                    The works created as a result of PCS’ provision of white label options (“Works”) are not works-for-hire, and
                    PCS and/or its subcontractors shall own all right, title, and interest of any kind, including intellectual
                    property rights and copyright, to the Works. Right, title, and interest in source codes, work-up files,
                    computer programs, and Elements (other than thoseElements provided to PCS by Customer, which shall remain the
                    property of Customer or its licensor) are expressly not transferred to Customer, and shall remain the rights,
                    title, and interests of their respective owners.
                  </p>
                  <p>
                    In the event that, by operation of law or otherwise, Customer shall obtain any right, title, or interest to
                    any Works, source codes, work-up files, computer programs, and Elements (other than those Elements provided to
                    PCS by Customer), other than as provided for under this Agreement, Customer hereby agrees to transfer and
                    assign such right, title, and interest to PCS and/or its subcontractors, without furtherconsideration
                  </p>
                  <p>
                    Upon completion of the white label options, PCS grants Customer a non-exclusive, non-transferable,
                    royalty-free license to use the Works. Customer agrees not to assign, sublicense, or otherwise dispose of its
                    rights under the grant of license.Customer’s license to use each Work shall terminate upon termination of this
                    Agreement. Customer may not, without the written consent of PCS modify, revise, or otherwise change a Work
                    which includes any name, logo, or reference related to Aspire or products and services offered by PCS
                  </p>
                  <p>All paragraphs of this section of the Agreement shall survive termination of the Agreement.</p>
                </li>
                <li>
                  Compliance with Laws.
                  <p>
                    Customer assumes full responsibility for compliance with all laws, statutes, rules, regulations, or other
                    requirements, including but not limited to electronic commerce laws and the payment of any applicable taxes
                    and tariffs, with regard to the white label options and Works and the use thereof. Customer agrees to
                    indemnify and hold harmless PCS Indemnified Parties from Liabilities directly or indirectly related to or
                    arising from or in connection with compliance with such requirements. This paragraph will survive termination
                    of the Agreement.
                  </p>
                </li>
                <li>
                  No Warranty.
                  <p>
                    The entire risk arising out of the use or performance of the white label options and works shall be with
                    Customer. The white label options and works are provided “as is,” and notwithstanding anything to the Contrary
                    contained within this agreement, neither pcs, nor any of its affiliates, or the shareholders, Directors,
                    officers, employees, agents, successors, assigns, or subcontractors of each, make any warranty of
                    Merchantability, any warranty of fitness for a particular purpose, or any other warranty, oral or written,
                    Express or implied, regarding the white label options or works. Further, pcs does not warrant that the
                    Functions contained in the white label options or works will be uninterrupted or error-free.
                  </p>
                  <p>
                    In no event will pcs be liable to the customer or any third party for any liabilities with regard to the use
                    and Performance of the white label options or works, including but not limited to service interruptions caused
                    by Acts of god, the hosting service, or any other circumstances beyond pcs’ reasonable control; or failure of
                    Any service provider, any telecommunications carrier, the internet backbone, any internet server, Customer’s
                    computer or internet software, or other users’ computers or internet software. Customer agrees To hold
                    harmless and indemnify pcs indemnified parties from liabilities directly or indirectly related to or Arising
                    from or in connection with the use and performance of the white label options, works, and service
                    Interruptions.
                  </p>
                  <p>All paragraphs in this section of the agreement shall survive termination of the agreement</p>
                </li>
                <li>
                  Limits on liability.
                  <p>
                    In no event shall pcs be liable to customer or any third party with regard to the subject matter of this
                    Agreement for any lost profits, lost savings, incidental, indirect, consequential, punitive, special damages,
                    Damages related to business interruption, attorneys’ fees, or any damages, even if pcs was advised of the
                    Possibility of such damages. Customer agrees to hold harmless and indemnify pcs indemnified parties with
                    Regard to all disclaimed damages (including without limitation, all reasonable legal and expert witness Fees
                    and expenses and all costs of investigation related to claims, threatened or actual, for disclaimed Damages).
                    This paragraph shall survive termination of theagreement.
                  </p>
                </li>
                <li>
                  Term of Agreement.
                  <p>This Agreement becomes effective only when executed by both Customer and PCS.</p>
                  <p>Either party may immediately terminate this Agreement upon written notice to the other party.</p>
                  <p>
                    Upon termination of the Agreement, any license granted to Customer under this Agreement for the use of any
                    Work is automatically terminated.
                  </p>
                  <p>
                    Notices, regarding termination of the Agreement or otherwise, shall be in writing and shall be sufficient if
                    sent by certified or registered mail, return receipt requested with postage prepaid, addressed to the
                    receiving party at the address provided below, or at such other address hereafter made known to the other
                    party in accordance with the provisions of this paragraph.
                  </p>
                </li>
                <li>
                  Jurisdiction, Venue, and Choice of Law.
                  <p>
                    Customer agrees that, for purposes of jurisdiction and venue, this Agreement was entered into in Philadelphia,
                    PA, and that any dispute related to the subject matter of this Agreement, whether under contract law or tort
                    law, shall be litigated or arbitrated in Philadelphia, PA. Customer hereby consents to the personal
                    jurisdiction of the Pennsylvania State Courts. Customer hereby waives any right to claims related to
                    inconvenient forum and/or sovereign immunity. This Agreement shall be governed by the laws of the State of
                    Pennsylvania, without giving effect to the conflict of laws principles therein. This paragraph shall survive
                    termination of the Agreement.
                  </p>
                </li>
                <li>
                  Entire Agreement.
                  <p>
                    This Agreement represents the entire Agreement between PCS and Customer regarding the subject matter hereof,
                    and supersedes all prior agreements, written or oral, regarding such matters. Except as otherwise noted
                    herein, no part of this Agreement may be changed, modified, or waived, except in writing, signed by Customer
                    and PCS
                  </p>
                </li>
                <li>
                  Severability.
                  <p>
                    In the event that one or more of the provisions of the Agreement shall be held invalid, illegal, or
                    unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be
                    affected or impaired thereby, and shall be interpreted, to the extent possible, to achieve the purposes as
                    originally expressed within the invalid, illegal, or unenforceable provisions. Each provision hereof is
                    intended to be severable and the validity, legality, or enforceability of any provision of this Agreement
                    shall not affect the validity, legality or enforceability of the remainder hereof. This paragraph shall
                    survive termination of the Agreement.
                  </p>
                </li>
              </ol>
            </v-col>
            <v-col v-if="!isAgreed" xl5 lg5 md6 sm12 xs12>
              <v-checkbox
                v-model="isDefault"
                :ripple="false"
                color="accent"
                label="I have read and agree to whitelabel terms and condition"
              />
            </v-col>
            <v-col v-if="!isAgreed" xs12 text-right mt-2 :class="[$vuetify?.breakpoint?.lgAndUp ? '' : 'mt-4']">
              <v-btn variant="outlined" color="accent" :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''" @click="disagree()">
                Disagree
              </v-btn>
              <v-btn color="accent" :class="[$vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="saveLegalAgreement()">
                Agree
              </v-btn>
            </v-col>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      legalShow: false,
      isDefault: false,
      showTermOfUse: false,
      isAgreed: false
    }
  },
  mounted() {
    this.getLegalAgreement()
  },
  methods: {
    getLegalAgreement() {
      this.$axios.get(`api/v1/brand/advisor/legalAgreement`).then((success) => {
        if (success.data.d !== null) {
          this.isAgreed = success.data.d.isAgreed
        } else this.isAgreed = false

        this.legalShow = !this.isAgreed ? true : false
      })
    },
    disagree() {
      this.$router.push('/Home')
    },
    close() {
      document.getElementById('headerContainer').scrollTop = 0
      this.legalShow = false
    },
    saveLegalAgreement() {
      if (this.isDefault) {
        this.$axios.post(`api/v1/tal/legalAgreement/${true}`).then(() => {
          this.getLegalAgreement()
        })
        document.getElementById('headerContainer').scrollTop = 0
      } else {
        this.$toast.warning(
          'Please indicate that you have read and agree to whitelabel Terms and Condition',
          '',
          this.notificationSystem.options.warning
        )
      }
    }
  }
}
</script>

<style scoped>
.leagal_min_height {
  max-height: 600px !important;
}
.agreementPadding {
  padding-left: 12px !important;
}
</style>
