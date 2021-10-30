// https://github.com/ptxmotc/PTX_Web/blob/master/Swagger服務說明上傳參考檔案/公共運輸整合資訊平台資料服務開發實作.pdf

export default function paramsFormat (config) {
    const {
        top = 1,
        format = 'JSON',
        skip = 0,
    } = config
    const params = new URLSearchParams()
    params.append('$top', top)
    params.append('$format', format)
    params.append('$skip', skip)
    // 可選擇欄位 $select=[A,B,C]
    // params.append('$select', $select(['OpenTime']))
    // params.append('$filter', $filter(`!contains(OpenTime,'${allTime.join('\')&!contains(OpenTime,\'')}')`))

    // 測試取得OpenTime肯定全開的景點
    // params.append('$filter', $filter(`trim(OpenTime)!='${allTime.join('\'&trim(OpenTime)!=\'')}'`))
    return params.toString()
}

// 回傳特定欄位
export function select (arr) {
    if (arr.length === 0) {
        return ''
    }
    return `${arr.join(',')}`
}

// filter('test > 3 & amout < 9 | ewaf == 123') => 'test gt 3 and amout lt 9 or ewa eq 123'
export function filter (str) {
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

// TODO
// export function spatialFilter ( {}

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
