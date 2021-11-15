import PointType from '@/api/PointType'

export class BikeAvailability {
    constructor (config, station = null) {
        Object.assign(this, config)

        if (station && station instanceof BikeStation) {
            this.isStation = true
            this.station = station
        } else if (station) {
            this.isStation = true
            this.registerStation(station)
        } else {
            this.isStation = false
        }
    }

    registerStation (station) {
        if (this.isStation) return
        this.station = new BikeStation(station, this)
    }

    get status () {
        return this.ServiceStatus
    }

    get statusDesc () {
        const desc = ['停止營運', '正常營運', '暫停營運']
        return desc[this.status]
    }

    get numOfRent () {
        return this.AvailableRentBikes
    }

    get numOfReturn () {
        return this.AvailableReturnBikes
    }

    get ableRent () {
        return this.AvailableRentBikes > 0
    }

    get ableReturn () {
        return this.AvailableReturnBikes > 0
    }
}

export class BikeStation {
    constructor (config, availability = null) {
        Object.assign(this, config)
        this.defaultLanguage = 'zh'

        if (availability && availability instanceof BikeAvailability) {
            this.isAvailability = true
            this.availability = availability
        } else if (availability) {
            this.isAvailability = true
            this.registerAvailability(availability)
        } else {
            this.isAvailability = false
        }
    }

    getDefaultLangValueByKey (key) {
        const { Zh_tw: zh, En: en } = this[key]
        return this.defaultLanguage === 'zh' ? (zh || en) : (en || zh)
    }

    registerAvailability (availability) {
        if (this.isAvailability) return
        this.availability = new BikeAvailability(availability, this)
    }

    get isInfo () {
        return !!this.availability
    }

    get id () {
        return this.StationUID
    }

    get name () {
        return this.getDefaultLangValueByKey('StationName')
    }

    get position () {
        return new PointType(this.StationPosition)
    }

    get address () {
        return this.getDefaultLangValueByKey('StationAddress')
    }

    get version () {
        return +this.ServiceType
    }

    get service () {
        if (this.version === 1) {
            return 'YouBike1.0'
        } else if (this.version === 2) {
            return 'YouBike2.0'
        } else {
            return '無'
        }
    }
}
