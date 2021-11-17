// 第二週 API
import getAxios from '@/api/getAxios'
import paramsFormat, { getBikeCityParam } from '@/api/paramsFormat'
import { BikeStation, BikeAvailability, BikeShape } from '@/api/Bike'

// Request URL: https://ptx.transportdata.tw/MOTC/v2/Cycling
const { axios, refreshHeader } = getAxios('Cycling')

const simpleQueryNumConfig = { // TODO
    // top: 10000,
    // skip: 0,
    // select: ['ID'],
}

function errorHandler (e) {
    return e
}

// GET /v2/Cycling/Shape/{City}
/**
 * 取得指定縣市之自行車道路網圖資
 */

export const getCyclingShape = async (queryCity, config = {}) => {
    try {
        const city = getBikeCityParam(queryCity)
        if (!city) throw new Error('查詢不到輸入字串的城市')
        const queryString = paramsFormat(config)
        // 取得資料
        const { data } = await axios.get(`/Shape/${city}/?${queryString}`)
        return data.map(item => (new BikeShape(item)))
    } catch (e) {
        return errorHandler(e)
    } finally {
        refreshHeader()
    }
}
