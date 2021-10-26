import axios from 'axios'
import TourSpot from '@/api/TourSpot'

axios.defaults.baseURL = 'https://ptx.transportdata.tw/MOTC/v2/Tourism'
axios.defaults.headers.get['Content-Type'] = 'application/json'

function errorHandler (e) {
    console.log(e)
}

// GET /v2/Tourism/ScenicSpot 取得所有觀光景點資料
// ScenicSpot?$top=30&$format=JSON
export async function getScenicSpot () {
    try {
        // $select=[A,B,C]
        // const url = new URLSearchParams()
        const { data } = await axios.get('/ScenicSpot?$top=100&$skip=100&$format=JSON&$filter=contains(OpenTime,\'全\')') // $top=30
        return data.map(item => (new TourSpot(item)))
    } catch (e) {
        errorHandler(e)
    }
}

// TODO 利用 $filter 搜尋 字串包含ＸＸＸ
function getAlwaysOpenQueryString () {

}

// GET /v2/Tourism/ScenicSpot/{City} 取得指定[縣市]觀光景點資料

// GET /v2/Tourism/Restaurant 取得所有觀光餐飲資料

// GET /v2/Tourism/Restaurant/{City} 取得指定[縣市]觀光餐飲資料

// GET /v2/Tourism/Hotel 取得所有觀光旅宿資料

// GET /v2/Tourism/Hotel/{City} 取得指定[縣市]觀光旅宿資料

// GET /v2/Tourism/Activity 取得所有觀光活動資料
