<script>
import { BusRoute, BusStation } from '@/api/Bus'
import RouteList from '@/views/Bus/SearchResult.vue'

// 透過 query 顯示
export default {
    name: 'BusStation',
    components: {
        RouteList,
    },
    inject: ['$map', 'viewIndex'],
    props: {
        busStation: {
            type: BusStation,
            default: undefined,
        },
    },
    data () {
        return {
            formatBusStation: null,
            currentRouteType: 'city',
            routes: null,
        }
    },
    computed: {
        currentRoutes () {
            if (this.routes) {
                return this.routes[this.currentRouteType === 'city' ? 'cityRoutes' : 'interRoutes']
            }
            return []
        },
        currentTimeOrArrival () {
            if (this.routes) {
                return this.routes[this.currentRouteType === 'city' ? 'cityTimeOfArrival' : 'interTimeOfArrival']
            }
            return []
        },
        updateTime () {
            if (this.formatBusStation?.updateTime) {
                const date = new Date(this.formatBusStation.updateTime)
                return date.toLocaleTimeString('zh-TW', { hour12: false, timeStyle: 'short' })
            }
            return ''
        },
        numOfRoutes () {
            if (!this.routes) return { city: undefined, inter: undefined }
            return {
                city: this.routes?.cityRoutes.length || 0,
                inter: this.routes?.interRoutes.length || 0,
            }
        },
    },
    watch: {
        busStation: {
            handler (busStation) {
                if (busStation) {
                    this.updateRoute()
                }
            },
            deep: true,
        },
    },
    mounted () {
        if (this.busStation) {
            this.updateRoute()
        }
    },
    methods: {
        updateRoute () {
            this.formatBusStation = new BusStation(this.busStation)
            this.formatBusStation.getRoutes()
                .then(routes => {
                    this.routes = routes
                })
        },
    },
}
</script>
<template>
    <div class="bus-station">
        <div
            v-if="formatBusStation"
            class="bus-station__info"
        >
            <div class="bus-station__info-name">
                {{ formatBusStation.name }}
            </div>
            <div
                class="bus-station__info-tab"
            >
                <div
                    class="bus-station__info-tab-item"
                    :class="{'-active': currentRouteType === 'city'}"
                    @click="currentRouteType = 'city'"
                >
                    市區公車 <span v-if="numOfRoutes.city !== undefined">{{ numOfRoutes.city }}</span>
                </div>
                <div
                    class="bus-station__info-tab-item"
                    :class="{'-active': currentRouteType === 'inter'}"
                    @click="currentRouteType = 'inter'"
                >
                    公路客運<span v-if="numOfRoutes.city !== undefined">{{ numOfRoutes.inter }}</span>
                </div>
            </div>
        </div>
        <RouteList
            class="bus-station__main"
            :is-station="true"
            :queries="currentRoutes"
            :time-of-arrival="currentTimeOrArrival"
        />
        <div
            v-if="updateTime"
            class="bus-search-route__update"
        >
            更新時間：{{ updateTime }}
        </div>
    </div>
</template>
<style lang="scss">
.bus-station {
    display: flex;
    flex-direction: column;

    &__info {
        flex-shrink: 0;
        padding: 10px;

        &-name {
            @include typo('ZH/D/H2_21px_Bold');
            @include media-breakpoint-down('tablet') {
                @include typo('ZH/M/H2_17px_Bold');
            }

            margin-bottom: $padding * 2;
        }

        &-tab {
            display: flex;

            &-item {
                @include typo-h4;

                cursor: pointer;
                padding: 0 $padding $padding / 2;
                text-align: center;
                border-bottom: 3px solid color('Black');
                transition: border-bottom-color 0.3s;
                flex: 0 0 50%;
                @include text-ellipsis(1);

                span {
                    @include typo('EN/D/Minimal_12px_Semi-Bold');
                    @include media-breakpoint-down('tablet') {
                        @include typo('EN/Minimal_12px_Semi-Bold_Superscript');
                    }

                    line-height: 22px;
                    display: inline-block;
                    margin: 4px;
                    padding: 0 $padding * 0.5;
                    min-width: 22px;
                    color: color('White');
                    background-color: color('Black');
                    border-radius: 50%;
                }

                &.-active {
                    border-bottom-color: var(--primary);

                    span {
                        color: color('Black');
                        background-color: var(--primary);
                    }
                }
                @include hover {
                    border-bottom-color: var(--primary);
                }
            }
        }
    }

    &__main {
        overflow-x: hidden;
        overflow-y: auto;
        flex-grow: 1;
        margin: $padding * 1.5 0;
    }

    &__update {
        margin-top: 20px;
        text-align: center;
        color: color('Gray');
        @include typo-min;
    }
}
</style>
