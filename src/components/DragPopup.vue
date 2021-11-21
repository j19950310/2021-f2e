<script setup>
import { nextTick, inject, ref, watch, onBeforeUnmount } from 'vue'
import { Vector2, MathUtils } from 'three'
import gsap from 'gsap'

const viewport = inject('viewport')

const popup = ref(null)

let reqID
const snapMap = [0, 0.4, 1]
const snap = gsap.utils.snap(snapMap)
const movePosition = new Vector2()
const lerpMovePosition = new Vector2()
const startPosition = new Vector2()
let isTouch = false
let tempY = 0
let diffY = 0
let distance = 1
let step = 0
let ease = 0.2

const touchstart = (e) => {
    const [{ clientX, clientY }] = e.touches
    isTouch = true
    ease = lerpMovePosition.distanceTo(movePosition) < 0.01 ? 0.8 : 0.1
    startPosition.set(clientX, clientY)
    tempY = lerpMovePosition.y

    window.addEventListener('touchmove', touchmove)
    window.addEventListener('touchend', touchend)
}
const touchmove = (e) => {
    if (isTouch && popup.value.scrollTop < 1) {
        const [{ clientX, clientY }] = e.touches
        const point = new Vector2(clientX, clientY)
        diffY = startPosition.distanceTo(point)
        distance = startPosition.clone().sub(point).normalize()
        movePosition.set(0, (diffY / popup.value.clientHeight * distance.y) + tempY)
    }
}
const touchend = () => {
    isTouch = false
    ease = 0.2

    if (diffY > 30) {
        const snapY = snap(movePosition.y)
        let currentStep = snapMap.findIndex(s => s === snapY)
        if (currentStep === step) currentStep = MathUtils.clamp(currentStep + Math.sign(distance.y), 0, snapMap.length - 1)
        step = currentStep
    }
    movePosition.set(0, snapMap[step])

    window.removeEventListener('touchmove', touchmove)
    window.removeEventListener('touchend', touchend)
}
const render = () => {
    reqID = window.requestAnimationFrame(render)

    const y = Math.min(lerpMovePosition.y, 1)
    popup.value.style.transform = `translate(0, 90%) translate3d(0, -${y * 90}%, 0)`
    lerpMovePosition.lerpVectors(lerpMovePosition, movePosition, ease)
    if (y > 0.99) {
        popup.value.style.overflow = 'auto'
        return
    }
    popup.value.style.overflow = 'hidden'
}
const destroy = () => {
    popup.value.style.overflow = 'auto'
    popup.value.style.transform = 'none'
    window.cancelAnimationFrame(reqID)
    window.removeEventListener('touchmove', touchmove)
    window.removeEventListener('touchend', touchend)
}

watch(() => viewport.isPc, (value) => {
    nextTick(() => {
        if (!value) {
            render()
            return
        }
        destroy()
    })
}, { immediate: true })

onBeforeUnmount(() => {
    destroy()
})
</script>

<template>
    <div
        ref="popup"
        class="drag-popup"
        :class="{'-mobile': !viewport.isPc}"
        @touchstart="touchstart"
    >
        <slot />
    </div>
</template>

<style lang="scss">
.drag-popup {
    @include size(100%);

    padding: $padding * 3;
    background-color: color('White');
    border-radius: 24px;
    z-index: 100;
    box-shadow: 0 0 24px rgba(0, 0, 0, 10%);

    &:not(.-mobile) {
        overflow: auto;
        max-height: calc(100vh - #{$padding * 15});
    }

    &.-mobile {
        position: fixed;
        top: 0;
        left: 0;

        &::before {
            @include size(45%, 4px);

            content: '';
            display: block;
            margin: auto;
            background-color: color('Light-Gray');
            border-radius: 24px;
            margin-bottom: $padding * 2;
        }
    }
}
</style>
