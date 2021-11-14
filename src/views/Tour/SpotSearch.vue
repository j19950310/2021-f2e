<script setup>
import bannerImage from '@/assets/tourBanner.png'
import defaultImage from '@/assets/default.png'
import { ref, watch, computed, reactive, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()

const title = 'Spot Search' // TODO
const subtitle = 'Search for a spot by name or by location' // TODO
const page = ref(route.query.page || 1)
const scrollInstance = inject('scrollInstance')
const viewport = inject('viewport')

const toggleSaveSpot = (spot) => {
    store.commit('tour/toggleSaveSpot', {
        spot,
        category: route.query.category,
    })
}
if (page.value !== store.state.tour.page) { // 重整page
    store.dispatch('tour/dispatchPageQuery', route.query)
}
watch(route, (to) => {
    const { query: { page: toPage } } = to
    if (toPage !== page.value) {
        page.value = toPage
        store.dispatch('tour/dispatchPageQuery', to.query).then(() => {
            console.log(scrollInstance)
        })
    }
})

const category = reactive({
    now: 'scenic',
    currentTotal: computed(() => store.state.tour.currentTotal),
})
const sumOfSpot = computed(() => {
    function numberWithCommas (x) {
        if (typeof x === 'number') {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        return x
    }
    const { scenic, restaurant, hotel, activity } = category.currentTotal
    const sum = scenic + restaurant + hotel + activity
    return numberWithCommas(sum > 9999 ? '9,999+' : sum)
})
const createCatButton = (key, name) => (reactive({
    name,
    active: computed(() => (route.query.category === key)),
    number: computed(() => (category.currentTotal[key])),
    onClick: () => {
        router.push({
            name: 'TourSpotSearch',
            query: {
                category: key,
                page: 1,
            },
        })
    },
}))
const tags = computed(() => {
    return store.getters['tour/getQueryTags'](route.query.category)
        .map(tag => ({
            label: tag,
            query: tag,
        }))
})
const posts = computed(() => store.getters['tour/getCurrentQueryPostByCategory'](route.query.category))
const pagination = computed(() => store.getters['tour/getCurrentQueryPagination'](route.query))
const isIdSaved = computed(() => store.getters['tour/isIdSaved'])
</script>
<template>
    <div class="tour-spot-search">
        <div
            v-bg="bannerImage"
            class="tour-spot-search__banner"
        >
            <div class="tour-spot-search__banner-main">
                <div class="container">
                    <div class="tour-spot-search__banner-content">
                        <p class="large">
                            找到了 <span class="primary">{{ sumOfSpot }}</span> 個地點！
                        </p>
                        <!-- TODO 第一個tag -->
                        <!-- <p class="medium">
                            太讚惹！在台北市找到 89 個地點  🏝
                        </p> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="tour-spot-search__filter ">
            <div class="tour-spot-search__filter-wrap container">
                <div class="tour-spot-search__filter-cat">
                    <!-- <ButtonTabCategory
                    :active="category.now === 'scenic'"
                    :number="category.currentTotal.scenic"
                    name="景點"
                    @click="category.click('scenic')"
                /> -->
                    <ButtonTabCategory v-bind="createCatButton('scenic', '景點')" />
                    <ButtonTabCategory v-bind="createCatButton('restaurant', '餐飲')" />
                    <ButtonTabCategory v-bind="createCatButton('hotel', '旅宿')" />
                    <ButtonTabCategory v-bind="createCatButton('activity', '活動')" />
                </div>
                <div class="tour-spot-search__filter-tag">
                    <ButtonMin
                        v-for="tag in tags"
                        :key="tag.query"
                        v-bind="tag"
                        icon="close-active"
                    >
                        {{ tag.label }}
                    </ButtonMin>
                </div>
            </div>
        </div>
        <div class="tour-spot-search__main container">
            <transition-group
                name="fade"
                class="tour-spot-search__list row"
                tag="div"
            >
                <div
                    v-for="post in posts"
                    :key="post.id"
                    :class="{
                        'col-4': viewport.isDesktop,
                        'col-6': viewport.isTablet,
                        'col-12': viewport.isMobile,
                    }"
                    class="tour-spot-search__card"
                >
                    <DefaultCard
                        :is-favorite="isIdSaved(post.id)"
                        :title="post.name"
                        :desc="post.description"
                        :src="post.picture.src || defaultImage"
                        :tags="post.class"
                        @on-add-favorite="toggleSaveSpot(post)"
                    >
                        <router-link
                            :to="{
                                name: 'TourSpotSearchPopup',
                                query: route.query,
                                params: {spot: post.id}}"
                        />
                    </DefaultCard>
                </div>
            </transition-group>
            <div class="tour-spot-search__pagination row">
                <Pagination v-bind="pagination" />
            </div>
        </div>
        <!-- pop up -->
        <router-view />
    </div>
</template>
<style lang="scss">
$class-name: '.tour-spot-search';
@include spot-list($class-name);
</style>
