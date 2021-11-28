// 第二週 API
import getAxios from '@/api/getAxios'
import paramsFormat, { getBikeCityParam } from '@/api/paramsFormat'
import { BikeStation, BikeAvailability } from '@/api/Bike'

// Request URL: https://ptx.transportdata.tw/MOTC/?t=Bike&v=2
const { axios, refreshHeader } = getAxios('Bike')
const simpleQueryNumConfig = { // TODO
    // top: 10000,
    // skip: 0,
    // select: ['ID'],
}

function errorHandler (e) {
    return e
}

// GET /v2/Bike/Station/{City}
/**
 * 取得指定[縣市]的公共自行車租借站位資料
 */
export const getBikeStation = async (queryCity, config = {}) => {
    try {
        const city = getBikeCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)
        // 取得資料
        const { data } = await axios.get(`/Station/${city}?${queryString}`)
        return data.map(item => (new BikeStation(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bike/Availability/{City}
/**
 * 取得動態指定[縣市]的公共自行車即時車位資料
 */
export const getBikeAvailability = async (queryCity, config = {}) => {
    try {
        const city = getBikeCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)
        // 取得資料
        const { data } = await axios.get(`/Availability/${city}/?${queryString}`)

        return data.map(item => (new BikeAvailability(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// 合併功能
export const getBikeStationWithAvailability = async (queryCity, config = {}) => {
    const stations = await getBikeStation(queryCity, { ...config, orderBy: 'StationID' })
    const availabilities = await getBikeAvailability(queryCity, { ...config, orderBy: 'StationID' })
    if (Array.isArray(stations)) {
        return stations.map((station, index) => {
            if (station.StationUID === availabilities[index].StationUID) {
                return new BikeStation(station, availabilities[index])
            } else {
                const ava = availabilities.find(availability => availability.StationUID === station.StationUID)
                return new BikeStation(station, ava || null)
            }
        }).filter(Boolean)
    }
    return []
}

// GET /v2/Bike/Station/NearBy
/**
 * 取得指定[位置,範圍]的全臺公共自行車租借站位資料
 * @param {Object} config.position 位置
 * @param {Number} config.range 範圍(公尺)
 */
export const getBikeStationNearBy = async (config = {}) => {
    try {
        config.distance = Math.min(config.distance, 1000)
        const queryString = paramsFormat(config)
        // 取得資料
        const { data } = await axios.get(`/Station/NearBy?${queryString}`)
        return data.map(item => (new BikeStation(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// GET /v2/Bike/Availability/NearBy
/**
 * 取得指定[位置,範圍]的全臺公共自行車即時車位資料
 * @param {Object} config.position 位置
 * @param {Number} config.range 範圍(公尺)
 */
export const getBikeAvailabilityNearBy = async (config = {}) => {
    try {
        config.distance = Math.min(config.distance, 1000)
        const queryString = paramsFormat(config)
        // 取得資料
        const { data } = await axios.get(`/Availability/NearBy?${queryString}`)
        return data.map(item => (new BikeAvailability(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}

// 合併功能
export const getBikeStationWithAvailabilityNearBy = async (config = {}) => {
    const stations = await getBikeStationNearBy({ ...config, orderBy: 'StationID' })
    const availabilities = await getBikeAvailabilityNearBy({ ...config, orderBy: 'StationID' })

    if (Array.isArray(stations)) {
        return stations.map((station, index) => {
            if (station.StationUID === availabilities[index].StationUID) {
                // BikeStation(Station, Availabilities)
                return new BikeStation(station, availabilities[index])
            } else {
                const ava = availabilities.find(availability => availability.StationUID === station.StationUID)
                return new BikeStation(station, ava || null)
            }
        }).filter(Boolean)
    }
    return []
}
