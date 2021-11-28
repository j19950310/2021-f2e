<script>
import { defineComponent, ref, computed, onMounted, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GoogleMap from '@/plugins/GoogleMap/googleMap'
import markerBusStation from '@/assets/markerBusStation.svg'
import markerBusStationActive from '@/assets/markerBusStationActive.svg'
import markerBusStop from '@/assets/markerBusStop.png'
import markerBusStopEnd from '@/assets/markerBusStopEnd.png'
import { BusQuery } from '@/api/Bus'
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
        const viewIndex = ref(0)
        const googleMapEl = ref('')
        const searchValue = ref(null)
        const searchQueries = ref([])
        const cacheQuerys = ref([])
        const currentStation = ref(null)
        const currentRoute = ref(null) // 此route為車的路線...
        const mapInit = () => {
            const { lat, lng } = $map.value.mapInstance.getCenter()
            preventInteraction.value = false
            $busQuery.setPosition({ lat: lat(), lng: lng() })
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
            $busQuery.setPosition({ lat, lng }, Math.ceil(Math.min(radius, 1000)))
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
            Object.assign(map.onEvents, {
                boundsChanged,
                init: mapInit,
            })
            $map.value = map
        })
        provide('$map', $map)
        provide('viewIndex', viewIndex)

        return {
            viewIndex,
            preventInteraction,
            googleMapEl,
            searchValue,
            searchQueries,
            submit,
            $busQuery,
            currentRoute,
            currentStation,
            cacheQuerys,
        }
    },
    data () {
        return {
            isDetail: false,
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
            'pointer-events': preventInteraction ? 'none' : 'auto',
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
        </div>
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
}
</style>
