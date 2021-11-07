import { createStore } from 'vuex'
import admin from './admin' // 行政區
import tour from './tour' // 旅遊

export default createStore({
    state: () => ({}),
    getters: {},
    mutations: {},
    actions: {
    },
    modules: {
        admin,
        tour,
    },
})
