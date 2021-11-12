<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useStore } from 'vuex'
import { ref, reactive, provide } from 'vue'
// scroll
import gsap from 'gsap/dist/gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
const store = useStore()
store.dispatch('admin/init')

// registerPlugin gsap
const scrollInstace = reactive({
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
        scrollInstace.progress = self.progress
        scrollInstace.scrollTop = self.progress * self.end
        scrollInstace.direction = self.direction
        scrollInstace.end = self.end
    },
})

provide('scrollInstace', scrollInstace)

</script>

<template>
    <div class="app">
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
                旅遊景點（搜不到)
            </router-link>
            <router-link
                class="dev-link"
                to="/tour/spot/saved"
            >
                旅遊景點（搜不到)
            </router-link>
        </div>
        <router-view />
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
        top: 90px;
        right: 0;
        left: 0;
        z-index: 100;
    }
}
</style>
