import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import store from '@/store/index'
import '@/style/_main.scss'
import 'swiper/css'
import 'virtual:svg-icons-register'
import directives from '@/plugins/directives/index'
import gsap from 'gsap/dist/gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

const app = createApp(App)

app.provide('gsap', gsap)
app.use(directives)
app.use(router)
app.use(store)

app.mount('#app')

// refresh instance
router.afterEach((to, from) => {
    ScrollTrigger.refresh(true)
})
