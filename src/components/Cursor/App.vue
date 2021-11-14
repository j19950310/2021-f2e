<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Cursor from './cursorApp'
const cursor = ref(null)
const cursorEffect = ref(null)

onMounted(() => {
    cursor.value = new Cursor(cursorEffect.value)
    cursor.value.init()
})
onBeforeUnmount(() => {
    cursor.value.destroy()
    cursor.value = null
})
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
