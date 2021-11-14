<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, reactive, provide, computed, watch, onMounted } from 'vue'
// scroll
import gsap from 'gsap/dist/gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
// viewport
import Viewport from '@/plugins/viewport'
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
const viewport = reactive(new Viewport())

const loadingConfig = computed(() => $store.state.loadingConfig)
const isFirstEnter = computed(() => $store.state.isFirstEnter)

window.addEventListener('resize', () => { // 待其他合併
    viewport.update()
})

provide('scrollInstance', scrollInstance)
provide('viewport', viewport)

onMounted(() => {
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
        <div class="dev-link__wrap">
            <router-link
                class="dev-link"
                to="/dev"
            >
                DEV
            </router-link>
            <router-link
                class="dev-link"
                to="/components"
            >
                Component
            </router-link>
            <router-link
                class="dev-link"
                to="/tour"
            >
                旅遊景點
            </router-link>
            <router-link
                class="dev-link"
                to="/tour/no-result"
            >
                旅遊景點（搜不到)
            </router-link>
            <router-link
                class="dev-link"
                to="/tour/spot/search"
            >
                搜尋結果
            </router-link>
            <router-link
                class="dev-link"
                to="/tour/spot/saved"
            >
                收藏
            </router-link>
        </div>
        <router-view v-slot="{ Component }">
            <transition
                name="fade"
                mode="out-in"
            >
                <component
                    :is="Component"
                    v-show="!isFirstEnter"
                />
            </transition>
        </router-view>
        <div id="portalTarget" />
        <Loading />
        <CursorApp />
    </div>
</template>

<style lang="scss">
.dev-link {
    display: inline-block;
    margin-right: 10px;
    padding: 20px;
    background-color: white;
    border: 1px solid #cccccc;
    z-index: 100;

    &__wrap {
        position: fixed;
        top: 50px;
        right: 0;
        left: 0;
        z-index: 100;
    }
}
</style>
