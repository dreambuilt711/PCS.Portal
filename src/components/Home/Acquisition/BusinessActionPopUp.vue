<template>
  <v-col class="pa-0" cols="12">
    <v-card>
      <v-card-title class="text-secondary pa-3 bg-accent">
        <v-col class="text-left pa-0">
          <h4>Pending Approval</h4>
        </v-col>
      </v-card-title>
      <v-card-text class="text-body-1">
        <div v-if="planType === 'plan'">
          <h3 class="font-weight-medium mb-3">
            {{ planNameVal }}
          </h3>
        </div>
        <div v-if="planType === 'plan'">
          You currently do not have the necessary permission to sell this type of plan. Please get in touch with your Regional
          Manager or the Sales Team to learn more and get the approval process started.
        </div>
        <div v-if="planType === 'business'">
          You currently do not have the necessary permission to sell this type of entity. Please get in touch with your Regional
          Manager or the Sales Team to learn more and get the approval process started.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-col class="text-center pa-0">
          <v-btn color="accent" @click="confirmAction()"> Close </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
import { ref } from 'vue'
export default {
  props: ['type', 'planName'],
  setup(props, { emit }) {
    const planType = ref(props.type)
    const planNameVal = ref(props.planName)
    //methods
    function confirmAction() {
      emit('cancelAction')
    }
    return {
      planType,
      planNameVal,
      confirmAction
    }
  }
}
</script>
<style scoped>
.theme--light.v-card > .v-card__text {
  color: #000;
}
</style>
