<script>
import { BusRoute, BusStop } from '@/api/Bus'
import markerIconUrl from '@/assets/markerBusStop.png'
import markerIconEndsUrl from '@/assets/markerBusStopEnd.png'
import markerBusStationActive from '@/assets/markerBusStationActive.svg'
const iconBetween = {
    url: markerIconUrl,
    anchor: { x: 12, y: 12 },
}
const iconEnds = {
    url: markerIconEndsUrl,
    anchor: { x: 16, y: 16 },
}
const iconBus = {
    url: markerBusStationActive,
    anchor: { x: 44, y: 44 },
}
const createMarkerLabel = (text) => ({
    text,
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    className: 'marker-label',
})
// 透過 query 顯示
export default {
    name: 'BusSearchRoute',
    inject: ['$map', 'viewIndex'],
    props: {
        busRoute: {
            type: BusRoute,
            default: null,
        },
    },
    emits: ['forward', 'back'],
    data () {
        return {
            direction: 0,
            stops: [],
            buss: [],
            formatBusRoute: null,
            activeStop: null,
            estimatedTime: [],
        }
    },
    computed: {
        infoData () {
            if (!this.formatBusRoute) return null
            const { name, city, id, uid, type, start, end } = this.formatBusRoute
            return { name, city, id, uid, type, start, end, isLink: false }
        },
        currentStops () {
            if (!this.activeCurrentView) return null
            const stops = this.stops.find(({ direction }) => (direction === this.direction))
            if (!stops) return null
            const { stops: stopsList = [] } = stops
            let estimateTime = Infinity
            const times = this.estimatedTime
                .filter(({ direction }) => (direction === this.direction))
                .sort((stop1, stop2) => (stopsList.findIndex(({ id }) => id === stop1.id) - stopsList.findIndex(({ id }) => id === stop2.id)))

            times.forEach((stop) => {
                if (stop.EstimateTime !== undefined) {
                    if (stop.EstimateTime === 0) {
                        console.log(stop)
                        stop.busState = 'now'
                    } else if (estimateTime > stop.EstimateTime) {
                        stop.busState = 'coming'
                    } else {
                        stop.busState = false
                    }
                    estimateTime = stop.EstimateTime
                } else {
                    stop.busState = false
                }
            })

            return {
                ...stops,
                times: times.map(stop => stop.estimateTime),
                busState: times.map(stop => stop.busState),
            }
        },
        activeCurrentView () {
            return this.viewIndex.value === 2
        },
        updateTime () {
            if (this.formatBusRoute?.updateTime) {
                const date = new Date(this.formatBusRoute.updateTime)
                return date.toLocaleTimeString('zh-TW', { hour12: false, timeStyle: 'short' })
            }
            return ''
        },
    },
    watch: {
        busRoute: {
            handler (newVal, oldVal) {
                if (!newVal) return
                const { mapInstance } = this.$map.value
                this.stops = []
                this.formatBusRoute = new BusRoute(newVal)
                this.formatBusRoute.getShape().then(res => {
                    const drawPoints = (() => {
                        const arr = []
                        res.forEach(({ points }) => {
                            points.forEach(([lat, lng]) => { arr.push({ lat, lng }) })
                        })
                        return arr
                    })()
                    this.customPolylineOuter.setPath(drawPoints)
                    this.customPolylineInner.setPath(drawPoints)
                    this.customPolylineOuter.setMap(mapInstance)
                    this.customPolylineInner.setMap(mapInstance)
                })
                this.formatBusRoute.getStops().then(res => {
                    this.stops = res.map(route => {
                        const { Direction: direction, Stops } = route
                        return {
                            direction,
                            stops: Stops.map(stop => new BusStop(stop)),
                        }
                    })
                    this.direction = 0
                })
                this.formatBusRoute.getEstimatedTime().then(res => {
                    this.estimatedTime = res
                })
                this.formatBusRoute.getBusRealTime().then(res => {
                    this.buss = [...res]
                    this.updateBusMarker(this.buss.filter(({ direction }) => (direction === this.direction)))
                })
            },
        },
        currentStops (routeStops) {
            if (!routeStops) return
            const { stops = [] } = routeStops
            this.clearMarker().then(() => {
                if (stops.length) {
                    this.updateMarker()
                }
            })
        },
        direction () {
            this.clearBusMarker().then(() => {
                const filterBuss = this.buss.filter(({ direction }) => (direction === this.direction))
                if (filterBuss.length) {
                    this.updateBusMarker(filterBuss)
                }
            })
        },
        activeCurrentView (newVal) {
            if (newVal) {
                this.showPolyline()
            } else {
                this.clearMarker()
                this.hidePolyline()
                this.activeStop = null
            }
        },
        activeStop (focusStop, blurStop) {
            const { mapInstance } = this.$map.value
            const focusMarker = this.stopMarkers.find(marker => (marker.stop === focusStop))
            const blurMarker = this.stopMarkers.find(marker => (marker.stop === blurStop))
            if (focusMarker) {
                mapInstance.panTo(focusMarker.position)
                if (!focusMarker.isEnd) {
                    focusMarker.setLabel(createMarkerLabel(focusStop.name))
                }
            }
            if (blurMarker && !blurMarker.isEnd) {
                blurMarker.setLabel(null)
            }
        },
    },
    mounted () {
        const { googleMap } = this.$map.value
        this.stopMarkers = []
        this.busMarkers = []
        this.customPolylineOuter = new googleMap.Polyline({
            path: [],
            geodesic: true,
            strokeColor: '#00A67E',
            strokeOpacity: 1.0,
            strokeWeight: 14,
        })
        this.customPolylineInner = new googleMap.Polyline({
            path: [],
            geodesic: true,
            strokeColor: '#32F3AE',
            strokeOpacity: 1.0,
            strokeWeight: 10,
        })
    },
    methods: {
        updateMarker () {
            const stops = this.currentStops.stops
            const { googleMap, mapInstance } = this.$map.value
            const length = stops.length
            stops.forEach((stop, index) => {
                const isEnd = (index === 0 | index === length - 1)
                const marker = new googleMap.Marker({
                    zIndex: 1,
                    position: stop.position,
                    map: mapInstance,
                    title: stop.name,
                    icon: isEnd ? iconEnds : iconBetween,
                    label: isEnd ? createMarkerLabel(stop.name) : undefined,
                })
                marker.stop = stop
                marker.isEnd = isEnd
                this.stopMarkers.push(marker)
                googleMap.event.addListener(marker, 'click', () => {
                    this.activeStop = stop
                })
            })
        },
        updateBusMarker (buss) {
            const { googleMap, mapInstance } = this.$map.value
            buss.forEach(bus => {
                const marker = new googleMap.Marker({
                    zIndex: 2,
                    position: bus.position,
                    map: mapInstance,
                    icon: iconBus,
                    label: createMarkerLabel(bus.number || bus.PlateNumb),
                })
                this.busMarkers.push(marker)
            })
        },
        clearMarker () {
            return new Promise(resolve => {
                while (this.stopMarkers.length) {
                    let marker = this.stopMarkers.pop()
                    marker.setMap(null)
                    marker = null
                }
                while (this.busMarkers.length) {
                    let marker = this.busMarkers.pop()
                    marker.setMap(null)
                    marker = null
                }
                resolve()
            })
        },
        clearBusMarker () {
            return new Promise(resolve => {
                while (this.busMarkers.length) {
                    let marker = this.busMarkers.pop()
                    marker.setMap(null)
                    marker = null
                }
                resolve()
            })
        },
        showPolyline () {
            const { mapInstance } = this.$map.value
            this.customPolylineOuter.setMap(mapInstance)
            this.customPolylineInner.setMap(mapInstance)
        },
        hidePolyline () {
            this.customPolylineOuter.setPath([])
            this.customPolylineInner.setPath([])
            this.customPolylineOuter.setMap(null)
            this.customPolylineInner.setMap(null)
        },
    },
}
</script>
<template>
    <div
        class="bus-search-route"
        :class="{
            '-hide': !activeCurrentView,
            '-show': activeCurrentView,
        }"
    >
        <div class="bus-search-route__info">
            <CardBusQuery v-bind="infoData" />
            <div
                v-if="formatBusRoute"
                class="bus-search-route__info-tab"
            >
                <div
                    class="bus-search-route__info-tab-item"
                    :class="{'-active': direction === 0}"
                    @click="direction = 0"
                >
                    往{{ formatBusRoute.end }}
                </div>
                <div
                    class="bus-search-route__info-tab-item"
                    :class="{'-active': direction === 1}"
                    @click="direction = 1"
                >
                    往{{ formatBusRoute.start }}
                </div>
            </div>
        </div>
        <div
            v-if="currentStops"
            class="bus-search-route__main"
        >
            <transition
                name="fade"
                mode="out-in"
            >
                <div
                    :key="index"
                    :data-direction="currentStops.direction"
                    class="bus-search-route__stops-wrap"
                >
                    <CardBusStop
                        v-for="(stop, stopIndex) in currentStops.stops"
                        :key="stop.id"
                        :active="activeStop === stop"
                        :index="stop.index"
                        :name="stop.name"
                        :position="stop.position"
                        :is-end="stopIndex === currentStops.stops.length - 1"
                        :time="currentStops.times[stopIndex] || ''"
                        :bus-state="currentStops.busState[stopIndex] || false"
                        @click="activeStop = stop"
                    />
                </div>
            </transition>
        </div>
        <div class="bus-search-route__action">
            <ButtonSecondary @click="$emit('back')">
                返回
            </ButtonSecondary>
            <ButtonPrimary
                icon="info"
                @click="$emit('forward')"
            >
                路線資訊
            </ButtonPrimary>
        </div>
        <div
            v-if="updateTime"
            class="bus-search-route__update"
        >
            更新時間：{{ updateTime }}
        </div>
    </div>
</template>
<style lang="scss">
    .bus-search-route {
        display: flex;
        flex-direction: column;

        &__info {
            flex-shrink: 0;
            padding: 10px;

            &-tab {
                display: flex;

                &-item {
                    @include typo-h4;

                    cursor: pointer;
                    padding: 0 $padding $padding/2;
                    text-align: center;
                    border-bottom: 3px solid color('Black');
                    transition: border-bottom-color 0.3s;
                    flex: 0 0 50%;
                    @include text-ellipsis(1);

                    &.-active {
                        border-bottom-color: var(--primary);
                    }
                    @include hover {
                        border-bottom-color: var(--primary);
                    }
                }
            }
        }

        &__main {
            overflow-x: hidden;
            overflow-y: auto;
            flex-grow: 1;
            margin: $padding * 1.5 0;

            .card-bus-stop {
                margin-right: -$padding * 3;
                margin-left: -$padding * 3;
            }

            .-hide & {
                overflow: hidden;
            }
        }

        &__action {
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;

            .button-main {
                flex: 1 0 calc(50% - 12px);
                margin: 0 6px;
            }
        }

        &__update {
            margin-top: 20px;
            text-align: center;
            color: color('Gray');
            @include typo-min;
        }
    }

    // google Map
    .marker-label {
        padding: 8px 12px;
        color: white;
        background-color: color('Black');
        border-radius: 8px;
        line-height: 1.5;
        transform: translateY(-120%);

        &::before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            display: block;
            width: 0;
            height: 0;
            transform: translate(-50%, -1px);
            border-left: 6.5px solid transparent;
            border-right: 6.5px solid transparent;
            border-top: 4px solid color('Black');
        }
    }
</style>
