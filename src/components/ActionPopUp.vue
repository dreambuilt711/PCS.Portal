<template>
  <v-col>
    <v-card>
      <v-card-title class="text-secondary pa-3" :class="theme.dark ? '' : 'bg-accent'">
        <v-col class="text-left">
          <h4>{{ actionText }}</h4>
        </v-col>
      </v-card-title>
      <v-card-text class="text-body-1">
        <div>{{ actionMessage }}</div>
      </v-card-text>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn class="ma-0" size="small" :class="theme.dark ? '' : 'text-accent'" variant="text" @click="cancelAction()">
            {{ cancelActionText === '' ? 'No' : cancelActionText }}
          </v-btn>
          <v-btn
            v-if="showConfirmAction"
            class="ma-0"
            size="small"
            :class="theme.dark ? '' : 'text-accent'"
            variant="text"
            @click="confirmAction()"
          >
            {{ title === '' ? 'Yes' : title }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
export default {
  props: {
    confirmActionText: {
      type: String,
      default: ''
    },
    cancelActionText: {
      type: String,
      default: ''
    },
    actionText: {
      default: 'Delete'
    },
    actionMessage: {
      default: 'Are you sure you want to delete?'
    },
    showConfirmAction: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const title = ref(props.confirmActionText)
    const theme = useTheme()
    const confirmAction = () => {
      emit('confirmAction')
    }
    const cancelAction = () => {
      emit('cancelAction')
    }
    return {
      theme,
      title,
      cancelAction,
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
