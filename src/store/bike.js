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
        isStart: false,
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
        SET_START (state) {
            state.isStart = true
        },
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
                data = await getBikeStationWithAvailability(city, options)
                commit('SET_BIKE_STATIONS', data)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_BIKE_NEAR_STATIONS ({ commit }, { options }) {
            let data
            try {
                data = await getBikeStationWithAvailabilityNearBy(options)
                commit('SET_BIKE_STATIONS', data)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_MERGE_BIKE_NEAR_STATIONS ({ commit }, payload) {
            if (Array.isArray(payload)) {
                const memo = new Set()
                const stations = []
                const results = await Promise.all(payload.map(({ lat, lng, r }) => {
                    return getBikeStationWithAvailabilityNearBy({
                        position: { lat, lng },
                        distance: r | 0,
                    })
                }))
                if (results && results.length) {
                    results.flat().forEach(result => {
                        const { StationUID } = result
                        if (!memo.has(StationUID)) {
                            memo.add(StationUID)
                            stations.push(result)
                        }
                    })
                }
                commit('SET_BIKE_STATIONS', stations)
                return stations
            }
        },
        async GET_BIKE_CYCLING ({ commit }, { city, options }) {
            let data
            try {
                data = await getCyclingShape(city, options)
                commit('SET_BIKE_CYCLING', data)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_RESTAURANTS ({ commit }, { options }) {
            let data
            try {
                data = await getRestaurantSpot(options)
                commit('SET_RESTAURANTS', data.list)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_RESTAURANTS_BY_CITY ({ commit }, { city, options }) {
            let data
            try {
                data = await getRestaurantSpotByCity(city, options)
                commit('SET_RESTAURANTS', data)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_MERGE_RESTAURANTS ({ commit }, { city, payload }) {
            if (Array.isArray(payload)) {
                const memo = new Set()
                const restaurants = []
                const results = await Promise.all(payload.map(({ lat, lng, r }) => {
                    return getRestaurantSpotByCity(city, {
                        position: { lat, lng },
                        distance: r | 0,
                    })
                }))
                if (results && results.length) {
                    results.flat().forEach(result => {
                        const { RestaurantID } = result
                        if (!memo.has(RestaurantID)) {
                            memo.add(RestaurantID)
                            restaurants.push(result)
                        }
                    })
                }
                commit('SET_RESTAURANTS', restaurants)
                return restaurants
            }
        },
        async GET_TOURS ({ commit }, { options }) {
            let data
            try {
                data = await getScenicSpot(options)
                commit('SET_TOURS', data.list)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_TOURS_BY_CITY ({ commit }, { city, options }) {
            let data
            try {
                data = await getScenicSpotByCity(city, options)
                commit('SET_TOURS', data)
            } catch (e) {
                console.log(e)
            }
            return data
        },
        async GET_MERGE_TOURS ({ commit }, { city, payload }) {
            if (Array.isArray(payload)) {
                const memo = new Set()
                const tours = []
                const results = await Promise.all(payload.map(({ lat, lng, r }) => {
                    return getScenicSpotByCity(city, {
                        position: { lat, lng },
                        distance: r | 0,
                    })
                }))
                if (results && results.length) {
                    results.flat().forEach(result => {
                        const { ScenicSpotID } = result
                        if (!memo.has(ScenicSpotID)) {
                            memo.add(ScenicSpotID)
                            tours.push(result)
                        }
                    })
                }
                commit('SET_TOURS', tours)
                return tours
            }
        },
    },
})
