<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import BikeSearch from '@/views/Bike/Search.vue'
import GoogleMap from '@/plugins/GoogleMap/googleMap'
import { BIKE_TYPE } from '@/plugins/variable'
import { cities } from '@/api/paramsFormat'

const SEARCH_NEAR_RANGE = 300
const PLACE_NEAR_RANGE = 1000

export default defineComponent({
    components: {
        BikeSearch,
    },
    setup () {
        const $store = useStore()
        const $route = useRoute()
        const $router = useRouter()

        const searchValue = ref(null)
        const isSearchFocus = ref(false)
        const googleMapEl = ref(null)
        const map = ref(null)
        const queryPredictions = ref([])
        const selectTypesMap = ref({
            [BIKE_TYPE.STATION]: '自行車站',
            [BIKE_TYPE.CYCLING]: '自行車路線',
            [BIKE_TYPE.RESTAURANT]: '餐廳',
            [BIKE_TYPE.TOUR]: '景點',
        })
        const iconsMap = ref({
            [BIKE_TYPE.STATION]: 'bike',
            [BIKE_TYPE.CYCLING]: 'cycling',
            [BIKE_TYPE.RESTAURANT]: 'restaurant',
            [BIKE_TYPE.TOUR]: 'tour',
        })

        const isWaiting = computed(() => $store.state.bike.isWaiting)
        const isHome = computed(() => $route.name === 'BikeHome')
        const isSearch = computed(() => $route.name === 'BikeSearch')
        const isPlace = computed(() => $route.name === 'BikePlace')
        const allData = computed(() => $store.getters['bike/allData'])
        const currentLocationData = computed(() => $store.state.bike.currentLocationData)
        const allTypes = computed(() => $store.state.bike.allTypes)
        const selectTypes = computed(() => $store.state.bike.selectTypes)

        watch(() => $store.state.bike.isStart, (value) => {
            if (map.value) {
                map.value.requestUserLocation()
            }
        })
        watch(() => searchValue.value, async (value) => {
            if (value && map.value) {
                queryPredictions.value = await map.value.getPlacePredictions(value)
                return
            }
            queryPredictions.value = []
        })
        watch(() => $route.params.value, (value) => {
            if (value) {
                displayMapObjects()
            }
        })

        const handleBoundsChanged = ({ lat, lng, radius }) => {
            $router.push({ name: $route.name, query: { lat, lng, r: radius } })
        }
        const zoom = (value = 1) => {
            if (map.value) {
                map.value.setZoom(map.value.mapInstance.zoom + value)
            }
        }
        const moveUserLocation = () => {
            if (map.value) {
                if (map.value.agreeGeolocation) {
                    map.value.moveMapToPlace(map.value.userLocationMark.getPosition())
                    map.value.setZoom(17)
                    return
                }
                map.value.requestUserLocation()
            }
        }
        const getAdministrative = async () => {
            // console.log('getAdministrative')
            if (map.value) {
                let data = await map.value.getLocationInformation()
                if (Array.isArray(data)) {
                    data = data.flatMap(d => d.address_components)
                    for (let i = 0, len = data.length; i < len; i++) {
                        const d = data[i]
                        if (d.long_name) {
                            if (cities[d.long_name]) return d.long_name
                        }
                        if (d.short_name) {
                            if (cities[d.short_name]) return d.short_name
                        }
                    }
                }
            }
        }
        const findLocationMarker = (value) => {
            if (value) {
                const marker = map.value.findFilterMarker(({ position }) => {
                    return `${position.lat()},${position.lng()}` === value
                })
                return marker
            }
        }
        const changeSelectTypes = (type) => {
            if (type !== 'all') {
                selectTypes.value.includes(type)
                    ? $store.commit('bike/DEL_SELECT_TYPE', type)
                    : $store.commit('bike/ADD_SELECT_TYPE', type)
            } else {
                $store.commit('bike/TOGGLE_ALL_TYPE')
            }
            search()
        }
        const displayMapObjects = () => {
            // console.log('display')
            const marker = findLocationMarker($route.params.value)
            if (marker) {
                const { position, markerData } = marker
                const { type } = markerData
                map.value.clearPathStartMarker()
                map.value.clearPathEndMarker()
                map.value.clearActivatePath()
                if (type === BIKE_TYPE.CYCLING) {
                    const { geometry } = markerData
                    map.value.setActivatePath(geometry.map(g => {
                        const [lat, lng] = g.split(' ').reverse()
                        return new map.value.googleMap.LatLng(lat, lng)
                    }))
                    map.value.setPathStartMarker(findLocationMarker(geometry.shift().split(' ').reverse().join(',')))
                    map.value.setPathEndMarker(findLocationMarker(geometry.pop().split(' ').reverse().join(',')))
                }
                map.value.setActivateMarker(marker)
                map.value.moveMapToPlace(position)
                $store.commit('bike/SET_CURRENT_LOCATION_DATA', markerData)
            }
        }

        const getViewportBikeStations = async (lat, lng, r, administrative) => {
            lat = lat || $route.query.lat
            lng = lng || $route.query.lng
            r = r || $route.query.r
            administrative = administrative || await getAdministrative()
            if (administrative && map.value) {
                const stations = await $store.dispatch('bike/GET_BIKE_STATIONS', {
                    city: administrative,
                    options: {
                        position: { lat, lng },
                        distance: r | 0,
                    },
                })
                if (Array.isArray(stations)) {
                    const markers = stations.flat().map(station => {
                        const { StationPosition } = station
                        return map.value.generateMarker(station, {
                            position: { lat: StationPosition.PositionLat, lng: StationPosition.PositionLon },
                            icon: new URL('../../assets/icons/bike.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getNearbyBikeStations = async (lat, lng, r) => {
            lat = lat || $route.query.lat
            lng = lng || $route.query.lng
            r = r || $route.query.r
            if (map.value) {
                const stations = await $store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
                    options: {
                        position: { lat, lng },
                        distance: r | 0,
                    },
                })
                if (Array.isArray(stations)) {
                    const markers = stations.flat().map(station => {
                        const { StationPosition } = station
                        return map.value.generateMarker(station, {
                            position: { lat: StationPosition.PositionLat, lng: StationPosition.PositionLon },
                            icon: new URL('../../assets/icons/bike.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getMergeNearbyBikeStations = async (payload) => {
            if (map.value) {
                const stations = await $store.dispatch('bike/GET_MERGE_BIKE_NEAR_STATIONS', payload)
                if (Array.isArray(stations)) {
                    const markers = stations.map(station => {
                        const { StationPosition } = station
                        return map.value.generateMarker(station, {
                            position: { lat: StationPosition.PositionLat, lng: StationPosition.PositionLon },
                            icon: new URL('../../assets/icons/bike.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getBikeCycling = async (administrative) => {
            administrative = administrative || await getAdministrative()
            if (administrative && map.value) {
                const cyclings = await $store.dispatch('bike/GET_BIKE_CYCLING', {
                    city: administrative,
                })
                if (Array.isArray(cyclings)) {
                    const markers = cyclings.map(cycling => {
                        const { geometry } = cycling
                        const start = geometry.shift().split(' ').reverse()
                        const end = geometry.pop().split(' ').reverse()
                        return [
                            map.value.generateMarker(cycling, {
                                position: new map.value.googleMap.LatLng(start[0], start[1]),
                                icon: new URL('../../assets/icons/cycling-active.svg', import.meta.url).href,
                            }),
                            map.value.generateMarker(cycling, {
                                position: new map.value.googleMap.LatLng(end[0], end[1]),
                                icon: new URL('../../assets/icons/cycling-active.svg', import.meta.url).href,
                            }),
                        ]
                    }).flat()
                    map.value.setFilterMarkers(markers, false)
                }
            }
        }
        const getRestaurants = async (lat, lng, r, administrative) => {
            lat = lat || $route.query.lat
            lng = lng || $route.query.lng
            r = r || $route.query.r
            administrative = administrative || await getAdministrative()
            if (map.value && administrative) {
                const restaurants = await $store.dispatch('bike/GET_RESTAURANTS_BY_CITY', {
                    city: administrative,
                    options: {
                        position: { lat, lng },
                        distance: r | 0,
                    },
                })
                if (Array.isArray(restaurants)) {
                    const markers = restaurants.map(restaurant => {
                        const { Position } = restaurant
                        return map.value.generateMarker(restaurant, {
                            position: { lat: Position.PositionLat, lng: Position.PositionLon },
                            icon: new URL('../../assets/icons/restaurant.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getMergeRestaurants = async (payload, administrative) => {
            administrative = administrative || await getAdministrative()
            if (map.value && administrative) {
                const restaurants = await $store.dispatch('bike/GET_MERGE_RESTAURANTS', {
                    city: administrative,
                    payload,
                })
                if (Array.isArray(restaurants)) {
                    const markers = restaurants.map(restaurant => {
                        const { Position } = restaurant
                        return map.value.generateMarker(restaurant, {
                            position: { lat: Position.PositionLat, lng: Position.PositionLon },
                            icon: new URL('../../assets/icons/restaurant.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getTours = async (lat, lng, r, administrative) => {
            lat = lat || $route.query.lat
            lng = lng || $route.query.lng
            r = r || $route.query.r
            administrative = administrative || await getAdministrative()
            if (map.value && administrative) {
                const tours = await $store.dispatch('bike/GET_TOURS_BY_CITY', {
                    city: administrative,
                    options: {
                        position: { lat, lng },
                        distance: r | 0,
                    },
                })
                if (Array.isArray(tours)) {
                    const markers = tours.map(tour => {
                        const { Position } = tour
                        return map.value.generateMarker(tour, {
                            position: { lat: Position.PositionLat, lng: Position.PositionLon },
                            icon: new URL('../../assets/icons/tour.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }
        const getMergeTours = async (payload, administrative) => {
            administrative = administrative || await getAdministrative()
            if (map.value && administrative) {
                const tours = await $store.dispatch('bike/GET_MERGE_TOURS', {
                    city: administrative,
                    payload,
                })
                if (Array.isArray(tours)) {
                    const markers = tours.map(tour => {
                        const { Position } = tour
                        return map.value.generateMarker(tour, {
                            position: { lat: Position.PositionLat, lng: Position.PositionLon },
                            icon: new URL('../../assets/icons/tour.svg', import.meta.url).href,
                        })
                    })
                    map.value.setFilterMarkers(markers)
                }
            }
        }

        const searchFromMap = async (lat, lng, r) => {
            // console.log('searchMap')
            lat = lat || $route.query.lat
            lng = lng || $route.query.lng
            r = r || $route.query.r
            const administrative = await getAdministrative()
            await Promise.all(selectTypes.value.map(type => {
                if (type === BIKE_TYPE.STATION) {
                    return getViewportBikeStations(lat, lng, r, administrative)
                }
                // if (type === BIKE_TYPE.CYCLING) {
                //     return getBikeCycling(administrative)
                // }
                if (type === BIKE_TYPE.RESTAURANT) {
                    return getRestaurants(lat, lng, r, administrative)
                }
                if (type === BIKE_TYPE.TOUR) {
                    return getTours(lat, lng, r, administrative)
                }
                return null
            }))
        }

        const searchFromText = async () => {
            if (searchValue.value) {
                // console.log('searchText')
                const positions = []
                const markers = []
                const administrative = await getAdministrative()
                const places = await map.value.textSearch(searchValue.value)
                places.forEach(place => {
                    const { location } = place.geometry
                    positions.push({
                        lat: location.lat(),
                        lng: location.lng(),
                        r: SEARCH_NEAR_RANGE,
                    })
                    markers.push(map.value.generateMarker(place, {
                        position: location,
                    }))
                })
                map.value.setQueryMarkers(markers)
                const [firstMarker] = markers
                if (firstMarker) {
                    map.value.moveMapToPlace(firstMarker.position)
                }
                await Promise.all(selectTypes.value.map(type => {
                    if (type === BIKE_TYPE.STATION) {
                        return getMergeNearbyBikeStations(positions)
                    }
                    if (type === BIKE_TYPE.CYCLING) {
                        return getBikeCycling(administrative)
                    }
                    if (type === BIKE_TYPE.RESTAURANT) {
                        return getMergeRestaurants(positions, administrative)
                    }
                    if (type === BIKE_TYPE.TOUR) {
                        return getMergeTours(positions, administrative)
                    }
                    return null
                }))
            }
        }
        const searchFromPlace = async () => {
            if (isPlace.value) {
                // console.log('searchPlace')
                const administrative = await getAdministrative()
                const [lat, lng] = $route.params.value.split(',')
                if (lat && lng) {
                    const position = new map.value.googleMap.LatLng(lat, lng)
                    const marker = map.value.generateMarker(null, {
                        position,
                        zIndex: 3,
                    })
                    map.value.setQueryMarkers([marker])
                    map.value.moveMapToPlace(position)
                    await Promise.all(selectTypes.value.map(type => {
                        if (type === BIKE_TYPE.STATION) {
                            return getNearbyBikeStations(lat, lng, PLACE_NEAR_RANGE)
                        }
                        if (type === BIKE_TYPE.CYCLING) {
                            return getBikeCycling(administrative)
                        }
                        if (type === BIKE_TYPE.RESTAURANT) {
                            return getRestaurants(lat, lng, PLACE_NEAR_RANGE, administrative)
                        }
                        if (type === BIKE_TYPE.TOUR) {
                            return getTours(lat, lng, PLACE_NEAR_RANGE, administrative)
                        }
                        return null
                    }))
                }
            }
        }

        const search = async () => {
            try {
                $store.commit('bike/SET_WAITING', true)
                $store.commit('bike/CLEAR_ALL_DATA')
                map.value.clearAllMapMarkers()
                if (isSearch.value) {
                    await searchFromText()
                    return
                }
                if (isPlace.value) {
                    await searchFromPlace()
                    return
                }
                await searchFromMap()
            } finally {
                $store.commit('bike/SET_WAITING', false)
            }
        }
        const submitText = async () => {
            if (searchValue.value) {
                await $router.push({ name: 'BikeSearch', params: { value: searchValue.value }, query: { ...$route.query } })
                isSearchFocus.value = false
                search()
            }
        }
        const submitPlace = async (query) => {
            if (query) {
                const [place] = await map.value.findPlaceFromQuery(query.structured_formatting.main_text)
                if (place) {
                    const lat = place.geometry.location.lat()
                    const lng = place.geometry.location.lng()
                    const [info] = await map.value.getLocationInformation({
                        location: new map.value.googleMap.LatLng(lat, lng),
                    })
                    if (info) {
                        await $router.push({ name: 'BikePlace', params: { value: `${lat},${lng}` }, query: { ...$route.query } })
                        searchValue.value = info.formatted_address
                        isSearchFocus.value = false
                        search()
                    }
                }
            }
        }
        const clearSearch = () => {
            searchValue.value = null
            map.value.clearAllMapMarkers()
            $router.push({ name: 'BikeHome', query: { ...$route.query } })
        }

        onMounted(() => {
            map.value = new GoogleMap(googleMapEl.value)
            map.value.on('init', async () => {
                if (isSearch.value) {
                    searchValue.value = $route.params.value
                }
                if (isPlace.value) {
                    const [lat, lng] = $route.params.value.split(',')
                    if (lat && lng) {
                        const [info] = await map.value.getLocationInformation({
                            location: new map.value.googleMap.LatLng(lat, lng),
                        })
                        if (info) {
                            searchValue.value = info.formatted_address
                        }
                    }
                }
            })
            map.value.on('boundsChanged', (payload) => {
                handleBoundsChanged(payload)
            })
            map.value.on('allowUserLocation', async () => {
                await search()
                displayMapObjects()
            })
            map.value.on('requestUserLocation', async () => {
                $store.commit('bike/SET_LOADING', false)
            })
            map.value.on('onUserLocationChanged', (position) => {
                $store.commit('bike/SET_USER_LOCATION', {
                    lat: position.lat(),
                    lng: position.lng(),
                })
            })
            map.value.on('markerClicked', (marker) => {
                const { position } = marker

                $router.push({ name: 'BikePlace', params: { value: `${position.lat()},${position.lng()}` }, query: { ...$route.query } })
            })
            map.value.on('markerActivated', (marker) => {
                const { markerData } = marker

                if (markerData.type === BIKE_TYPE.STATION) {
                    marker.setIcon(new URL('../../assets/icons/bike-active.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.RESTAURANT) {
                    marker.setIcon(new URL('../../assets/icons/restaurant-active.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.TOUR) {
                    marker.setIcon(new URL('../../assets/icons/tour-active.svg', import.meta.url).href)
                }
                marker.setAnimation(map.value.googleMap.Animation.Hy)
                marker.setZIndex(2)
            })
            map.value.on('markerDeActivated', (marker) => {
                const { markerData } = marker

                if (markerData.type === BIKE_TYPE.STATION) {
                    marker.setIcon(new URL('../../assets/icons/bike.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.RESTAURANT) {
                    marker.setIcon(new URL('../../assets/icons/restaurant.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.TOUR) {
                    marker.setIcon(new URL('../../assets/icons/tour.svg', import.meta.url).href)
                }
                marker.setZIndex(0)
            })
        })

        return {
            googleMapEl,
            searchValue,
            isSearchFocus,
            queryPredictions,
            isWaiting,
            isHome,
            isSearch,
            isPlace,
            allData,
            currentLocationData,
            submitText,
            submitPlace,
            search,
            zoom,
            moveUserLocation,
            selectTypesMap,
            iconsMap,
            allTypes,
            selectTypes,
            changeSelectTypes,
            clearSearch,
        }
    },
})
</script>

<template>
    <div class="bike">
        <div
            ref="googleMapEl"
            class="bike__map"
        />
        <div class="bike__main">
            <div class="bike__search">
                <SearchDefault
                    v-model.trim="searchValue"
                    v-blur="() => isSearchFocus = false"
                    @submit="submitText"
                    @focus="isSearchFocus = true"
                >
                    <div class="search-filter__functions">
                        <div
                            v-show="searchValue"
                            class="search-filter__functions-item"
                            @click="clearSearch"
                        >
                            <Icon name="close-active" />
                        </div>
                        <div
                            class="search-filter__functions-item"
                            @click="submitText"
                        >
                            <Icon name="search" />
                        </div>
                        <!-- <div class="search-filter__functions-item">
                            <Icon name="filter" />
                        </div> -->
                    </div>
                    <div
                        v-show="isSearchFocus && queryPredictions.length"
                        class="bike__search-result"
                    >
                        <ul class="bike__search-result-main">
                            <li
                                v-for="query in queryPredictions"
                                :key="query.place_id"
                                class="bike__search-result-item"
                                @click="submitPlace(query)"
                            >
                                <p class="bike__search-result-title">
                                    {{ query.structured_formatting.main_text }}
                                </p>
                                <p class="bike__search-result-desc">
                                    {{ query.structured_formatting.secondary_text }}
                                </p>
                            </li>
                        </ul>
                    </div>
                </SearchDefault>
                <DragPopup v-show="(isSearch && allData.length) || (isPlace && currentLocationData)">
                    <router-view v-if="!isHome" />
                    <BikeSearch v-else />
                </DragPopup>
            </div>
            <div
                class="bike__refresh"
                :class="{'-active': !isPlace && !isWaiting}"
                @click="search(null)"
            >
                <Icon name="search" />
                <p>搜尋這個區域</p>
            </div>
            <div
                class="bike__zoom-in"
                @click="zoom(1)"
            >
                <Icon name="plus" />
            </div>
            <div
                class="bike__zoom-out"
                @click="zoom(-1)"
            >
                <Icon name="sub" />
            </div>
            <div
                class="bike__reset-position"
                @click="moveUserLocation"
            >
                <Icon name="position" />
            </div>
            <Collapse class="bike__types">
                <template #display>
                    <div class="bike__types-display">
                        <div
                            v-for="type in selectTypes"
                            :key="type"
                            class="bike__types-icon"
                        >
                            <Icon :name="`${iconsMap[type]}-outline`" />
                        </div>
                        <p>顯示項目 x {{ selectTypes.length }}</p>
                    </div>
                </template>
                <ul class="bike__types-main">
                    <li
                        v-for="type in allTypes"
                        :key="type"
                        class="bike__types-type"
                        :class="{'-active': selectTypes.includes(type)}"
                        @click="changeSelectTypes(type)"
                    >
                        <div class="bike__types-icon">
                            <Icon :name="`${iconsMap[type]}-outline`" />
                        </div>
                        <p>{{ selectTypesMap[type] }}</p>
                    </li>
                    <li
                        class="bike__types-type"
                        :class="{'-active': selectTypes.length === allTypes.length}"
                        @click="changeSelectTypes('all')"
                    >
                        <div class="bike__types-icon">
                            <Icon name="all-outline" />
                        </div>
                        <p>全部項目</p>
                    </li>
                </ul>
            </Collapse>
        </div>
        <div
            class="bike__mask"
            :class="{'-active': isWaiting}"
        >
            <div class="bike__loading">
                <Icon name="refresh" />
                <p>更新地圖資訊…</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.bike {
    @include size(100%, 100vh);

    position: relative;
    user-select: none;

    > * {
        @include size(100%);

        position: absolute;
        top: 0;
        left: 0;
    }

    &__main {
        pointer-events: none;

        > * {
            position: absolute;
            pointer-events: auto;
        }
    }

    &__search {
        top: $padding * 3;
        left: $padding * 3;
        width: 400px;
        @include media-breakpoint-down(tablet) {
            left: $padding * 2.5;
            width: calc(100% - #{$padding} * 5);
        }

        .search-default {
            position: relative;
            margin-bottom: $padding * 2;
        }

        &-result {
            position: absolute;
            bottom: -$padding * 2;
            left: 0;
            padding: $padding  $padding * 3;
            width: 100%;
            background-color: color('White');
            border-radius: 24px;
            z-index: 1;
            box-shadow: 0 0 24px rgba(0, 0, 0, 10%);
            transform: translate(0, 100%);

            &-item {
                display: flex;
                padding: $padding * 2 0;
                cursor: pointer;
                transition: color .3s;
                @media (hover: hover) and (pointer: fine) {
                    &:hover {
                        color: var(--primary, color('Primary'));
                    }
                }
            }

            &-title {
                @include text-ellipsis;
                @include typo-h3;

                margin-right: $padding;
            }

            &-desc {
                @include text-ellipsis;
                @include typo-h4;

                color: color('Dark-Gray');
            }
        }
    }

    &__refresh {
        @include typo-h4;

        top: $padding * 3;
        left: 50%;
        display: flex;
        align-items: center;
        padding: $padding * 1.5 $padding * 2;
        background-color: color('White');
        border-radius: 24px;
        opacity: 0%;
        transition: color .3s, opacity .3s;
        transform: translate(-50%, 0);
        cursor: pointer;
        pointer-events: none;
        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: var(--primary, color('Primary'));
            }
        }
        @include media-breakpoint-down(desktop) {
            top: $padding * 12;
        }

        .icon {
            margin-right: $padding;
            transition: none;
        }

        &.-active {
            opacity: 100%;
            pointer-events: auto;
        }
    }

    &__zoom-in, &__zoom-out, &__reset-position {
        @include size(48px);

        bottom: $padding * 5;
        right: $padding * 4;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: color('White');
        border-radius: 50%;
        cursor: pointer;
        @include media-breakpoint-down(desktop) {
            bottom: 22%;
        }
        @include media-breakpoint-down(tablet) {
            right: $padding * 2.5;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: var(--primary, color('Primary'));
            }
        }

        .icon {
            @include size(1.25rem);
        }
    }

    &__zoom-in {
        transform: translate(0, -200%) translate(0, -$padding * 3);
    }

    &__zoom-out {
        transform: translate(0, -100%) translate(0, -$padding * 2);
    }

    &__reset-position {
        color: color('Dark-Gray');
    }

    &__types {
        position: absolute;
        bottom: $padding * 5;
        left: 50%;
        transform: translate(-50%, 0);
        @include media-breakpoint-down(tablet) {
            bottom: 22%;
            left: $padding * 2.5;
            transform: none;
        }

        &-icon {
            @include size(24px);

            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: $padding;
            border-radius: 50%;

            .icon {
                transition: none;
            }
        }

        &-display {
            display: flex;
            align-items: center;
            justify-content: center;

            .bike__types-icon {
                color: color('Black');
                background-color: var(--primary, color('Primary'));
            }

            > * {
                flex-shrink: 0;
            }
        }

        &-type {
            display: flex;
            align-items: center;
            white-space: nowrap;
            cursor: pointer;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    p {
                        color: var(--primary, color('Primary'));
                    }
                }
            }

            &.-active {
                p {
                    color: var(--primary, color('Primary'));
                }

                .bike__types-icon {
                    color: color('Black');
                    background-color: var(--primary, color('Primary'));
                }
            }

            & ~ & {
                margin-top: $padding * 1.5;
            }

            p {
                transition: color .3s;
            }

            .bike__types-icon {
                color: color('White');
                background-color: color('Black');
            }
        }
    }

    &__mask {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0%;
        transition: opacity .3s;
        pointer-events: none;

        &.-active {
            opacity: 100%;
            pointer-events: auto;
        }
    }

    &__loading {
        @include typo-h4;

        display: flex;
        align-items: center;
        padding: $padding * 3;
        background-color: color('White');
        border-radius: 24px;
        box-shadow: 0 0 24px rgba(0, 0, 0, 10%);

        .icon {
            margin-right: $padding;
        }
    }
}
</style>
