<script setup>
import bannerImage from '@/assets/tourBanner.png'
import { ref, watch, computed, reactive, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()

const title = 'Spot Search' // TODO
const subtitle = 'Search for a spot by name or by location' // TODO
const page = ref(1)
const scrollInstance = inject('scrollInstance')

watch(route, (to) => {
    const { query: { page: toPage } } = to
    if (toPage !== page.value) {
        page.value = toPage
        window.scrollTo(0, 0)
        store.dispatch('tour/dispatchPageQuery', to.query).then(() => {
            console.log(scrollInstance)
        })
    }
})

const category = reactive({
    now: 'scenic',
    currentTotal: computed(() => store.state.tour.currentTotal),
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
</script>
<template>
    <div class="tour-spot-search">
        <div
            v-bg="bannerImage"
            class="tour-spot-search__banner"
        >
            <div class="tour-spot-search__banner-main">
                <div class="tour-spot-search__banner-content">
                    <div class="tour-spot-search__banner-content-title">
                        {{ title }}
                    </div>
                    <div class="tour-spot-search__banner-content-subtitle">
                        {{ subtitle }}
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
                    class="tour-spot-search__card col-4"
                >
                    <DefaultCard
                        :title="post.name"
                        :desc="post.description"
                        :src="post.picture.src"
                        :tags="post.class"
                        @on-add-favorite="() => {}"
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
#{$class-name} {
    &__banner {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;

        &::before {
            content: '';
            display: block;
            padding-bottom: percentage(580/1440);
            width: 100%;
        }

        &__main {
            position: absolute;
            top: 0;
            left: 0;
            @include size(100%);
        }
    }

    &__filter {
        $space: 24px;

        padding: $space 0;
        background: color('White');
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);

        &-cat {
            display: flex;
            border-bottom: 4px solid #383838;
            padding: 0;
            margin-bottom: $space;

            .button-tab-category {
                flex: 0 0 150px;
                margin-bottom: -4px;
            }
        }

        &-tag {
            margin: -6px;

            .button-min {
                margin: 6px;
            }
        }
    }

    &__main {
        padding-top: 64px;
        padding-bottom: 64px;
    }

    &__list {
        margin: -16px -12px;
    }

    &__card {
        padding: 16px 12px;
    }
}
</style>
