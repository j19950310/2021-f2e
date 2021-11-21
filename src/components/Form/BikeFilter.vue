<template>
    <form
        class="form-bike-filter form-filter"
        :class="{
            '-pendding' :pendding
        }"
        @submit.prevent="submit"
    >
        <div class="form-filter__row">
            <SearchKeywords
                v-model="search"
                :input-attrs="{name: 'keywords'}"
            />
        </div>
        <!-- 搜尋類別 -->
        <div class="form-filter__row">
            <p class="form-filter__title">
                搜尋類別
            </p>
            <div class="form-filter__category">
                <ButtonCategory
                    :active="category.station"
                    @click="category.station = !category.station"
                >
                    公共自行車站點
                </ButtonCategory>
                <ButtonCategory
                    :active="category.cycling"
                    @click="category.cycling = !category.cycling"
                >
                    自行車路線
                </ButtonCategory>
                <ButtonCategory
                    :active="category.scenic"
                    @click="category.scenic = !category.scenic"
                >
                    景點
                </ButtonCategory>
                <ButtonCategory
                    :active="category.restaurant"
                    @click="category.restaurant = !category.restaurant"
                >
                    餐飲
                </ButtonCategory>
            </div>
            <!-- 類別同步資料 -->
            <input
                v-for="(cat, catName) in category"
                :id="catName"
                :key="catName"
                hidden
                type="checkbox"
                :name="`category/${catName}`"
                :checked="cat"
            >
        </div>
        <!-- 地區 / 縣市 -->
        <div class="form-filter__row">
            <Dropdown title="縣市">
                <div class="form-filter__dropdown-category">
                    <div
                        v-for="(regionValue, regionKey) in region"
                        :key="regionKey"
                        class="form-filter__dropdown-category-item"
                    >
                        <ButtonCategory
                            :active="regionValue && regionButtonState.includes(regionKey)"
                            @click="updateSelectedRegion(regionKey, regionValue)"
                        >
                            {{ regionLabels[regionKey] }}
                        </ButtonCategory>
                    </div>
                </div>
                <div class="form-filter__dropdown-checkboxs">
                    <div
                        v-for="option in countiesOptions"
                        :key="option.id"
                        class="form-filter__dropdown-checkboxs-item"
                    >
                        <FormCheckbox
                            v-bind="option"
                            prefix="county/"
                            :value="counties[option.id]"
                            @update="updateSelectedCounty(option.id, $event)"
                        />
                    </div>
                </div>
                <div class="form-filter__dropdown-all">
                    <ButtonMin
                        icon="check"
                        @click="selectAllCoutiesHandler"
                    >
                        全選
                    </ButtonMin>
                    <ButtonMin
                        icon="close-default"
                        @click="clearSelectedCouties"
                    >
                        清除
                    </ButtonMin>
                </div>
            </Dropdown>
            <!-- 全選縣市同步資料 -->
            <input
                v-for="county in countySelectedAllTowns"
                :id="`countyAll/${county}`"
                :key="`countyAll/${county}`"
                hidden
                type="checkbox"
                :name="`countyAll/${county}`"
                :checked="!!countySelectedAllTowns.length"
            >
        </div>
        <!-- 鄉鎮 / 行政區 -->
        <div
            class="form-filter__row"
        >
            <Dropdown title="行政區">
                <transition-group
                    name="fade"
                    class="form-filter__dropdown-category"
                    tag="div"
                >
                    <div
                        v-for="(county, countyName, index) in selectedTownList"
                        :key="countyName"
                        class="form-filter__dropdown-category-item"
                    >
                        <ButtonCategory
                            :active="countySelectedAllTowns.includes(countyName)"
                            :focus="activeTownListCountyName ? (activeTownListCountyName === countyName) : index === 0"
                            @click="activeTownListCountyName = countyName"
                        >
                            {{ countyNameSimpleConvert(countyName) }}
                        </ButtonCategory>
                    </div>
                </transition-group>
                <!-- :class="{'-empty': selectedTown.length === 0}" -->
                <div
                    class="form-filter__dropdown-checkboxs -town"
                >
                    <template v-for="(county, countyName, index) in selectedTownList">
                        <div
                            v-for="town in county"
                            v-show="activeTownListCountyName ? (countyName === activeTownListCountyName) : (index === 0)"
                            :key="town.code"
                            class="form-filter__dropdown-checkboxs-item"
                        >
                            <!-- :value="selectedTown.includes(town.name)" -->
                            <FormCheckbox
                                v-bind="town"
                                :prefix="`town/${countyName}/`"
                                :value="selectedTown.includes(countyName+town.name)"
                                @update="updateSelectedTown(town.name, countyName)"
                            />
                        </div>
                    </template>
                    <div class="form-filter__dropdown-all -inside">
                        <ButtonMin
                            icon="check"
                            @click="selectCurrentCountyAllTowns"
                        >
                            全選
                        </ButtonMin>
                        <ButtonMin
                            icon="close-default"
                            @click="clearCurrentCountyAllSelectedTowns"
                        >
                            清除
                        </ButtonMin>
                    </div>
                </div>
            </Dropdown>
        </div>
        <!-- 其他 -->
        <div class="form-filter__row">
            <Dropdown title="其他">
                <div class="form-filter__dropdown-checkboxs">
                    <div class="form-filter__dropdown-checkboxs-item">
                        <FormCheckbox
                            v-bind="version.v1"
                            id="YouBike1.0"
                            prefix="version/"
                            name="YouBike1.0"
                            :value="version.v1"
                            @update="version.v1 = $event"
                        />
                    </div>
                    <div class="form-filter__dropdown-checkboxs-item">
                        <FormCheckbox
                            v-bind="version.v2"
                            id="YouBike2.0"
                            prefix="version/"
                            name="YouBike2.0"
                            :value="version.v2"
                            @update="version.v2 = $event"
                        />
                    </div>
                </div>
            </Dropdown>
        </div>
        <!-- 送出/返回 -->
        <div class="form-filter__row">
            <div class="form-filter__submit">
                <ButtonSecondary
                    @click="$emit('back')"
                >
                    返回
                </ButtonSecondary>
                <ButtonPrimary
                    icon="search"
                    @click="submit"
                >
                    送出
                </ButtonPrimary>
            </div>
        </div>
    </form>
</template>
<script>
import { defaultFilterComponent } from '@/plugins/defaultFilter'
export default {
    name: 'FormBikeFilter',
    extends: defaultFilterComponent,
    data () {
        return {
            version: {
                v1: false,
                v2: false,
            },
        }
    },
    methods: {
        submit () {
            const data = new FormData(this.$el)
            console.log([...data.keys()], [...data.values()])
            // this.submitQuery(data).then((category) => {
            //     // 成功，清除所有選取
            //     this.$emit('submit')
            //     this.$router.push({
            //         name: 'TourSpotSearch',
            //         query: {
            //             keyword: this.search,
            //             category,
            //             page: 1,
            //         },
            //     })
            //     this.clearAll()
            // }).catch(err => {
            //     // 失敗，無收尋內容
            //     // console.log(err)
            //     this.$emit('submit')
            //     this.$router.push({
            //         name: 'TourNoResult',
            //         params: {
            //             messages: err.message || '查無結果',
            //         },
            //     })
            // }).finally(() => {
            //     this.search = null
            // })
        },
    },
}

</script>
<style lang="scss">

</style>
