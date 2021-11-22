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
