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

const FILTER_BASIC_TRUE = '1 == 1'

const BASIC_FILTER = { // Query 預設 True
    [QUERY_SCENIC]: FILTER_BASIC_TRUE,
    [QUERY_SCENIC_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_RESTAURANT]: FILTER_BASIC_TRUE,
    [QUERY_RESTAURANT_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_HOTEL]: FILTER_BASIC_TRUE,
    [QUERY_HOTEL_BY_CITY]: FILTER_BASIC_TRUE,
    [QUERY_ACTIVITY]: FILTER_BASIC_TRUE,
    [QUERY_ACTIVITY_BY_CITY]: '1 == 0', // 活動沒有ZipCode
}
Object.freeze(BASIC_FILTER)

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
    console.log('tour/queryScenic', config)
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
    console.log('tour/queryRestaurant', config)
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
    console.log('tour/queryHotel', config)
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
    console.log('tour/queryActivity', config)
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
        popUp: {
            isShow: false,
        },
        page: 1,
        currentQueryConfig: {
            scenic: {},
            restaurant: {},
            hotel: {},
            activity: {},
        },
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
        savedQuery: {
            scenic: [],
            restaurant: [],
            hotel: [],
            activity: [],
        },
    }),
    getters: {
        getSkip: state => (state.page - 1) * baseQueryConfig.top,
        getQueryTags: state => category => {
            const config = state.currentQueryConfig[category]
            const map = new Map()
            if (!config) return []
            if (config.keywords) {
                map.set(config.keywords, true)
            }
            if (config.queryList && config.queryList.length > 0) {
                config.queryList.forEach((item) => {
                    item.query.forEach(query => { map.set(query, true) })
                })
            }
            return [...map.keys()]
        },
        getCurrentQueryPostByCategory: state => category => (state.currentQuery[category] || []),
        getCurrentQueryPagination: state => ({ category, page }) => {
            const total = state.currentTotal[category]
            return {
                max: total ? Math.ceil(total / baseQueryConfig.top) : 0,
                now: state.page,
            }
        },
        getSingleSpotByQuery: state => (spot, category) => {
            const list = state.currentQuery[category] || []
            return list.find(item => item.id === spot) || null
        },
    },
    mutations: {
        showPopUp (state) {
            state.popUp.isShow = true
        },
        hidePopUp (state) {
            state.popUp.isShow = false
        },
        saveQueryConfig (state, { config, category }) {
            console.log('saveQueryConfig', category, config)
            state.currentQueryConfig[category] = config
        },
        resetResultCurrent (state) {
            state.currentQuery = {
                scenic: [],
                restaurant: [],
                hotel: [],
                activity: [],
            }
        },
        resetResultTotal (state) {
            state.currentTotal = {
                scenic: 0,
                restaurant: 0,
                hotel: 0,
                activity: 0,
            }
        },
        resetQueryConfig (state) {
            state.page = 1
            state.currentQueryConfig = {
                scenic: {},
                restaurant: {},
                hotel: {},
                activity: {},
            }
        },
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
        init ({ commit, dispatch }) {
            // TODO 串 loaclStorage
        },
        resetAll ({ commit }) {
            commit('resetResultCurrent')
            commit('resetResultTotal')
        },
        // ------------ 0: 分類別 (OR) ------------
        query (context, formDate) {
            console.log('tour/query', formDate)
            context.commit('resetQueryConfig') // 重置查詢設定

            const config = {
                keywords: formDate.get('keywords'),
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
                    if (!node[key] && key !== 'keywords') {
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
            return context.dispatch('dispatchQueryStacks', config)
        },

        // ------------ 1: 分地區查詢 ------------
        // a. (全選的縣市 聯集 地區包含的縣市) 的 $Filter查詢
        // b. (排除a剩餘鄉鎮) 的 利用 $Filter zip code查詢
        // 傳遞: a And b

        // ------------ 2: 最後包含字串，送出查詢 (AND) ------------
        dispatchQueryStacks (context, config) {
            context.dispatch('resetAll') // 重置資料
            return new Promise((resolve, reject) => {
                let categoryList = Object.keys(config.category)
                const queryString = config.keywords
                    ? `(contains(Name,'${config.keywords}') | contains(Description,'${config.keywords}'))`
                    : FILTER_BASIC_TRUE

                // 若空白 則全選
                categoryList = (categoryList.length > 0)
                    ? categoryList
                    : ['scenic', 'restaurant', 'hotel', 'activity']
                const requestStacks = []
                const filter = Object.assign({}, BASIC_FILTER)

                // Merge same category
                config.queryList.forEach(queryConfig => {
                    const { category, query } = queryConfig

                    // 非正常操作：不純在查詢的API
                    if (!queryFunction[category]) return

                    if ( // Filter City
                        category === QUERY_SCENIC_BY_CITY ||
                        category === QUERY_RESTAURANT_BY_CITY ||
                        category === QUERY_HOTEL_BY_CITY ||
                        category === QUERY_ACTIVITY_BY_CITY
                    ) {
                        if (query.length > 0) { // ex. City == '臺北市' | ...
                            filter[category] = `City == '${query.join('\' | City == \'')}'`
                        }
                    } else if ( // Filter ZipCode （活動沒有ZipCode）
                        category === QUERY_SCENIC ||
                        category === QUERY_RESTAURANT ||
                        category === QUERY_HOTEL
                    ) {
                        if (query.length > 0) { // ex. ZipCode == '123' | ...
                            const zipCodeList = query.map(getZipcode)
                            filter[category] = `ZipCode == '${zipCodeList.join('\' | ZipCode == \'')}'`
                        }
                    }
                })

                // Make request
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
                    console.log({ category, query: `${queryString} & ${queryFilter}` })
                    const queryConfig = Object.assign({ ...baseQueryConfig }, {
                        filter: `${queryString} & ${queryFilter}`, // 關鍵字 & 地區
                        skip: context.getters.getSkip, // 跳過幾筆
                    })

                    // 送出主要查詢
                    requestStacks.push(queryFunction[category](queryConfig))
                    // 儲存查詢
                    context.commit('saveQueryConfig', { category, config: queryConfig })
                })

                Promise.allSettled(requestStacks).then(res => {
                    context.commit('resetResultCurrent')
                    const ifNoResult = res.every(item => {
                        console.log(item)
                        return item.status === 'fulfilled' && item.value.length === 0
                    })
                    if (ifNoResult) {
                        reject(new Error('查無結果'))
                    } else {
                        const categoryQuery = []
                        res.forEach(({ status, value }, index) => {
                            if (status === 'fulfilled') {
                                context.commit('setQueryResult', value)
                            }
                            if (value.length) {
                                categoryQuery.push(value.type) // 撈取預設查詢類別
                            }
                        })
                        resolve(categoryQuery[0])
                    }
                })
            })
        },
        dispatchPageQuery (context, query) {
            const { category, page } = query
            const config = context.state.currentQueryConfig[category]
            if (context.state.page === page || !config) {
                return new Promise((resolve, reject) => { resolve(false) })
            } else {
                context.state.page = +page // 設定目前頁數 // TODO commit
            }

            config.skip = context.getters.getSkip // 只針對skip設定
            return new Promise((resolve, reject) => {
                // 送出相同查詢
                queryFunction[category](config).then(res => { // 更新查詢結果
                    context.state.currentQuery[category] = res.list // TODO commit
                }).catch(err => {
                    reject(err)
                })
            })
        },
    },
}
