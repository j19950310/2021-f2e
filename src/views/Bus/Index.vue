<script>
import { defineComponent, ref, computed, onMounted, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GoogleMap from '@/plugins/GoogleMap/googleMap'
import markerBusStation from '@/assets/markerBusStation.svg'
import markerBusStationActive from '@/assets/markerBusStationActive.svg'
import markerBusStop from '@/assets/markerBusStop.png'
import markerBusStopEnd from '@/assets/markerBusStopEnd.png'
import { BusQuery } from '@/api/Bus'
import loadingBg from '@/assets/busLanding.png'

const iconBusStation = {
    url: markerBusStation,
    anchor: { x: 12, y: 12 },
}
const iconBusStationActive = {
    url: markerBusStationActive,
    anchor: { x: 44, y: 44 },
}

// view -1: station |
// 0: searchRoute -> 1: routes -> 2: routeDetail
export default defineComponent({
    name: 'BusRoot',
    inject: ['viewport'],
    setup () {
        // use
        const $router = useRouter()
        const $route = useRoute()
        const $busQuery = new BusQuery({ distance: 1000 })
        const $map = ref(null)

        // variable
        let stationMarkers = []
        const preventInteraction = ref(true)
        const isLoading = ref(true)
        const enterLoading = ref(false)
        const enableRefreshStation = ref(false)
        const viewIndex = ref(0)
        const googleMapEl = ref('')
        const searchValue = ref(null)
        const searchQueries = ref([])
        const cacheQueries = ref([])
        const currentStation = ref(null)
        const currentRoute = ref(null) // 此route為車的路線...
        const enter = () => {
            enterLoading.value = true
        }
        const submit = async () => { // 查詢關鍵字
            if (searchValue.value) {
                preventInteraction.value = true
                try {
                    const config = $busQuery.mergeRouteKeywordsConfig({}, searchValue.value)
                    const cityResults = await $busQuery.searchRouteByNearBy(searchValue.value)
                    const interCityResults = await $busQuery.searchRouteInterCity(config)
                    searchQueries.value = [...cityResults, ...interCityResults]
                } catch (e) {
                    console.error(e)
                } finally {
                    viewIndex.value = 1
                    $router.push({
                        name: 'BusSearch',
                        params: {
                            search: searchValue.value,
                        },
                    })
                    preventInteraction.value = false
                }
            }
        }
        const zoom = (value = 1) => {
            if ($map.value) {
                $map.value.setZoom($map.value.mapInstance.zoom + value)
            }
        }
        const moveUserLocation = () => {
            if ($map.value) {
                if ($map.value.agreeGeolocation) {
                    $map.value.moveMapToPlace($map.value.userLocationMark.getPosition())
                    $map.value.setZoom(17)
                    return
                }
                $map.value.requestUserLocation()
            }
        }
        const createStationMarker = (station) => {
            const { Marker, event } = $map.value.googleMap
            const isActive = station.uid === currentStation?.value?.uid
            const marker = new Marker({
                position: station.position,
                map: $map.value.mapInstance,
                icon: isActive ? iconBusStationActive : iconBusStation,
            })
            event.addListener(marker, 'click', () => {
                stationMarkers.forEach(marker => {
                    marker.setIcon(iconBusStation)
                })
                marker.setIcon(iconBusStationActive) // 觸發狀態改變
                currentStation.value = station
                viewIndex.value = 0
                $router.replace({
                    name: 'BusSearch',
                    params: {
                        search: station.name,
                    },
                })
            })
            return marker
        }
        const clearStationMarkers = () => {
            stationMarkers.forEach(marker => {
                marker.setMap(null)
                marker = null
            })
        }
        const boundsChanged = ({ lat, lng, radius }) => { // 更新查詢位置
            enableRefreshStation.value = true
            $busQuery.setPosition({ lat, lng }, Math.ceil(Math.min(radius, 1000)))
        }
        const refreshStationMarkers = () => {
            enableRefreshStation.value = false
            if (viewIndex.value === 0) { // 巴士站點畫面
                $busQuery.searchStationByNearBy().then(results => {
                    clearStationMarkers()
                    stationMarkers = results.map((station) => {
                        return createStationMarker(station)
                    })
                })
            } else {
                clearStationMarkers()
            }
        }
        const mapInit = () => {
            // const { lat, lng } = $map.value.mapInstance.getCenter()
            const map = $map.value
            map.requestUserLocation()
            map.getUserLocation().then((e) => {
                const {
                    coords: {
                        latitude: lat,
                        longitude: lng,
                    },
                } = e
                isLoading.value = false
                preventInteraction.value = false
                map.mapInstance.setCenter({ lat, lng })
                map.setZoom(17)
                $busQuery.setPosition({ lat, lng })
                refreshStationMarkers()
            })
        }
        $router.afterEach(async (to, from) => {
            console.log(to, from)
            const { route: toRoute, city } = to.query
            const { route: fromRoute } = from.query
            let results = []
            if (toRoute !== fromRoute && toRoute) {
                if (city) {
                    results = await $busQuery.searchRouteByCity(city, {
                        filter: `RouteUID eq '${toRoute}'`,
                    })
                } else {
                    results = await $busQuery.searchRouteInterCity({
                        filter: `RouteUID eq '${toRoute}'`,
                    })
                }
                if (results && results[0]) {
                    if (results[0].uid !== currentRoute.value?.uid) {
                        currentRoute.value = results[0]
                        viewIndex.value = 2
                    }
                }
            }
        })
        onMounted(() => {
            const map = new GoogleMap(googleMapEl.value)
            map.on('init', mapInit)
            map.on('boundsChanged', boundsChanged)
            $map.value = map
        })
        provide('$map', $map)
        provide('viewIndex', viewIndex)

        return {
            enter,
            zoom,
            moveUserLocation,
            enterLoading,
            isLoading,
            enableRefreshStation,
            viewIndex,
            preventInteraction,
            googleMapEl,
            searchValue,
            searchQueries,
            submit,
            $busQuery,
            currentRoute,
            currentStation,
            cacheQueries,
            refreshStationMarkers,
        }
    },
    data () {
        return {
            isDetail: false,
            loadingBg,
        }
    },
    methods: {
        backToResult () {
            this.$router.replace({
                name: 'BusSearch',
                query: {
                    route: undefined,
                },
            })
            if (this.searchValue) {
                this.viewIndex = 1
            } else if (this.currentStation) {
                this.viewIndex = 0
                this.$nextTick(() => {
                    this.currentRoute = null
                })
            } else {
                this.viewIndex = 0
                this.clearSearch()
            }
        },
        goToDetail () {
            this.viewIndex = 3
            this.$forceUpdate()
        },
        clearSearch () {
            this.currentStation = null
            this.searchValue = null
            this.searchQueries = []
            this.viewIndex = 0
        },
    },
})
</script>
<template>
    <div
        class="bus"
        :style="{
            '--primary': '#32f3ae',
        }"
    >
        <div
            ref="googleMapEl"
            class="bus__map"
        />
        <div class="bus__main">
            <div
                class="bus__search"
                :class="{'-mobile': !viewport.isPc}"
            >
                <SearchBusFilter
                    v-model.trim="searchValue"
                    :active="viewIndex === 1 || currentStation"
                    :style="{
                        'pointer-events': preventInteraction ? 'none' : 'auto',
                    }"
                    @submit="submit"
                    @close="clearSearch"
                />
                <DragPopup v-if="currentStation || searchQueries.length > 0">
                    <div class="bus__view">
                        <div
                            class="bus__view-wrapper"
                            :style="{transform: `translate3d(${viewIndex * -100}%,0,0)`}"
                        >
                            <!-- 0: Station -->
                            <router-view
                                key="BusStation"
                                class="bus__view-slide"
                                name="BusStation"
                                :bus-station="currentStation"
                            />
                            <!-- 1: Search -->
                            <router-view
                                key="BusSearchResult"
                                class="bus__view-slide"
                                name="BusSearchResult"
                                :queries="searchQueries"
                            />
                            <!-- 2: Route -->
                            <router-view
                                key="BusSearchRoute"
                                class="bus__view-slide"
                                :bus-route="currentRoute"
                                :map="$map"
                                name="BusSearchRoute"
                                @back="backToResult"
                                @forward="goToDetail"
                            />
                            <!-- 3: Route Detail -->
                            <router-view
                                key="BusSearchRouteDetail"
                                class="bus__view-slide"
                                :bus-route="currentRoute"
                                name="BusSearchRouteDetail"
                                @back="viewIndex = 2"
                            />
                        </div>
                    </div>
                </DragPopup>
            </div>
            <div
                class="bike__refresh"
                :class="{'-active': enableRefreshStation && viewIndex === 0}"
                @click="refreshStationMarkers"
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
        </div>
        <!-- loading -->
        <transition name="bike-loading">
            <div
                v-show="isLoading || !enterLoading"
                v-bg="loadingBg"
                class="bus-loading"
            >
                <div class="container">
                    <div class="bus-loading__header">
                        <p
                            class="bus-loading__title-en"
                            lang="en"
                        >
                            FORMOSA<br> BUS Guide
                        </p>
                        <p class="bus-loading__title">
                            台灣巴士懶人包
                        </p>
                    </div>
                    <div
                        class="bus-loading__button"
                        :class="{'-loading': enterLoading}"
                    >
                        <ButtonPrimary
                            :icon="enterLoading ? null : 'enter'"
                            @click="enter"
                        >
                            <transition
                                name="fade"
                                mode="out-in"
                            >
                                <p v-if="!enterLoading">
                                    開始旅程
                                </p>
                                <svg
                                    v-else
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 50 50"
                                >
                                    <path
                                        fill="#32F3AE"
                                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                                    >
                                        <animateTransform
                                            attributeType="xml"
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 25 25"
                                            to="360 25 25"
                                            dur="0.6s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                </svg>
                            </transition>
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss">
.bus {
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
        bottom: $padding * 3;
        left: $padding * 3;
        display: flex;
        width: 420px;
        flex-direction: column;
        pointer-events: none;
        @include media-breakpoint-down(tablet) {
            left: $padding * 2.5;
            width: calc(100% - #{$padding} * 5);
        }

        .search-default {
            position: relative;
            margin-bottom: $padding * 2;
            flex: 0 0 auto;
            pointer-events: all;
        }

        .drag-popup {
            pointer-events: all;

            &:not(.-mobile) {
                flex: 1 0 500px;
                position: relative;
                max-height: initial;
            }
        }
    }

    &__view {
        position: absolute;
        top: $padding * 3;
        bottom: $padding * 3;
        right: $padding * 3;
        left: $padding * 3;
        overflow: hidden;
        max-height: 100%;

        &-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform .3s;
        }

        &-slide {
            flex: 0 0 100%;
            max-height: 100%;
        }
    }

    &-loading {
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        padding-top: $padding * 7;
        color: color('White');
        z-index: 100;
        text-shadow: 0 1px 6px rgba(0, 0, 0, 25%);
        touch-action: none;
        user-select: none;

        @include size(100%);

        .container {
            @include size(100%);

            display: flex;
            flex-direction: column;
        }

        &__title-en {
            @include typo-display;

            text-transform: uppercase;
            margin-bottom: $padding;
        }

        &__title {
            @include typo-display-small;
        }

        &__header {
            flex: 1 1 auto;
        }

        &__button {
            margin: 0 auto $padding * 16;

            .button-main {
                height: 52px;
            }

            &.-loading {
                pointer-events: none;
            }
        }
    }
}
</style>
