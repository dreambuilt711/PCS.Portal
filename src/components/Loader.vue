<template>
  <v-row class="justify-center" color="success">
    <v-dialog v-model="load.value" persistent fullscreen content-class="loading-dialog">
      <v-container class="h-screen d-flex">
        <v-row class="justify-center align-center">
          <v-col class="shortcutflex" cols="12">
            <div class="loaderbox">
              <CustomIcon type="barLoader" />
            </div>
            <v-col class="text-center mt-3" cols="12">
              <h3 class="text-accent text-capitalize">Loading..</h3>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </v-row>
</template>

<script>
import CustomIcon from '@/components/CustomIcon'
import { computed, ref } from 'vue'
export default {
  components: {
    CustomIcon
  },
  props: ['loading'],
  setup(props) {
    const load = computed(() => {
      return ref(props.loading)
    })
    return {
      load
    }
  }
}
</script>
<style>
.loading-dialog {
  background-color: #ffffff !important;
  opacity: 0.8;
}
</style>
