/**
 * 轉譯API格式至自訂與Google Map API格式
 */
export default class PointType {
    constructor (config) {
        const {
            GeoHash: hash,
            PositionLat: lat,
            PositionLon: lng,
        } = config
        Object.assign(this, { lat, lng, hash })
    }

    get empty () {
        return !this.lat && !this.lng && !this.hash
    }
}
