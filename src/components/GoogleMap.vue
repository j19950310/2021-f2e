
<template>
    <div class="google-map" />
</template>
<script>
import { Loader } from '@googlemaps/js-api-loader'
const apiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
const mapId = import.meta.env.VITE_APP_GOOGLE_MAP_STYLE_ID

export default {
    props: {
        PositionLat: {
            type: Number,
            default: 0,
        },
        PositionLon: {
            type: Number,
            default: 0,
        },
        GeoHash: {
            type: String,
            default: '',
        },
        empty: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            map: null,
        }
    },
    mounted () {
        const loader = new Loader({
            apiKey,
            version: 'weekly',
        })
        loader.load().then((google) => {
            // console.log('google map')
            this.map = new google.maps.Map(this.$el, {
                mapId,
                center: {
                    lat: +this.PositionLat,
                    lng: +this.PositionLon,
                },
                zoom: 16,
            })
            const marker = new google.maps.Marker({
                position: {
                    lat: +this.PositionLat,
                    lng: +this.PositionLon,
                },
                map: this.map,
            })
            this.map.setCenter({ lat: +this.PositionLat, lng: this.PositionLon })
        })
    },
}
</script>
