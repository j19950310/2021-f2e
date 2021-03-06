import {
    ScenicSpot,
    RestaurantSpot,
    HotelSpot,
    ActivitySpot
} from '@/api/TourSpot'
import {
    pushScenicQuery,
    pushRestaurantQuery,
    pushHotelQuery,
    pushActivityQuery,
    getTourQueryFunction,
    QUERY_SCENIC,
    QUERY_SCENIC_BY_CITY,
    QUERY_RESTAURANT,
    QUERY_RESTAURANT_BY_CITY,
    QUERY_HOTEL,
    QUERY_HOTEL_BY_CITY,
    // QUERY_ACTIVITY,
    QUERY_ACTIVITY_BY_CITY,
    FILTER_BASIC_TRUE,
    BASIC_TOUR_FILTER
} from '@/plugins/defaultFilter'

import getZipcode from '@/api/getZipcode'

const baseQueryConfig = {
    top: 12, // 一次幾篇
    skip: 0, // offset
    filter: '', // 查詢條件
    format: 'JSON',
}
Object.freeze(baseQueryConfig)

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
        // currentQueryConfig, currentQuery, savedQuery, savedQueryIds
        ...(() => {
            const localCurrentQueryConfig = localStorage.getItem('currentQueryConfig') || '{}'
            const localCurrentQuery = localStorage.getItem('currentQuery') || '{}'
            const localCurrentTotal = localStorage.getItem('currentTotal') || '{}'
            const localSavedQuery = localStorage.getItem('savedQuery') || '{}'

            const currentTotal = JSON.parse(localCurrentTotal)
            const currentQueryConfig = JSON.parse(localCurrentQueryConfig)
            const { // currentQuery
                scenic = [],
                restaurant = [],
                hotel = [],
                activity = [],
            } = JSON.parse(localCurrentQuery)
            const { // savedQuery
                scenic: scenicSaved = [],
                restaurant: restaurantSaved = [],
                hotel: hotelSaved = [],
                activity: activitySaved = [],
            } = JSON.parse(localSavedQuery)

            const currentQuery = {
                scenic: scenic.map((spot) => (new ScenicSpot(spot))),
                restaurant: restaurant.map((spot) => (new RestaurantSpot(spot))),
                hotel: hotel.map((spot) => (new HotelSpot(spot))),
                activity: activity.map((spot) => (new ActivitySpot(spot))),
            }
            const savedQuery = {
                scenic: scenicSaved.map((spot) => (new ScenicSpot(spot))),
                restaurant: restaurantSaved.map((spot) => (new RestaurantSpot(spot))),
                hotel: hotelSaved.map((spot) => (new HotelSpot(spot))),
                activity: activitySaved.map((spot) => (new ActivitySpot(spot))),
            }
            const savedQueryIds = [scenicSaved, restaurantSaved, hotelSaved, activitySaved].reduce((acc, cur) => {
                cur.forEach(item => { acc.push(item.ID) })
                return acc
            }, [])
            return { currentTotal, currentQuery, currentQueryConfig, savedQuery, savedQueryIds }
        })(),
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
        getSingleSpotByQuery: state => (spot, category, isSaved = false) => {
            const queryList = isSaved ? state.savedQuery : state.currentQuery
            const list = queryList[category] || []
            return list.find(item => item.id === spot) || null
        },
        getSavedSpotPreview: state => {
            const { savedQuery, savedQueryIds } = state
            const ids = savedQueryIds.slice(0, 5) // 取前五筆
            const list = []
            ids.forEach(id => {
                Object.keys(savedQuery).forEach(category => {
                    savedQuery[category].forEach(item => {
                        if (item.ID === id) list.push(item)
                    })
                })
            })
            return list
        },
        savedQueryTotal: state => {
            const { savedQuery } = state
            return Object.keys(savedQuery).reduce((total, cur) => {
                total[cur] = savedQuery[cur].length
                return total
            }, {})
        },
        isIdSaved: state => id => state.savedQueryIds.includes(id),
    },
    mutations: {
        showPopUp (state) {
            state.popUp.isShow = true
        },
        hidePopUp (state) {
            state.popUp.isShow = false
        },
        saveQueryConfig (state, { config, category }) {
            // console.log('saveQueryConfig', category, config)
            state.currentQueryConfig[category] = config
            localStorage.setItem('currentQueryConfig', JSON.stringify({ ...state.currentQueryConfig }))
        },
        resetResultCurrent (state) {
            state.currentQuery = {
                scenic: [],
                restaurant: [],
                hotel: [],
                activity: [],
            }
            localStorage.setItem('currentQuery', JSON.stringify({ ...state.currentQuery }))
        },
        resetResultTotal (state) {
            state.currentTotal = {
                scenic: 0,
                restaurant: 0,
                hotel: 0,
                activity: 0,
            }
            localStorage.setItem('currentTotal', JSON.stringify({ ...state.currentTotal }))
        },
        resetQueryConfig (state) {
            state.page = 1
            state.currentQueryConfig = {
                scenic: {},
                restaurant: {},
                hotel: {},
                activity: {},
            }
            localStorage.setItem('currentQueryConfig', JSON.stringify({ ...state.currentQueryConfig }))
        },
        setQueryResult (state, result) {
            const { list, type, length } = result
            state.currentQuery[type] = list
            state.currentTotal[type] = length
        },
        setPage (state, page) {
            state.page = page
        },
        toggleSaveSpot (state, { spot, category }) {
            // console.log({ spot, category })
            const id = spot.id
            const list = state.savedQuery[category] || []
            const index = list.findIndex(item => item.id === id)
            if (index > -1) {
                list.splice(index, 1)
                state.savedQueryIds.splice(state.savedQueryIds.indexOf(id), 1)
            } else {
                list.unshift(spot)
                state.savedQueryIds.unshift(id)
            }
            localStorage.setItem('savedQuery', JSON.stringify({ ...state.savedQuery }))
        },
        destroy (state) {
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
                const requestStacks = []
                const filter = Object.assign({}, BASIC_TOUR_FILTER)
                const queryString = config.keywords
                    ? `(contains(Name,'${config.keywords}') | contains(Description,'${config.keywords}'))`
                    : FILTER_BASIC_TRUE
                    // 若空白 則全選
                const categoryList = (Object.keys(config.category).length > 0)
                    ? Object.keys(config.category)
                    : ['scenic', 'restaurant', 'hotel', 'activity']

                // Merge same category
                config.queryList.forEach(queryConfig => {
                    const { category, query } = queryConfig

                    // 非正常操作：不純在查詢的API
                    if (!getTourQueryFunction[category]) return

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
                        if (query.length > 0) {
                            // ex. ZipCode == '123' | ZipCode == '456' | Zip...
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
                    // console.log({ category, query: `${queryString} & ${queryFilter}` })
                    const queryConfig = Object.assign({ ...baseQueryConfig }, {
                        filter: `${queryString} & ${queryFilter}`, // 關鍵字 & 地區
                        skip: context.getters.getSkip, // 跳過幾筆
                    })

                    // 送出主要查詢
                    requestStacks.push(getTourQueryFunction[category](queryConfig))
                    // 儲存查詢
                    context.commit('saveQueryConfig', { category, config: queryConfig })
                })

                Promise.allSettled(requestStacks).then(res => {
                    context.commit('resetResultCurrent')
                    const ifNoResult = res.every(item => {
                        // console.log(item)
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
                        localStorage.setItem('currentQuery', JSON.stringify({ ...context.state.currentQuery }))
                        localStorage.setItem('currentTotal', JSON.stringify({ ...context.state.currentTotal }))
                        resolve(categoryQuery[0])
                    }
                })
            })
        },
        // ------------ 3: 補充查詢 ------------
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
                getTourQueryFunction[category](config).then(res => { // 更新查詢結果
                    context.state.currentQuery[category] = res.list // TODO commit
                }).catch(err => {
                    reject(err)
                })
            })
        },
    },
}
