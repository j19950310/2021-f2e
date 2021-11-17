<script setup>
import {
    getScenicSpot,
    getScenicSpotByCity,
    getHotelSpot,
    getHotelSpotByCity,
    getActivitySpot,
    getActivitySpotByCity,
    getRestaurantSpotByCity,
    getRestaurantSpot
} from '@/api/getTourism'

import paramsFormat, { getCityParam } from '@/api/paramsFormat'
import { onMounted, computed, ref } from 'vue'
import {
    getBikeStation,
    getBikeAvailability,
    getBikeStationWithAvailability,
    getBikeStationNearBy,
    getBikeAvailabilityNearBy,
    getBikeStationWithAvailabilityNearBy
} from '@/api/getBike'
// dev
const list = ref([])
const closeStation = ref([])
// getBikeStation('台北市').then(res => {
//     list.value.push(...res)
// })
// getBikeAvailability('台北市').then(res => {
//     list.value.push(...res)
// })
getBikeStationWithAvailability('台北市').then(res => {
    list.value.push(...res)
})
navigator.geolocation.getCurrentPosition((e) => {
    const { coords: { latitude: lat, longitude: lng } } = e
    const config = { position: { lat, lng }, distance: 1000 }

    // getBikeStationNearBy, getBikeAvailabilityNearBy
    getBikeStationWithAvailabilityNearBy(config).then(res => {
        closeStation.value.push(...res)
    })
}, (e) => {
    console.log('確定啦')
}, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
})

</script>

<template>
    <div class="page-dev">
        站點資料
        <ul
            v-for="ul in list"
            :key="ul.id"
        >
            <li
                v-for="key in ['id','name','position','address','version','service','availability']"
                :key="key"
            >
                <template v-if="key === 'availability'">
                    <ol>
                        <li
                            v-for="subkey in ['status','statusDesc','numOfRent','numOfReturn','ableRent','ableReturn']"
                            :key="subkey"
                        >
                            <temaplate v-if="ul['availability'][subkey]">
                                {{ subkey }}: {{ ul['availability'][subkey] }}
                            </temaplate>
                        </li>
                    </ol>
                </template>

                <temaplate v-if="key !== 'availability' && ul[key]">
                    {{ key }}: {{ ul[key] }}
                </temaplate>
            </li>
        </ul>
        <br><br><br><br><br><br>
        近站點
        {{ closeStation }}
    </div>
</template>

<style lang="scss">
.page-dev {
    form {
        display: flex;
        align-items: center;
        justify-content: center;

        [type="submit"] {
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
