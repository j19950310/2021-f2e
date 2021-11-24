<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import GoogleMap from '@/plugins/GoogleMap/googleMapDev'
import { getBusRouteByCity } from '@/api/getBus'
import { BusQuery } from '@/api/Bus'
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
        this.map.onEvents.init = (map) => {
            originMapInit()
            // query.searchByNearBy('士林').then(res => {
            //     console.log(res)
            // })
            query.searchByCity('臺北市', '士林').then(routes => {
                console.log(routes)
                routes[0].getStops().then(stops => {
                    console.log(stops)
                    const paths = stops[0].stops.map(stop => (stop.position))
                    console.log(paths)
                    this.map.drawCustomPolyline(paths)
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
}
</style>
