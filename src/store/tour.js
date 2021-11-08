import {
    getScenicSpot,
    getScenicSpotByCity,
    getRestaurantSpot,
    getRestaurantSpotByCity,
    getHotelSpot,
    getHotelSpotByCity,
    getActivitySpot,
    getActivitySpotByCity
} from '@/api/getTourism'
import {
    regionLabels,
    regionKeys,
    getRegionCounty,
    coutiesLabels
} from '@/api/taiwanCountyData'
import getZipcode from '@/api/getZipcode'
import objectKeys from 'object-keys'

const baseQueryConfig = {
    top: 12, // 一次幾篇
    skip: 0, // offset
    filter: '', // 查詢條件
    format: 'JSON',
}
Object.freeze(baseQueryConfig)

// 固定 KEY 值
const QUERY_SCENIC = 'QUERY_SCENIC'
const QUERY_SCENIC_BY_CITY = 'QUERY_SCENIC_BY_CITY'
const QUERY_RESTAURANT = 'QUERY_RESTAURANT'
const QUERY_RESTAURANT_BY_CITY = 'QUERY_RESTAURANT_BY_CITY'
const QUERY_HOTEL = 'QUERY_HOTEL'
const QUERY_HOTEL_BY_CITY = 'QUERY_HOTEL_BY_CITY'
const QUERY_ACTIVITY = 'QUERY_ACTIVITY'
const QUERY_ACTIVITY_BY_CITY = 'QUERY_ACTIVITY_BY_CITY'

const queryFunction = {
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

function pushScenicQuery (config) {
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

function pushRestaurantQuery (config) {
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

function pushHotelQuery (config) {
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

function pushActivityQuery (config) {
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

export default {
    namespaced: true,
    state: () => ({
        page: 1,
        currentQuery: {
            scenic: [],
            restaurant: [],
            hotel: [],
            activity: [],
        },
        currentTotal: {
            scenic: 0,
            restaurant: 0,
            hotel: 0,
            activity: 0,
        },
    }),
    getters: {
        getSkip: state => state.page * baseQueryConfig.top,
    },
    mutations: {
        setQueryResult (state, result) {
            const { list, type, length } = result
            state.currentQuery[type] = list
            state.currentTotal[type] = length
        },
        setPage (state, page) {
            state.page = page
        },
    },
    actions: {
        // ------------ 0: 分類別 (OR) ------------
        query (context, formDate) {
            const config = {
                region: {},
                countyAll: {},
                town: {},
                category: {},
                queryList: [], // 查詢陣列
            }
            let categoryList = Object.keys(config.category)
            // 空白則全選
            categoryList = (categoryList.length > 0)
                ? categoryList
                : ['scenic', 'restaurant', 'hotel', 'activity']

            // 以物件Folder格式 傳遞
            for (const key of formDate.keys()) {
                key.split('/').reduce((node, key) => {
                    if (!node[key]) {
                        node[key] = {}
                    }
                    return node[key]
                }, config)
            }
            categoryList.forEach(category => {
                // 'scenic', 'restaurant', 'hotel', 'activity'
                if (category === 'scenic') {
                    pushScenicQuery(config)
                } else if (category === 'restaurant') {
                    pushRestaurantQuery(config)
                } else if (category === 'hotel') {
                    pushHotelQuery(config)
                } else if (category === 'activity') {
                    pushActivityQuery(config)
                }
            })
            context.dispatch('dispatchQueryStacks', config)
        },

        // ------------ 1: 分地區查詢 ------------
        // a. (全選的縣市 聯集 地區包含的縣市) 的 $Filter查詢
        // b. (排除a剩餘鄉鎮) 的 利用 $Filter zip code查詢
        // 傳遞: a And b

        // ------------ 2: 最後包含字串，送出查詢 (AND) ------------
        dispatchQueryStacks (context, config) {
            let categoryList = Object.keys(config.category)
            // 空白則全選
            categoryList = (categoryList.length > 0)
                ? categoryList
                : ['scenic', 'restaurant', 'hotel', 'activity']
            const requestStacks = []
            const filter = { // Query 預設 True
                [QUERY_SCENIC]: '1 == 1',
                [QUERY_SCENIC_BY_CITY]: '1 == 1',
                [QUERY_RESTAURANT]: '1 == 1',
                [QUERY_RESTAURANT_BY_CITY]: '1 == 1',
                [QUERY_HOTEL]: '1 == 1',
                [QUERY_HOTEL_BY_CITY]: '1 == 1',
                [QUERY_ACTIVITY]: '1 == 1',
                [QUERY_ACTIVITY_BY_CITY]: '1 == 0', // 活動沒有ZipCode
            }

            // Merge same category // TODO: 關鍵字搜尋
            config.queryList.forEach(queryConfig => {
                const { category, query } = queryConfig
                // 不純在查詢的API
                if (!queryFunction[category]) return

                if ( // Filter City
                    category === QUERY_SCENIC_BY_CITY ||
                    category === QUERY_RESTAURANT_BY_CITY ||
                    category === QUERY_HOTEL_BY_CITY ||
                    category === QUERY_ACTIVITY_BY_CITY
                ) {
                    if (query.length > 0) {
                        filter[category] = `City == '${query.join('\' | City == \'')}'`
                    }
                } else if ( // Filter ZipCode （活動沒有ZipCode）
                    category === QUERY_SCENIC ||
                    category === QUERY_RESTAURANT ||
                    category === QUERY_HOTEL
                ) {
                    if (query.length > 0) {
                        const zipCodeList = query.map(getZipcode)
                        filter[category] = `ZipCode == '${zipCodeList.join('\' | ZipCode == \'')}'`
                    }
                }
            })

            categoryList.forEach((category) => {
                let queryFilter = ''
                if (category === 'scenic') {
                    queryFilter = `(${filter[QUERY_SCENIC]}) & (${filter[QUERY_SCENIC_BY_CITY]})`
                } else if (category === 'restaurant') {
                    queryFilter = `(${filter[QUERY_RESTAURANT]}) & (${filter[QUERY_RESTAURANT_BY_CITY]})`
                } else if (category === 'hotel') {
                    queryFilter = `(${filter[QUERY_HOTEL]}) & (${filter[QUERY_HOTEL_BY_CITY]})`
                } else if (category === 'activity') { // 活動沒有ZipCode
                    queryFilter = `(${filter[QUERY_ACTIVITY_BY_CITY]})`
                }
                const queryConfig = Object.assign({ ...baseQueryConfig }, {
                    filter: queryFilter,
                })
                requestStacks.push(queryFunction[category](queryConfig))
            })

            Promise.allSettled(requestStacks).then(res => {
                res.forEach(({ status, value }, index) => {
                    if (status === 'fulfilled') {
                        context.commit('setQueryResult', value)
                    }
                })
            })
        },
    },
}
