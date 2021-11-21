<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import BikeSearch from '@/views/Bike/Search.vue'
import GoogleMap from '@/plugins/GoogleMap/googleMap'
import { BIKE_TYPE } from '@/plugins/variable'

export default defineComponent({
    components: {
        BikeSearch,
    },
    async beforeRouteUpdate (to, from) {
        const { lat = 0, lng = 0, r = 0 } = to.query
        if (this.isHome) {
            await this.$store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
                options: {
                    position: { lat, lng },
                    distance: r | 0,
                },
            })
            this.addClusterMakers()
        }
    },
    setup () {
        const $store = useStore()
        const $route = useRoute()
        const $router = useRouter()

        const searchValue = ref(null)
        const googleMapEl = ref(null)
        const map = ref(null)
        const searchQuerys = ref([])
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

        watch(() => searchValue.value, async (value) => {
            if (value) {
                searchQuerys.value = await map.value.searchQuery(value)
                return
            }
            searchQuerys.value = []
        })
        watch(() => $route.params.value, (value) => {
            if (value) {
                if (!isSearch.value) {
                    const marker = findLocationMarker($route.params.value)
                    if (marker) {
                        map.value.moveMapToPlace(marker.position)
                        $store.commit('bike/SET_CURRENT_LOCATION_DATA', marker.markerData)
                    }
                }
            }
        })

        const handleBoundsChanged = async ({ lat, lng, radius }) => {
            $router.push({ name: $route.name, query: { lat, lng, r: radius } })
        }
        const addClusterMakers = () => {
            map.value.clearClusterMarker()
            allData.value.forEach(station => {
                if (station.type === BIKE_TYPE.STATION) {
                    map.value.setClusterMarker(station, {
                        position: {
                            lat: station.StationPosition.PositionLat,
                            lng: station.StationPosition.PositionLon,
                        },
                        icon: new URL('../../assets/icons/bike.svg', import.meta.url).href,
                    })
                }
                if (station.type === BIKE_TYPE.CYCLING) {
                    const [lng, lat] = station.geometry[0].split(' ')
                    map.value.setClusterMarker(station, {
                        position: {
                            lat: Number(lat),
                            lng: Number(lng),
                        },
                        icon: new URL('../../assets/icons/cycling.svg', import.meta.url).href,
                    })
                }
            })
        }
        const findLocationMarker = (value) => {
            if (value) {
                const marker = map.value.findClusterMarker(({ markerData }) => {
                    const { type } = markerData
                    if (type === BIKE_TYPE.STATION) {
                        return markerData.StationName.Zh_tw === value
                    }
                    if (type === BIKE_TYPE.CYCLING) {
                        return markerData.RouteName === value
                    }
                })
                map.value.setActivateMarker(marker)
                return marker
            }
        }
        const search = async (value) => {
            value = value || $route.params.value

            if (typeof value === 'string') {
                const radius = Math.min(Math.max(map.value.radius[0] | 0, 250), 1000)
                const [firstPlaces] = await map.value.searchPlace(value, {
                    radius,
                })
                if (firstPlaces) {
                    const detail = await map.value.searchPlaceDetail(firstPlaces.place_id, {
                        fields: ['address_components'],
                    })
                    let administrative
                    if (detail) {
                        administrative = detail.address_components[4]?.long_name
                    }
                    const { location } = firstPlaces.geometry

                    await Promise.all(selectTypes.value.map(type => {
                        if (type === BIKE_TYPE.STATION) {
                            return $store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
                                options: {
                                    position: { lat: location.lat(), lng: location.lng() },
                                    distance: radius,
                                },
                            })
                        }
                        if (type === BIKE_TYPE.CYCLING) {
                            return $store.dispatch('bike/GET_BIKE_CYCLING', {
                                area: administrative,
                            })
                        }
                        if (type === BIKE_TYPE.RESTAURANT) {
                            return null
                        }
                        if (type === BIKE_TYPE.TOUR) {
                            return null
                        }
                        return null
                    }))
                    addClusterMakers()
                    map.value.moveMapToPlace(firstPlaces.geometry.location, radius)
                    map.value.removeQueryMarker()
                    map.value.setQueryMarker({
                        position: location,
                    })
                }
            }
        }
        const submit = (value) => {
            if (value) {
                $router.push({ name: 'BikeSearch', params: { value }, query: { ...$route.query } })
                searchValue.value = null
                search(value)
            }
        }
        const zoom = (value = 1) => {
            if (map.value) {
                map.value.setZoom(map.value.mapInstance.zoom + value)
            }
        }
        const getUserLocation = () => {
            if (map.value) {
                map.value.getUserLocation()
            }
        }
        const changeSelectTypes = (type) => {
            $store.commit('bike/CLEAR_ALL_DATA')
            if (type !== 'all') {
                selectTypes.value.includes(type)
                    ? $store.commit('bike/DEL_SELECT_TYPE', type)
                    : $store.commit('bike/ADD_SELECT_TYPE', type)
            } else {
                $store.commit('bike/TOGGLE_ALL_TYPE')
            }
            search()
        }
        const reset = () => {
            $router.push({ name: 'BikeHome' })
            map.value.removeQueryMarker()
        }

        onMounted(() => {
            map.value = new GoogleMap(googleMapEl.value)
            map.value.on('init', () => {
                search()
                $store.commit('bike/SET_LOADING', false)
            })
            map.value.on('boundsChanged', (payload) => {
                handleBoundsChanged(payload)
            })
            map.value.on('onUserLocationChanged', (position) => {
                $store.commit('bike/SET_USER_LOCATION', {
                    lat: position.lat(),
                    lng: position.lng(),
                })
            })
            map.value.on('markerActivated', (marker) => {
                map.value.removeQueryMarker()
                const { markerData } = marker
                if (markerData.type === BIKE_TYPE.STATION) {
                    marker.setIcon(new URL('../../assets/icons/bike-active.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.CYCLING) {
                    marker.setIcon(new URL('../../assets/icons/cycling-active.svg', import.meta.url).href)
                }
            })
            map.value.on('markerDeActivated', (marker) => {
                const { markerData } = marker
                if (markerData.type === BIKE_TYPE.STATION) {
                    marker.setIcon(new URL('../../assets/icons/bike.svg', import.meta.url).href)
                }
                if (markerData.type === BIKE_TYPE.CYCLING) {
                    marker.setIcon(new URL('../../assets/icons/cycling.svg', import.meta.url).href)
                }
            })
            map.value.on('markerClicked', (marker) => {
                const { markerData } = marker
                if (markerData.type === BIKE_TYPE.STATION) {
                    $router.push({ name: 'BikePlace', params: { value: markerData.StationName.Zh_tw }, query: { ...$route.query } })
                }
                if (markerData.type === BIKE_TYPE.CYCLING) {
                    $router.push({ name: 'BikePlace', params: { value: markerData.RouteName }, query: { ...$route.query } })
                }
            })
        })

        return {
            googleMapEl,
            map,
            searchValue,
            searchQuerys,
            isWaiting,
            isHome,
            isSearch,
            isPlace,
            allData,
            currentLocationData,
            submit,
            search,
            addClusterMakers,
            findLocationMarker,
            zoom,
            getUserLocation,
            selectTypesMap,
            iconsMap,
            allTypes,
            selectTypes,
            changeSelectTypes,
            reset,
        }
    },
})
</script>

<template>
    <div
        class="bike"
        :style="{'--primary': '#32F3AE'}"
    >
        <div
            ref="googleMapEl"
            class="bike__map"
        />
        <div class="bike__main">
            <div class="bike__search">
                <SearchDefault
                    v-model.trim="searchValue"
                    @submit="submit(searchValue)"
                >
                    <div class="search-filter__functions">
                        <div
                            v-show="!isHome"
                            class="search-filter__functions-item"
                            @click="reset"
                        >
                            <Icon name="close-active" />
                        </div>
                        <div
                            class="search-filter__functions-item"
                            @click="submit(searchValue)"
                        >
                            <Icon name="search" />
                        </div>
                        <!-- <div class="search-filter__functions-item">
                            <Icon name="filter" />
                        </div> -->
                    </div>
                    <div
                        v-show="searchQuerys.length"
                        class="bike__search-result"
                    >
                        <ul class="bike__search-result-main">
                            <li
                                v-for="query in searchQuerys"
                                :key="query.place_id"
                                class="bike__search-result-item"
                                @click="submit(query.structured_formatting.main_text)"
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
                :class="{'-active': !isHome && !isWaiting}"
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
                @click="getUserLocation"
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
