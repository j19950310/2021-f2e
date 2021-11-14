import { createStore } from 'vuex'
import admin from './admin' // 行政區
import tour from './tour' // 旅遊

const LOADING = Object.freeze({
    MIN_LOAD_TIME: 600,
})

export default createStore({
    modules: {
        admin,
        tour,
    },
    state: () => ({
        isFirstEnter: true,
        loadingConfig: {
            waiting: false,
            minTime: LOADING.MIN_LOAD_TIME,
        },
        loadingStack: [new Promise((resolve) => { resolve() })],
    }),
    getters: {
        isLoading (state) {
            return !!state.loadingStack.length
        },
    },
    mutations: {
        SET_FIRST_ENTER (state) {
            state.isFirstEnter = false
        },
        CHANGE_LOADING_WAITING (state, payload) {
            state.loadingConfig.waiting = payload
        },
        SET_LOADING_STACK (state, payload) {
            state.loadingStack.push(payload)
        },
        DEL_LOADING_STACK (state, payload) {
            state.loadingStack.shift()
        },
    },
    actions: {
        ADD_LOADING_STACK ({ state, dispatch, commit }, payload) {
            if (Array.isArray(payload)) {
                const promise = Promise.all(payload.filter(p => p instanceof Promise))
                commit('SET_LOADING_STACK', promise)
                return promise
            }
            if (payload instanceof Promise) {
                commit('SET_LOADING_STACK', payload)
                return payload
            }
        },
        WAIT_LOADING ({ state, getters, dispatch, commit }) {
            const startTime = Date.now()
            if (!state.loadingConfig.waiting) {
                commit('CHANGE_LOADING_WAITING', true)
                return Promise.all(state.loadingStack).then((results) => {
                    const endTime = Date.now()
                    setTimeout(() => {
                        results.forEach(result => commit('DEL_LOADING_STACK'))
                        commit('CHANGE_LOADING_WAITING', false)
                        if (getters.isLoading) {
                            dispatch('WAIT_LOADING')
                        }
                    }, state.loadingConfig.minTime - (endTime - startTime))
                })
            }
        },
    },
})
