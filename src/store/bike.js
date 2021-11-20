import {
    getBikeStation,
    getBikeAvailability,
    getBikeStationWithAvailability,
    getBikeStationNearBy,
    getBikeAvailabilityNearBy,
    getBikeStationWithAvailabilityNearBy
} from '@/api/getBike'

export default ({
    namespaced: true,
    state: () => ({
        isWaiting: false,
        currentLocation: null,
        bikeStations: [],
        bikeRoads: [],
    }),
    getters: {
        allData (state) {
            return [...state.bikeStations]
        },
    },
    mutations: {
        SET_WAITING (state, status) {
            state.isWaiting = status
        },
        SET_BIKE_STATIONS (state, payload) {
            state.bikeStations = payload || []
        },
        SET_BIKE_ROADS (state, payload) {
            state.bikeRoads = payload
        },
        SET_CURRENT_LOCATION (state, payload) {
            state.currentLocation = payload
        },
    },
    actions: {
        async GET_BIKE_NEAR_STATIONS ({ commit }, { options }) {
            let data
            try {
                commit('SET_WAITING', true)
                data = await getBikeStationWithAvailabilityNearBy(options)
                console.log(data)
                commit('SET_BIKE_STATIONS', data)
            } catch (e) {
                console.log(e)
            } finally {
                commit('SET_WAITING', false)
            }
            return data
        },
    },
})
