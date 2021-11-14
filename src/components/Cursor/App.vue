<script setup>
import { nextTick, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Cursor from './cursorApp'
const cursor = ref(null)
const cursorEffect = ref(null)
const isTouch = ref((('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)))

watch(() => isTouch.value, (value) => {
    if (!isTouch.value) {
        nextTick(() => {
            cursor.value = new Cursor(cursorEffect.value)
            cursor.value.init()
        })
        return
    }
    cursor.value?.destroy()
    cursor.value = null
}, { immediate: true })

onMounted(() => {
    window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
})

const resize = () => {
    isTouch.value = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
}
</script>

<template>
    <div
        ref="cursorEffect"
        class="cursor-effect"
    />
</template>

<style lang="scss">
button, a, [href], [data-cursor] {
    > * {
        pointer-events: none;
    }
}

.cursor-effect {
    @include size(100vw, 100%);

    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 100;
}
</style>
