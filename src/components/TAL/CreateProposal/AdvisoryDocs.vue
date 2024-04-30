<template>
  <v-dialog
    v-model="docsDialog"
    persistent
    class="elevation-3 dialogPosition"
    content-class="elevation-3 dialogPosition"
    scrollable
    :eager="true"
    :max-width="dialogWidth"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <v-col cols="12">
          <v-row>
            <v-col class="text-right">
              <v-icon color="accent" @click="closeDocsDialog()"> close </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="1" xs="1">
            <v-checkbox color="accent" />
          </v-col>
          <v-col cols="11" xs="11" class="py-6">
            <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']">A document from my document library</a>
          </v-col>
          <v-divider />
          <v-col xs1>
            <v-checkbox color="accent" />
          </v-col>
          <v-col xs11 py-6>
            <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']">Salary Reduction Agreement (SRA)</a>
          </v-col>
          <v-divider />
          <v-col xs1>
            <v-checkbox color="accent" />
          </v-col>
          <v-col xs11 py-6>
            <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']">
              Certification of Intent To Adopt a Pre-approved Plan
            </a>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
export default {
  props: ['value'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    function closeDocsDialog() {
      docsDialog.value = false
    }
    const docsDialog = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    return {
      theme,
      docsDialog,
      dialogWidth,
      closeDocsDialog
    }
  }
}
</script>
