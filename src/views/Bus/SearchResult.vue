<script>
// 透過 query 顯示
export default {
    name: 'BusSearchResult',
    props: {
        querys: {
            type: Array,
            default: () => ([]),
        },
    },
    computed: {
        filterData () {
            return this.querys.map(({ name, city, id, uid, type, start, end }) => ({ name, city, id, uid, type, start, end }))
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
