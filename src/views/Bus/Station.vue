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
        updateTime () {
            if (this.formatBusStation?.updateTime) {
                const date = new Date(this.formatBusStation.updateTime)
                return date > new Date() ? date.toLocaleTimeString() : ''
            }
            return ''
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
        this.updateRoute()
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
                    市區公車
                </div>
                <div
                    class="bus-station__info-tab-item"
                    :class="{'-active': currentRouteType === 'inter'}"
                    @click="currentRouteType = 'inter'"
                >
                    公路客運
                </div>
            </div>
        </div>
        <RouteList
            class="bus-station__main"
            :queries="currentRoutes"
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
            @include typo-h2;

            margin-bottom: $padding * 2;
        }

        &-tab {
            display: flex;

            &-item {
                @include typo-h4;

                cursor: pointer;
                padding: 0 $padding $padding/2;
                text-align: center;
                border-bottom: 3px solid color('Black');
                transition: border-bottom-color 0.3s;
                flex: 0 0 50%;
                @include text-ellipsis(1);

                &.-active {
                    border-bottom-color: var(--primary);
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
