import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import authz from './authz'
import TALPlan from '@/views/TAL/TALPlan'
import OrionDashboard from '@/views/Retention/OrionDashboard'
import AccountLink from '@/views/Retention/AccountLink'
import Apprise from '@/views/Retention/Apprise'
import TSMAspire from '@/views/Retention/TSMAspire'
import InvestmentList from '@/views/Account/InvestmentList'
import ReportOptions from '@/views/Account/ReportOptions'
import ModelList from '@/views/Account/ModelAndInvestment'
import FeeEngine from '@/views/Account/FeeEngine'
import RBCDashboard from '@/views/Retention/RBCDashboard'
import RBCLivePlans from '@/views/Retention/Plans'
import RBCPlan from '@/views/Retention/RBCPlan.vue'
import Snapshot from '@/views/TAL/Snapshot'
import FinderResult from '@/views/TAL/FinderResult'
import Home from '@/views/Home.vue'
import MyProspectPipeline from '@/views/TAL/MyProspectPipeline'
import StartupPlan from '@/views/TAL/StartupPlan'
import Branding from '@/views/Brand/Branding'
import Program from '@/views/Program.vue'
import HouseholdResult from '@/views/TAL/HouseholdResult'
import SchoolAccountDetails from '@/views/TAL/SchoolAccountDetails'
import Disclosure from '@/views/Disclosure.vue'
import SimpleIRARequest from '@/views/TAL/SimpleIRARequest'
import TALPlanSimpleIRA from '@/views/TAL/TALPlanSimpleIRA'
import MarketInsight from '@/views/TAL/MarketInsight'
import ParticipantMPAA from '@/views/ParticipantMPAA'
import IndividualReview from '@/views/Retention/IndividualReview'
import MunicipalDetail from '@/views/TAL/Municipal'
import ChurchDetail from '@/views/TAL/Church'
import TaxExemptDetail from '@/views/TAL/TaxExempt'
import MarketOpportunitiesPlans from '@/views/TAL/MarketOpportunitiesPlans'
import InvestmentOverview from '@/views/Retention/InvestmentOverview'
import ResourceCenter from '@/views/Account/ResourceCenter'

let router = createRouter({
  mode: 'history',
  routes: [
    // {
    //   path: '*',
    //   redirect: {
    //     name: 'HomeAcquisition'
    //   }
    // },
    {
      path: '/',
      redirect: {
        name: 'HomeAcquisition'
      }
    },
    {
      path: '/Retention',
      redirect: {
        name: 'RBCDashboard'
      }
    },
    {
      path: '/Account/FeeEngine',
      redirect: {
        name: 'AccountFeeEngineFeeSchedules'
      }
    },
    {
      path: '/Account/ModelsInvestments',
      redirect: {
        name: 'AccountModelsInvestmentsModels'
      }
    },
    {
      path: '/Account/ReportOptions',
      redirect: {
        name: 'AccountReportOptionsLogo'
      }
    },
    {
      path: '/Participant/:id',
      redirect: {
        name: 'ParticipantMPAA'
      }
    },
    {
      path: '/IndividualDashboard',
      redirect: {
        name: 'IndividualReview'
      }
    },
    {
      path: '/Home/Acquisition',
      name: 'HomeAcquisition',
      component: Home,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: null
      }
    },
    {
      path: '/TAL/Finder/Result',
      name: 'TALFinderResult',
      component: FinderResult,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Plans', 'Write.Diagnostic', 'Write.RPEA', 'Write.Proposal'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Search Leads'
      }
    },
    {
      path: '/TAL/Plans',
      name: 'TALProspectPlans',
      component: MyProspectPipeline,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Manage.Pipeline'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Prospect Pipeline'
      }
    },
    {
      path: '/TAL/Plan/:id/:planType?',
      name: 'TALPlan',
      component: TALPlan,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Plans', 'Write.Diagnostic', 'Write.RPEA', 'Write.Proposal'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Plan Details'
      }
    },
    {
      path: '/TAL/StartupPlan',
      name: 'StartupPlan',
      component: StartupPlan,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Plans', 'Write.Proposal'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Create Startup Plan'
      }
    },
    {
      path: '/TAL/School',
      name: 'SchoolAccountDetails',
      component: SchoolAccountDetails,
      props: true,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'School District Details'
      }
    },
    {
      path: '/TAL/Municipalities',
      name: 'MunicipalDetail',
      component: MunicipalDetail,
      props: true,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Municipalities Details'
      }
    },
    {
      path: '/TAL/Churches',
      name: 'ChurchDetail',
      component: ChurchDetail,
      props: true,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Church Details'
      }
    },
    {
      path: '/TAL/TaxExempt',
      name: 'TaxExemptDetail',
      component: TaxExemptDetail,
      props: true,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Tax-Exempt Details'
      }
    },
    {
      path: '/TAL/MarketInsight',
      name: 'MarketInsight',
      component: MarketInsight,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Market Insight'
      }
    },
    {
      path: '/TAL/HouseholdResult',
      name: 'TALHouseholdResult',
      component: HouseholdResult,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Plans'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Households'
      }
    },
    {
      path: '/TAL/SimpleIRARequest',
      name: 'SimpleIRARequest',
      component: SimpleIRARequest,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Create Startup Plan'
      }
    },
    {
      path: '/TAL/SimpleIRAPlan/:id',
      name: 'TALPlanSimpleIRA',
      component: TALPlanSimpleIRA,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Plans', 'Write.Diagnostic', 'Write.RPEA', 'Write.Proposal'],
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Plan Details'
      }
    },
    {
      path: '/Home/Onboarding',
      name: 'HomeOnboarding',
      component: Home,
      meta: {
        parentRoute: '/Home/Onboarding',
        parentName: 'Onboarding',
        pageName: null
      }
    },
    {
      path: '/Home/ClientManagement',
      name: 'HomeClientManagement',
      component: Home,
      meta: {
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: null
      }
    },
    {
      path: '/Home/ResourceCenter',
      name: 'HomeResourceCenter',
      component: ResourceCenter,
      props: true,
      meta: {
        parentRoute: '/Home/ResourceCenter',
        parentName: 'ResourceCenter',
        pageName: 'Resource Center'
      }
    },
    {
      path: '/Retention/Orion',
      name: 'RetentionOrion',
      component: OrionDashboard,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Orion'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Orion',
        pageName: 'Dashboard'
      }
    },
    {
      path: '/Retention/AccountLink',
      name: 'RetentionAccountLink',
      component: AccountLink,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius'],
        parentName: 'Clients',
        pageName: 'AccountLink',
        parentRoute: '/Home/ClientManagement'
      }
    },
    {
      path: '/Retention/Apprise',
      name: 'RetentionApprise',
      component: Apprise,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'Asprise'
      }
    },
    {
      path: '/Retention/TSM',
      name: 'RetentionTSM',
      component: TSMAspire,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.TSM'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'TSM Aspire'
      }
    },
    {
      path: '/Retention/Dashboard',
      name: 'RBCDashboard',
      component: RBCDashboard,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius', 'Access.TSM'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'Client Dashboard'
      }
    },
    {
      path: '/Retention/Plans',
      name: 'RBCLivePlans',
      component: RBCLivePlans,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius', 'Access.TSM'],
        parentName: 'Clients',
        pageName: 'My Clients',
        parentRoute: '/Home/ClientManagement'
      }
    },
    {
      path: '/Retention/Plan/:id',
      name: 'RBCPlan',
      component: RBCPlan,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius', 'Access.TSM'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'Plan Details'
      }
    },
    {
      path: '/Retention/Participants',
      name: 'IndividualReview',
      component: IndividualReview,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius', 'Access.TSM'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'Client Dashboard'
      }
    },
    {
      path: '/Retention/Investments',
      name: 'InvestmentOverview',
      component: InvestmentOverview,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.Relius', 'Access.TSM'],
        parentRoute: '/Home/ClientManagement',
        parentName: 'Clients',
        pageName: 'Investments Dashboard'
      }
    },
    {
      path: '/Home/AdvisorSetup',
      name: 'HomeAdvisorSetup',
      component: Home,
      meta: {
        parentName: 'Setup',
        parentRoute: '/Home/AdvisorSetup',
        pageName: null
      }
    },
    {
      path: '/Account/FeeEngine',
      name: 'AccountFeeEngineFeeSchedules',
      component: FeeEngine,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.FeeBuilder'],
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Fee Schedules'
      }
    },
    {
      path: '/Account/Models',
      name: 'AccountModelsInvestmentsModels',
      component: ModelList,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.ModelBuilder'],
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Models'
      }
    },
    {
      path: '/Account/Investments',
      name: 'AccountModelsInvestmentsInvestments',
      component: InvestmentList,
      props: true,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Access.InvestmentListBuilder'],
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Investments'
      }
    },
    {
      path: '/Account/ReportOptions/Logo',
      name: 'AccountReportOptionsLogo',
      component: ReportOptions,
      meta: {
        requiresAuth: true,
        restrictedTo: ['Manage.Logo'],
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Report Options'
      }
    },
    {
      path: '/Branding',
      name: 'Branding',
      component: Branding,
      meta: {
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Branding'
      }
    },
    {
      path: '/TAL/Snapshot',
      name: 'Snapshot',
      component: Snapshot,
      meta: {
        parentRoute: '/Home/AdvisorSetup',
        parentName: 'Setup',
        pageName: 'Snapshot'
      }
    },
    {
      path: '/Disclosure',
      name: 'Disclosure',
      component: Disclosure,
      meta: {
        parentName: null,
        pageName: ''
      }
    },
    {
      path: '/Program',
      name: 'Program',
      component: Program,
      meta: {
        parentName: null,
        pageName: ''
      }
    },
    {
      path: '/Participant/:id',
      name: 'ParticipantMPAA',
      component: ParticipantMPAA,
      meta: {
        parentName: null,
        pageName: ''
      }
    },
    {
      path: '/TAL/MarketOpportunities',
      name: 'MarketOpportunities',
      component: MarketOpportunitiesPlans,
      meta: {
        parentRoute: '/Home/Acquisition',
        parentName: 'Acquisition',
        pageName: 'Market Opportunitites'
      }
    }
  ],
  history: createWebHistory(),
  linkExactActiveClass: 'active'
})

let lstore = store
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  let isParticipant =
    lstore.state.user && lstore.state.user.temporarySessionType && lstore.state.user.temporarySessionType === 'Participant'
      ? true
      : false
  if (isParticipant) {
    if (to.name !== 'ParticipantMPAA') {
      next({
        name: 'ParticipantMPAA'
      })
    } else {
      next()
    }
  } else {
    var disclosureValue = lstore.state.disclosure
    if (!disclosureValue && !lstore.state.isImpersonating) {
      if (to.fullPath !== '/Disclosure')
        next({
          path: '/Disclosure'
        })
      else next()
    } else if (
      to.name !== 'Program' &&
      to.name !== 'HomeAcquisition' &&
      lstore.state.contactPreferences &&
      !lstore.state.contactPreferences.hideFirstTimeUX
    )
      next({
        name: 'HomeAcquisition'
      })
    else {
      if (
        (lstore.state.user.selectedProgram &&
          lstore.state.user.selectedProgram.selectedAccount &&
          lstore.state.user.selectedProgram.selectedRelationship) ||
        (lstore.state.user.selectedProgram &&
          lstore.state.user.selectedProgram.roles.some(
            (a) =>
              a.roleName === authz.roles.SiteAdmin ||
              a.roleName === authz.roles.ProgramAdmin ||
              a.roleName === authz.roles.InternalAdmin
          ))
      ) {
        if (to.fullPath === '/Program')
          next({
            path: '/'
          })
        else next()
        return
      }

      var programs = lstore.state.user.programs //all Programs List
      var distinctPrograms = [...new Map(programs.map((item) => [item['programId'], item])).values()]

      if (distinctPrograms.length === 1) {
        //single program checks
        var singleProgram = distinctPrograms[0]

        if (
          singleProgram.roles.some(
            (a) =>
              a.roleName === authz.roles.SiteAdmin ||
              a.roleName === authz.roles.ProgramAdmin ||
              a.roleName === authz.roles.InternalAdmin
          )
        ) {
          lstore.state.user.selectedProgram = singleProgram
          if (to.fullPath === '/Program')
            next({
              path: '/'
            })
          else next()
        } else if (
          singleProgram.roles.length > 1 ||
          singleProgram.accounts.length > 1 ||
          singleProgram.relationships.length > 1
        ) {
          if (to.fullPath !== '/Program')
            next({
              path: '/Program'
            })
          else {
            next()
          }
        } else {
          lstore.state.user.selectedProgram = singleProgram
          lstore.state.user.selectedProgram.selectedAccount = singleProgram.accounts[0]
          lstore.state.user.selectedProgram.selectedRelationship = singleProgram.relationships[0]
          if (to.fullPath === '/Program')
            next({
              path: '/'
            })
          else next()
        }
      } else {
        if (to.fullPath !== '/Program')
          next({
            path: '/Program'
          })
        else next()
      }
    }
  }
})

export default router
