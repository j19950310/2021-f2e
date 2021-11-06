import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Components from '@/views/Components.vue'
import Dev from '@/views/Dev.vue'

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/dev',
        name: 'Develope',
        component: Dev,
    }, {
        path: '/components',
        name: 'Components',
        component: Components,
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
