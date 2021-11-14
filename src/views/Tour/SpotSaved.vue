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
const perPage = 12
const scrollInstance = inject('scrollInstance')
const toggleSaveSpot = (spot) => {
    store.commit('tour/toggleSaveSpot', {
        spot,
        category: route.query.category,
    })
}

if (!route.query.category) { // 預設category
    router.push({
        query: {
            category: 'scenic',
            page: 1,
        },
    })
}
const page = ref(route.query.page || 1)

const category = reactive({
    now: 'scenic',
    currentTotal: computed(() => store.getters['tour/savedQueryTotal']),
})
const createCatButton = (key, name) => (reactive({
    name,
    active: computed(() => (route.query.category === key)),
    number: computed(() => (category.currentTotal[key])),
    onClick: () => {
        router.push({
            name: 'TourSpotSaved',
            query: {
                category: key,
                page: 1,
            },
        })
    },
}))
const tags = ref([])
const sumOfSpot = computed(() => (store.state.tour.savedQueryIds.length))
const totalPosts = computed(() => {
    const category = route.query.category || 'scenic'
    return store.state.tour.savedQuery[category]
})
const posts = computed(() => {
    return totalPosts.value.slice((page.value - 1) * perPage, page.value * perPage)
})
const pagination = computed(() => {
    const max = totalPosts.value.length ? Math.ceil(totalPosts.value.length / perPage) : 0
    const now = page.value
    return { max, now }
})
const isIdSaved = computed(() => store.getters['tour/isIdSaved'])
watch(route, (to) => {
    const { query: { page: toPage } } = to
    if (toPage !== page.value) {
        page.value = +toPage
    }
})
</script>
<template>
    <div class="tour-spot-saved">
        <div
            v-bg="bannerImage"
            class="tour-spot-saved__banner"
        >
            <div class="tour-spot-saved__banner-main">
                <div class="container">
                    <div class="tour-spot-saved__banner-content">
                        <p class="large">
                            已收藏 <span class="primary">{{ sumOfSpot }}</span> 個地點！
                        </p>
                        <p class="medium">
                            把喜歡的地點保存起來，世世代代流傳下去 ☺️
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="tour-spot-saved__filter ">
            <div class="tour-spot-saved__filter-wrap container">
                <div class="tour-spot-saved__filter-cat">
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
                <div class="tour-spot-saved__filter-tag">
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
        <div class="tour-spot-saved__main container">
            <transition-group
                name="fade"
                class="tour-spot-saved__list row"
                tag="div"
            >
                <div
                    v-for="post in posts"
                    :key="post.id"
                    class="tour-spot-saved__card col-4"
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
                                name: route.name === 'TourSpotSaved' ? 'TourSpotSavedPopup'
                                    : 'TourSpotSearchPopup',
                                query: route.query,
                                params: {spot: post.id}}"
                        />
                    </DefaultCard>
                </div>
            </transition-group>
            <div class="tour-spot-saved__pagination row">
                <Pagination v-bind="pagination" />
            </div>
        </div>
        <!-- pop up -->
        <router-view />
    </div>
</template>
<style lang="scss">
$class-name: '.tour-spot-saved';
@include spot-list($class-name);
</style>
