
export default class PointType {
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
