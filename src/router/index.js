import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import Home from '@/views/Home.vue'
import Components from '@/views/Components.vue'
import Week2Component from '@/views/Week2Component.vue'
import About from '@/views/About/index.vue'
import AboutPerson from '@/views/About/AboutPerson.vue'
import TourHome from '@/views/Tour/Index.vue'
import TourNoResult from '@/views/Tour/NoResult.vue'
import TourSpot from '@/views/Tour/Spot.vue'
import TourSpotSaved from '@/views/Tour/SpotSaved.vue'
import TourSpotSearch from '@/views/Tour/SpotSearch.vue'
import TourSpotPopup from '@/views/Tour/TourSpotPopup.vue'

const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: Home,
    // },
    {
        path: '/about',
        name: 'About',
        component: About,
        children: [
            {
                path: ':person',
                name: 'AboutPerson',
                component: AboutPerson,
            },
        ],
    },
    {
        path: '/week2-component',
        name: 'Week2Component',
        component: Week2Component,
    },
    {
        path: '/components',
        name: 'Components',
        component: Components,
    },
    {
        path: '/tour',
        name: 'Tour',
        component: TourHome,
        children: [
            {
                path: 'no-result',
                name: 'TourNoResult',
                component: TourNoResult,
            },
        ],
    },
    {
        path: '/tour/spot',
        name: 'TourSpot',
        component: TourSpot,
        children: [
            {
                path: 'search',
                name: 'TourSpotSearch',
                component: TourSpotSearch,
                children: [
                    {
                        path: ':spot',
                        name: 'TourSpotSearchPopup',
                        component: TourSpotPopup,
                    },
                ],
            },
            {
                path: 'saved',
                name: 'TourSpotSaved',
                component: TourSpotSaved,
                children: [
                    {
                        path: ':spot',
                        name: 'TourSpotSavedPopup',
                        component: TourSpotPopup,
                    },
                ],
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/tour',
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.afterEach((to, from) => {
    setTimeout(() => {
        ScrollTrigger.refresh(true)
    }, store.state.loadingConfig.minTime * 2)
})

export default router
