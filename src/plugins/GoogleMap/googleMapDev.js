import GoogleMap from './googleMap'

export default class GoogleMapDev extends GoogleMap {
    constructor (el, options) {
        super(el, options)
        this.onEvents.init = () => {
            // 初始化 Class
            this.customPolylineOuter = new this.googleMap.Polyline({
                path: [],
                geodesic: true,
                strokeColor: '#00A67E',
                strokeOpacity: 1.0,
                strokeWeight: 14,
            })
            this.customPolylineInner = new this.googleMap.Polyline({
                path: [],
                geodesic: true,
                strokeColor: '#32F3AE',
                strokeOpacity: 1.0,
                strokeWeight: 10,
            })
        }
    }

    drawCustomPolyline (path) {
        this.customPolylineOuter.setPath(path)
        this.customPolylineInner.setPath(path)
        this.customPolylineOuter.setMap(this.mapInstance)
        this.customPolylineInner.setMap(this.mapInstance)
    }
}
