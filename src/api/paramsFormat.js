/**
 * 轉換參數格式
 */
// Filter參考： https://github.com/ptxmotc/PTX_Web/blob/master/Swagger服務說明上傳參考檔案/公共運輸整合資訊平台資料服務開發實作.pdf

/**
 * 轉換物件參數至搜尋字串
 * @param {Object} config    參數物件
 * @returns {String}         搜尋字串
 * @example paramsFormat({
 *      top:1,
 *      skip:0,
 *      filter: '',
 *      select:['ID']
 *  })
 */
export default function paramsFormat (config) {
    const {
        top = 1,
        format = 'JSON',
        skip = 0,
        select = [],
        position = null,
        orderBy = '',
        distance = 0,
        filter = '',
    } = config
    const params = new URLSearchParams()
    params.append('$top', top)
    params.append('$format', format)
    params.append('$skip', skip)

    // 可選擇欄位 $select=[A,B,C]
    if (select.length > 0) {
        params.append('$select', selectToString(select))
    }

    // 排序 $orderby
    if (orderBy) {
        params.append('$orderby', orderBy)
    }

    // 距離範圍 filter
    if (position && distance) {
        params.append('$spatialFilter', spatialFilter(position, distance))
    }

    // 主要filter
    if (filter) {
        params.append('$filter', filterStringConvert(filter))
    }

    return params.toString()
}

// 回傳特定欄位
export function selectToString (arr) {
    if (arr.length === 0) {
        return ''
    }
    return `${arr.join(',')}`
}

// filter('test>3&number<9|what==123') => 'test gt 3 and number lt 9 or what eq 12'
export function filterStringConvert (str) {
    const sign2key = {
        '==': 'eq',
        '!=': 'ne',
        '>': 'gt',
        '>=': 'ge',
        '<': 'lt',
        '<=': 'le',
        '&': 'and',
        '|': 'or',
        '!': 'not',
        '+': 'add',
        '-': 'sub',
        '*': 'mul',
        '/': 'div',
        '%': 'mod',
    }
    Object.entries(sign2key).forEach(([sign, key]) => {
        str = str.replaceAll(sign, ` ${key} `)
    })
    return str
}

// nearby({Lat},{Lon},{DistanceInMeters})，距離範圍為{DistanceInMeters}公尺
export function spatialFilter (position, distance) {
    const { lat, lng } = position
    return `nearby(${lat},${lng},${distance})`
}

export const cities = {
    臺北市: 'Taipei',
    台北市: 'Taipei',
    新北市: 'NewTaipei',
    桃園市: 'Taoyuan',
    臺中市: 'Taichung',
    台中市: 'Taichung',
    臺南市: 'Tainan',
    台南市: 'Tainan',
    高雄市: 'Kaohsiung',
    基隆市: 'Keelung',
    新竹市: 'Hsinchu',
    新竹縣: 'HsinchuCounty',
    苗栗縣: 'MiaoliCounty',
    彰化縣: 'ChanghuaCounty',
    南投縣: 'NantouCounty',
    雲林縣: 'YunlinCounty',
    嘉義縣: 'ChiayiCounty',
    嘉義市: 'Chiayi',
    屏東縣: 'PingtungCounty',
    宜蘭縣: 'YilanCounty',
    花蓮縣: 'HualienCounty',
    臺東縣: 'TaitungCounty',
    台東縣: 'TaitungCounty',
    金門縣: 'KinmenCounty',
    澎湖縣: 'PenghuCounty',
    連江縣: 'LienchiangCounty',
    馬祖地區: 'LienchiangCounty',
}

export const bikeCities = {
    臺北市: 'Taipei',
    台北市: 'Taipei',
    新竹市: 'Hsinchu',
    苗栗縣: 'MiaoliCounty',
    新北市: 'NewTaipei',
    屏東縣: 'PingtungCounty',
    金門縣: 'KinmenCounty',
    桃園市: 'Taoyuan',
    臺中市: 'Taichung',
    台中市: 'Taichung',
    高雄市: 'Kaohsiung',
    臺南市: 'Tainan',
    嘉義市: 'Chiayi',
    台南市: 'Tainan',
}

/**
 * 取得城市 API key值
 * @param {String} text 城市名稱
 * @returns {String} API key值
 */
export const getCityParam = (text) => {
    if (text === '') return undefined
    try {
        for (const [key, value] of Object.entries(cities)) {
            if (key.includes(text)) {
                throw value
            } else if (value.includes(text)) {
                throw value
            }
        }
    } catch (city) {
        return city
    }

    return false
}

/**
 * 取得自行車城市 API key值
 * @param {String} text 自行車城市名稱
 * @returns {String} API key值
 */
export const getBikeCityParam = (text) => {
    if (text === '') return undefined
    try {
        for (const [key, value] of Object.entries(bikeCities)) {
            if (key.includes(text)) {
                throw value
            } else if (value.includes(text)) {
                throw value
            }
        }
    } catch (city) {
        return city
    }

    return false
}
