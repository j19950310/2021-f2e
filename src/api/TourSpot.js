// ZipCode collection

export default class TourSpot {
    constructor (config) {
        Object.assign(this, config)
    }

    get id () {
        // 景點代碼 ,
        return this.ID
    }

    get name () {
        // 景點名稱 ,
        return this.Name
    }

    get description () {
        // 景點特色精簡說明 ,
        return this.Description
    }

    get address () {
        // 景點地址 ,
        return this.Address
    }

    get phone () {
        // 景點服務電話 ,
        const value = this.Phone
        return {
            empty: value === '',
            value,
            label: '景點服務電話',
            href: value ? `tel:${value}` : undefined,
        }
    }

    get websiteUrl () {
        // 景點官方網站網址 ,
        return this.WebsiteUrl
    }

    get picture () {
        // 景點照片 ,
        return new TourismPicture(this.Picture)
    }

    get position () {
        // 景點位置 {GeoHash,PositionLat,PositionLon}
        // google map api { lat, lng }
        return new PointType(this.Position)
    }

    get class () {
        // 景點分類
        const { Class, Class1, Class2, Class3 } = this
        return [Class, Class1, Class2, Class3].filter(Boolean)
    }

    get mapUrl () {
        // 景點地圖/簡圖介紹網址 ,
        return this.MapUrl
    }

    get zipCode () {
        // 郵遞區號 ,
        return this.ZipCode
    }

    get parkingInfo () {
        // 停車資訊 ,
        return this.ParkingInfo
    }

    get city () {
        // 所屬縣市 ,
        return this.City
    }

    get srcUpdateTime () {
        // 觀光局檔案更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) ,
        return new Date(this.SrcUpdateTime)
    }

    get updateTime () {
        // 本平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz)
        return new Date(this.UpdateTime)
    }
}

export class ScenicSpot extends TourSpot {
    constructor (config) {
        super(config)
        this.category = 'scenic'
    }

    get descriptionDetail () {
        // 景點特色詳細說明 ,
        return this.DescriptionDetail
    }

    get travelInfo () {
        // 交通資訊 ,
        return this.TravelInfo
    }

    get openTime () {
        // 開放時間 ,
        return this.OpenTime
    }

    get level () {
        // 古蹟分級 ,
        return this.Level
    }

    get parkingPosition () {
        // 景點主要停車場位置 ,
        return new PointType(this.ParkingPosition)
    }

    get ticketInfo () {
        // 票價資訊 ,
        return this.TicketInfo
    }

    get remarks () {
        // 警告及注意事項 ,
        return this.Remarks ? document.createTextNode(this.Remarks) : undefined
    }

    get keyword () {
        // 常用搜尋關鍵字 ,
        return this.Keyword
    }
}

export class RestaurantSpot extends TourSpot {
    constructor (config) {
        super(config)
        this.category = 'restaurant'
    }
}

export class HotelSpot extends TourSpot {
    constructor (config) {
        super(config)
        this.category = 'hotel'
    }

    get grade () {
        // 旅宿星級 ,
        return this.Grade
    }

    get fax () {
        // 旅宿傳真 ,
        return this.Fax
    }

    get spec () {
        // 旅宿房型、價目及數量 ,
        return this.Spec
    }

    get serverInfo () {
        // 旅宿服務 ,
        return this.ServerInfo
    }
}

export class ActivitySpot extends TourSpot {
    constructor (config) {
        super(config)
        this.category = 'activity'
    }

    get particpation () {
        // 活動參與對象 ,
        return this.Particpation
    }

    get organizer () {
        // 活動主辦單位 ,
        return this.Organizer
    }

    get time () {
        return {
            start: new Date(this.StartTime),
            end: new Date(this.EndTime),
        }
    }

    get cycle () {
        // 活動周期 ,
        return this.Cycle
    }

    get nonCycle () {
        // 活動不重複 ,
        return this.NonCycle
    }

    // get class(){} // TODO
    get charge () {
        // 活動費用標示 ,
        return this.Charge
    }
}

class TourismPicture {
    constructor (config) {
        const {
            PictureUrl1,
            PictureDescription1,
            PictureUrl2,
            PictureDescription2,
            PictureUrl3,
            PictureDescription3,
        } = config
        this.pictures = [PictureUrl1, PictureUrl2, PictureUrl3].filter(Boolean)
        this.descriptions = [PictureDescription1, PictureDescription2, PictureDescription3].filter(Boolean)
        this.index = 0
    }

    // PictureUrl1 照片連結網址1
    // PictureDescription1 照片說明1

    get src () {
        return this.pictures[this.index]
    }

    get alt () {
        return this.descriptions[this.index]
    }

    change () {
        this.index = (this.index + 1) % this.pictures.length
    }

    get all () {
        return this.pictures
    }

    get desc () {
        return this.descriptions
    }

    get length () {
        return this.pictures.length
    }

    get empty () {
        return !this.length
    }
}

class PointType {
    constructor (config) {
        const {
            GeoHash,
            PositionLat,
            PositionLon,
        } = config
        Object(this, {
            GeoHash,
            PositionLat,
            PositionLon,
        })
    }

    get lat () {
        return this.PositionLat
    }

    get lng () {
        return this.PositionLon
    }

    get hash () {
        return this.GeoHash
    }

    get empty () {
        return !this.lat && !this.lng && !this.hash
    }
}

// TODO: 應該會改去用filter查，資料不多可以All in
function filtOpenTime (openTime) {
    // Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours
    // 需事先預約訂購賞鯨豚行程及船隻，龜山島開放登島時間為每年3月1日至11月30日之每日09:00-17:00。但每年6.7.8.9月份，得配合天候調整為每日08:30-17:30，如遇天候不佳則封島禁止進入。
    const time = ['07:00 ~ 21:00', '09:00-17:00']
    const none = ['尚未有資料']
    return [
        '隨時',
        '＊',
        '無限制',
        '每日開放',
        '全天候',
        '全天開放',
        '全天候開放',
        '全日',
        '全天',
        '全年無休',
        '全年開放',
        '全年皆可進入',
        '全年皆可，無時間限制(00:00~24:00)',
        '24H',
        '24h',
        '24小時',
        '24小時，全年無休',
    ]
}

// "免費","無","免門票","免費參觀","免收門票"
