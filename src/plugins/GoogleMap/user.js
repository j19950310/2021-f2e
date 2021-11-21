export default (google) => {
    if (google) {
        return class User extends google.maps.OverlayView {
            // TODO 方向
            constructor ({ lat, lng }) {
                super()
                this.latlng = new google.maps.LatLng(lat, lng)
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

                const panes = this.getPanes()

                panes.overlayLayer.appendChild(this.div)
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
