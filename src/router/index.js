import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Components from '@/views/Components.vue'
import Dev from '@/views/Dev.vue'
import About from '@/views/About.vue'
import TourHome from '@/views/Tour/Index.vue'
import TourNoResult from '@/views/Tour/NoResult.vue'
import TourSpot from '@/views/Tour/Spot.vue'
import TourSpotSaved from '@/views/Tour/SpotSaved.vue'
import TourSpotSearch from '@/views/Tour/SpotSearch.vue'
import TourSpotPopup from '@/views/Tour/TourSpotPopup.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/dev',
        name: 'Develope',
        component: Dev,
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
                path: ':spot',
                name: 'TourSpotPopup',
                component: TourSpotPopup,
            },
            {
                path: 'search',
                name: 'TourSpotSearch',
                component: TourSpotSearch,
            },
            {
                path: 'saved',
                name: 'TourSpotSaved',
                component: TourSpotSaved,
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
