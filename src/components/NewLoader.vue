<template>
  <v-row justify="center" align="center">
    <v-overlay
      contained
      :model-value="load"
      z-index="4"
      :class="addCss ? 'loaderCss' : ''"
      class="align-center justify-center loaderOverlay"
    >
      <v-col class="shortcutflex pa-0" cols="12">
        <v-row class="justify-center align-center">
          <v-col class="loaderbox pa-0 justify-center align-center d-flex">
            <CustomIcon type="barLoader" />
          </v-col>
          <v-col class="text-center mt-3 pa-0" cols="12">
            <h3 class="'text-accent text-capitalize'">
              {{ loadingText ? loadingText.toLowerCase() : '' }}
            </h3>
          </v-col>
        </v-row>
      </v-col>
    </v-overlay>
  </v-row>
</template>
<script>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    CustomIcon
  },
  props: ['loadingText', 'loading', 'count'],
  setup(props) {
    const theme = useTheme()
    const load = computed(() => {
      return props.loading
    })
    const addCss = computed(() => {
      if (parseInt(props.count) > 0) return true
      else return false
    })
    return {
      theme,
      load,
      addCss
    }
  }
}
</script>
