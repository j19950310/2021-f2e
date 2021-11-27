<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GoogleMap from '@/plugins/GoogleMap/googleMapDev'
import { BusQuery } from '@/api/Bus'

// view 0: search -> 1: result -> 2: routes
export default defineComponent({
    name: 'BusRoot',
    async beforeRouteUpdate (to, from) {
        console.log(to, from)
    },
    setup () {
        // use
        const $router = useRouter()
        const $route = useRoute()
        const $busQuery = new BusQuery({ distance: 1000 })
        const $map = ref(null)

        // variable
        const preventInteraction = ref(false)
        const googleMapEl = ref('')
        const searchValue = ref(null)
        const searchQuerys = ref([])
        const cacheQuerys = ref([])
        const currentRoute = ref(null) // 此route為車的路線...
        const mapInit = () => {
            const { lat, lng } = $map.value.mapInstance.getCenter()
            $busQuery.setPosition({ lat: lat(), lng: lng() })
        }
        const submit = async () => { // 查詢關鍵字
            if (searchValue.value) {
                preventInteraction.value = true
                try {
                    const results = await $busQuery.searchByNearBy(searchValue.value)
                    searchQuerys.value = results
                } catch (e) {
                    console.error(e)
                } finally {
                    $router.push({
                        name: 'BusSearch',
                        params: {
                            search: searchValue.value,
                        },
                    })
                    preventInteraction.value = false
                }
            }
        }
        const boundsChanged = ({ lat, lng, radius }) => { // 更新查詢位置
            $busQuery.setPosition({ lat, lng }, Math.ceil(radius))
        }

        onMounted(() => {
            const map = new GoogleMap(googleMapEl.value)
            Object.assign(map.onEvents, {
                boundsChanged,
                init: mapInit,
            })
            $map.value = map
        })
        return {
            preventInteraction,
            googleMapEl,
            searchValue,
            searchQuerys,
            submit,
            $busQuery,
            currentRoute,
            cacheQuerys,
        }
    },
    data () {
        return {
            isDetail: false,
        }
    },
    methods: {
        clickRoute (route) {
            this.$router.push({
                name: 'BusSearch',
                params: {
                    ...this.$route.params,
                },
                query: {
                    ...this.$route.query,
                    uid: route.uid,
                },
            })
            this.currentRoute = route
            this.cacheQuerys = [...this.searchQuerys]
            this.searchQuerys = []
        },
    },
})
</script>
<template>
    <div
        class="bus"
        :style="{
            '--primary': '#32f3ae',
            'pointer-events': preventInteraction ? 'none' : 'auto',
        }"
    >
        <div
            ref="googleMapEl"
            class="bus__map"
        />
        <div class="bus__main">
            <div class="bus__search">
                <SearchBusFilter
                    v-model.trim="searchValue"
                    @submit="submit"
                >
                    <div
                        v-show="searchQuerys.length"
                        class="bus__search-result"
                    >
                        <ul class="bus__search-result-main">
                            <li
                                v-for="query in searchQuerys"
                                :key="query.id"
                                class="bus__search-result-item"
                                @click="clickRoute(query)"
                            >
                                <p class="bus__search-result-title">
                                    {{ query.start }} 往返 {{ query.end }}
                                </p>
                                <p class="bus__search-result-desc">
                                    {{ query.type }} {{ query.name }}
                                </p>
                            </li>
                        </ul>
                    </div>
                </SearchBusFilter>
                <DragPopup v-if="currentRoute">
                    <div class="bus__view">
                        <div
                            class="bus__view-wrapper"
                            :style="{
                                transform: isDetail ? 'translateX(-100%)':'translateX(0)',
                            }"
                        >
                            <router-view
                                class="bus__view-slide"
                                :data="currentRoute"
                                :style="{
                                    transform: !isDetail ? 'translateX(0)' : 'translateX(-100%)',
                                }"
                                name="route"
                            />
                            <router-view
                                class="bus__view-slide"
                                :data="currentRoute"
                                name="routeDetail"
                            />
                        </div>
                    </div>
                </DragPopup>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.bus {
    @include size(100%, 100vh);

    position: relative;
    user-select: none;

    > * {
        @include size(100%);

        position: absolute;
        top: 0;
        left: 0;
    }

    &__main {
        pointer-events: none;

        > * {
            position: absolute;
            pointer-events: auto;
        }
    }

    &__search {
        top: $padding * 3;
        left: $padding * 3;
        width: 420px;
        @include media-breakpoint-down(tablet) {
            left: $padding * 2.5;
            width: calc(100% - #{$padding} * 5);
        }

        .search-default {
            position: relative;
            margin-bottom: $padding * 2;
        }

        &-result {
            position: absolute;
            bottom: -$padding * 2;
            left: 0;
            padding: $padding  $padding * 3;
            width: 100%;
            background-color: color('White');
            border-radius: 24px;
            z-index: 1;
            box-shadow: 0 0 24px rgba(0, 0, 0, 10%);
            transform: translate(0, 100%);

            &-item {
                display: flex;
                padding: $padding * 2 0;
                cursor: pointer;
                transition: color .3s;
                @media (hover: hover) and (pointer: fine) {
                    &:hover {
                        color: var(--primary, color('Primary'));
                    }
                }
            }

            &-title {
                @include text-ellipsis;
                @include typo-h3;

                margin-right: $padding;
            }

            &-desc {
                @include text-ellipsis;
                @include typo-h4;

                color: color('Dark-Gray');
            }
        }
    }

    &__view {
        position: relative;
        overflow: hidden;
        width: 100%;

        &-wrapper {
            display: flex;
            width: 100%;
            transition: transform .3s;
        }

        &-slide {
            flex: 0 0 100%;
        }
    }
}
</style>
