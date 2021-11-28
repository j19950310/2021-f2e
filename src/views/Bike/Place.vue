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

        const currentLocationData = computed(() => $store.state.bike.currentLocationData)
        const userLocation = computed(() => $store.state.bike.userLocation)

        const linkGoogleDirections = (to, from) => {
            let { query: { lat, lng } } = $route
            if (userLocation.value) {
                ({ lat, lng } = userLocation.value)
                from = from || `${lat},${lng}`
            }
            console.log(to)
            window.open(`https://www.google.com.tw/maps/dir/${from}/${to}`, '_blank')
        }

        return {
            bikeType,
            serviceStatusMap,
            currentLocationData,
            prevRoute,
            linkGoogleDirections,
        }
    },
})

</script>

<template>
    <div class="bike-place">
        <BikeCard
            v-if="currentLocationData && currentLocationData.type === bikeType.STATION"
            :key="currentLocationData.StationName.Zh_tw"
            :title="currentLocationData.StationName.Zh_tw"
            :desc="currentLocationData.StationAddress.Zh_tw"
            :rent-bikes="currentLocationData.availability.AvailableRentBikes"
            :return-bikes="currentLocationData.availability.AvailableReturnBikes"
            :tags="[
                serviceStatusMap[currentLocationData.availability.ServiceStatus],
                `YouBike${currentLocationData.ServiceType}.0`,
            ]"
            :date="currentLocationData.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocationData.StationPosition.PositionLat},${currentLocationData.StationPosition.PositionLon}`)"
        />
        <BikeCard
            v-if="currentLocationData && currentLocationData.type === bikeType.CYCLING"
            :key="currentLocationData.RouteName"
            :title="currentLocationData.RouteName"
            :from="currentLocationData.RoadSectionStart"
            :to="currentLocationData.RoadSectionEnd"
            :tags="[
                currentLocationData.city,
                `路線長度：${currentLocationData.CyclingLength / 1000}km`,
            ]"
            :date="currentLocationData.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocationData.geometry[0].split(' ').reverse().join(',')}`)"
        />
        <BikeCard
            v-if="currentLocationData && currentLocationData.type === bikeType.RESTAURANT"
            :key="currentLocationData.Name"
            :title="currentLocationData.Name"
            :from="currentLocationData.Address"
            :desc="currentLocationData.OpenTime"
            :src="currentLocationData.Picture.PictureUrl1"
            :content="currentLocationData.Description"
            :tags="[
                currentLocationData.City,
                currentLocationData.Class,
            ]"
            :date="currentLocationData.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocationData.Position.PositionLat},${currentLocationData.Position.PositionLon}`)"
        />
        <BikeCard
            v-if="currentLocationData && currentLocationData.type === bikeType.TOUR"
            :key="currentLocationData.Name"
            :title="currentLocationData.Name"
            :from="currentLocationData.Address"
            :desc="currentLocationData.Description"
            :src="currentLocationData.Picture.PictureUrl1"
            :content="currentLocationData.DescriptionDetail"
            :tags="[
                currentLocationData.City,
            ]"
            :date="currentLocationData.UpdateTime"
            @on-back="$router.push(prevRoute)"
            @on-road="linkGoogleDirections(`${currentLocationData.Position.PositionLat},${currentLocationData.Position.PositionLon}`)"
        />
    </div>
</template>

<style lang="scss">
.bike-place {

}
</style>
