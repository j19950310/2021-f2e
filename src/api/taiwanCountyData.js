export const regionLabels = {
    north: '北部',
    center: '中部',
    east: '東部',
    south: '南部',
    outlyingIslands: '離島',
}
export const regionKeys = {
    北部: 'north',
    中部: 'center',
    東部: 'east',
    南部: 'south',
    離島: 'outlyingIslands',
}

export const getRegionCounty = (region) => {
    switch (region) {
        case 'north':
            return ['臺北市', '新北市', '基隆市', '新竹市', '桃園市', '新竹縣', '宜蘭縣']
        case 'center':
            return ['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣']
        case 'south':
            return ['高雄市', '臺南市', '嘉義市', '嘉義縣', '屏東縣']
        case 'east':
            return ['花蓮縣', '臺東縣']
        case 'outlyingIslands':
            return ['金門縣', '連江縣', '澎湖縣']
        default:
            return []
    }
}
export const getCountyRegion = (county) => {
    switch (county) {
        case '臺北市':
        case '新北市':
        case '基隆市':
        case '新竹市':
        case '桃園市':
        case '新竹縣':
        case '宜蘭縣':
            return 'north'
        case '臺中市':
        case '苗栗縣':
        case '彰化縣':
        case '南投縣':
        case '雲林縣':
            return 'center'
        case '高雄市':
        case '臺南市':
        case '嘉義市':
        case '嘉義縣':
        case '屏東縣':
            return 'south'
        case '花蓮縣':
        case '臺東縣':
            return 'east'
        case '金門縣':
        case '連江縣':
        case '澎湖縣':
            return 'outlyingIslands'
        default:
            return undefined
    }
}

export const coutiesLabels = {
    Taipei: '台北市',
    NewTaipei: '新北市',
    Taoyuan: '桃園市',
    Taichung: '台中市',
    Tainan: '台南市',
    Kaohsiung: '高雄市',
    Keelung: '基隆市',
    Hsinchu: '新竹市',
    HsinchuCounty: '新竹縣',
    MiaoliCounty: '苗栗縣',
    ChanghuaCounty: '彰化縣',
    NantouCounty: '南投縣',
    YunlinCounty: '雲林縣',
    ChiayiCounty: '嘉義縣',
    Chiayi: '嘉義市',
    PingtungCounty: '屏東縣',
    YilanCounty: '宜蘭縣',
    HualienCounty: '花蓮縣',
    TaitungCounty: '台東縣',
    KinmenCounty: '金門縣',
    PenghuCounty: '澎湖縣',
    LienchiangCounty: '連江縣',
}

// 正反收錄好查詢
export const coutiesMap = new Map(Object.entries(coutiesLabels))
Object.keys(coutiesLabels).forEach(key => {
    coutiesMap.set(coutiesLabels[key], key)
})

// ＃＃＃＃＃＃校正簡體繁體名稱＃＃＃＃＃＃
export const countySimpleNameMap = {
    台北市: '臺北市',
    臺北市: '台北市',
    台中市: '臺中市',
    臺中市: '台中市',
    台南市: '臺南市',
    臺南市: '台南市',
    台東縣: '臺東縣',
    臺東縣: '台東縣',
}
