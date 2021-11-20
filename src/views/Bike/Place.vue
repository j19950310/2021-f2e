<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const $store = useStore()

const serviceStatusMap = ref(['停止營運', '正常營運', '暫停營運'])

const currentLocation = computed(() => $store.state.bike.currentLocation)

</script>

<template>
    <div class="bike-place">
        <BikeCard
            v-if="currentLocation && currentLocation.type === 'bikeStation'"
            :title="currentLocation.StationName.Zh_tw"
            :desc="currentLocation.StationAddress.Zh_tw"
            :rent-bikes="currentLocation.availability.AvailableRentBikes"
            :return-bikes="currentLocation.availability.AvailableReturnBikes"
            :tags="[
                serviceStatusMap[currentLocation.availability.ServiceStatus],
                `YouBike${currentLocation.ServiceType}.0`,
            ]"
            :date="currentLocation.UpdateTime"
        />
    </div>
</template>

<style lang="scss">
.bike-place {

}
</style>
