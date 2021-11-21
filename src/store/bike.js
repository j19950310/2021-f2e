import {
    getBikeStation,
    getBikeAvailability,
    getBikeStationWithAvailability,
    getBikeStationNearBy,
    getBikeAvailabilityNearBy,
    getBikeStationWithAvailabilityNearBy
} from '@/api/getBike'
import { getCyclingShape } from '@/api/getCycling'
import { BIKE_TYPE } from '@/plugins/variable'

export default ({
    namespaced: true,
    state: () => ({
        isLoading: true,
        isWaiting: false,
        currentLocationData: null,
        userLocation: null,
        // allTypes: [BIKE_TYPE.STATION, BIKE_TYPE.CYCLING, BIKE_TYPE.RESTAURANT, BIKE_TYPE.TOUR],
        allTypes: [BIKE_TYPE.STATION, BIKE_TYPE.CYCLING],
        selectTypes: [BIKE_TYPE.STATION],
        bikeStations: [],
        bikeCycling: [],
        restaurants: [],
        tours: [],
    }),
    getters: {
        allData (state) {
            return state.selectTypes.map(type => ([...state[type]])).flat()
        },
    },
    mutations: {
        SET_LOADING (state, status) {
            state.isLoading = status
        },
        SET_WAITING (state, status) {
            state.isWaiting = status
        },
        SET_BIKE_STATIONS (state, payload) {
            if (Array.isArray(payload)) {
                state.bikeStations = payload
            }
        },
        SET_BIKE_CYCLING (state, payload) {
            if (Array.isArray(payload)) {
                state.bikeCycling = payload
            }
        },
        SET_CURRENT_LOCATION_DATA (state, payload) {
            state.currentLocationData = payload
        },
        SET_USER_LOCATION (state, payload) {
            state.userLocation = payload
        },
        ADD_SELECT_TYPE (state, type) {
            if (state.allTypes.includes(type)) {
                state.selectTypes.push(type)
                state.selectTypes = [...new Set(state.selectTypes)]
            }
        },
        DEL_SELECT_TYPE (state, type) {
            if (state.allTypes.includes(type)) {
                const index = state.selectTypes.findIndex(t => t === type)
                if (~index) state.selectTypes.splice(index, 1)
            }
        },
        TOGGLE_ALL_TYPE (state) {
            if (state.selectTypes.length !== state.allTypes.length) {
                state.selectTypes = [...state.allTypes]
                return
            }
            state.selectTypes = []
        },
        CLEAR_ALL_DATA (state) {
            state.bikeStations = []
            state.bikeCycling = []
            state.restaurants = []
            state.tours = []
        },
    },
    actions: {
        async GET_BIKE_NEAR_STATIONS ({ commit }, { options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getBikeStationWithAvailabilityNearBy(options)
                commit('SET_BIKE_STATIONS', data)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
        async GET_BIKE_CYCLING ({ commit }, { area, options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getCyclingShape(area, options)
                commit('SET_BIKE_CYCLING', data)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
    },
})
