<script setup>
import { ref, computed } from 'vue'
import { getTownsByCountycode } from '@/api/getAdministrative'
import { useStore } from 'vuex'
const search = ref('132')
const store = useStore()
const Taipei = []
const scenic = computed(() => {
    return store.state.tour.currentQuery.scenic
})
const restaurant = computed(() => {
    return store.state.tour.currentQuery.restaurant
})
const hotel = computed(() => {
    return store.state.tour.currentQuery.hotel
})
const activity = computed(() => {
    return store.state.tour.currentQuery.activity
})
getTownsByCountycode('A').then(res => {
    Taipei.push(...res)
})
</script>

<template>
    <div class="page-components">
        <div class="container">
            <!-- 1 -->
            <div class="row">
                <div class="col-3">
                    <ButtonCategory>
                        ButtonCategory
                    </ButtonCategory>
                </div>
                <div class="col-3">
                    <ButtonCategory :active="true">
                        景點
                    </ButtonCategory>
                </div>
                <div class="col-3">
                    <Dropdown title="Dropdown">
                        Dropdown
                    </Dropdown>
                </div>
                <div class="col-3">
                    <ButtonPrimary icon="shuffle">
                        ButtonPrimary
                    </ButtonPrimary>
                </div>
            </div>
            <!-- 2 -->
            <div class="row">
                <div class="col-3">
                    <ButtonSecondary icon="shuffle">
                        ButtonSecondary
                    </ButtonSecondary>
                </div>
                <div class="col-3">
                    <ButtonThird icon="info">
                        ButtonThird
                    </ButtonThird>
                </div>
                <div class="col-3">
                    <ButtonThird icon="info">
                        資訊
                    </ButtonThird>
                </div>
                <div class="col-3">
                    <ButtonMin icon="check">
                        資訊
                    </ButtonMin>
                </div>
            </div>
            <!-- 3 -->
            <div class="row">
                <div class="col-6">
                    SearchDefault
                    <SearchDefault
                        v-model="search"
                        :value="search"
                    />
                </div>
                <div class="col-6">
                    SearchKeywords
                    <SearchKeywords
                        v-model="search"
                    />
                </div>
            </div>
            <!-- 4 -->
            <div
                class="row"
                style="padding-top: 20px; padding-bottom: 20px;"
            >
                <div class="col-6">
                    SearchTourFilter
                    <SearchTourFilter
                        v-model="search"
                    />
                </div>
                <div
                    class="col-6"
                    style="background: #000000; backdrop-filter: blur(2px);"
                >
                    FormTourFilter
                    <FormBikeFilter />
                </div>
                <div
                    class="col-6"
                    style="background: #000000; backdrop-filter: blur(2px);"
                >
                    FormTourFilter
                    <FormTourFilter />
                </div>
            </div>
            <!-- 5 -->
            <div
                class="row"
                style="padding-bottom: 200px;"
            >
                <div class="col-4">
                    <ButtonTabCategory
                        name="ButtonTabCategory"
                        :number="10000"
                        :active="true"
                    />
                </div>
                <div class="col-2">
                    <ButtonTabCategory
                        name="餐飲"
                        :number="1000"
                    />
                </div>
                <div class="col-2">
                    <ButtonTabCategory
                        name="餐飲"
                        :number="0"
                    />
                </div>
                <div class="col-2">
                    <ButtonTabCategory
                        name="旅宿"
                        :number="999"
                    />
                </div>
                <div class="col-2">
                    <ButtonTabCategory
                        name="活動"
                        :number="100"
                    />
                </div>
            </div>
            <div
                style="padding-bottom: 200px;"
                class="row"
            >
                <div class="col-3">
                    <Pagination
                        :max="1000"
                        :now="+$route.query.page || 1"
                    />
                </div>
            </div>
            <div
                class="row"
                style="padding-bottom: 200px;"
            >
                <div class="col-3">
                    景點<br>
                    {{ scenic }}
                </div>
                <div class="col-3">
                    餐飲<br>
                    {{ restaurant }}
                </div>
                <div class="col-3">
                    旅宿<br>
                    {{ hotel }}
                </div>
                <div class="col-3">
                    活動<br>
                    {{ activity }}
                </div>
            </div>
            <DefaultCard
                title="關渡碼頭"
                desc="關渡原名甘豆門，因背倚觀音山和大屯山，面向淡水河，成為一處地勢險要的港口，早年先民由關渡碼頭進入移居臺…"
                src="https://source.unsplash.com/random/1024x768"
                :tags="['景點', '台北市']"
                @on-add-favorite="() => {}"
            />
            <router-link to="/">
                <SaveCard
                    title="關渡碼頭"
                    src="https://source.unsplash.com/random/1024x768"
                    :tags="['景點', '台北市']"
                />
            </router-link>
            <PersonCard
                title="Jay Wu"
                desc="Front End Developer"
                src="https://source.unsplash.com/random/1024x768"
            />
            <DescCard
                title="Jay Wu"
                src="https://source.unsplash.com/random/1024x768"
            />
        </div>
    </div>
</template>

<style lang="scss">
.page-components {
    padding-bottom: 100px;
    background-color: #eeeeee;

    a {
        display: block;
    }
}
</style>
