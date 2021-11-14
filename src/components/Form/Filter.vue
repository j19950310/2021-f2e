<template>
    <form
        class="form-filter"
        :class="{
            '-pendding' :pendding
        }"
    >
        <div class="form-filter__row">
            <SearchKeywords
                v-model="search"
                :input-attrs="{
                    name: 'keywords',
                }"
            />
        </div>
        <!-- 搜尋類別 -->
        <div class="form-filter__row">
            <p class="form-filter__title">
                搜尋類別
            </p>
            <div class="form-filter__category">
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
                <ButtonCategory
                    :active="category.hotel"
                    @click="category.hotel = !category.hotel"
                >
                    旅宿
                </ButtonCategory>
                <ButtonCategory
                    :active="category.activity"
                    @click="category.activity = !category.activity"
                >
                    活動
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
                        v-for="option in coutiesOptions"
                        :key="option.id"
                        class="form-filter__dropdown-checkboxs-item"
                    >
                        <FormCheckbox
                            v-bind="option"
                            prefix="county/"
                            :value="couties[option.id]"
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
        <!-- 鄉鎮 -->
        <div
            class="form-filter__row"
        >
            <Dropdown title="縣市">
                <transition-group
                    v-if="selectedTownList.length"
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
import { mapGetters, mapActions } from 'vuex'
import {
    regionLabels,
    getRegionCounty,
    getCountyRegion,
    coutiesLabels,
    coutiesMap,
    countySimpleNameMap
} from '@/api/taiwanCountyData'

export default {
    name: 'FormFilter',
    emits: ['back', 'submit'],
    data () {
        const region = Object.keys(regionLabels).reduce((obj, key) => {
            obj[key] = false
            return obj
        }, {}) // => {'北部': false}
        const couties = Object.keys(coutiesLabels).reduce((obj, key) => {
            obj[key] = false
            return obj
        }, {})
        return {
            search: '',
            category: {
                scenic: false,
                restaurant: false,
                hotel: false,
                activity: false,
            },
            region,
            couties,
            activeTownListCountyName: '',
            selectedTown: [],
            countySelectedAllTowns: [], // 選擇全鄉鎮的 縣市
            pendding: false,
            regionLabels,
        }
    },
    computed: {
        // 還原縣市/直轄市 名稱/值
        coutiesOptions () {
            return Object.entries(this.couties).map(([key, value]) => {
                return {
                    name: coutiesMap.get(key),
                    id: key,
                }
            })
        },
        // 打API撈取現在選取縣市底下 所有鄉鎮
        selectedTownList () {
            const zhCountyList = Object.entries(this.couties).reduce((list, [key, value]) => {
                const countyKey = coutiesMap.get(key)
                if (value && countyKey) {
                    list.push(this.countyNameSimpleConvert(countyKey))
                }
                return list
            }, [])
            return this.getSelectedTownListByCounties()(zhCountyList)
        },
        // 區域按鈕狀態
        regionButtonState () {
            return Object.entries(this.couties).reduce((arr, [key, value]) => {
                const countyName = coutiesLabels[key]
                const regionKey = getCountyRegion(countyName)
                if (regionKey && value && !arr.includes(regionKey)) {
                    arr.push(regionKey)
                }
                return arr
            }, [])
        },
    },
    watch: {
        selectedTownList (newVal, oldVal) {
            let newKey = ''

            const newCounty = Object.keys(newVal).reduce((target, key) => {
                if (!oldVal[key]) {
                    newKey = key
                    return newVal[key]
                } else {
                    return target
                }
            }, null)
            const removeCounty = Object.keys(oldVal).reduce((target, key) => {
                if (!newVal[key]) {
                    return oldVal[key]
                } else {
                    return target
                }
            }, null)

            if (newCounty) {
                this.activeTownListCountyName = newKey
            }
            if (removeCounty) {
                this.activeTownListCountyName = this.countySelectedAllTowns[0]
            }
        },
        selectedTown: {
            deep: true,
            handler (newVal) {
                this.updateSelectedAllTownsCounty(newVal)
            },
        },
    },
    mounted () {
        // 建立(快取)監聽查詢鄉鎮市區，首次點擊查詢API
        Object.keys(this.couties).forEach(key => {
            const killWatch = this.$watch(`couties.${key}`, (isActive) => {
                this.pendding = true // prevent bug
                const countyKey = coutiesMap.get(key)
                const countyName = countySimpleNameMap[countyKey] || countyKey
                this.getTownsByCountyName(countyName).then(res => {
                    this.pendding = false
                    if (!isActive) {
                        res.forEach((townName) => { this.removeTownFromList(townName, countyName) })
                    } else {
                        res.forEach((townName) => { this.addTownToList(townName, countyName) })
                    }
                })
            })
        })
    },
    methods: {
        ...mapActions({
            // 政府查詢鄉鎮API
            getTownsByCountyName: 'admin/getTownsByCountyName',
            // 景點 API
            submitQuery: 'tour/query',
        }),
        ...mapGetters({
            // 取得選取縣市的鄉鎮
            getSelectedTownListByCounties: 'admin/getSelectedTownListByCounties',
        }),
        countyNameSimpleConvert (name) {
            try {
                Object.keys(countySimpleNameMap).forEach(key => {
                    if (countySimpleNameMap[key] === name) {
                        throw key
                    }
                })
            } catch (adjustName) {
                return adjustName
            }
            return name
        },
        updateSelectedRegion (regionName, currentValue) {
            const isCheck = !currentValue
            this.region[regionName] = isCheck // 反向
            getRegionCounty(regionName).forEach((countyName) => {
                const simpleCountyName = this.countyNameSimpleConvert(countyName)
                this.updateSelectedCounty(coutiesMap.get(simpleCountyName), isCheck)
            })
        },
        updateSelectedCounty (key, event) {
            if (this.couties[key] !== undefined) {
                this.couties[key] = event
            }
        },
        updateSelectedTown (town, county) {
            if (this.selectedTown.includes(county + town)) { this.removeTownFromList(town, county) } else { this.addTownToList(town, county) }
        },
        updateSelectedAllTownsCounty (selectedTownList) {
            const list = []
            Object.entries(this.selectedTownList).forEach(([countyName, county]) => {
                const isAllIn = county.reduce((acc, town) => {
                    const checkName = countyName + town.name
                    return selectedTownList.includes(checkName) && acc
                }, true)
                if (isAllIn) {
                    list.push(countyName)
                }
            })
            this.countySelectedAllTowns = list
        },
        selectAllRegion () {
            Object.keys(this.region).forEach(key => {
                this.region[key] = true
            })
        },
        clearAll () {
            this.clearRegion()
            this.clearSelectedCouties()
            this.selectedTown = []
        },
        clearRegion () {
            Object.keys(this.region).forEach(key => {
                this.region[key] = false
            })
        },
        clearSelectedCouties () {
            Object.keys(this.couties).forEach(key => {
                this.couties[key] = false
            })
        },
        clearCurrentCountyAllSelectedTowns () {
            if (!this.activeTownListCountyName) return
            const currentFocusTownList = this.selectedTownList[this.activeTownListCountyName]
            currentFocusTownList.forEach((town) => { this.removeTownFromList(town, this.activeTownListCountyName) })
        },
        selectAllCoutiesHandler () {
            Object.keys(this.couties).forEach(key => {
                this.couties[key] = true
            })
        },
        selectCurrentCountyAllTowns () {
            if (!this.activeTownListCountyName) return
            const currentFocusTownList = this.selectedTownList[this.activeTownListCountyName]
            currentFocusTownList.forEach((town) => { this.addTownToList(town, this.activeTownListCountyName) })
        },
        removeTownFromList (town, countyName) {
            const name = typeof town === 'string' ? town : town.name
            const index = this.selectedTown.indexOf(countyName + name)
            if (index !== -1) {
                this.selectedTown.splice(index, 1)
            }
        },
        addTownToList (town, countyName) {
            const townName = typeof town === 'string' ? town : town.name
            if (this.selectedTown.includes(`${countyName}${townName}`)) return
            this.selectedTown.push(`${countyName}${townName}`)
        },
        convertCountyNameToApiKey (county) {
            const countyName = countySimpleNameMap[county] || county
            return coutiesMap.get(countyName)
        },
        submit () {
            const data = new FormData(this.$el)
            // console.log('submit', [...data.keys()])
            this.submitQuery(data).then((category) => {
                // 成功，清除所有選取
                this.$emit('submit')
                this.$router.push({
                    name: 'TourSpotSearch',
                    query: {
                        keyword: this.searchValue,
                        category,
                        page: 1,
                    },
                })
                this.clearAll()
            }).catch(err => {
                // 失敗，無收尋內容
                // console.log(err)
                this.$emit('submit')
                this.$router.push({
                    name: 'TourNoResult',
                    params: {
                        messages: err.message || '查無結果',
                    },
                })
            })
        },
    },
}
</script>
<style lang="scss">
.form-filter {
    position: relative;
    padding: $padding * 5;
    text-align: left;
    background-color: color('White');
    border-radius: 24px;
    @include media-breakpoint-down(tablet) {
        padding: $padding * 3;
    }

    // block loading
    &::after {
        content: '.';
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        font-size: 200px;
        opacity: 0;
        z-index: 100;
        line-height: 2;
        pointer-events: none;
        @include size(100%);
    }

    &.-pendding {
        &::after {
            background-color: rgba(color('Black'), 0.5);
            opacity: 1;
            transition: opacity 1s ease 0.3s;
            pointer-events: all;
            animation: dotLoading 1s steps(3) infinite;
            @keyframes dotLoading {
                0% {
                    content: '.  ';
                }

                50% {
                    content: '.. ';
                }

                100% {
                    content: '...';
                }
            }
        }
    }

    &__row {
        margin-bottom: $padding * 4;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 2;
        }
    }

    &__title {
        @include typo-h2;
    }

    &__category {
        padding-top: 12px;

        .button-category {
            margin: 0 $padding $padding 0;
        }
    }

    &__dropdown {
        &-checkboxs {
            $space: 16px;

            display: flex;
            margin-top: -$space/2;
            margin-right: -$space/2;
            margin-left: -$space/2;
            padding-top: 14px;
            padding-bottom: 18px;
            flex-wrap: wrap;
            align-content: flex-start;
            @include media-breakpoint-down(tablet) {
                padding-bottom: 4px;
            }

            &.-town {
                transition: height 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out;
            }

            &.-empty {
                margin: 0;
                padding: 0;
                height: 0;
            }

            &-item {
                padding: $space / 2;
            }
        }

        &-category {
            $space: 8px;

            display: flex;
            overflow: auto;
            margin: 0 #{-$space};
            padding: 16px $space;
            flex-wrap: nowrap;
            @include media-breakpoint-down(tablet) {
                padding: 12px $space;
            }

            &-item {
                display: inline-block;
                padding: $space / 2;
                transition: transform 1s;
            }
        }

        &-all {
            .button-min + .button-min {
                margin-left: 12px;
            }

            &.-inside {
                padding: 8px;
                flex: 1 0 100%;
            }
        }
    }

    &__submit {
        display: flex;
        justify-content: center;
        @include media-breakpoint-down(tablet) {
            flex-direction: column-reverse;
        }

        .button-main {
            margin: 4px 12px;
            @include media-breakpoint-down(tablet) {
                margin: 0 0 12px 0;
                width: 100%;
            }
        }
    }
}
</style>
