
import { ScenicSpot, RestaurantSpot, HotelSpot, ActivitySpot } from '@/api/TourSpot'
import getAxios from '@/api/getAxios'
import paramsFormat, { getCityParam } from '@/api/paramsFormat'

// Request URL: https://ptx.transportdata.tw/MOTC/v2/Tourism
const { axios, refreshHeader } = getAxios('Tourism')
const simpleQueryNumConfig = {
    top: 10000,
    skip: 0,
    select: ['ID'],
}

function errorHandler (e) {
    return e
}

// GET /v2/Tourism/ScenicSpot
/**
 * 取得景點資訊
 * @param {*} config 參數設定
 * @returns {Array} ScenicSpot
 */
export const getScenicSpot = async (config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const queryQuickNumString = paramsFormat(Object.assign({ }, config, { ...simpleQueryNumConfig }))
        let length = 0

        // 取得資料
        const { data } = await axios.get(`/ScenicSpot/?${queryString}`)
        // 若無數量快取資料
        if (!config.skip) {
            const { data: { length: total } } = await axios.get(`/ScenicSpot/?${queryQuickNumString}`)
            length = total
        }

        return {
            length,
            type: 'scenic',
            list: data.map(item => (new ScenicSpot(item))),
        }
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/ScenicSpot/{City} 取得指定[縣市]觀光景點資料
/**
 * 取得特定縣市景點資訊
 * @param {string} queryCity 縣市
 * @param {*} config 參數設定
 * @returns {Array} ScenicSpot
 */
export const getScenicSpotByCity = async (queryCity, config = {}) => {
    try {
        // $select=[A,B,C]
        const city = getCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)

        // 取得資料
        const { data } = await axios.get(`/ScenicSpot/${city}/?${queryString}`)

        return data.map(item => (new ScenicSpot(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Restaurant 取得所有觀光餐飲資料
/**
 * 取得餐廳資訊
 * @param {*} config 參數設定
 * @returns {Array} RestaurantSpot
 */
export const getRestaurantSpot = async (config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const queryQuickNumString = paramsFormat(Object.assign({ }, config, { ...simpleQueryNumConfig }))
        let length = 0

        // 取得資料
        const { data } = await axios.get(`/Restaurant/?${queryString}`)
        // 若無數量快取資料
        if (!config.skip) {
            const { data: { length: total } } = await axios.get(`/Restaurant/?${queryQuickNumString}`)
            length = total
        }

        return {
            length,
            type: 'restaurant',
            list: data.map(item => (new RestaurantSpot(item))),
        }
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Restaurant/{City} 取得指定[縣市]觀光餐飲資料
/**
 * 取得特定縣市餐廳資訊
 * @param {string} queryCity 縣市
 * @param {*} config 參數設定
 * @returns {Array} RestaurantSpot
 * @example getRestaurantSpotByCity('台北市')
 */
export const getRestaurantSpotByCity = async (queryCity, config = {}) => {
    try {
        // $select=[A,B,C]
        const city = getCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)

        // 取得資料
        const { data } = await axios.get(`/Restaurant/${city}/?${queryString}`)
        return data.map(item => (new RestaurantSpot(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Hotel 取得所有觀光旅宿資料
/**
 * 取得旅館資訊
 * @param {*} config 參數設定
 * @returns {Array} HotelSpot
*/
export const getHotelSpot = async (config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const queryQuickNumString = paramsFormat(Object.assign({ }, config, { ...simpleQueryNumConfig }))
        let length = 0
        // 取得資料
        const { data } = await axios.get(`/Hotel/?${queryString}`)
        // 若無數量快取資料
        if (!config.skip) {
            const { data: { length: total } } = await axios.get(`/Hotel/?${queryQuickNumString}`)
            length = total
        }
        return {
            length,
            type: 'hotel',
            list: data.map(item => (new HotelSpot(item))),
        }
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Hotel/{City} 取得指定[縣市]觀光旅宿資料
/**
 * 取得特定縣市旅館資訊
 * @param {string} queryCity 縣市
 * @param {*} config 參數設定
 * @returns {Array} HotelSpot
 * @example getHotelSpotByCity('台北市')
 */
export const getHotelSpotByCity = async (queryCity, config = {}) => {
    try {
        // $select=[A,B,C]
        const city = getCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)

        // 取得資料
        const { data } = await axios.get(`/Hotel/${city}/?${queryString}`)
        // data.forEach(item => { console.log(item) })
        return data.map(item => (new HotelSpot(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Activity 取得所有觀光活動資料
/**
 * 取得活動資訊
 * @param {*} config 參數設定
 * @returns {Array} ActivitySpot
 */
export const getActivitySpot = async (config = {}) => {
    try {
        // $select=[A,B,C]
        const queryString = paramsFormat(config)
        const queryQuickNumString = paramsFormat(Object.assign({ }, config, { ...simpleQueryNumConfig }))
        let length = 0

        // 取得資料
        const { data } = await axios.get(`/Activity/?${queryString}`)
        // 若無數量快取資料
        if (!config.skip) {
            const { data: { length: total } } = await axios.get(`/Activity/?${queryQuickNumString}`)
            length = total
        }
        // data.forEach(item => { console.log(item) })
        return {
            length,
            type: 'activity',
            list: data.map(item => (new ActivitySpot(item))),
        }
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Tourism/Activity/{City} 取得指定[縣市]觀光活動資料
/**
 * 取得特定縣市活動資訊
 * @param {string} queryCity 縣市
 * @param {*} config 參數設定
 * @returns {Array} ActivitySpot
 * @example getActivitySpotByCity('台北市')
 */
export const getActivitySpotByCity = async (queryCity, config = {}) => {
    try {
        // $select=[A,B,C]
        const city = getCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)

        // 取得資料
        const { data } = await axios.get(`/Activity/${city}/?${queryString}`)
        return data.map(item => (new ActivitySpot(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// TODO 利用 $filter 搜尋 字串包含ＸＸＸ
// function getAlwaysOpenQueryString () {

// }

const allTime = [
    'Sun 24 hours；Sun 24 hours；Mon 24 hours；Mon 24 hours；Tue 24 hours；Tue 24 hours；Wed 24 hours；Wed 24 hours；Thu 24 hours；Thu 24 hours；Fri 24 hours；Fri 24 hours；Sat 24 hours；Sat 24 hours',
    'Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours',
    '隨時',
    '整天',
    '24 小時營業',
    '＊',
    '無限制',
    '無時間限制',
    '每日開放',
    '開放式空間，無時間限制',
    '開放式空間 隨時開放',
    '對外開放',
    '全天候',
    '全天開放',
    '全天候開放',
    '全天開放，無時間限制(00:00~24:00)',
    '全日',
    '全日開放',
    '全日無休',
    '全天',
    '全天候',
    '全年無休',
    '全年皆可進入，無時間限制',
    '全年開放',
    '全年皆可進入',
    '全年皆可，無時間限制(00:00~24:00)', // X "全年無休（詢問處08:30-17:30）"
    '24H',
    '24H 全年無休',
    '24h',
    '24H無限制',
    '24小時',
    '24小時，全年無休',
    '24小時營業',
    '00:00~24:00',
]
