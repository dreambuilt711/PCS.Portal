<template>
  <div ref="viewer"></div>
</template>

<script>
import PdfViewer from '@pdftron/pdfjs-express-viewer'
import { ref, onMounted } from 'vue'
export default {
  name: 'PdfViewer',
  props: ['pdfUrl'],
  setup(props, { emit }) {
    const viewer = ref(null)
    //mounted
    onMounted(() => {
      PdfViewer(
        {
          path: '/lib',
          initialDoc: props.pdfUrl,
          licenseKey: '6tRFO5nU692602Q8T6xD'
        },
        viewer.value
      ).then((instance) => {
        // now you can access APIs through the WebViewer instance
        const { Core, UI } = instance

        // adding an event listener for when a document is loaded
        Core.documentViewer.addEventListener('documentLoaded', () => {
          // eslint-disable-next-line
          console.log('document loaded')
        })

        // adding an event listener for when the page number has changed
        Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
          // eslint-disable-next-line
          console.log(`Page number is: ${pageNumber}`)
        })

        // adds a button to the header that on click sets the page to the next page
        UI.setHeaderItems((header) => {
          header.push({
            type: 'actionButton',
            img: 'ic_close_black_24px',
            onClick: () => {
              emit('closePopUpEvent')
            }
          })
        })
      })
    })

    return {
      viewer
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%;
  height: 100vh;
}
</style>
