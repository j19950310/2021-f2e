<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, reactive, provide, computed, watch, onMounted } from 'vue'
import ImagesLoaded from 'imagesloaded'

// scroll
import gsap from 'gsap/dist/gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
// viewport
import vp from '@/plugins/viewport'
const $route = useRoute()
const $store = useStore()
$store.dispatch('admin/init')

// registerPlugin gsap
const scrollInstance = reactive({
    scrollTop: ref(0),
    progress: ref(0),
    direction: 1,
    end: 0,
})
gsap.registerPlugin(ScrollTrigger)
const scrollTriggerInstance = ScrollTrigger.create({
    scroller: window,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
        scrollInstance.progress = self.progress
        scrollInstance.scrollTop = self.progress * self.end
        scrollInstance.direction = self.direction
        scrollInstance.end = self.end
    },
})
const viewport = reactive(vp)

const loadingConfig = computed(() => $store.state.loadingConfig)
const isFirstEnter = computed(() => $store.state.isFirstEnter)

window.addEventListener('resize', () => { // 待其他合併
    viewport.update()
})

provide('scrollInstance', scrollInstance)
provide('viewport', viewport)

const loadImage = () => {
    return new Promise((resolve) => {
        new ImagesLoaded('#app', { background: '[data-background]' }, (instance) => {
            resolve()
        })
    })
}
const loadFont = () => {
    new Promise((resolve) => {
        import('webfontloader').then((WebFont) => {
            WebFont.load({
                google: {
                    families: ['Noto Sans TC:500, 700', 'Asap:700'],
                },
                active () {
                    resolve()
                },
            })
        })
    })
}

onMounted(async () => {
    await $store.dispatch('ADD_LOADING_STACK', [
        loadImage(),
        loadFont(),
    ])
    $store.dispatch('WAIT_LOADING')
})

</script>

<template>
    <div
        class="app"
        :class="`-${$route.name}`"
        :style="{
            '--loading-duration': `${loadingConfig.minTime / 1000}s`
        }"
    >
        <router-view />
        <div id="portalTarget" />
        <Loading />
        <CursorApp />
    </div>
</template>

<style lang="scss">

</style>
