import {
    getBikeStationWithAvailability,
    getBikeStationWithAvailabilityNearBy
} from '@/api/getBike'
import { getCyclingShape } from '@/api/getCycling'
import {
    getRestaurantSpot,
    getRestaurantSpotByCity,
    getScenicSpotByCity,
    getScenicSpot
} from '@/api/getTourism'
import { BIKE_TYPE } from '@/plugins/variable'

export default ({
    namespaced: true,
    state: () => ({
        isLoading: true,
        isWaiting: false,
        currentLocationData: null,
        userLocation: null,
        allTypes: [BIKE_TYPE.STATION, BIKE_TYPE.CYCLING, BIKE_TYPE.RESTAURANT, BIKE_TYPE.TOUR],
        selectTypes: [BIKE_TYPE.STATION, BIKE_TYPE.CYCLING],
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
                state.bikeStations.push(...payload)
            }
        },
        CLEAR_BIKE_STATIONS (state) {
            state.bikeStations = []
        },
        SET_BIKE_CYCLING (state, payload) {
            if (Array.isArray(payload)) {
                state.bikeCycling = payload
            }
        },
        SET_RESTAURANTS (state, payload) {
            if (Array.isArray(payload)) {
                state.restaurants.push(...payload)
            }
        },
        CLEAR_RESTAURANTS (state) {
            state.restaurants = []
        },
        SET_TOURS (state, payload) {
            if (Array.isArray(payload)) {
                state.tours.push(...payload)
            }
        },
        CLEAR_TOURS (state) {
            state.tours = []
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
        async GET_BIKE_STATIONS ({ commit }, { city, options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getBikeStationWithAvailability(city, options)
                commit('SET_BIKE_STATIONS', data)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
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
        async GET_BIKE_CYCLING ({ commit }, { city, options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getCyclingShape(city, options)
                commit('SET_BIKE_CYCLING', data)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
        async GET_RESTAURANTS ({ commit }, { options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getRestaurantSpot(options)
                commit('SET_RESTAURANTS', data.list)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
        async GET_TOURS ({ commit }, { options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getScenicSpot(options)
                commit('SET_TOURS', data.list)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
    },
})
