<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const $store = useStore()

const serviceStatusMap = ref(['停止營運', '正常營運', '暫停營運'])
const bikeStations = computed(() => $store.state.bike.bikeStations)

</script>

<template>
    <div class="bike-search">
        <router-link
            v-for="{StationUID, StationName, StationAddress, ServiceType, availability} in bikeStations"
            :key="StationUID"
            :to="'/'"
        >
            <BikeListCard
                :title="StationName.Zh_tw"
                :desc="StationAddress.Zh_tw"
                :tags="[
                    serviceStatusMap[availability.ServiceStatus],
                    `YouBike${ServiceType}.0`,
                ]"
            />
        </router-link>
    </div>
</template>

<style lang="scss">
.bike-search {
    > * {
        display: block;

        & ~ * {
            margin-top: $padding * 2;
            padding-top: $padding * 2;
            border-top: 1px solid color('Light-Gray');
        }
    }
}
</style>
