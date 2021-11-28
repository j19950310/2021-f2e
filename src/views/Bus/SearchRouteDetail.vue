<script>
import SearchRoute from '@/views/Bus/SearchRoute.vue'
import { BusRoute, BusStop } from '@/api/Bus'
import { countiesMap } from '@/api/taiwanCountyData'
// 透過 query 顯示
export default {
    name: 'BusSearchRouteDetail',
    // extends: SearchRoute,
    inject: ['viewIndex'],
    props: {
        busRoute: {
            type: BusRoute,
            default: null,
        },
    },
    data () {
        return {
            formatBusRoute: null,
        }
    },
    computed: {
        activeCurrentView () {
            return this.viewIndex.value === 3
        },
        infoData () {
            if (!this.formatBusRoute) return null
            const { name, city, id, uid, type, start, end } = this.formatBusRoute
            return { name, city, id, uid, type, start, end, isLink: false }
        },
        routeInfo () {
            if (!this.formatBusRoute) return null
            const { city, url } = this.formatBusRoute
            const cityZh = countiesMap.get(city)
            if (!city || !cityZh) return null
            return {
                title: '路線資訊',
                list: [
                    { tag: 'div', innerText: cityZh },
                    { tag: 'a', innerText: '路線圖', href: url, target: '_blank' },
                ],
            }
        },
        routeEnds () {
            if (!this.formatBusRoute) return null
            const { startDetail, endDetail } = this.formatBusRoute
            if (!startDetail || !endDetail) return null
            return {
                title: '起訖站',
                list: [
                    { tag: 'div', innerText: `起站：${startDetail}` },
                    { tag: 'div', innerText: `訖站：${endDetail}` },
                ],
            }
        },
        routeTime () {
            if (!this.formatBusRoute) return null
            const { time } = this.formatBusRoute
            if (!time) return null
            return {
                title: '平日發車時間',
                list: [
                    { tag: 'div', innerText: `起站：${time.first}` },
                    { tag: 'div', innerText: `訖站：${time.last}` },
                ],
            }
        },
        routeHoliday () {
            if (!this.formatBusRoute) return null
            const { holiday } = this.formatBusRoute
            if (!holiday) return null
            return {
                title: '假日發車時間',
                list: [
                    { tag: 'div', innerText: `起站：${holiday.first}` },
                    { tag: 'div', innerText: `訖站：${holiday.last}` },
                ],
            }
        },
        routeTicket () {
            if (!this.formatBusRoute) return null
            const { ticket, fareBufferZone } = this.formatBusRoute
            if (!ticket || !fareBufferZone) return null
            return {
                title: '票價',
                list: [
                    { tag: 'div', innerText: ticket },
                    { tag: 'div', innerText: `緩衝區：${fareBufferZone}` },
                ],
            }
        },
        routeOperator () { // TODO
            if (!this.formatBusRoute) return null
            const { operators } = this.formatBusRoute
            if (!operators) return null
            return { operators }
        },
        cardInfos () {
            const {
                routeInfo,
                routeEnds,
                routeTime,
                routeTicket,
                // routeOperator,
            } = this
            return [
                routeInfo,
                routeEnds,
                routeTime,
                routeTicket,
                // routeOperator,
            ].filter(Boolean)
        },
    },
    // clear needless
    watch: {
        busRoute: {
            handler (newVal, oldVal) {
                if (!newVal) return
                this.formatBusRoute = new BusRoute(newVal)
            },
        },
    },
    mounted () {
        if (this.busRoute) {
            this.formatBusRoute = new BusRoute(this.busRoute)
        }
    },
}
</script>
<template>
    <div
        class="bus-search-route bus-search-route-detail"
    >
        <div class="bus-search-route__info">
            <CardBusQuery v-bind="infoData" />
        </div>
        <div
            v-if="activeCurrentView"
            class="bus-search-route__main"
        >
            <div
                v-for="(card, index) in cardInfos"
                v-show="card"
                :key="index"
                class="bus-search-route__card"
            >
                <div class="bus-search-route__card-title">
                    {{ card.title }}
                </div>
                <template
                    v-for="(item, itemIndex) in card.list"
                    :key="itemIndex"
                >
                    <component
                        :is="item.tag"
                        class="bus-search-route__card-desc"
                        v-bind="item"
                    />
                </template>
            </div>
        </div>
        <div class="bus-search-route__action">
            <ButtonSecondary @click="$emit('back')">
                返回
            </ButtonSecondary>
        </div>
        <div
            v-if="updateTime"
            class="bus-search-route__update"
        >
            更新時間：{{ updateTime }}
        </div>
    </div>
</template>

<style lang="scss">
.bus-search-route-detail {
    .bus-search-route__info {
        padding: 0;

        .card-bus-query {
            padding-bottom: 0;

            &__info-route {
                // @include typo-h2;
                // TODO: styleName: ZH/D/H2_21px_Bold;
                font-size: 21px;
                font-style: normal;
                font-weight: 700;
                line-height: 30px;
                letter-spacing: 0;
                text-align: left;
            }
        }
    }

    .bus-search-route {
        &__card {
            border-bottom: 1px solid #e1e1e1;
            padding: $padding 0;

            &:last-child {
                border-bottom: none;
            }

            &-title {
                //TODO: styleName: ZH/D/H4_14px_Bold;
                font-size: 14px;
                font-weight: 700;
                color: color('Dark-Gray');
                margin-bottom: 4px;
                line-height: 20px;
                letter-spacing: 0.01em;
            }

            &-desc {
                @include typo-h3;

                margin-bottom: 4px;
            }

            a {
                border-bottom: 2px solid var(--primary);
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 100%;
                    display: block;
                    background-size: cover;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADNSURBVHgB7ZPbDYIwFIb/Q3glyghuYLqBIygLMIIb6CawABoXIY7ABqC+qsf6QEJIW9sGHiR8L00v5z/XAjOTh+CIuBVHBHRQ3b2ftLrG26p7FmBklBmIx4m/axntjBmKe5GBKG33g2bQijOjkttG987LQVecX7QBD+igL94vSZ8QDmjFiS+gYCEr1Xg7MEVeRsleZ2ddIgaTbVl+RyvHtB3VLuv6vIQjTk2WkTdwZPSfbGyyqIsUFpRxksPHAULKYEeulVCeEmkNZv6PD4JuXpp6AZ49AAAAAElFTkSuQmCC');
                    @include size(24px);
                }
            }
        }
    }
}
</style>
