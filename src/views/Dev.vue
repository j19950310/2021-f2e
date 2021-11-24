<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import GoogleMap from '@/plugins/GoogleMap/googleMap'
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
        this.map = new GoogleMap(this.$refs.map)
        navigator.geolocation.getCurrentPosition((e) => {
            const { latitude: lat, longitude: lng } = e.coords
            const distance = 1000
            const query = new BusQuery({
                position: { lat, lng },
                distance,
            })
            // query.searchByNearBy('士林').then(res => {
            //     console.log(res)
            // })
            query.searchByCity('臺北市', '士林').then(res => {
                console.log(res)
            })
        })
    },
    methods: {
        keywordsSearch (keywords) {
            const config = {
                top: 10,
                filter: `contains(RouteName/Zh_tw, '${keywords}') | contains(DestinationStopNameZh, '${keywords}') | contains(DepartureStopNameZh, '${keywords}')`,
            }
            // getBusRouteByCity('臺北市', config).then(res => {
            //     console.log(res)
            // })
            const queryObject = new BusQuery(config)
            queryObject.searchByCity('臺北市').then(res => {
                console.log(res)
            })
        },
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
