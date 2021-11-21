import { mapGetters, mapActions } from 'vuex'
import {
    regionLabels,
    getRegionCounty,
    getCountyRegion,
    countiesLabels,
    countiesMap,
    countySimpleNameMap
} from '@/api/taiwanCountyData' // 行政區
import {
    getScenicSpot,
    getScenicSpotByCity,
    getRestaurantSpot,
    getRestaurantSpotByCity,
    getHotelSpot,
    getHotelSpotByCity,
    getActivitySpot,
    getActivitySpotByCity
} from '@/api/getTourism' // Week 1 Tour

export const defaultFilterComponent = {
    name: 'defaultFilter',
    emits: ['back', 'submit'],
    data () {
        const region = Object.keys(regionLabels).reduce((obj, key) => {
            obj[key] = false
            return obj
        }, {}) // => {'北部': false}
        const counties = Object.keys(countiesLabels).reduce((obj, key) => {
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
            counties,
            activeTownListCountyName: '',
            selectedTown: [],
            countySelectedAllTowns: [], // 選擇全鄉鎮的 縣市
            pendding: false,
            regionLabels,
        }
    },
    computed: {
        // 還原縣市/直轄市 名稱/值
        countiesOptions () {
            return Object.entries(this.counties).map(([key, value]) => {
                return {
                    name: countiesMap.get(key),
                    id: key,
                }
            })
        },
        // 打API撈取現在選取縣市底下 所有鄉鎮
        selectedTownList () {
            const zhCountyList = Object.entries(this.counties).reduce((list, [key, value]) => {
                const countyKey = countiesMap.get(key)
                if (value && countyKey) {
                    list.push(this.countyNameSimpleConvert(countyKey))
                }
                return list
            }, [])
            return this.getSelectedTownListByCounties()(zhCountyList)
        },
        // 區域按鈕狀態
        regionButtonState () {
            return Object.entries(this.counties).reduce((arr, [key, value]) => {
                const countyName = countiesLabels[key]
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
        Object.keys(this.counties).forEach(key => {
            const killWatch = this.$watch(`counties.${key}`, (isActive) => {
                this.pendding = true // prevent bug
                const countyKey = countiesMap.get(key)
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
            tourSubmitQuery: 'tour/query',
            bikeSubmitQuery: 'bike/query',
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
                this.updateSelectedCounty(countiesMap.get(simpleCountyName), isCheck)
            })
        },
        updateSelectedCounty (key, event) {
            if (this.counties[key] !== undefined) {
                this.counties[key] = event
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
            Object.keys(this.counties).forEach(key => {
                this.counties[key] = false
            })
        },
        clearCurrentCountyAllSelectedTowns () {
            if (!this.activeTownListCountyName) return
            const currentFocusTownList = this.selectedTownList[this.activeTownListCountyName]
            currentFocusTownList.forEach((town) => { this.removeTownFromList(town, this.activeTownListCountyName) })
        },
        selectAllCoutiesHandler () {
            Object.keys(this.counties).forEach(key => {
                this.counties[key] = true
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
            return countiesMap.get(countyName)
        },
        async tourSubmit () {
            const data = new FormData(this.$el)
            return this.tourSubmitQuery(data)
        },
        async bikeSubmit () {
            const data = new FormData(this.$el)
            return this.bikeSubmitQuery(data)
        },
    },
}

// ######## Vuex start ########
// 固定 KEY 值
export const QUERY_SCENIC = 'QUERY_SCENIC'
export const QUERY_SCENIC_BY_CITY = 'QUERY_SCENIC_BY_CITY'
export const QUERY_RESTAURANT = 'QUERY_RESTAURANT'
export const QUERY_RESTAURANT_BY_CITY = 'QUERY_RESTAURANT_BY_CITY'
export const QUERY_HOTEL = 'QUERY_HOTEL'
export const QUERY_HOTEL_BY_CITY = 'QUERY_HOTEL_BY_CITY'
export const QUERY_ACTIVITY = 'QUERY_ACTIVITY'
export const QUERY_ACTIVITY_BY_CITY = 'QUERY_ACTIVITY_BY_CITY'
export const FILTER_BASIC_TRUE = '1 == 1'

// 初始化預設Filter
export const BASIC_TOUR_FILTER = { // Query 預設 True
    [QUERY_SCENIC]: FILTER_BASIC_TRUE,
    [QUERY_SCENIC_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_RESTAURANT]: FILTER_BASIC_TRUE,
    [QUERY_RESTAURANT_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_HOTEL]: FILTER_BASIC_TRUE,
    [QUERY_HOTEL_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_ACTIVITY]: FILTER_BASIC_TRUE,
    [QUERY_ACTIVITY_BY_CITY]: '1 == 0', // 活動沒有ZipCode
}
Object.freeze(BASIC_TOUR_FILTER)

export const getTourQueryFunction = {
    [QUERY_SCENIC]: getScenicSpot,
    [QUERY_SCENIC_BY_CITY]: getScenicSpotByCity, // 發現一般filter也可以用
    [QUERY_RESTAURANT]: getRestaurantSpot,
    [QUERY_RESTAURANT_BY_CITY]: getRestaurantSpotByCity, // 發現一般filter也可以用
    [QUERY_HOTEL]: getHotelSpot,
    [QUERY_HOTEL_BY_CITY]: getHotelSpotByCity, // 發現一般filter也可以用
    [QUERY_ACTIVITY]: getActivitySpot,
    [QUERY_ACTIVITY_BY_CITY]: getActivitySpotByCity, // 發現一般filter也可以用
    scenic: getScenicSpot,
    restaurant: getRestaurantSpot,
    hotel: getHotelSpot,
    activity: getActivitySpot,
}

/**
 * 取得query格式的縣市
 */
function getConfigQueryCounties (config) {
    const counties = new Map()

    // 全選的縣市
    Object.keys(config.region).forEach(region => {
        if (regionKeys[region]) {
            getRegionCounty(regionKeys[region]).forEach(county => {
                counties.set(county, true)
            })
        }
    })

    // 一般選的縣市
    Object.keys(config.countyAll).forEach(county => {
        counties.set(county, true)
    })
    return [...counties.keys()]
}

/**
 * 取得query格式的行政區
 */
function getConfigQueryTowns (config) {
    const townsMap = new Map()
    Object.keys(config.town).forEach(countyName => {
        // 收集所有 不包含全選 的 鄉鎮
        if (!config?.countyAll?.[countyName]) {
            Object.keys(config.town[countyName]).forEach(town => {
                townsMap.set(town, true)
            })
        }
    })
    return [...townsMap.keys()]
}

export function pushScenicQuery (config) {
    // 純縣市查詢
    config.queryList.push({
        category: QUERY_SCENIC_BY_CITY,
        query: getConfigQueryCounties(config),
    })
    // 地區查詢
    config.queryList.push({
        category: QUERY_SCENIC,
        query: getConfigQueryTowns(config),
    })
}

export function pushRestaurantQuery (config) {
    // 純縣市查詢
    config.queryList.push({
        category: QUERY_RESTAURANT_BY_CITY,
        query: getConfigQueryCounties(config),
    })
    // 地區查詢
    config.queryList.push({
        category: QUERY_RESTAURANT,
        query: getConfigQueryTowns(config),
    })
}

export function pushHotelQuery (config) {
    // 純縣市查詢
    config.queryList.push({
        category: QUERY_HOTEL_BY_CITY,
        query: getConfigQueryCounties(config),
    })
    // 地區查詢
    config.queryList.push({
        category: QUERY_HOTEL,
        query: getConfigQueryTowns(config),
    })
}

export function pushActivityQuery (config) {
    // 純縣市查詢
    config.queryList.push({
        category: QUERY_ACTIVITY_BY_CITY,
        query: getConfigQueryCounties(config),
    })
    // 地區查詢
    config.queryList.push({
        category: QUERY_ACTIVITY,
        query: getConfigQueryTowns(config),
    })
}
