<script>
import { BusRoute, BusStop } from '@/api/Bus'
import markerIconUrl from '@/assets/markerBusStop.png'
import markerIconEndsUrl from '@/assets/markerBusStopEnd.png'
const iconBetween = {
    url: markerIconUrl,
    anchor: { x: 12, y: 12 },
}
const iconEnds = {
    url: markerIconEndsUrl,
    anchor: { x: 16, y: 16 },
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
            formatBusRoute: null,
            activeStop: null,
        }
    },
    computed: {
        infoData () {
            if (!this.formatBusRoute) return null
            const { name, city, id, uid, type, start, end } = this.formatBusRoute
            return { name, city, id, uid, type, start, end, isLink: false }
        },
        currentStops () {
            if (!this.stops.length) return null
            return this.stops.find(({ direction }) => (direction === this.direction))
        },
        activeRoute () {
            return this.viewIndex.value === 1
        },
        updateTime () {
            if (this.formatBusRoute.updateTime) {
                const date = new Date(this.formatBusRoute.updateTime)
                return date.toLocaleTimeString()
            }
            return ''
        },
    },
    watch: {
        busRoute: {
            handler (newVal) {
                this.stops = []
                this.formatBusRoute = new BusRoute(newVal)
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
            },
            deep: true,
        },
        currentStops (routeStops) {
            if (!routeStops) return
            const { stops } = routeStops
            if (stops) {
                const { mapInstance } = this.$map.value
                const path = stops.map(stop => (stop.position))
                this.customPolylineOuter.setPath(path)
                this.customPolylineInner.setPath(path)
                this.customPolylineOuter.setMap(mapInstance)
                this.customPolylineInner.setMap(mapInstance)
                this.updateMarker(stops)
                mapInstance.panTo(stops[0].position)
            }
        },
        activeRoute (newVal) {
            if (newVal) {
                this.showPolyline()
            } else {
                this.clearMarker()
                this.hidePolyline()
            }
        },
        activeStop (focusStop, blurStop) {
            const { mapInstance } = this.$map.value
            const focusMarker = this.markers.find(marker => (marker.stop === focusStop))
            const blurMarker = this.markers.find(marker => (marker.stop === blurStop))
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
        this.markers = [] // 不在data，防止代理無法清除
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
        updateMarker (stops) {
            const { googleMap, mapInstance } = this.$map.value
            const length = stops.length
            const markers = []
            this.clearMarker()
            stops.forEach((stop, index) => {
                const isEnd = (index === 0 | index === length - 1)
                const marker = new googleMap.Marker({
                    position: stop.position,
                    map: mapInstance,
                    title: stop.name,
                    icon: isEnd ? iconEnds : iconBetween,
                    label: isEnd ? createMarkerLabel(stop.name) : undefined,
                })
                marker.stop = stop
                marker.isEnd = isEnd
                markers.push(marker)
                googleMap.event.addListener(marker, 'click', () => {
                    this.activeStop = stop
                })
            })
            this.clearMarker()
            this.markers = markers
        },
        clearMarker () {
            const markers = [...this.markers]
            markers.forEach(marker => {
                console.log(marker)
                marker.setMap(null)
                marker = null
            })
            this.markers = []
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
    <div class="bus-search-route">
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
            margin: $padding * 1.5 $padding * -3;
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
