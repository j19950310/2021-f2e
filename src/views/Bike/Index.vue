<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import GoogleMap from '@/plugins/GoogleMap/googleMap'

const $store = useStore()
const $route = useRoute()
const $router = useRouter()

const searchValue = ref(null)
const googleMapEl = ref(null)
const map = ref(null)

const isWaiting = computed(() => $store.state.bike.isWaiting)
const isHome = computed(() => $route.name === 'BikeHome')
const allData = computed(() => $store.getters['bike/allData'])

onMounted(() => {
    map.value = new GoogleMap(googleMapEl.value)
    map.value.on('init', (payload) => {
        search()
    })
    map.value.on('boundsChanged', (payload) => {
        handleBoundsChanged(payload)
    })
    map.value.on('markerClicked', (marker) => {
        const { markerData } = marker
        marker.setIcon(new URL('../../assets/icons/bike-active.svg', import.meta.url).href)
        map.value.removeQueryMarker()
        $store.commit('bike/SET_CURRENT_LOCATION', markerData)
        $router.push({ name: 'BikePlace', params: { value: markerData.StationName.Zh_tw }, query: { ...$route.query } })
    })
    map.value.on('markerUnClicked', (marker) => {
        marker.setIcon(new URL('../../assets/icons/bike.svg', import.meta.url).href)
    })
})

const handleBoundsChanged = async ({ lat, lng, radius }) => {
    $router.push({ name: $route.name, query: { lat, lng, r: radius } })
    if (isHome.value) {
        await $store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
            options: {
                position: { lat, lng },
                distance: radius | 0,
            },
        })
        addClusterMakers()
    }
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
const search = async () => {
    const { value } = $route.params

    if (value) {
        const radius = Math.min(Math.max(map.value.radius[0] | 0, 250), 1000)
        const [firstPlaces] = await map.value.searchPlace(value, {
            radius,
        })
        const { location } = firstPlaces.geometry
        await $store.dispatch('bike/GET_BIKE_NEAR_STATIONS', {
            options: {
                position: { lat: location.lat(), lng: location.lng() },
                distance: radius,
            },
        })
        addClusterMakers()
        map.value.moveMapToPlace(firstPlaces.geometry.location, radius / 2)
        map.value.removeQueryMarker()
        map.value.setQueryMarker({
            position: location,
        })
    }
}
const submit = () => {
    if (searchValue.value) {
        $router.push({ name: 'BikeSearch', params: { value: searchValue.value }, query: { ...$route.query } })
        searchValue.value = null
        requestAnimationFrame(() => {
            search()
        })
    }
}
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
                    @submit="submit"
                >
                    <div class="search-filter__functions">
                        <div
                            class="search-filter__functions-item"
                            @click="submit"
                        >
                            <Icon name="search" />
                        </div>
                        <div class="search-filter__functions-item">
                            <Icon name="filter" />
                        </div>
                    </div>
                </SearchDefault>
                <DragPopup v-if="!isHome">
                    <router-view />
                </DragPopup>
            </div>
            <div
                class="bike__refresh"
                :class="{'-active': !isHome && !isWaiting}"
                @click="search"
            >
                <p>重新搜尋這區域</p>
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
            pointer-events: auto;
        }
    }

    &__search {
        position: absolute;
        top: $padding * 3;
        left: $padding * 3;
        width: 400px;

        .search-default {
            margin-bottom: $padding * 2;
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

    &__refresh {
        @include typo-h4;

        position: absolute;
        top: $padding * 3;
        left: 50%;
        padding: $padding * 2;
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

        &.-active {
            opacity: 100%;
            pointer-events: auto;
        }
    }
}
</style>
