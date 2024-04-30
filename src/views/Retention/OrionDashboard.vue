<template>
  <div class="iframe-container">
    <iframe :src="iframe.src" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframe: {
        src: '/api/v1/retention/orion'
      }
    }
  }
}
</script>

<style scoped>
.iframe-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 30px);
  padding-top: 13px;
  flex-direction: column;
  overflow: hidden;
}
.iframe-container iframe {
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
