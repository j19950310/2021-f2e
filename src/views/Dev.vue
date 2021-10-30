<script setup>
import { getScenicSpot, getScenicSpotByCity } from '@/api/getTourism'
import { onMounted } from 'vue'
// dev
onMounted(async () => {
    const data = await getScenicSpotByCity('台中')
    // await new Promise(resolve => setTimeout(resolve, 100))
    const collection = {}
    const keys = ['ID', 'Name', 'DescriptionDetail', 'Description', 'Phone', 'Address', 'ZipCode', 'TravelInfo', 'OpenTime', 'Picture', 'Position', 'ParkingPosition', 'TicketInfo', 'Remarks', 'SrcUpdateTime', 'UpdateTime']
    data.forEach(item => {
        keys.forEach(key => {
            if (!collection[key]) {
                collection[key] = []
            }

            if (item[key]) {
                collection[key].push(item[key])
            }
        })
    })
    console.log({ collection })
})

</script>

<template>
    <div class="page-dev">
        dev
    </div>
</template>

<style lang="scss">
.page-dev {
    text-align: center;
}
</style>
