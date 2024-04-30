import store from './store'

export default {
  hasPermission: function (permissionSet, requiredMinimumPermission) {
    if (store.state.user.selectedProgram && store.state.user.selectedProgram.roles.length > 1) {
      if (store.state.user.selectedProgram.selectedRelationship.roleId) {
        let selectedRoles = store.state.user.selectedProgram.roles.filter(
          (a) => a.roleId === store.state.user.selectedProgram.selectedRelationship.roleId
        )
        if (selectedRoles && selectedRoles.length > 0) {
          return selectedRoles.some((x) => x[permissionSet] === requiredMinimumPermission)
        }
      }
    } else {
      return (
        store.state.user.selectedProgram &&
        store.state.user.selectedProgram.roles.some((x) => x[permissionSet] === requiredMinimumPermission)
      )
    }
  },
  allowedByProgram: function (programPermissionSet, requiredMinimumPermission) {
    var user = store.state.user
    var val
    if (programPermissionSet === this.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c) {
      val = user.selectedProgram && user.selectedProgram[programPermissionSet].includes(requiredMinimumPermission)
    } else {
      val = user.selectedProgram && user.selectedProgram[programPermissionSet] === requiredMinimumPermission
    }
    return val
  },
  allowedByAccount: function (accountPermissionSet, requiredMinimumPermission) {
    var user = store.state.user
    var val
    if (accountPermissionSet === this.accountPermissionSet.Type_of_Business_Advisors_allowed__c) {
      if (user.selectedProgram && user.selectedProgram.accounts.length > 0) {
        val = user.selectedProgram.selectedAccount[accountPermissionSet].includes(requiredMinimumPermission)
      } else return false
    } else {
      val = user.selectedProgram.selectedAccount[accountPermissionSet] === requiredMinimumPermission
    }
    return val
  },
  allowedByWebUser: function (webuserPermissionSet, requiredMinimumPermission) {
    var user = store.state.user
    var val
    if (webuserPermissionSet === this.accountPermissionSet.navigation) {
      val = user.navigation.includes(requiredMinimumPermission)
    } else {
      val = user[webuserPermissionSet] === requiredMinimumPermission
    }
    return val
  },
  userRole() {
    var user = store.state.user
    if (user.selectedProgram) {
      if (user.selectedProgram.selectedRelationship) return user.selectedProgram.selectedRelationship.roleName
    }
    return 'Advisor'
  },
  hasRole: function (roleName) {
    var user = store.state.user
    if (user.selectedProgram && user.selectedProgram.selectedRelationship) {
      return user.selectedProgram && user.selectedProgram.selectedRelationship.roleName === roleName
    }
    return false
  },
  planType: {
    Defined_Benefit_Plan: 'Defined Benefit Plan',
    Cash_Balance_Plan: 'Cash Balance Plan',
    Simple_IRA_Plan_Proposal: 'Simple IRA Plan Proposal',
    Defined_Contribution_Plan: 'Defined Contribution Plan',
    ERISA_403_b: 'ERISA 403(b)',
    Uni_K: 'Uni-k',
    Individual_Simple_IRA: 'SIMPLE IRA',
    Individual_457_b_Governmental_Plan: '457(b) Individual Governmental Plan',
    Individual_457_f_TaxExempt_Plan: '457(f) Individual Tax Exempt Plan'
  },
  pcsAspireProduct: {
    Single_Strategist_Product: 'Single-Strategist Product',
    Multi_Strategist_Product: 'Multi-Strategist Product',
    BPO: 'BPO'
  },
  managedPlan: {
    MML: 'MML',
    PA: 'PA'
  },
  program: {
    Axos: 'Axos',
    PCS: 'PCS',
    Strategic: 'Strategic',
    Savant: 'Savant',
    RPA: 'RPA',
    Franklin: 'Franklin'
  },
  roles: {
    SiteAdmin: 'Site Admin',
    ProgramAdmin: 'Program Admin',
    FirmAdmin: 'Firm Admin',
    Advisor: 'Advisor',
    Strategist: 'Strategist',
    Fiduciary338: '3(38) Direct',
    InternalAdmin: 'Internal Admin',
    AdvisorSupport: 'Advisor Support'
  },
  permissionSet: {
    All_In_One_Fee_Report__c: 'all_In_One_Fee_Report__c',
    Annual_Participant_Disclosure__c: 'annual_Participant_Disclosure__c',
    Annual_Review__c: 'annual_Review__c',
    Branding_Items__c: 'branding_Items__c',
    Clients_Export_Option__c: 'clients_Export_Option__c',
    Comparison__c: 'comparison__c',
    Create_Start_up_Plan__c: 'create_Start_up_Plan__c',
    Diagnostic__c: 'diagnostic__c',
    Enrollment_Guide__c: 'enrollment_Guide__c',
    Enrollment_Overview__c: 'enrollment_Overview__c',
    Express_Diagnostic__c: 'express_Diagnostic__c',
    Fee_Engine_Administration__c: 'fee_Engine_Administration__c',
    Fee_Engine_Advisory__c: 'fee_Engine_Advisory__c',
    Fee_Engine_Custodian__c: 'fee_Engine_Custodian__c',
    Fee_Engine_ETF__c: 'fee_Engine_ETF__c',
    Fee_Engine_Investment_Manager__c: 'fee_Engine_Investment_Manager__c',
    Fee_Engine_Recordkeeping__c: 'fee_Engine_Recordkeeping__c',
    Finder__c: 'finder__c',
    Fund_Fact_Sheets__c: 'fund_Fact_Sheets__c',
    Impersonation__c: 'impersonation__c',
    Investment_Lineup__c: 'investment_Lineup__c',
    Model_Fact_Sheets__c: 'model_Fact_Sheets__c',
    Models__c: 'models__c',
    My_Pipeline__c: 'my_Pipeline__c',
    Proposal__c: 'proposal__c',
    Prospects_Export_Option__c: 'prospects_Export_Option__c',
    Results__c: 'results__c',
    Retirement_Snapshot_Participant__c: 'retirement_Snapshot_Participant__c',
    Add_User__c: 'add_User__c'
  },
  programPermissionSet: {
    Advisors_Firms_Access_to_IMC__c: 'advisors_Firms_Access_to_IMC__c',
    Advisors_Firms_create_Office_Branches__c: 'advisors_Firms_create_Office_Branches__c',
    Advisors_Firms_to_create_Fee_Schedule__c: 'advisors_Firms_to_create_Fee_Schedule__c',
    Advisors_Firms_to_have_LTA__c: 'advisors_Firms_to_have_LTA__c',
    Advisors_Firms_to_promote_Social_Media__c: 'advisors_Firms_to_promote_Social_Media__c',
    Advisors_Firms_to_Upload_own_Brand__c: 'advisors_Firms_to_Upload_own_Brand__c',
    Advisors_Firms_Update_Copyright_Privacy__c: 'advisors_Firms_Update_Copyright_Privacy__c',
    Allow_Advisors_Firms_to_create_Product__c: 'allow_Advisors_Firms_to_create_Product__c',
    Allow_Asset_Based_Fee__c: 'allow_Asset_Based_Fee__c',
    Allowed_to_Email_Firms_Advisors__c: 'allowed_to_Email_Firms_Advisors__c',
    Allowed_to_email_Participants__c: 'allowed_to_email_Participants__c',
    Allowed_to_Email_Plan_Sponsors__c: 'allowed_to_Email_Plan_Sponsors__c',
    Allow_Participant_Based_Fee__c: 'allow_Participant_Based_Fee__c',
    Type_of_Business_Advisors_Firms_allowed__c: 'type_of_Business_Advisors_Firms_allowed__c',
    Allow_Adv_Firms_to_create_Fee_Schedule__c: 'allow_Adv_Firms_to_create_Fee_Schedule__c',
    Allow_assoc_Adv_Firms_to_create_RTQ_s__c: 'allow_assoc_Adv_Firms_to_create_RTQ_s__c',
    Allow_assoc_Adv_Firmss_access_to_IMC__c: 'allow_assoc_Adv_Firmss_access_to_IMC__c',
    PCS_Aspire_Product__c: 'pcS_Aspire_Product__c',
    Access_to_fee_engine_allowed__c: 'access_to_fee_engine_allowed__c',
    Access_to_IMC_allowed__c: 'access_to_IMC_allowed__c',
    Allow_Investment_Manager_TAMP__c: 'allow_Investment_Manager_TAMP__c',
    Base_Fee__c: 'base_Fee__c',
    PcS_Proposal_Options__c: 'pcS_Proposal_Options__c',
    Show_Aspire_Payroll_Slots__c: 'show_Aspire_Payroll_Slots__c'
  },
  accountPermissionSet: {
    Advisors_Firms_create_Office_Branches__c: 'advisors_Firms_create_Office_Branches__c',
    Advisors_Firms_create_unique_RTQ_s__c: 'advisors_Firms_create_unique_RTQ_s__c',
    Advisors_Firms_to_create_Fee_Schedules__c: 'advisors_Firms_to_create_Fee_Schedules__c',
    Allow_Advisors_Firms_access_to_IMC__c: 'allow_Advisors_Firms_access_to_IMC__c',
    Allow_Advisors_Firms_Social_Media_Links__c: 'allow_Advisors_Firms_Social_Media_Links__c',
    Allow_Advisors_Firms_Upload_Brand__c: 'allow_Advisors_Firms_Upload_Brand__c',
    Allow_Advisors_Firms_to_create_Product__c: 'allow_Advisors_Firms_to_create_Product__c',
    Allowed_to_email_Firms_Advisors__c: 'allowed_to_email_Firms_Advisors__c',
    Allowed_to_email_Participants__c: 'allowed_to_email_Participants__c',
    Allowed_to_email_Plan_Sponsors__c: 'allowed_to_email_Plan_Sponsors__c',
    Type_of_Business_Advisors_allowed__c: 'type_of_Business_Advisors_allowed__c',
    Allow_Asset_Based_Fee__c: 'allow_Asset_Based_Fee__c',
    Allow_Participant_Based_Fee__c: 'allow_Participant_Based_Fee__c',
    Advisors_Firms_Update_Copyright_Privacy__c: 'advisors_Firms_Update_Copyright_Privacy__c',
    Allow_Investment_Manager_TAMP__c: 'allow_Investment_Manager_TAMP__c',
    PcS_Proposal_Options__c: 'pcS_Proposal_Options__c',
    Show_Aspire_Payroll_Slots__c: 'show_Aspire_Payroll_Slots__c',
    Advisors_Firms__c: 'advisors_Firms__c'
  },
  permission: {
    None: 'None',
    RequiresApproval: 'RequiresApproval',
    ViewOnly: 'ViewOnly',
    Full: 'Full',
    FullAccess: 'Full Access'
  },
  navigation: {
    Acquisition: 'Acquisition',
    Clients: 'Clients',
    Setup: 'Setup'
  },
  typeOfBusiness: {
    None: 'None',
    EmployerSponsored: 'EmployerSponsored',
    Individuals: 'Individuals',
    Municipalities: 'Municipalities',
    Schools: 'Schools'
  },
  firmRelationship: {
    Pooled_Employer_Plan: 'Pooled Employer Plan (PEP)',
    Single_Employer_Plan: 'Single Employer Plan'
  },
  programId: {
    PCS: 'a3Z60000000Q1LKEA0'
  },
  webuserPermissionSet: {
    navigation: 'navigation'
  }
}
