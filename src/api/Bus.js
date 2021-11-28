import { decode, encode } from '@googlemaps/polyline-codec'
import PointType from '@/api/PointType'
import { getCityByPosition } from '@/api/getAdministrative'
import paramsFormat, { getCityParam } from '@/api/paramsFormat'
import {
    getBusStationNearBy,
    getInterCityBusEstimatedTimeOfArrivalById,
    getCityBusEstimatedTimeOfArrivalById,
    getBusRouteInterCity,
    getBusRouteByCity,
    getCityBusEstimatedTimeOfArrivalByRouteName,
    getInterBusEstimatedTimeOfArrivalByRouteName,
    getBusShapeByCity,
    getBusShapeByInterCity,
    getBusRouteByNearBy,
    getStopOfRouteInterCity,
    getBusDisplayStopOfRoute,
    getCityBusRealTimeByFrequency,
    getInterBusRealTimeByFrequency
} from '@/api/getBus'
const PER_PAGE = 10

export class BusStation {
    constructor (config) {
        Object.assign(this, config)
    }

    async getRoutes () {
        const routeUIDs = this.stops.map(stop => stop.RouteUID)
        const city = getCityParam(await getCityByPosition(this.position))
        const config = {
            // ${id} == RouteUID
            filter: routeUIDs.map(id => `(RouteUID == '${id}')`).join(' | '),
        }
        const interRoutes = (await getBusRouteInterCity(config))
            .map(item => new BusRoute(item))
        const cityRoutes = (await getBusRouteByCity(city, config))
            .map(item => new BusRoute(item))
        const interTimeOfArrival = (await getInterCityBusEstimatedTimeOfArrivalById(this.id)).map(item => new BusStopEstimatedTime(item))
        const cityTimeOfArrival = (await getCityBusEstimatedTimeOfArrivalById(city, this.id)).map(item => new BusStopEstimatedTime(item))

        return { interRoutes, cityRoutes, interTimeOfArrival, cityTimeOfArrival }
    }

    get name () {
        // return this.RouteName.En
        return this.StationName.Zh_tw
    }

    get id () {
        return this.StationID
    }

    get uid () {
        return this.StationUID
    }

    get position () {
        return new PointType(this.StationPosition)
    }

    get stops () {
        return this.Stops.map(stop => new BusStation(stop))
    }

    get updateTime () {
        return this.UpdateTime
    }
}

export class BusRoute {
    constructor (config) {
        Object.assign(this, config)
    }

    async getStops () {
        const config = {
            filter: `RouteID == '${this.id}'`,
        }
        if (this.city) {
            return (await getBusDisplayStopOfRoute(this.city, this.name, config))
        } else { // 公交車路線沒有城市資訊
            return (await getStopOfRouteInterCity(config))
        }
    }

    async getShape () { // TODO 建立 class
        try {
            const shape = []
            if (this.city) {
                shape.push(...await getBusShapeByCity(this.city, this.name, this.config))
            } else {
                shape.push(...await getBusShapeByInterCity(this.name, this.config))
            }
            return shape
                .map(item => {
                    const points = decode(item.EncodedPolyline)
                    return {
                        points,
                    }
                })
        } catch (error) {
            return []
        }
    }

    async getEstimatedTime () {
        // getCityBusEstimatedTimeOfArrivalByRouteName
        // getInterBusEstimatedTimeOfArrivalByRouteName
        try {
            const stops = []
            if (this.city) {
                stops.push(...await getCityBusEstimatedTimeOfArrivalByRouteName(this.city, this.name))
            } else {
                stops.push(...await getInterBusEstimatedTimeOfArrivalByRouteName(this.name))
            }
            return stops.map(item => new BusStopEstimatedTime(item))
        } catch (error) {
            return []
        }
    }

    async getBusRealTime () {
        // getCityBusRealTimeByFrequency
        // getInterBusRealTimeByFrequency
        try {
            const buss = []
            if (this.city) {
                buss.push(...await getCityBusRealTimeByFrequency(this.city, this.name))
            } else {
                buss.push(...await getInterBusRealTimeByFrequency(this.name))
            }
            return buss.map(item => new BusBusData(item))
        } catch (error) {
            return []
        }
    }

    get name () {
        // return this.RouteName.En
        return this.RouteName.Zh_tw
    }

    get id () {
        return this.RouteID
    }

    get uid () {
        return this.RouteUID
    }

    get hasSub () {
        return this.HasSubRoutes
    }

    get operators () {
        return this.Operators // TODO: class
    }

    get subRoutes () {
        return this.SubRoutes.map(item => (new BusSubRoute(item, this.start, this.end))) // TODO: class
    }

    get type () {
        const typeName = { 11: '市區公車', 12: '公路客運', 13: '國道客運', 14: '接駁車' }
        return typeName[this.BusRouteType]
    }

    get start () {
        // DepartureStopNameEn 起站英文名稱
        return this.DepartureStopNameZh
    }

    // 含英文名稱
    get startDetail () {
        return `${this.DepartureStopNameZh}(${this.DepartureStopNameEn})`
    }

    get end () {
        // DestinationStopNameEn 終站英文名稱
        return this.DestinationStopNameZh
    }

    // 含英文名稱
    get endDetail () {
        return `${this.DestinationStopNameZh}(${this.DestinationStopNameEn})`
    }

    get ticket () {
        return `${this.TicketPriceDescriptionZh}(${this.TicketPriceDescriptionEn})`
    }

    get fareBufferZone () {
        // FareBufferZoneDescriptionEn 收費緩衝區英文敘述
        return this.FareBufferZoneDescriptionZh
    }

    get url () {
        return this.RouteMapImageUrl
    }

    get city () {
        return this.City
    }

    get cityCode () {
        return this.CityCode
    }

    get updateTime () {
        return this.UpdateTime
    }
}
export class BusSubRoute {
    constructor (config, stop1, stop2) {
        Object.assign(this, { stop1, stop2 }, config)
    }

    get name () {
        // return this.RouteName.En
        return this.SubRouteName.Zh_tw
    }

    get id () {
        return this.SubRouteID
    }

    get uid () {
        return this.SubRouteUID
    }

    get operators () {
        return this.Operators // TODO: class
    }

    get direction () {
        const directionName = { 0: '去程', 1: '返程', 2: '迴圈', 255: '未知' }
        return directionName[this.Direction]
    }

    get isReverse () {
        return this.Direction === 1
    }

    get stop () {
        return {
            [this.isReverse ? 'end' : 'start']: this.stop1,
            [!this.isReverse ? 'end' : 'start']: this.stop2,
        }
    }

    get time () {
        return {
            first: this.FirstBusTime,
            last: this.LastBusTime,
        }
    }

    get holiday () {
        return {
            first: this.HolidayFirstBusTime,
            last: this.HolidayLastBusTime,
        }
    }
    // Headsign (String, optional): 車頭描述 ,
    // HeadsignEn (String, optional): 車頭英文描述 ,
}

export class BusStop {
    constructor (config) {
        Object.assign(this, config)
    }

    get uid () {
        return this.StopUID
    }

    get id () {
        return this.StopID
    }

    get name () {
        return this.StopName.Zh_tw
    }

    get boarding () {
        const boardingName = { '-1': '可下車', 0: '可上下車', 1: '可上車' }
        return boardingName[this.StopBoarding]
    }

    get index () {
        return this.StopSequence
    }

    get stationId () {
        return this.StationID
    }

    get position () {
        return new PointType(this.StopPosition)
    }
}

export class BusBusData {
    constructor (config) {
        Object.assign(this, config)
    }

    get number () {
        return this.PlateNumb
    }

    get route () {
        return {
            id: this.RouteID,
            uid: this.RouteUID,
            name: this.RouteName.Zh_tw,
        }
    }

    get direction () {
        // [0:'去程',1:'返程',2:'迴圈',255:'未知']
        return this.Direction
    }

    get position () {
        return new PointType(this.BusPosition)
    }

    get status () {
        const statusName = { 0: '正常', 1: '車禍', 2: '故障', 3: '塞車', 4: '緊急求援', 5: '加油', 90: '不明', 91: '去回不明', 98: '偏移路線', 99: '非營運狀態', 100: '客滿', 101: '包車出租', 255: '未知' }
        return statusName[this.BusStatus]
    }

    get updateTime () {
        return this.UpdateTime
    }
}

export class BusStopEstimatedTime extends BusStop {
    get estimateTime () {
        if (!this.EstimateTime) return null
        const date = new Date(new Date().getTime() + this.EstimateTime * 1000)
        return date.toLocaleTimeString('zh-TW', { hour12: false, timeStyle: 'short' })
    }

    get direction () {
        return this.Direction
    }
    // TODO
}

export class BusQuery {
    constructor (config) {
        this.config = Object.assign({
            top: PER_PAGE,
            page: 1,
        }, config)
        this.setPage(this.config.page)
    }

    async searchRouteInterCity (options) {
        const config = Object.assign({}, this.config, options)
        return (await getBusRouteInterCity(config))
            .map(item => new BusRoute(item))
    }

    async searchRouteByCity (queryCity, options) {
        const city = getCityParam(queryCity)
        if (!city) return new Error('city wrong')
        const config = Object.assign({}, this.config, options)
        return (await getBusRouteByCity(city, config))
            .map(item => new BusRoute(item))
    }

    async searchRouteByNearBy (keywords = '') {
        if (!this.config.position || !this.config.distance) return new Error('position wrong')
        const routeConfig = this.mergeRouteKeywordsConfig(this.config, keywords)
        return (await getBusRouteByNearBy(routeConfig))
            .map(item => new BusRoute(item))
            .filter((item, index, list) => { // 濾掉重複ID
                return list.findIndex((subFindItem) => (subFindItem.uid === item.uid)) === index
            })
    }

    async searchStationByNearBy () {
        if (!this.config.position || !this.config.distance) return new Error('position wrong')
        return (await getBusStationNearBy({
            ...this.config,
            top: 1000, // 範圍1000公尺內的站點不會太多
        }))
            .map(item => new BusStation(item))
    }

    // async getLength () {
    //     const config = Object.assign({}, this.config, {
    //         top: 10000,
    //         select: ['RouteUID'],
    //     })
    //     const { length } = await getBusRouteByCity(config)
    //     return length
    // }

    mergeStationKeywordsConfig (config, keywords) {
        const filter = keywords ? `contains(StationName/Zh_tw, '${keywords}') | contains(StationAddress, '${keywords}') | Stops/any(stop: contains(stop/StopName/Zh_tw, '${keywords}'))` : '(1 == 1)'
        return {
            ...config,
            filter: config.filter ? config.filter + ` and (${filter})` : filter,
        }
    }

    mergeRouteKeywordsConfig (config, keywords) {
        const filter = keywords ? `contains(RouteName/Zh_tw, '${keywords}') | contains(DestinationStopNameZh, '${keywords}') | contains(DepartureStopNameZh, '${keywords}')` : '(1 == 1)'
        return {
            ...config,
            filter: config.filter ? config.filter + ` and (${filter})` : filter,
        }
    }

    next () {
        this.page++
        this.setPage(this.page)
    }

    prev () {
        this.page = Math.max(1, this.page - 1)
        this.setPage(this.page)
    }

    setPage (page) {
        this.config.skip = PER_PAGE * (page - 1)
    }

    setPosition (position, distance = undefined) {
        this.config.position = position
        if (distance) this.config.distance = distance
    }
}
