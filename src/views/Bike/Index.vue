<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import BikeSearch from '@/views/Bike/Search.vue'
import GoogleMap from '@/plugins/GoogleMap/googleMap'

export default defineComponent({
    components: {
        BikeSearch,
    },
    async beforeRouteUpdate (to, from) {
        const { lat = 0, lng = 0, r = 0 } = to.query
        const { value } = to.params
        if (this.isHome) {
            await this.$store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
                options: {
                    position: { lat, lng },
                    distance: r | 0,
                },
            })
            this.addClusterMakers()
        }
        if (this.isPlace) {
            const marker = this.map.findClusterMarker(({ markerData }) => markerData.StationName.Zh_tw === value)
            if (marker) {
                this.map.setActivateMarker(marker)
                this.$store.commit('bike/SET_CURRENT_LOCATION', marker.markerData)
            }
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

        const isWaiting = computed(() => $store.state.bike.isWaiting)
        const isHome = computed(() => $route.name === 'BikeHome')
        const isSearch = computed(() => $route.name === 'BikeSearch')
        const isPlace = computed(() => $route.name === 'BikePlace')
        const allData = computed(() => $store.getters['bike/allData'])
        const currentLocation = computed(() => $store.state.bike.currentLocation)

        watch(() => searchValue.value, async (value) => {
            if (value) {
                searchQuerys.value = await map.value.searchQuery(value)
                return
            }
            searchQuerys.value = []
        })

        const handleBoundsChanged = async ({ lat, lng, radius }) => {
            $router.push({ name: $route.name, query: { lat, lng, r: radius } })
        }
        const addClusterMakers = () => {
            map.value.clearClusterMarker()
            allData.value.forEach(station => {
                map.value.setClusterMarker(station, {
                    position: {
                        lat: station.StationPosition.PositionLat,
                        lng: station.StationPosition.PositionLon,
                    },
                    icon: new URL('../../assets/icons/bike.svg', import.meta.url).href,
                })
            })
        }
        const search = async (value) => {
            value = value || $route.params.value
            if (value) {
                const radius = Math.min(Math.max(map.value.radius[0] | 0, 250), 1000)
                const [firstPlaces] = await map.value.searchPlace(value, {
                    radius,
                })
                if (firstPlaces) {
                    const { location } = firstPlaces.geometry
                    await $store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
                        options: {
                            position: { lat: location.lat(), lng: location.lng() },
                            distance: radius,
                        },
                    })
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

        onMounted(() => {
            map.value = new GoogleMap(googleMapEl.value)
            map.value.on('init', () => {
                search()
            })
            map.value.on('boundsChanged', (payload) => {
                handleBoundsChanged(payload)
            })
            map.value.on('markerActivated', (marker) => {
                map.value.removeQueryMarker()
                marker.setIcon(new URL('../../assets/icons/bike-active.svg', import.meta.url).href)
            })
            map.value.on('markerDeActivated', (marker) => {
                marker.setIcon(new URL('../../assets/icons/bike.svg', import.meta.url).href)
            })
            map.value.on('markerClicked', (marker) => {
                const { markerData } = marker
                $router.push({ name: 'BikePlace', params: { value: markerData.StationName.Zh_tw }, query: { ...$route.query } })
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
            currentLocation,
            submit,
            search,
            addClusterMakers,
            zoom,
            getUserLocation,
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
                <DragPopup v-show="(isSearch && allData.length) || (isPlace && currentLocation)">
                    <router-view v-if="!isHome" />
                    <BikeSearch v-else />
                </DragPopup>
            </div>
            <div
                class="bike__refresh"
                :class="{'-active': !isHome && !isWaiting}"
                @click="search"
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
            bottom: 12%;
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
