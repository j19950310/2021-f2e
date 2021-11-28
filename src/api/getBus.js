// 第三週 API
import getAxios from '@/api/getAxios'
import paramsFormat, { getCityParam } from '@/api/paramsFormat'

// Request URL: https://ptx.transportdata.tw/MOTC/v2/Bus
const { axios, refreshHeader } = getAxios('Bus')

function errorHandler (e) {
    return e
}

// GET /v2/Bus/Station/NearBy
/**
 * 取得指定[位置,範圍]的全臺公車站位資料
 */
export const getBusStationNearBy = async (config) => {
    try {
        if (config.position === undefined || config.distance === undefined) throw new Error('請輸入位置與範圍')
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/Station/NearBy?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
        return []
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/EstimatedTimeOfArrival/City/{City}/PassThrough/Station/{StationID}
/**
 * 取得指定[縣市],[站位]的市區公車預估到站資料(N1)
 */
export const getCityBusEstimatedTimeOfArrivalById = async (city, id, config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/EstimatedTimeOfArrival/City/${city}/PassThrough/Station/${id}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
        return []
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/EstimatedTimeOfArrival/InterCity/PassThrough/Station/{StationID}
/**
 * 取得指定[站位]的公路客運預估到站資料(N1)
 */
export const getInterCityBusEstimatedTimeOfArrivalById = async (id, config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/EstimatedTimeOfArrival/InterCity/PassThrough/Station/${id}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
        return []
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/Route/InterCity
/**
 * 取得公路客運路線資料
 */
export const getBusRouteInterCity = async (config) => {
    try {
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/Route/InterCity?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/Route/City/{City}
/**
 * 取得指定[縣市]的市區公車路線資料
 * Note: 參數沒有[位置,範圍]，所以含有position參數不會影響結果
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

// GET /v2/Bus/EstimatedTimeOfArrival/City/{City}/{RouteName}
/**
 * 取得指定[縣市],[路線名稱]的公車預估到站資料(N1)[批次更新]
 */
export const getCityBusEstimatedTimeOfArrivalByRouteName = async (queryCity, routeName, config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const city = getCityParam(queryCity)
        const { data } = await axios.get(`/EstimatedTimeOfArrival/City/${city}/${routeName}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
        return []
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/EstimatedTimeOfArrival/InterCity/{RouteName}
/**
 * 取得指定[路線名稱]的公路客運預估到站資料(N1)[批次更新]
 */
export const getInterBusEstimatedTimeOfArrivalByRouteName = async (routeName, config = {}) => {
    try {
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/EstimatedTimeOfArrival/InterCity/${routeName}?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
        return []
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/StopOfRoute/InterCity
/**
 * 取得公路客運路線與站牌資料
 */
export const getStopOfRouteInterCity = async (config) => {
    try {
        const queryString = paramsFormat(config)
        const { data } = await axios.get(`/StopOfRoute/InterCity?${queryString}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/Shape/City/{City}/{RouteName}
/**
 * 取得指定[縣市],[路線名稱]的市區公車線型資料
 */
export const getBusShapeByCity = async (queryCity, queryRouteName, config = {}) => {
    try {
        const city = getCityParam(queryCity)
        const { data } = await axios.get(`/Shape/City/${city}/${queryRouteName}?${paramsFormat(config)}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/Shape/InterCity/{RouteName}
/**
 * 取得指定[路線名稱]的公路公車線型資料
 */
export const getBusShapeByInterCity = async (queryRouteName, config = {}) => {
    try {
        const { data } = await axios.get(`/Shape/InterCity/${queryRouteName}?${paramsFormat(config)}`)
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

// GET /v2/Bus/RealTimeByFrequency/City/{City}/{RouteName}
/**
 * 取得指定[縣市],[路線名稱]的公車動態定時資料(A1)[批次更新]
 */
export const getCityBusRealTimeByFrequency = async (queryCity, queryRouteName, config = {}) => {
    try {
        const city = getCityParam(queryCity)
        const { data } = await axios.get(`/RealTimeByFrequency/City/${city}/${queryRouteName}?${paramsFormat(config)}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bus/RealTimeByFrequency/InterCity/{RouteName}
/**
 * 取得指定[路線名稱]的公路客運動態定時資料(A1)[批次更新]
 */
export const getInterBusRealTimeByFrequency = async (queryRouteName, config = {}) => {
    try {
        const { data } = await axios.get(`/RealTimeByFrequency/InterCity/${queryRouteName}?${paramsFormat(config)}`)
        return data
    } catch (error) {
        errorHandler(error)
    } finally {
        refreshHeader()
    }
}
