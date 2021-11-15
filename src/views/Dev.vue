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
import { getBikeStation, getBikeAvailability, getBikeStationWithAvailability } from '@/api/getBike'
// dev
const list = ref([])
// getBikeStation('台北市').then(res => {
//     list.value.push(...res)
// })
// getBikeAvailability('台北市').then(res => {
//     list.value.push(...res)
// })
getBikeStationWithAvailability('台北市').then(res => {
    list.value.push(...res)
})

</script>

<template>
    <div class="page-dev">
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
