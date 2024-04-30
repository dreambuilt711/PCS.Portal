<template>
  <v-container fluid>
    <v-col v-if="brandList.length > 0" xs12 class="mt-2">
      <v-row>
        <v-col xs12 sm12 md12 lg8 xl8 mb-2 class="text-left">
          <h1 class="font-weight-medium">Branding</h1>
        </v-col>
        <v-col
          v-if="brandTabSelected === 'logo'"
          class="text-right mr-0 d-flex justify-end"
          xs12
          sm12
          md12
          lg4
          xl4
          :class="$vuetify?.breakpoint?.mdAndDown ? 'mt-1' : 'mt-1 pt-1'"
        >
          <v-switch
            v-if="
              $authz.allowedByAccount($authz.accountPermissionSet.Allow_Advisors_Firms_Upload_Brand__c, $authz.permission.Full)
            "
            v-model="isAssociatedFirm"
            label="Allow Associated Firms to Update Branding"
            hide-details
            color="accent"
            :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : ''"
          />
          <v-switch
            v-if="
              $authz.hasRole($authz.roles.FirmAdmin) &&
              $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c, $authz.permission.Full)
            "
            v-model="isAssociatedFirmAdvisor"
            label="Allow Associated Advisors to Update Branding"
            hide-details
            color="accent"
            :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : ''"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="brandList.length > 0" xs12 pt-3>
      <v-progress-linear v-if="loading" indeterminate color="accent" height="6" class="ma-0" />
      <v-tabs
        v-model="brandTabs"
        class="mb-4"
        :color="$vuetify?.theme.dark ? '' : 'surface'"
        :bg-color="$vuetify?.theme.dark ? '' : 'accent'"
        show-arrows
        slider-color="white"
      >
        <v-tab v-for="(item, i) in brandList" :key="i" ref="check">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col v-if="brandTabSelected === 'logo'">
      <v-col v-if="!isAdvisorLevelRole()" xs12>
        <v-row>
          <v-col class="text-left" xs12>
            <h2 class="font-weight-bold">Primary Brand Logo</h2>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="!isAdvisorLevelRole()" xs12 class="text-subtitle-1 mt-1"> The logo will be used as the brand logo </v-col>
      <v-col v-if="!isAdvisorLevelRole()" xs12 sm12 md5 xl5 lg5 :class="$vuetify?.breakpoint?.mdAndUp ? 'mt-3' : 'align-self'">
        <v-card
          height="255"
          :class="{ dragging: isDragging }"
          class="border elevation-3"
          @dragenter="onDragEnter($event)"
          @dragleave="onDragLeave($event)"
          @dragover.prevent
          @drop="onDrop($event)"
        >
          <v-col>
            <v-col class="dragdrop" :class="$vuetify?.theme.dark ? '' : 'border-color'">
              <v-row v-show="contentURL == '' && imageData == '' && images == ''" class="justify-center">
                <v-col xs4 lg3 md3 sm3 xl3 flex_none mt-5>
                  <CustomIcon type="upload" />
                </v-col>
                <v-col xs8 lg5 md5 sm5 xl4 class="align-self ml-3 mt-5">
                  <p>Drag and drop image here</p>
                </v-col>
              </v-row>
              <!-- new Load -->
              <img
                v-show="contentURL != ''"
                :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                :src="contentURL"
                class="pl-3 pr-3"
                width="100%"
                height="196"
                @click="handleFile"
              />
              <!-- this is for incoming image-->
              <img
                v-show="imageData !== '' && contentURL === ''"
                :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                :src="brandImgSrc"
                class="pl-3 pr-3"
                width="100%"
                height="196"
                @click="handleFile"
              />
              <img
                v-for="(image, index) in images"
                v-show="images.length"
                :key="index"
                :src="image"
                width="100%"
                height="196"
                @click="handleFile"
              />
            </v-col>
            <v-col v-if="imageData == '' && images == ''" xs12 md12 sm12 lg12 xl12 pt-0 class="text-center">
              <v-btn
                v-show="imageData == '' && images == ''"
                variant="text"
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                @click="pickFile"
              >
                Browse
              </v-btn>
              <input ref="image" type="file" style="display: none" accept="image/*" multiple @change="onFilePicked" />
            </v-col>
            <v-col v-if="imageData !== '' && images !== ''" lg12 xl12 md12 sm12 xs12 class="text-center pt-1">
              <v-btn variant="text" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="pickFile()"> Change </v-btn>
              <input ref="image" type="file" style="display: none" accept="image/*" multiple @change="onFilePicked" />
            </v-col>
          </v-col>
        </v-card>
      </v-col>
      <v-col xs12>
        <v-row>
          <v-col v-if="!isAdvisorLevelRole()" xs12 sm12 md6 lg6 xl6>
            <v-col class="text-left mt-4" xs12>
              <h2 class="font-weight-bold">Dark Theme Logo</h2>
            </v-col>
            <v-col xs12 class="text-subtitle-1 mt-1"> The logo will be used as the brand logo </v-col>
            <v-col xs12 sm12 md10 xl10 lg10 :class="$vuetify?.breakpoint?.mdAndUp ? 'mt-3' : 'align-self'">
              <v-card
                height="255"
                :class="{ dragging: isDraggingDark }"
                class="border elevation-3"
                @dragenter="onDragEnterDark($event)"
                @dragleave="onDragLeaveDark($event)"
                @dragover.prevent
                @drop="onDropDark($event)"
              >
                <v-col>
                  <v-col class="dragdrop" :class="$vuetify?.theme.dark ? '' : 'border-color'">
                    <v-row v-show="darkImagecontentURL == '' && darkImageData == '' && Darkimages == ''" class="justify-center">
                      <v-col xs4 lg3 md3 sm3 xl3 flex_none mt-5>
                        <CustomIcon type="upload" />
                      </v-col>
                      <v-col xs8 lg5 md5 sm5 xl4 class="align-self ml-3 mt-5">
                        <p>Drag and drop image here</p>
                      </v-col>
                    </v-row>
                    <!-- new Load -->
                    <img
                      v-show="darkImagecontentURL != ''"
                      :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                      :src="darkImagecontentURL"
                      class="pl-3 pr-3"
                      width="100%"
                      height="196"
                      @click="handleDarkFile"
                    />
                    <!-- this is for incoming image-->
                    <img
                      v-show="darkImageData !== '' && darkImagecontentURL === ''"
                      :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                      :src="darkImageSrc"
                      class="pl-3 pr-3"
                      width="100%"
                      height="196"
                      @click="handleDarkFile"
                    />
                    <img
                      v-for="(image, index) in Darkimages"
                      v-show="Darkimages.length"
                      :key="index"
                      :src="image"
                      width="100%"
                      height="196"
                      @click="handleDarkFile"
                    />
                  </v-col>
                  <v-col xs12 md12 sm12 lg12 xl12 pt-0 class="text-center">
                    <v-btn
                      v-show="darkImageData == '' && Darkimages == ''"
                      variant="text"
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      @click="pickDarkFile"
                    >
                      Browse
                    </v-btn>
                    <input
                      ref="darkImage"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      multiple
                      @change="onFilePickedDark"
                    />
                  </v-col>
                  <v-col v-show="darkImageData !== '' && Darkimages !== ''" lg12 xl12 md12 sm12 xs12 class="text-center pt-1">
                    <v-btn variant="text" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="pickDarkFile()"> Change </v-btn>
                    <input ref="image" type="file" style="display: none" accept="image/*" multiple @change="onFilePicked" />
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
          </v-col>
          <v-col xs12 sm12 md6 lg6 xl6>
            <v-col class="text-left mt-4" xs12>
              <h2 class="font-weight-bold">Print Logo</h2>
            </v-col>

            <v-col xs12 sm12 md10 xl10 lg10 :class="$vuetify?.breakpoint?.mdAndUp ? '' : 'align-self'">
              <v-col xs12 class="text-subtitle-1 mb-3">
                The logo will be used on the cover of report and automatically adjusted to the appropriate size.
              </v-col>
              <v-card
                height="255"
                :class="{ dragging: isDraggingPrint }"
                class="border elevation-3"
                @dragenter="onDragEnterPrint($event)"
                @dragleave="onDragLeavePrint($event)"
                @dragover.prevent
                @drop="onDropPrint($event)"
              >
                <v-col>
                  <v-col class="dragdrop" :class="$vuetify?.theme.dark ? '' : 'border-color'">
                    <v-row
                      v-show="printImagecontentURL == '' && printImageData == '' && printImages == ''"
                      class="justify-center"
                    >
                      <v-col xs4 lg3 md3 sm3 xl3 flex_none mt-5>
                        <CustomIcon type="upload" />
                      </v-col>
                      <v-col xs8 lg5 md5 sm5 xl4 class="align-self ml-3 mt-5">
                        <p>Drag and drop image here</p>
                      </v-col>
                    </v-row>
                    <!-- new Load -->
                    <img
                      v-show="printImagecontentURL != ''"
                      :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                      :src="printImagecontentURL"
                      class="pl-3 pr-3"
                      width="100%"
                      height="196"
                      @click="handlePrintFile"
                    />
                    <!-- this is for incoming image-->
                    <img
                      v-show="printImageData !== '' && printImagecontentURL === ''"
                      :class="$vuetify?.theme.dark ? 'outlinedlight' : 'outlineddark'"
                      class="pl-3 pr-3"
                      :src="printImageSrc"
                      width="100%"
                      height="196"
                      @click="handlePrintFile"
                    />
                    <img
                      v-for="(image, index) in printImages"
                      v-show="printImages.length"
                      :key="index"
                      :src="image"
                      class="pl-3 pr-3"
                      width="100%"
                      height="196"
                      @click="handlePrintFile"
                    />
                  </v-col>
                  <v-col xs12 md12 sm12 lg12 xl12 pt-0 class="text-center">
                    <v-btn
                      v-show="printImageData == '' && printImages == ''"
                      variant="text"
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      @click="pickPrintFile"
                    >
                      Browse
                    </v-btn>
                    <input
                      ref="printImage"
                      type="file"
                      style="display: none"
                      accept="image/*"
                      multiple
                      @change="onFilePickedPrint"
                    />
                  </v-col>
                  <v-col v-show="printImageData !== '' && printImages !== ''" lg12 xl12 md12 sm12 xs12 class="text-center pt-1">
                    <v-btn
                      v-if="
                        $authz.allowedByAccount(
                          $authz.accountPermissionSet.Allow_Advisors_Firms_Upload_Brand__c,
                          $authz.permission.Full
                        )
                      "
                      variant="text"
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      @click="pickPrintFile()"
                    >
                      Change
                    </v-btn>
                    <input
                      ref="printImage"
                      type="file"
                      style="display: none"
                      accept="image/*"
                      multiple
                      @change="onFilePickedPrint"
                    />
                  </v-col>
                </v-col>
              </v-card>
              <v-col xs12 class="pt-2">
                <!-- <v-col>For the best visual results, please use a high resolution image with an aspect ratio of 2:1</v-col> -->
                <a
                  v-if="false"
                  href="#"
                  class="text-uppercase text-decoration-none pr-1 font_14"
                  :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                  @click="downloadSample()"
                  >Preview Sample Report</a
                >
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="!isAdvisorLevelRole()" xs12 :class="$vuetify?.breakpoint?.mdAndUp ? '' : ''">
        <v-col class="text-h6 text-left mt-4" xs12> Favicon </v-col>
        <v-col xs12 class="text-subtitle-1 mt-1"> Logo with 16x16 or 32x32 pixels </v-col>
        <v-col xs12 sm10 md8 lg3 xl3 mb-3 pb-5>
          <v-text-field
            v-model="favImage.favImageName"
            variant="outlined"
            label="Browse"
            prepend-icon="attach_file"
            required
            :error="error"
            :error-messages="snackbarText"
            :rules="[(v) => !!v || 'Please select file']"
            clearable
            @click="pickFileFav"
          />
          <input ref="imageFav" type="file" style="display: none" accept="image/*" multiple @change="onFilePickedFav" />
        </v-col>
      </v-col>
      <v-col xs12>
        <v-row>
          <v-col v-if="showSaveButton" xs12 class="text-right">
            <v-btn :class="[!$vuetify?.theme.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="SaveLogos()">
              Save
            </v-btn>
          </v-col>
          <v-col v-if="!isAdvisorLevelRole()" text-left xs12>
            <TermOfUse />
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col v-if="brandTabSelected === 'typography'">
      <Typography :brand-data="brand" :save-brand-method="saveBrandTypography" />
    </v-col>
    <v-col v-if="brandTabSelected === 'brandColor'">
      <BrandColor :brand-colors-data="brand" :save-brand-method="saveBrandColor" />
    </v-col>
    <v-col v-if="brandTabSelected === 'footerLinks'">
      <FooterLinks :brand-footer-data="brand" :save-brand-method="saveFooterLink" />
    </v-col>
    <canvas class="d-none" />
    <loader v-model="reportLoading" :loading="reportLoading" />
  </v-container>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
import Typography from '@/components/Brand/Typography'
import BrandColor from '@/components/Brand/BrandColors'
import FooterLinks from '@/components/Brand/FooterLinks'
import Loader from '@/components/Loader'
import TermOfUse from '@/components/Brand/TermOfUse'
export default {
  components: {
    CustomIcon,
    Typography,
    BrandColor,
    FooterLinks,
    Loader,
    TermOfUse
  },
  data() {
    return {
      error: false,
      brandTabs: 0,
      tabList: [
        { text: 'LOGO', value: 'logo' },
        { text: 'TYPOGRAPHY', value: 'typography' },
        { text: 'BRAND COLOR', value: 'brandColor' },
        { text: 'FOOTER & SOCIAL LINKS', value: 'footerLinks' }
      ],
      isAssociatedFirm: false,
      isAssociatedFirmAdvisor: false,
      //primary logo data
      contentURL: '',
      imageData: '',
      images: [],
      image: {
        imageUrl: '',
        imageName: '',
        imagebyte: ''
      },
      isDragging: false,
      files: [],
      Filetype: '',
      fileData: '',
      //dark logo data
      isDraggingDark: false,
      darkfiles: [],
      darkImagecontentURL: '',
      darkImage: {
        darkImageUrl: '',
        darkImageName: '',
        darkImagebyte: ''
      },
      darkFiletype: '',
      darkfileData: '',
      darkImageData: '',
      Darkimages: [],
      //print logo data
      isDraggingPrint: false,
      Printfiles: [],
      printImagecontentURL: '',
      printImage: {
        printImageUrl: '',
        printImageName: '',
        printImagebyte: ''
      },
      printFileType: '',
      PrintFileData: '',
      printImageData: '',
      printImages: [],
      //favIcon data
      contentURLFav: '',
      favImage: {
        favImageUrl: '',
        favImageName: '',
        favImagebyte: ''
      },
      favFileType: '',
      favFileData: '',
      imageDataFav: '',
      brandImgSrc: '',
      darkImageSrc: '',
      printImageSrc: '',
      favImageSrc: '',
      brandData: [],
      snackbarText: '',
      brandList: [],
      brandTabSelected: '',
      brand: {
        programId: '',
        accountId: '',
        relationshipId: '',
        productId: '',
        brandId: '',
        login_URL__c: '',
        advisor_Phone_Number__c: '',
        copyright__c: '',
        legal_Policy__c: '',
        privacy_Policy__c: '',
        facebook__c: '',
        linkedin__c: '',
        twitter__c: '',
        advisors_Firms_to_promote_Social_Media__c: false,
        advisors_Firms_to_Upload_own_Brand__c: 'No',
        advisors_Firms_Update_Copyright_Privacy__c: false,
        brand: {
          analytics_Code__c: '',
          background__c: '',
          bG_Graphic1__c: '',
          bG_Graphic_2__c: '',
          bG_Graphic_3__c: '',
          brand_Name__c: '',
          color1__c: '',
          color1_B__c: '',
          color1_G__c: '',
          color1_R__c: '',
          color2__c: '',
          color3__c: '',
          color4__c: '',
          content2__c: '',
          content3__c: '',
          content4__c: '',
          dark_Theme_Logo__c: '',
          dismiss_Error__c: '',
          dismiss_Information__c: '',
          dismiss_Success__c: '',
          dismiss_Warning__c: '',
          email_Logo__c: '',
          error_Active__c: '',
          error_Date_From__c: '',
          error_Date_To__c: '',
          error_Description__c: '',
          favicon__c: '',
          font_Family__c: 'Arial',
          font_Size__c: '10',
          information_Active__c: '',
          information_Date_From__c: '',
          information_Date_To__c: '',
          information_Description__c: '',
          link__c: '',
          navigation_1_Label__c: '',
          navigation_1_URL__c: '',
          navigation_2_Label__c: '',
          navigation_2_URL__c: '',
          navigation_3_Label__c: '',
          navigation_3_URL__c: '',
          navigation_4_Label__c: '',
          navigation_4_URL__c: '',
          navigation_5_Label__c: '',
          navigation_5_URL__c: '',
          navigation_6_Label__c: '',
          navigation_6_URL__c: '',
          print_Logo__c: '',
          success_Active__c: '',
          success_Date_From__c: '',
          success_Date_To__c: '',
          success_Description__c: '',
          surface__c: '',
          textColor1__c: '',
          textColor2__c: '',
          textColor3__c: '',
          textColor4__c: '',
          warning_Active__c: '',
          warning_Date_From__c: '',
          warning_Date_To__c: '',
          warning_Description__c: '',
          web_Logo__c: '',
          welcome_Content__c: ''
        }
      },
      loading: false,
      reportLoading: false,
      refreshKey: 0
    }
  },
  computed: {
    showSaveButton() {
      if (this.$authz.hasPermission(this.$authz.permissionSet.Branding_Items__c, this.$authz.permission.Full)) {
        if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
          return true
        } else if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
          return this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
            this.$authz.permission.Full
          )
        } else if (
          this.$authz.hasRole(this.$authz.roles.Advisor) ||
          this.$authz.hasRole(this.$authz.roles.Strategist) ||
          this.$authz.hasRole(this.$authz.roles.Fiduciary338)
        ) {
          return (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
              this.$authz.permission.Full
            ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Allow_Advisors_Firms_Upload_Brand__c,
              this.$authz.permission.Full
            )
          )
        } else return true
      }
      return false
    }
  },
  watch: {
    tabList: {
      handler() {
        if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
          this.brandList = this.tabList
          return
        }
        if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
          if (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
              this.$authz.permission.None
            )
          ) {
            var logo = this.tabList.findIndex((a) => a.value === 'logo')
            if (logo > -1) this.tabList.splice(logo, 3)
          }

          if (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
              this.$authz.permission.None
            ) &&
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
              this.$authz.permission.None
            )
          ) {
            var footer = this.tabList.findIndex((a) => a.value === 'footerLinks')
            if (footer > -1) this.tabList.splice(footer, 1)
          }
        } else if (
          this.$authz.hasRole(this.$authz.roles.Advisor) ||
          this.$authz.hasRole(this.$authz.roles.Strategist) ||
          this.$authz.hasRole(this.$authz.roles.Fiduciary338)
        ) {
          if (this.tabList.length > 1) this.tabList.splice(1, 3)
        }
        this.brandList = this.tabList
      },
      deep: true,
      immediate: true
    },
    brandTabs: {
      handler(val) {
        this.brandTabSelected = this.brandList.length > 0 ? this.brandList[val].value : ''
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.updateBrandBasedOnValue()
    this.LoadLogo()
    this.checkPermissionSwitches()
  },
  methods: {
    resetLogoData() {
      this.image.imageName = ''
      this.imageData = ''
      this.darkImage.darkImageName = ''
      this.darkImageData = ''
      this.printImageData = ''
      this.printImage.printImageName = ''
      this.imageDataFav = ''
      this.favFileData = ''
      this.contentURLFav = ''
      this.favImage.favImageName = ''
      this.brandImgSrc = this.brand.brand.web_Logo__c
      this.printImageSrc = this.brand.brand.print_Logo__c
      this.darkImageSrc = this.brand.brand.dark_Theme_Logo__c
      this.favImageSrc = this.brand.brand.favicon__c
    },
    handleFile() {
      this.$refs.image[1].click()
    },
    gcd(a, b) {
      return b === 0 ? a : this.gcd(b, a % b)
    },
    async onFilePicked(e) {
      const files = e.target.files
      if (files.length > 0) {
        this.snackbarText = ''
        this.error = false
        if (files[0] !== undefined) {
          this.Filetype = files[0].type
          var imageSize = parseFloat(files[0].size / 1024)
          if (!this.validateFileType(this.Filetype)) {
            this.fileData = ''
            return
          }
          if (!this.validateLogoSize(imageSize)) {
            this.fileData = ''
            return
          }
          this.image.imageName = files[0].name
          this.fileData = files[0]
          if (this.image.imageName.lastIndexOf('.') <= 0) {
            return
          }
          const fr = new FileReader()
          fr.readAsDataURL(files[0])
          // eslint-disable-next-line no-unused-vars
          fr.onload = (evt) => {
            let img = new Image()
            img.onload = () => {
              this.imgExt = 'data:' + files[0].type + ';base64,'
              this.contentURL = fr.result
              this.imageData = fr.result
              this.loadFile = true
            }
            img.src = fr.result
          }
        } else {
          this.image.imageName = ''
          this.contentURL = ''
        }
      }
    },
    pickFile() {
      this.$refs.image.click()
    },
    clearLogo() {
      this.imageData = ''
      this.image.imageName = ''
      this.contentURL = ''
      this.brandImgSrc = ''
      this.fileData = ''
      this.images = []
      this.files = []
      this.$refs.image.value = ''
    },
    onDragEnter($event) {
      $event.preventDefault()
      this.isDragging = true
    },
    onDragLeave($event) {
      $event.preventDefault()
      this.isDragging = false
    },
    onDrop($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.isDragging = false
      const files = $event.dataTransfer.files
      if (files.length > 0) if (!this.validateFileType(files[0].type)) return
      Array.from(files).forEach((file) => this.addImage(file))
    },
    async addImage(file) {
      if (file !== undefined) {
        this.files = []
        this.files.push(file)
        this.Filetype = this.files[0].type
        var imageSize = parseFloat(this.files[0].size / 1024)
        if (!this.validateFileType(this.Filetype)) {
          this.fileData = ''
          return
        }
        if (!this.validateLogoSize(imageSize)) {
          this.fileData = ''
          return
        }
        this.image.imageName = this.files[0].name
        if (this.image.imageName.lastIndexOf('.') <= 0) {
          return
        }
        this.fileData = this.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(this.files[0])
        // eslint-disable-next-line no-unused-vars
        fr.onload = (evt) => {
          let img = new Image()
          img.onload = () => {
            this.imgExt = 'data:' + this.files[0].type + ';base64,'
            this.contentURL = fr.result
            this.imageData = fr.result
            this.loadFile = true
          }
          img.src = fr.result
        }
      }
    },
    clearDarkLogo() {
      this.darkImageData = ''
      this.darkImage.darkImageName = ''
      this.darkImagecontentURL = ''
      this.darkfileData = ''
      this.darkImageSrc = ''
      this.Darkimages = []
      this.darkfiles = []
      this.$refs.darkImage.value = ''
    },
    clearPrintLogo() {
      this.printImageData = ''
      this.printImage.printImageName = ''
      this.printImagecontentURL = ''
      this.PrintFileData = ''
      this.printImageSrc = ''
      this.printImages = []
      this.printfiles = []
      this.$refs.printImage.value = ''
    },
    SaveLogos() {
      if (!this.isAdvisorLevelRole()) {
        if (!this.brandImgSrc && !this.fileData) {
          this.$toast?.destroy()
          this.$toast.error('Brand Logo Updation Failed', '', this.notificationSystem.options.error)
          return
        }
        if (!this.darkImageSrc && !this.darkfileData) {
          this.$toast?.destroy()
          this.$toast.error('Dark Theme Logo Updation Failed', '', this.notificationSystem.options.error)
          return
        }
      }
      if (!this.printImageSrc && !this.PrintFileData) {
        this.$toast?.destroy()
        this.$toast.error('Brand Print Logo Updation Failed', '', this.notificationSystem.options.error)
        return
      }
      this.insertLogo()
      this.$vuetify.goTo(0)
    },
    async insertLogo() {
      this.loading = true
      var promises = []
      if (this.contentURL !== '' || this.imageData !== '') {
        if (this.fileData) {
          var formData = new FormData()
          formData.append('logo', this.fileData)
          var that = this
          promises.push(
            this.$axios
              .post(`/api/v1/brandapi/advisor/logo/WebBanner`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .catch(() => {
                this.$toast?.destroy()
                this.$toast.error('Failed to Insert Web Logo', '', this.notificationSystem.options.error)
                that.loadingSubmit = false
              })
          )
        }
      }
      if (this.darkImagecontentURL !== '' || this.darkImageData !== '') {
        if (this.darkfileData) {
          var formDataDark = new FormData()
          formDataDark.append('logo', this.darkfileData)
          promises.push(
            this.$axios.post(`/api/v1/brandapi/advisor/logo/DarkTheme`, formDataDark, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          )
        }
      }
      if (this.printImagecontentURL !== '' || this.printImageData !== '') {
        if (this.PrintFileData) {
          var printData = new FormData()
          printData.append('logo', this.PrintFileData)
          var imageType = !this.isAdvisorLevelRole() ? 'ReportBanner' : 'Banner'
          promises.push(
            this.$axios
              .post(`/api/v1/brandapi/advisor/logo/${imageType}`, printData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .catch(() => {
                this.$toast?.destroy()
                this.$toast.error('Failed to Insert Print Logo', '', this.notificationSystem.options.error)
              })
          )
        }
      }
      if (this.favFileData) {
        var favData = new FormData()
        favData.append('logo', this.favFileData)
        promises.push(
          this.$axios
            .post(`/api/v1/brandapi/advisor/logo/Favicon`, favData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .catch(() => {
              this.$toast?.destroy()
              this.$toast.error('Failed to Insert Print Logo', '', this.notificationSystem.options.error)
            })
        )
      }
      await Promise.all(promises)
      if (!this.isAdvisorLevelRole()) this.saveBrand(true)
      if (this.isAdvisorLevelRole()) this.$store.dispatch('getAdvisorPrintLogo')

      this.$toast?.destroy()
      this.$toast.success('Brand Logo Updated Successfully', '', this.notificationSystem.options.success)
      this.loading = false
      this.refreshKey += 1
    },
    handleDarkFile() {
      this.$refs.darkImage[1].click()
    },
    async onFilePickedDark(e) {
      const Darkfiles = e.target.files
      if (Darkfiles.length > 0) {
        if (Darkfiles[0] !== undefined) {
          this.darkFiletype = Darkfiles[0].type
          var imageSize = parseFloat(Darkfiles[0].size / 1024)
          if (!this.validateFileType(this.darkFiletype)) {
            this.darkfileData = ''
            return
          }
          if (!this.validateLogoSize(imageSize)) {
            this.darkfileData = ''
            return
          }
          this.darkImage.darkImageName = Darkfiles[0].name
          if (this.darkImage.darkImageName.lastIndexOf('.') <= 0) {
            return
          }
          this.darkfileData = Darkfiles[0]
          const darkfr = new FileReader()
          darkfr.readAsDataURL(Darkfiles[0])
          // eslint-disable-next-line no-unused-vars
          darkfr.onload = (evt) => {
            let img = new Image()
            img.onload = () => {
              this.imgExt = 'data:' + Darkfiles[0].type + ';base64,'
              this.darkImagecontentURL = darkfr.result
              this.darkImageData = darkfr.result
              this.loadFile = true
            }

            img.src = darkfr.result
          }
        }
      }
    },
    pickDarkFile() {
      this.$refs.darkImage.click()
    },
    onDragEnterDark($event) {
      $event.preventDefault()
      this.isDraggingDark = true
    },
    onDragLeaveDark($event) {
      $event.preventDefault()
      this.isDraggingDark = false
    },
    onDropDark($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.isDraggingDark = false
      const darkThemefiles = $event.dataTransfer.files
      if (darkThemefiles.length > 0) if (!this.validateFileType(darkThemefiles[0].type)) return
      Array.from(darkThemefiles).forEach((file) => this.addDarkImage(file))
    },
    async addDarkImage(file) {
      if (file !== undefined) {
        this.darkfiles = []
        this.darkfiles.push(file)
        this.darkFiletype = this.darkfiles[0].type
        var imageSize = parseFloat(this.darkfiles[0].size / 1024)
        if (!this.validateFileType(this.darkFiletype)) {
          this.darkfileData = ''
          return
        }
        if (!this.validateLogoSize(imageSize)) {
          this.darkfileData = ''
          return
        }
        this.darkImage.darkImageName = this.darkfiles[0].name
        if (this.darkImage.darkImageName.lastIndexOf('.') <= 0) {
          return
        }
        this.darkfileData = this.darkfiles[0]
        const darkfr = new FileReader()
        darkfr.readAsDataURL(this.darkfiles[0])
        // eslint-disable-next-line no-unused-vars
        darkfr.onload = (evt) => {
          let img = new Image()
          img.onload = () => {
            this.imgExt = 'data:' + this.darkfiles[0].type + ';base64,'
            this.darkImagecontentURL = darkfr.result
            this.darkImageData = darkfr.result
            this.loadFile = true
          }
          img.src = darkfr.result
        }
      }
    },
    handlePrintFile() {
      this.$refs.printImage[1].click()
    },
    async onFilePickedPrint(e) {
      const printFiles = e.target.files
      if (printFiles.length > 0) {
        if (printFiles[0] !== undefined) {
          this.printFileType = printFiles[0].type
          var imageSize = parseFloat(printFiles[0].size / 1024)
          if (!this.validateFileType(this.printFileType)) {
            this.PrintFileData = ''
            return
          }
          if (!this.validatePrintLogoSize(imageSize)) {
            this.PrintFileData = ''
            return
          }
          this.printImage.printImageName = printFiles[0].name
          if (this.printImage.printImageName.lastIndexOf('.') <= 0) {
            return
          }
          this.PrintFileData = printFiles[0]
          const printfr = new FileReader()
          printfr.readAsDataURL(printFiles[0])
          // eslint-disable-next-line no-unused-vars
          printfr.onload = (evt) => {
            let img = new Image()
            img.onload = () => {
              this.imgExt = 'data:' + printFiles[0].type + ';base64,'
              this.printImagecontentURL = printfr.result
              this.printImageData = printfr.result
              this.loadFile = true
            }
            img.src = printfr.result
          }
        }
      }
    },
    pickPrintFile() {
      this.$refs.printImage.click()
    },
    onDragEnterPrint($event) {
      $event.preventDefault()
      this.isDraggingPrint = true
    },
    onDragLeavePrint($event) {
      $event.preventDefault()
      this.isDraggingPrint = false
    },
    onDropPrint($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.isDraggingPrint = false
      const printfiles = $event.dataTransfer.files
      if (printfiles.length > 0) if (!this.validateFileType(printfiles[0].type)) return
      Array.from(printfiles).forEach((file) => this.addPrintImage(file))
    },
    async addPrintImage(file) {
      if (file !== undefined) {
        this.printfiles = []
        this.Printfiles.push(file)
        this.printFileType = this.Printfiles[0].type
        var imageSize = parseFloat(this.Printfiles[0].size / 1024)
        if (!this.validateFileType(this.printFileType)) {
          this.PrintFileData = ''
          return
        }
        if (!this.validatePrintLogoSize(imageSize)) {
          this.PrintFileData = ''
          return
        }
        this.printImage.printImageName = this.Printfiles[0].name
        if (this.printImage.printImageName.lastIndexOf('.') <= 0) {
          return
        }
        this.PrintFileData = this.printFiles[0]
        const printtfr = new FileReader()
        printtfr.readAsDataURL(this.Printfiles[0])
        // eslint-disable-next-line no-unused-vars
        printtfr.onload = (evt) => {
          let img = new Image()
          img.onload = () => {
            this.imgExt = 'data:' + this.Printfiles[0].type + ';base64,'
            this.printImagecontentURL = printtfr.result
            this.printImageData = printtfr.result
            this.loadFile = true
          }
          img.src = printtfr.result
        }
      }
    },
    pickFileFav() {
      this.$refs.imageFav.click()
    },
    onFilePickedFav(e) {
      const filesfav = e.target.files
      if (filesfav.length > 0) {
        this.snackbarText = ''
        this.error = false
        if (filesfav[0] !== undefined) {
          if (filesfav[0].type !== 'image/png' && filesfav[0].type !== 'image/svg+xml') {
            this.$toast?.destroy()
            this.$toast.error('File type is not supported', '', this.notificationSystem.options.error)
            this.contentURLFav = ''
            this.favImage.favImageName = ''
            this.favFileData = ''
            return
          }
          this.favFileType = filesfav[0].type
          this.favFileData = filesfav[0]
          var imageSize = parseInt(filesfav[0].size / 1024)
          if (imageSize > 512) {
            this.error = true
            this.snackbarText = 'File size is more than 512 KB'
            this.contentURLFav = ''
            this.favImage.favImageName = ''
            this.favFileData = ''
            return
          }
          this.favFileData = filesfav[0]
          this.favImage.favImageName = filesfav[0].name
          if (this.favImage.favImageName.lastIndexOf('.') <= 0) {
            return
          }
          const fr = new FileReader()
          fr.readAsDataURL(filesfav[0])
          // eslint-disable-next-line no-unused-vars
          fr.onload = (evt) => {
            let img = new Image()
            img.onload = () => {
              if ((img.width !== 16 || img.width !== 32) && img.height !== 16 && img.height !== 32) {
                this.$toast?.destroy()
                this.$toast.error('File must be between the size of 16x16 or 32x32 px', '', this.notificationSystem.options.error)
                this.favFileData = ''
                this.contentURLFav = ''
                this.favImage.favImageName = ''
                return
              }
              this.imgExt = 'data:' + filesfav[0].type + ';base64,'
              this.contentURLFav = fr.result
              this.imageDataFav = fr.result
              this.loadFile = true
            }
            img.src = fr.result
          }
        } else {
          this.favImage.favImageName = ''
          this.contentURLFav = ''
        }
      }
    },
    checkPermissionSwitches() {
      var selectedProgram = this.$store.state.user.selectedProgram
      if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
        if (selectedProgram) {
          this.brand.advisors_Firms_to_promote_Social_Media__c = this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
            this.$authz.permission.Full
          )
          this.brand.advisors_Firms_to_Upload_own_Brand__c = this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
            this.$authz.permission.Full
          )
          this.brand.advisors_Firms_Update_Copyright_Privacy__c = this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
            this.$authz.permission.Full
          )
        }
        this.isAssociatedFirm = this.brand.advisors_Firms_to_Upload_own_Brand__c
      }
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        this.brand.advisors_Firms_to_promote_Social_Media__c = this.$authz.allowedByAccount(
          this.$authz.accountPermissionSet.Allow_Advisors_Firms_Social_Media_Links__c,
          this.$authz.permission.Full
        )
        this.brand.advisors_Firms_to_Upload_own_Brand__c = this.$authz.allowedByAccount(
          this.$authz.accountPermissionSet.Allow_Advisors_Firms_Upload_Brand__c,
          this.$authz.permission.Full
        )
        this.brand.advisors_Firms_Update_Copyright_Privacy__c = this.$authz.allowedByAccount(
          this.$authz.accountPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
          this.$authz.permission.Full
        )
        this.isAssociatedFirmAdvisor = this.brand.advisors_Firms_to_Upload_own_Brand__c
      }
    },
    LoadLogo() {
      this.brandImgSrc = this.brand.brand.web_Logo__c
      this.printImageSrc = this.brand.brand.print_Logo__c
      this.darkImageSrc = this.brand.brand.dark_Theme_Logo__c
      this.favImageSrc = this.brand.brand.favicon__c
      this.brandImgSrc ? ((this.imageData = this.brandImgSrc), (this.contentURL = '')) : ''
      this.darkImageSrc ? ((this.darkImageData = this.darkImageSrc), (this.darkImagecontentURL = '')) : ''
      this.printImageSrc ? ((this.printImageData = this.printImageSrc), (this.printImagecontentURL = '')) : ''
      this.favImageSrc ? ((this.imageDataFav = this.favImageSrc), (this.favImageUrl = '')) : ''
      if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        if (this.$store.state.user.selectedProgram.relationshipBrands.length > 0) {
          var selectedrelationship = this.$store.state.user.selectedProgram.selectedRelationship
          var selectedRelationshipBrand = this.$store.state.user.selectedProgram.relationshipBrands.find(
            (a) => a.relationshipId === selectedrelationship.relationshipId
          )
          if (selectedRelationshipBrand) this.printImageSrc = selectedRelationshipBrand.print_Logo__c
          else this.printImageSrc = this.getBrandApiPrintLogo()
        } else {
          this.printImageSrc = this.getBrandApiPrintLogo()
        }
        this.printImageSrc ? ((this.printImageData = this.printImageSrc), (this.printImagecontentURL = '')) : ''
      }
    },
    firmOrProgramLevelPrintLogo() {
      var printImageSrc = ''
      var selectedProgram = this.$store.state.user.selectedProgram
      if (selectedProgram) {
        if (selectedProgram.selectedAccount) {
          if (selectedProgram.selectedAccount.brand) {
            printImageSrc = selectedProgram.selectedAccount.brand.print_Logo__c
          } else printImageSrc = selectedProgram.brand ? selectedProgram.brand.print_Logo__c : ''
        } else {
          if (selectedProgram.brand) printImageSrc = selectedProgram.brand.print_Logo__c
        }
        return printImageSrc
      }
    },
    getBrandApiPrintLogo() {
      var printImageSrc = ''
      var selectedRelationship = this.$store.state.user.selectedProgram.selectedRelationship
      if (selectedRelationship) {
        if (selectedRelationship.fsgId) {
          this.$axios
            .get(`/brandapi/GetCascade/${selectedRelationship.fsgId}`)
            .then((success) => {
              printImageSrc = success
            })
            .catch(() => {
              printImageSrc = this.firmOrProgramLevelPrintLogo()
            })
        } else {
          printImageSrc = this.firmOrProgramLevelPrintLogo()
        }
      }
      //in case brand api fails or no image at all
      if (printImageSrc === '') {
        printImageSrc = this.firmOrProgramLevelPrintLogo()
      }
      return printImageSrc
    },
    saveFooterLink(footerData) {
      this.brand.login_URL__c = footerData.login_URL__c
      this.brand.advisor_Phone_Number__c = footerData.advisor_Phone_Number__c
      this.brand.copyright__c = footerData.copyright__c
      this.brand.legal_Policy__c = footerData.legal_Policy__c
      this.brand.privacy_Policy__c = footerData.privacy_Policy__c
      this.brand.facebook__c = footerData.facebook__c
      this.brand.linkedin__c = footerData.linkedin__c
      this.brand.twitter__c = footerData.twitter__c
      if (
        this.$authz.hasRole(this.$authz.roles.SiteAdmin) ||
        this.$authz.hasRole(this.$authz.roles.ProgramAdmin) ||
        this.$authz.hasRole(this.$authz.roles.FirmAdmin)
      ) {
        this.brand.advisors_Firms_to_promote_Social_Media__c = footerData.advisors_Firms_to_promote_Social_Media__c
        this.brand.advisors_Firms_Update_Copyright_Privacy__c = footerData.advisors_Firms_Update_Copyright_Privacy__c
      }
      this.saveBrand()
    },
    saveBrandColor(brandColorData) {
      this.brand.brand.color1__c = brandColorData.color1__c
      this.brand.brand.color2__c = brandColorData.color2__c
      this.brand.brand.color3__c = brandColorData.color3__c
      this.brand.brand.color4__c = brandColorData.color4__c
      this.brand.brand.background__c = brandColorData.background__c
      this.brand.brand.surface__c = brandColorData.surface__c
      this.brand.brand.textColor1__c = brandColorData.textColor1__c
      this.brand.brand.textColor2__c = brandColorData.textColor2__c
      this.brand.brand.link__c = brandColorData.link__c
      this.saveBrand()
    },
    saveBrandTypography(typographyData) {
      this.brand.brand.font_Family__c = typographyData.font_Family__c
      this.brand.brand.font_Size__c = typographyData.font_Size__c
      this.saveBrand()
    },
    saveBrand(val) {
      this.loading = true
      this.brand.programId = this.$store.state.user.selectedProgram.programId
      this.brand.relationshipId = this.$store.state.user.selectedProgram.relationshipId
      this.brand.productId = this.$store.state.user.selectedProgram.selectedAccount
        ? this.$store.state.user.selectedProgram.selectedAccount.brand
          ? this.$store.state.user.selectedProgram.selectedAccount.brand.productId
          : null
        : null
      if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
        this.brand.brandId = this.$store.state.user.selectedProgram.brand
          ? this.$store.state.user.selectedProgram.brand.brandId
          : null
        this.brand.advisors_Firms_to_Upload_own_Brand__c = this.isAssociatedFirm ? 'Yes' : 'No'
      }
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        this.brand.brandId = this.$store.state.user.selectedProgram.selectedAccount.brand
          ? this.$store.state.user.selectedProgram.selectedAccount.brand.brandId
          : null
        this.brand.accountId = this.$store.state.user.selectedProgram.selectedAccount
          ? this.$store.state.user.selectedProgram.selectedAccount.accountId
          : null
        this.brand.advisors_Firms_to_Upload_own_Brand__c = this.isAssociatedFirmAdvisor ? 'Yes' : 'No'
      }
      this.$axios
        .post('/api/v1/user/brand', this.brand)
        .then((success) => {
          if (success.data.d) {
            this.updateStoreAfterSave(val)
            this.lastUpdatedBrand = this.$store.state.user.selectedProgram
            this.loading = false
          } else {
            this.$toast?.destroy()
            this.$toast.error('Unable to save the branding changes', '', this.notificationSystem.options.error)
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
          this.$toast?.destroy()
          this.$toast.error('Unable to save the branding changes', '', this.notificationSystem.options.error)
        })
    },
    updateBrandBasedOnValue() {
      var isAdminLevelRole = this.isAdminLevelRole()
      var selectedProgram = this.$store.state.user.selectedProgram
      var selectedAccount = selectedProgram.selectedAccount
      if (isAdminLevelRole || (this.$authz.hasRole(this.$authz.roles.FirmAdmin) && !selectedAccount.brand)) {
        this.brand.login_URL__c = this.$root.$children[0].loginUrl
        this.brand.advisor_Phone_Number__c = this.$root.$children[0].Phone
        this.brand.copyright__c = this.$root.$children[0].copyright
        this.brand.legal_Policy__c = this.$root.$children[0].Legal
        this.brand.privacy_Policy__c = this.$root.$children[0].privacyPolicy
        this.brand.facebook__c = this.$root.$children[0].Facebook
        this.brand.linkedin__c = this.$root.$children[0].Linkedin
        this.brand.twitter__c = this.$root.$children[0].Twitter
        this.brand.brand.analytics_Code__c = this.$root.$children[0].analyticCode
        this.brand.brand.background__c = this.$root.$children[0].background ? this.$root.$children[0].background : '#FFFFFF'
        this.brand.brand.bG_Graphic1__c = this.$root.$children[0].bgGraphic1
        this.brand.brand.bG_Graphic_2__c = this.$root.$children[0].bgGraphic2
        this.brand.brand.bG_Graphic_3__c = this.$root.$children[0].bgGraphic3
        this.brand.brand.brand_Name__c = this.$root.$children[0].brandName
        this.brand.brand.color1__c = this.$root.$children[0].accentColor1 ? this.$root.$children[0].accentColor1 : '#FFFFFF'
        this.brand.brand.color1_B__c = this.$root.$children[0].color1B
        this.brand.brand.color1_G__c = this.$root.$children[0].color1G
        this.brand.brand.color1_R__c = this.$root.$children[0].color1R
        this.brand.brand.color2__c = this.$root.$children[0].accentColor2 ? this.$root.$children[0].accentColor2 : '#FFFFFF'
        this.brand.brand.color3__c = this.$root.$children[0].accentColor3 ? this.$root.$children[0].accentColor3 : '#FFFFFF'
        this.brand.brand.color4__c = this.$root.$children[0].accentColor4 ? this.$root.$children[0].accentColor4 : '#FFFFFF'
        this.brand.brand.content2__c = this.$root.$children[0].content2
        this.brand.brand.content3__c = this.$root.$children[0].content3
        this.brand.brand.content4__c = this.$root.$children[0].content4
        this.brand.brand.dark_Theme_Logo__c = this.$root.$children[0].darkThemeLogo
        this.brand.brand.dismiss_Error__c = this.$root.$children[0].dismissError
        this.brand.brand.dismiss_Information__c = this.$root.$children[0].dismissInformation
        this.brand.brand.dismiss_Success_6_c = this.$root.$children[0].dismissInformation
        this.brand.brand.dismiss_Warning__c = this.$root.$children[0].dismissWarning
        this.brand.brand.email_Logo__c = this.$root.$children[0].emailLogo
        this.brand.brand.error_Active__c = this.$root.$children[0].errorActive
        this.brand.brand.error_Date_From__c = this.$root.$children[0].errorDateFrom
        this.brand.brand.error_Date_To__c = this.$root.$children[0].errorDateTo
        this.brand.brand.error_Description__c = this.$root.$children[0].errorDescription
        this.brand.brand.favicon__c = this.$root.$children[0].favicon
        this.brand.brand.font_Family__c = this.$root.$children[0].fontfamily
        this.brand.brand.font_Size__c = this.$root.$children[0].fontsize ? this.$root.$children[0].fontsize : 10
        this.brand.brand.information_Active__c = this.$root.$children[0].informationActive
        this.brand.brand.information_Date_From__c = this.$root.$children[0].informationDateFrom
        this.brand.brand.information_Date_To__c = this.$root.$children[0].informationDateTo
        this.brand.brand.information_Description__c = this.$root.$children[0].informationDescription
        this.brand.brand.link__c = this.$root.$children[0].link
        this.brand.brand.print_Logo__c = this.$root.$children[0].printLogo
        this.brand.brand.success_Active__c = this.$root.$children[0].successActive
        this.brand.brand.success_Date_From__c = this.$root.$children[0].successDateFrom
        this.brand.brand.success_Date_To__c = this.$root.$children[0].successDateTo
        this.brand.brand.success_Description__c = this.$root.$children[0].successDescription
        this.brand.brand.surface__c = this.$root.$children[0].surface ? this.$root.$children[0].surface : '#FFFFFF'
        this.brand.brand.textColor1__c = this.$root.$children[0].textColor1 ? this.$root.$children[0].textColor1 : '#FFFFFF'
        this.brand.brand.textColor2__c = this.$root.$children[0].textColor2 ? this.$root.$children[0].textColor2 : '#FFFFFF'
        this.brand.brand.textColor3__c = this.$root.$children[0].textColor3
        this.brand.brand.textColor4__c = this.$root.$children[0].textColor4
        this.brand.brand.warning_Active__c = this.$root.$children[0].warningActive
        this.brand.brand.warning_Date_From__c = this.$root.$children[0].warningDateFrom
        this.brand.brand.warning_Date_To__c = this.$root.$children[0].warningDateTo
        this.brand.brand.warning_Description__c = this.$root.$children[0].warningDescription
        this.brand.brand.web_Logo__c = this.$root.$children[0].companyLogo
        this.brand.brand.welcome_Content__c = this.$root.$children[0].welcomeContent
      } else if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        if (selectedAccount) {
          if (selectedAccount.brand) {
            this.brand.brand.color1__c = selectedAccount.brand.color1__c
            this.brand.brand.color2__c = selectedAccount.brand.color2__c
            this.brand.brand.color3__c = selectedAccount.brand.color3__c
            this.brand.brand.color4__c = selectedAccount.brand.color4__c
            this.brand.brand.background__c = selectedAccount.brand.background__c
            this.brand.brand.surface__c = selectedAccount.brand.surface__c
            this.brand.brand.textColor1__c = selectedAccount.brand.textColor1__c
            this.brand.brand.textColor2__c = selectedAccount.brand.textColor2__c
            this.brand.brand.link__c = selectedAccount.brand.link__c
            this.brand.brand.web_Logo__c = selectedAccount.brand.web_Logo__c
            this.brand.brand.print_Logo__c = selectedAccount.brand.print_Logo__c
            this.brand.brand.dark_Theme_Logo__c = selectedAccount.brand.dark_Theme_Logo__c
            this.brand.login_URL__c = selectedAccount.login_URL__c
            this.brand.brand.login_URL__c = selectedAccount.brand.brand_Name__c
            this.brand.copyright__c = selectedAccount.copyright__c
            this.brand.privacy_Policy__c = selectedAccount.privacy_Policy__c
            this.brand.facebook__c = selectedAccount.facebook__c
            this.brand.linkedin__c = selectedAccount.linkedin__c
            this.brand.advisor_Phone_Number__c = selectedAccount.phone
            this.brand.twitter__c = selectedAccount.twitter__c
            this.brand.legal_Policy__c = selectedAccount.legal_Policy__c
            this.brand.brand.font_Size__c = selectedAccount.brand.font_Size__c ? selectedAccount.brand.font_Size__c : 10
            this.brand.brand.font_Family__c = selectedAccount.brand.font_Family__c
            this.brand.brand.favicon__c = selectedAccount.brand.favicon__c
          }
        }
      }
    },
    updateStoreAfterSave(val) {
      var selectedProgram = this.$store.state.user.selectedProgram
      var isAdminLevelRole = this.isAdminLevelRole()
      //for admin level role
      if (selectedProgram.brand && isAdminLevelRole) {
        this.applyProgramBrand(val)
      } else {
        if (!val) {
          this.$toast?.destroy()
          this.$toast.success('Brand updated successfully', '', this.notificationSystem.options.success)
        }
      }
    },
    applyProgramBrand(val) {
      var selectedProgram = this.$store.state.user.selectedProgram
      if (Object.keys(selectedProgram.brand ? selectedProgram.brand : {}).length > 0) this.storeSelectedBrand(val)
    },
    async storeSelectedBrand(val) {
      var selected = this.$store.state.user.selectedProgram
      this.$store.state.theme.accentColors = [
        this.brand.brand.color1__c,
        this.brand.brand.color2__c,
        this.brand.brand.color3__c,
        this.brand.brand.color4__c
      ]
      selected.brand.color1__c = this.brand.brand.color1__c
      selected.brand.color2__c = this.brand.brand.color2__c
      selected.brand.color3__c = this.brand.brand.color3__c
      selected.brand.color4__c = this.brand.brand.color4__c
      selected.brand.background__c = this.brand.brand.background__c
      selected.brand.surface__c = this.brand.brand.surface__c
      selected.brand.textColor1__c = this.brand.brand.textColor1__c
      selected.brand.textColor2__c = this.brand.brand.textColor2__c
      selected.brand.link__c = this.brand.brand.link__c
      selected.brand.web_Logo__c = `${this.brand.brand.web_Logo__c}&refreshKey=${this.refreshKey}`
      selected.brand.print_Logo__c = this.brand.brand.print_Logo__c
      selected.brand.dark_Theme_Logo__c = `${this.brand.brand.dark_Theme_Logo__c}&refreshKey=${this.refreshKey}`
      selected.login_URL__c = this.brand.login_URL__c
      selected.brand.brand_Name__c = this.brand.brand.login_URL__c
      selected.copyright__c = this.brand.copyright__c
      selected.privacy_Policy__c = this.brand.privacy_Policy__c
      selected.facebook__c = this.brand.facebook__c
      selected.linkedin__c = this.brand.linkedin__c
      selected.advisor_Phone_Number__c = this.brand.advisor_Phone_Number__c
      selected.twitter__c = this.brand.twitter__c
      selected.legal_Policy__c = this.brand.legal_Policy__c
      selected.brand.font_Size__c = this.brand.brand.font_Size__c ? this.brand.brand.font_Size__c : 10
      selected.brand.font_Family__c = this.brand.brand.font_Family__c
      selected.brand.favicon__c = `${this.brand.brand.favicon__c}&refreshKey=${this.refreshKey}`

      this.$store.state.user.selectedProgram = selected
      this.$root.$children[0].changeThemes(true)
      if (!val) {
        this.$toast?.destroy()
        this.$toast.success('Brand updated successfully', '', this.notificationSystem.options.success)
      }
    },
    validateLogoSize(imageSize) {
      if (imageSize > 3000) {
        this.$toast?.destroy()
        this.$toast.error('File must be between the size of 5KB - 3MB', '', this.notificationSystem.options.error)
        return false
      }
      if (imageSize <= 4) {
        this.$toast?.destroy()
        this.$toast.error('File must be between the size of 5KB - 3MB', '', this.notificationSystem.options.error)
        return false
      }
      return true
    },
    validatePrintLogoSize(imageSize) {
      if (imageSize > 10000) {
        this.$toast?.destroy()
        this.$toast.error('File must be between the size of 5KB - 10MB', '', this.notificationSystem.options.error)
        return false
      }
      if (imageSize <= 4) {
        this.$toast?.destroy()
        this.$toast.error('File must be between the size of 5KB - 3MB', '', this.notificationSystem.options.error)
        return false
      }
      return true
    },
    validateFileType(type) {
      if (
        type !== 'image/png' &&
        type !== 'image/bmp' &&
        type !== 'image/jpg' &&
        type !== 'image/jpeg' &&
        type !== 'image/x-emf' &&
        type !== 'image/svg+xml'
      ) {
        this.$toast?.destroy()
        this.$toast.error('File type is not supported', '', this.notificationSystem.options.error)
        return false
      }
      return true
    },
    downloadSample() {
      this.reportLoading = true
      var reportRequest = {
        seinPNumber: '231896263-001',
        preparedby: this.$store.state.user.name,
        isExpress: true,
        planName: 'Sample Plan'
      }
      this.$axios('/api/v1/tal/report/diagnostic', {
        method: 'POST',
        data: reportRequest
      })
        .then((response) => {
          this.onPopUpEvent(
            `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
            response.data.reportName
          )
          this.reportLoading = false
        })
        .catch(() => {
          this.reportLoading = false
        })
    },
    isAdminLevelRole() {
      return this.$store.state.user.selectedProgram.roles.some(
        (a) => a.roleName === this.$authz.roles.SiteAdmin || a.roleName === this.$authz.roles.ProgramAdmin
      )
    },
    isAdvisorLevelRole() {
      return (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      )
    }
  }
}
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.dragdrop {
  border: dashed 2px !important;
  height: 200px !important;
}
.border-color {
  border-color: rgb(var(--v-theme-accent)) !important;
}
.border {
  padding: 8px !important;
}
.v-text-field {
  padding-top: 5px !important;
  margin-top: 2px !important;
}
</style>
