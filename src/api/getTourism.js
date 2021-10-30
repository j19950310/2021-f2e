
import TourSpot from '@/api/TourSpot'
import getAxios from '@/api/getAxios'
import { filter as $filter, select as $select } from '@/api/paramsFormat'

// Request URL: https://ptx.transportdata.tw/MOTC/v2/Tourism
const axios = getAxios('Tourism')

function errorHandler (e) {
    // console.log(e)
    return e
}

// GET /v2/Tourism/ScenicSpot
export const getScenicSpot = async () => {
    try {
        // $select=[A,B,C]
        const params = new URLSearchParams()
        params.append('$top', 100)
        params.append('$format', 'JSON')
        params.append('$skip', 700)
        params.append('$select', $select(['OpenTime']))
        // params.append('$filter', $filter(`!contains(OpenTime,'${allTime.join('\')&!contains(OpenTime,\'')}')`))
        params.append('$filter', $filter(`trim(OpenTime)!='${allTime.join('\'&trim(OpenTime)!=\'')}'`))
        // 取得資料
        const { data } = await axios.get(`/ScenicSpot/?${params.toString()}`)
        return data.map(item => (new TourSpot(item)))
    } catch (e) {
        return errorHandler(e)
    }
}

// TODO 利用 $filter 搜尋 字串包含ＸＸＸ
function getAlwaysOpenQueryString () {

}

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
// GET /v2/Tourism/ScenicSpot 取得所有觀光景點資料
// ScenicSpot?$top=30&$format=JSON
// console.log($filter(`trim(OpenTime)!='${allTime.join('\'&trim(OpenTime)!=\'')}'`))

// GET /v2/Tourism/ScenicSpot/{City} 取得指定[縣市]觀光景點資料

// GET /v2/Tourism/Restaurant 取得所有觀光餐飲資料

// GET /v2/Tourism/Restaurant/{City} 取得指定[縣市]觀光餐飲資料

// GET /v2/Tourism/Hotel 取得所有觀光旅宿資料

// GET /v2/Tourism/Hotel/{City} 取得指定[縣市]觀光旅宿資料

// GET /v2/Tourism/Activity 取得所有觀光活動資料
