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
// dev
onMounted(() => {
    // await new Promise(resolve => setTimeout(resolve, 100))
    const collection = {}
    // const keys = ['ID', 'Name', 'DescriptionDetail', 'Description', 'Phone', 'Address', 'ZipCode', 'TravelInfo', 'OpenTime', 'Picture', 'Position', 'ParkingPosition', 'TicketInfo', 'Remarks', 'SrcUpdateTime', 'UpdateTime']
    // data.forEach(item => {
    //     keys.forEach(key => {
    //         if (!collection[key]) {
    //             collection[key] = []
    //         }

    //         if (item[key]) {
    //             collection[key].push(item[key])
    //         }
    //     })
    // })
    // console.log({ data })
})
const citiesOptions = (() => {
    const arr = Object.entries(cities).map(([label, value]) => ({ value, label }))
    arr.unshift({ value: '', label: '全部' })
    return arr
})()

// data
const apiOptions = [
    { label: '餐廳', value: 'restaurant' },
    { label: '景點', value: 'scenic' },
    { label: '旅宿', value: 'hotel' },
    { label: '活動', value: 'activity' },
]
const topOptions = [
    { label: '數量：10', value: '10' },
    { label: '數量：20', value: '20' },
    { label: '數量：30', value: '30' },
]
const city = ref('')
const apiType = ref('scenic')
const topNumber = ref('10')
const showArray = ref([])

// methods
const submit = async (e) => {
    // const config = {top: 1}
    // let api = apiType.value
    // new FormData(e.target)
    const cityParam = getCityParam(city.value)
    const whatApiType = apiType.value
    const top = topNumber.value
    switch (whatApiType) {
        case 'restaurant':
            showArray.value = cityParam ? (await getRestaurantSpotByCity(cityParam, { top })) : (await getRestaurantSpot({ top }))
            break
        case 'scenic':
            showArray.value = cityParam ? (await getScenicSpotByCity(cityParam, { top })) : (await getScenicSpot({ top }))
            break
        case 'hotel':
            showArray.value = cityParam ? (await getHotelSpotByCity(cityParam, { top })) : (await getHotelSpot({ top }))
            break
        case 'activity':
            showArray.value = cityParam ? (await getActivitySpotByCity(cityParam, { top })) : (await getActivitySpot({ top }))
            break
    }
}
</script>

<template>
    <div class="page-dev">
        <form
            ref="form"
            @submit.prevent="submit"
        >
            <select
                id="city"
                v-model="city"
                name="city"
            >
                <option
                    v-for="option in citiesOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
            <select
                id="apiType"
                v-model="apiType"
                name="apiType"
            >
                <option
                    v-for="option in apiOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
            <select
                id="top"
                v-model="topNumber"
                name="top"
            >
                <option
                    v-for="option in topOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
            <input
                type="submit"
                value="查"
            >
        </form>
        <div
            v-if="showArray.length"
            class="page-dev__show"
        >
            <div
                v-for="item in showArray"
                :key="item.ID"
                class="page-dev__show-row"
            >
                <div
                    v-for="(v, k) in item"
                    :key="k"
                    class="page-dev__show-col"
                >
                    {{ k }}: {{ v }}
                </div>
            </div>
        </div>
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
