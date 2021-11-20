import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import Home from '@/views/Home.vue'
import Components from '@/views/Components.vue'
import Bike from '@/views/Bike/Wrapper.vue'
import BikeHome from '@/views/Bike/Index.vue'
import BikeSearch from '@/views/Bike/Search.vue'
import BikePlace from '@/views/Bike/Place.vue'
import BikeDir from '@/views/Bike/Dir.vue'
import Dev from '@/views/Dev.vue'
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
        path: '/dev',
        name: 'Dev',
        component: Dev,
    },
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
        path: '/bike',
        name: 'Bike',
        component: Bike,
        children: [
            {
                path: ':pathMatch(.*)*',
                name: 'BikeHome',
                component: BikeHome,
                children: [
                    {
                        path: 'search',
                        name: 'BikeSearch',
                        component: BikeSearch,
                    },
                    {
                        path: 'place',
                        name: 'BikePlace',
                        component: BikePlace,
                    },
                    {
                        path: 'dir',
                        name: 'BikeDir',
                        component: BikeDir,
                    },
                ],
            },
        ],
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
