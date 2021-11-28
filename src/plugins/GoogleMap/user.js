import { detect } from 'detect-browser'

export default (google) => {
    if (google) {
        return class User extends google.maps.OverlayView {
            constructor ({ lat, lng }) {
                super()
                this.latlng = new google.maps.LatLng(lat, lng)
                this.deviceorientation = this.deviceorientation.bind(this)
            }

            requestDeviceOrientation () {
                const { os } = detect()
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                this.allowDeviceorientation = true
                                this.div.appendChild(this.direction)
                                if (os === 'iOS') {
                                    window.addEventListener('deviceorientation', this.deviceorientation)
                                }
                            }
                        })
                        .catch(console.error)
                    return
                }
                this.allowDeviceorientation = true
                this.div.appendChild(this.direction)
                window.addEventListener('deviceorientationabsolute', this.deviceorientation)
            }

            deviceorientation (e) {
                // https://stackoverflow.com/questions/40871669/js-html-detect-get-compass-heading-for-android
                const { beta: x, gamma: y, alpha: z } = e
                let absoluteHeading
                if (e.webkitCompassHeading) {
                    // ios
                    absoluteHeading = e.webkitCompassHeading
                } else {
                    // android
                    absoluteHeading = 180 - z
                }
                if (this.allowDeviceorientation) {
                    this.direction.style.transform = `translate(-50%, -50%) rotate(${absoluteHeading}deg)`
                }
            }

            onAdd () {
                this.div = document.createElement('div')
                this.div.style.position = 'absolute'
                this.div.style.width = '30px'
                this.div.style.height = '30px'
                this.div.style.background = '#ffffff'
                this.div.style.boxShadow = '3px 3px 8px rgba(0, 0, 0, 0.1)'
                this.div.style.borderRadius = '50%'

                const span = document.createElement('span')
                span.style.position = 'absolute'
                span.style.top = '50%'
                span.style.left = '50%'
                span.style.transform = 'translate(-50%, -50%)'
                span.style.width = '70%'
                span.style.height = '70%'
                span.style.background = '#32f3ae'
                span.style.borderRadius = '50%'
                this.div.appendChild(span)

                this.direction = document.createElement('div')
                this.direction.style.position = 'absolute'
                this.direction.style.top = '50%'
                this.direction.style.left = '50%'
                this.direction.style.transform = 'translate(-50%, -50%)'
                this.direction.style.width = '150%'
                this.direction.style.height = '350%'
                this.direction.style.background = `url('${new URL('../../assets/direction.png', import.meta.url).href}') no-repeat center / cover`
                this.direction.style.zIndex = '-1'

                const panes = this.getPanes()

                panes.overlayLayer.appendChild(this.div)

                this.requestDeviceOrientation()
            }

            draw () {
                if (this.div) {
                    const point = this.getProjection().fromLatLngToDivPixel(this.latlng)
                    if (point) {
                        this.div.style.left = `${point.x}px`
                        this.div.style.top = `${point.y}px`
                    }
                }
            }

            onRemove () {
                if (this.div) {
                    this.div.parentNode.removeChild(this.div)
                    this.div = null
                }
            }

            setPosition ({ lat, lng }) {
                this.latlng = new google.maps.LatLng(lat, lng)
            }

            getPosition () {
                return this.latlng
            }
        }
    }
}
