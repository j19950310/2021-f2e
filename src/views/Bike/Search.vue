<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { BIKE_TYPE } from '@/plugins/variable'
const bikeThumbnail = new URL('../../assets/bike_thumbnail.jpg', import.meta.url).href
const cyclingThumbnail = new URL('../../assets/cycling_thumbnail.jpg', import.meta.url).href

const $store = useStore()

const bikeType = ref(BIKE_TYPE)
const serviceStatusMap = ref(['停止營運', '正常營運', '暫停營運'])
const selectTypesMap = ref({
    [BIKE_TYPE.STATION]: '自行車站',
    [BIKE_TYPE.CYCLING]: '自行車路線',
    [BIKE_TYPE.RESTAURANT]: '餐廳',
    [BIKE_TYPE.TOUR]: '景點',
})
const typeIndex = ref(0)

const bikeStations = computed(() => $store.state.bike.bikeStations)
const bikeCycling = computed(() => $store.state.bike.bikeCycling)
const restaurants = computed(() => $store.state.bike.restaurants)
const tours = computed(() => $store.state.bike.tours)
const selectTypes = computed(() => $store.state.bike.selectTypes)

</script>

<template>
    <div class="bike-search">
        <div class="bike-search__main">
            <div class="bike-search__tags">
                <ButtonTabCategory
                    v-for="(type, i) in selectTypes"
                    :key="type"
                    :name="selectTypesMap[type]"
                    :number="$store.state.bike[type].length"
                    :active="typeIndex === i"
                    @click="typeIndex = i"
                />
            </div>
            <div class="bike-search__cards">
                <div
                    v-show="selectTypes[typeIndex] === bikeType.STATION"
                    class="bike-search__cards-stations"
                >
                    <router-link
                        v-for="({StationUID, StationName, StationAddress, ServiceType, StationPosition, availability}) in bikeStations"
                        :key="StationUID"
                        :to="{ name: 'BikePlace', params: { value: `${StationPosition.PositionLat},${StationPosition.PositionLon}` }, query: { ...$route.query } }"
                    >
                        <BikeListCard
                            :title="StationName.Zh_tw"
                            :desc="StationAddress.Zh_tw"
                            :src="bikeThumbnail"
                            :tags="[
                                serviceStatusMap[availability.ServiceStatus],
                                `YouBike${ServiceType}.0`,
                            ]"
                        />
                    </router-link>
                </div>
                <div
                    v-show="selectTypes[typeIndex] === BIKE_TYPE.CYCLING"
                    class="bike-search__cards-cycling"
                >
                    <router-link
                        v-for="({ RouteName, RoadSectionStart, RoadSectionEnd, CyclingLength, city, geometry }) in bikeCycling"
                        :key="RouteName"
                        :to="{ name: 'BikePlace', params: { value: `${geometry[0].split(' ').reverse().join(',')}` }, query: { ...$route.query } }"
                    >
                        <BikeListCard
                            :title="RouteName"
                            :from="RoadSectionStart"
                            :to="RoadSectionEnd"
                            :src="cyclingThumbnail"
                            :tags="[
                                city,
                                `路線長度：${CyclingLength / 1000}km`,
                            ]"
                        />
                    </router-link>
                </div>
                <div
                    v-show="selectTypes[typeIndex] === BIKE_TYPE.RESTAURANT"
                    class="bike-search__cards-restaurant"
                >
                    <router-link
                        v-for="({ Name, Address, City, Class, Picture, Position }) in restaurants"
                        :key="Name"
                        :to="{ name: 'BikePlace', params: { value: `${Position.PositionLat},${Position.PositionLon}` }, query: { ...$route.query } }"
                    >
                        <BikeListCard
                            :title="Name"
                            :desc="Address"
                            :src="Picture.PictureUrl1"
                            :tags="[
                                City,
                                Class,
                            ]"
                        />
                    </router-link>
                </div>
                <div
                    v-show="selectTypes[typeIndex] === BIKE_TYPE.TOUR"
                    class="bike-search__cards-tour"
                >
                    <router-link
                        v-for="({ Name, Address, Description, City, Picture, Position }) in tours"
                        :key="Name"
                        :to="{ name: 'BikePlace', params: { value: `${Position.PositionLat},${Position.PositionLon}` }, query: { ...$route.query } }"
                    >
                        <BikeListCard
                            :title="Name"
                            :from="Address"
                            :desc="Description"
                            :src="Picture.PictureUrl1"
                            :tags="[
                                City,
                            ]"
                        />
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.bike-search {
    &__tags {
        @include typo-h4;

        display: flex;
        overflow: auto;
        padding: $padding 0;
        margin-bottom: $padding * 2;

        > * {
            flex-shrink: 0;
            min-width: 150px;
        }
    }

    &__cards {
        a {
            display: block;

            & ~ * {
                margin-top: $padding * 2;
                padding-top: $padding * 2;
                border-top: 1px solid color('Light-Gray');
            }
        }
    }
}
</style>
