<template>
  <v-card class="elevation-6 pa-2 fixHeight_Card">
    <v-col pt-5 class="text-center">
      <h3 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">New Account Activity</h3>
    </v-col>
  </v-card>
</template>
<script>
export default {}
</script>
<style scoped>
.fixHeight_Card {
  height: 400px;
}
</style>
