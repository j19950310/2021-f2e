<script>
import { defineComponent, ref, computed, onMounted, watch, createApp } from 'vue'
import GoogleMap from '@/plugins/GoogleMap/googleMapDev'
import markerIconUrl from '@/assets/markerStop.png'
import markerIconEndsUrl from '@/assets/markerStopEnd.png'
import { getBusRouteByCity } from '@/api/getBus'
import { BusQuery } from '@/api/Bus'

const iconBetween = {
    url: markerIconUrl,
    anchor: { x: 12, y: 12 },
}
const iconEnds = {
    url: markerIconEndsUrl,
    anchor: { x: 12, y: 12 },
}
const getMarkerLabel = (text) => ({
    text,
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    className: 'marker-label',
})

export default defineComponent({
    name: 'Dev',
    setup () {

    },
    data () {
        return {
            map: null,
        }
    },
    mounted () {
        const div = document.createElement('div')
        // map
        this.map = new GoogleMap(this.$refs.map)
        const originMapInit = this.map.onEvents.init

        // bus query
        const distance = 1000
        const query = new BusQuery({
            position: { lat: 25.0833676, lng: 121.5258913 },
            distance,
        })

        // events
        this.map.onEvents.init = () => {
            originMapInit() // 初始function
            // query.searchByNearBy('士林').then(res => {
            //     console.log(res)
            // })

            query.searchByCity('臺北市', '士林').then(routes => {
                console.log(routes)

                // 取得停站點
                routes[0].getStops().then(stops => {
                    console.log(stops)
                    const path = stops[0].stops.map(stop => (stop.position))
                    console.log(path)
                    const stopLength = path.length
                    this.map.drawCustomPolyline(path)
                    path.forEach((stop, index) => {
                        const marker = new this.map.Stop({
                            position: stop,
                            map: this.map.mapInstance,
                            icon: (index === 0 | index === stopLength - 1) ? iconEnds : iconBetween,
                            label: (index === 0 | index === stopLength - 1) ? getMarkerLabel(stops[0].stops[index].name) : undefined,
                        })
                        this.map.googleMap.event.addListener(marker, 'click', () => {
                            console.log(stop)
                        })
                    })
                })
            })
        }
    },
    methods: {

    },
})
</script>

<template>
    <div class="page-dev">
        <div
            id="map"
            ref="map"
        />
        <div
            id="testMarker"
            ref="marker"
        >
            test
        </div>
    </div>
</template>

<style lang="scss">
.page-dev {
    #map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    form {
        display: flex;
        align-items: center;
        justify-content: center;

        [type='submit'] {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 24px;
            padding: 12px;
            font-weight: bold;
        }
    }

    &__show {
        padding: 40px;
        font-size: 12px;
        line-height: 1.5;

        &-row {
            padding: 20px;
        }
    }

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
}
</style>
