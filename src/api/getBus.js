// 第三週 API
import getAxios from '@/api/getAxios'
import paramsFormat, { getCityParam } from '@/api/paramsFormat'

// Request URL: https://ptx.transportdata.tw/MOTC/v2/Bus
const { axios, refreshHeader } = getAxios('Bus')

function errorHandler (e) {
    return e
}

// GET /v2/Bus/Route/City/{City}
/**
 * 取得指定[縣市]的市區公車路線資料
 */
export const getBusRouteByCity = async (queryCity, config = {}) => {
    try {
        const city = getCityParam(queryCity)
        const queryString = paramsFormat(config)
        if (!city) throw new Error('查詢不到輸入字串的城市')

        const { data } = await axios.get(`/Route/City/${city}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/Route/NearBy
/**
 * 取得指定[位置,範圍]的全臺公車路線資料
 */
export const getBusRouteByNearBy = async (config) => {
    try {
        if (config.position === undefined || config.distance === undefined) throw new Error('請輸入位置與範圍')
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/Route/NearBy?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/DisplayStopOfRoute/City/{City}/{RouteName}
/**
 * 取得指定[縣市],[路線名稱]的市區公車顯示用路線站序資料
 */
export const getBusDisplayStopOfRoute = async (queryCity, queryRouteName, config = {}) => {
    try {
        const city = getCityParam(queryCity)
        const queryString = paramsFormat(config)
        if (!city) throw new Error('查詢不到輸入字串的城市')

        const { data } = await axios.get(`/DisplayStopOfRoute/City/${city}/${queryRouteName}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}
