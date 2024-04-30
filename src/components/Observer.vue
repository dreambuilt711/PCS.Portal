<template>
  <div class="observer mb-3" ref="observerRef" />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
export default {
  props: ['options'],
  setup(props, { emit }) {
    const observerRef = ref(null)
    let observer = null

    onMounted(() => {
      const options = props.options || {}
      observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          emit('intersect')
        }
      }, options)
      observer.observe(observerRef.value)
    })
    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
    })
    return {
      observerRef
    }
  }
}
</script>
