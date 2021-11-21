<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { BIKE_TYPE } from '@/plugins/variable'

export default defineComponent({
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            if (from.name === 'BikeSearch') {
                vm.prevRoute = from
            }
        })
    },
    beforeRouteUpdate (to, from) {
        if (from.name === 'BikeSearch') {
            this.prevRoute = from
        }
    },
    setup () {
        const $store = useStore()
        const $route = useRoute()

        const prevRoute = ref({ name: 'BikeHome' })
        const bikeType = ref(BIKE_TYPE)
        const serviceStatusMap = ref(['停止營運', '正常營運', '暫停營運'])

        const currentLocation = computed(() => $store.state.bike.currentLocation)

        const linkGoogleDirections = (address) => {
            const { query: { lat, lng } } = $route
            window.open(`https://www.google.com.tw/maps/dir/${lat},${lng}/${address}`, '_blank')
        }

        return {
            bikeType,
            serviceStatusMap,
            currentLocation,
            prevRoute,
            linkGoogleDirections,
        }
    },
})

</script>

<template>
    <div class="bike-place">
        <BikeCard
            v-if="currentLocation && currentLocation.type === bikeType.STATION"
            :title="currentLocation.StationName.Zh_tw"
            :desc="currentLocation.StationAddress.Zh_tw"
            :rent-bikes="currentLocation.availability.AvailableRentBikes"
            :return-bikes="currentLocation.availability.AvailableReturnBikes"
            :tags="[
                serviceStatusMap[currentLocation.availability.ServiceStatus],
                `YouBike${currentLocation.ServiceType}.0`,
            ]"
            :date="currentLocation.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocation.StationPosition.PositionLat},${currentLocation.StationPosition.PositionLon}`)"
        />
        <BikeCard
            v-if="currentLocation && currentLocation.type === 'bikeCycling'"
            :title="currentLocation.RouteName"
            :from="currentLocation.RoadSectionStart"
            :to="currentLocation.RoadSectionEnd"
            :tags="[
                currentLocation.city,
                `路線長度：${currentLocation.CyclingLength / 1000}km`,
            ]"
            :date="currentLocation.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocation.geometry[0].split(' ').reverse().join(',')}`)"
        />
    </div>
</template>

<style lang="scss">
.bike-place {

}
</style>
