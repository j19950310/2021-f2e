<script>
// 透過 query 顯示
export default {
    name: 'BusSearchResult',
    props: {
        queries: {
            type: Array,
            default: () => ([]),
        },
        timeOfArrival: {
            type: Array,
            default: () => ([]),
        },
        isStation: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        filterData () {
            const routes = this.queries.map(({ name, city, id, uid, type, start, end }) => {
                // merge 估計時間
                const stop = this.timeOfArrival.find(({ RouteID }) => RouteID === id)
                return { name, city, id, uid, type, start, end, stop }
            })
            if (this.isStation) {
                routes.sort((a, b) => { // 排序最早進站
                    const { stop: { EstimateTime: aTime = Infinity } } = a
                    const { stop: { EstimateTime: bTime = Infinity } } = b
                    return aTime - bTime
                })
            }
            return routes
        },
    },
    methods: {
        toQueryRoute (query) {
            this.$router.push({
                query: {
                    ...this.$route.query,
                    route: query.uid,
                    city: query.city,
                },
            })
        },
    },
}
</script>
<template>
    <div class="bus-search-result">
        <!-- TODO: category -->
        <div class="bus-search-result__main">
            <div
                v-for="query in filterData"
                :key="query.id"
                class="bus-search-result__item"
            >
                <CardBusQuery
                    v-bind="query"
                    @click="toQueryRoute(query)"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .bus-search-result {
        &__main {
            position: relative;
            overflow: auto;
            max-height: 100%;
        }

        &__item {
            border-bottom: 1px solid #e1e1e1;

            &:last-child {
                border-bottom: none;
            }
        }
    }
</style>
