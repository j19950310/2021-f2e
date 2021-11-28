import { Loader } from '@googlemaps/js-api-loader'
import getUserMark from './user'
const apiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
const mapId = import.meta.env.VITE_APP_GOOGLE_MAP_STYLE_ID

const queryMarkers = []
const filterMarkers = []
let currentPath = null
let pathStartMarker = null
let pathEndMarker = null
export default class GoogleMap {
    constructor (el, options) {
        if (!(el instanceof Element)) return
        this.el = el
        this.options = {
            mapId,
            center: {
                lat: 23.973875,
                lng: 120.982024,
            },
            zoom: 8,
            minZoom: 8,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            ...options,
        }
        this.onEvents = {}
        this.agreeGeolocation = false
        this.boundsChanged = this.boundsChanged.bind(this)
        this.userLocationChange = this.userLocationChange.bind(this)

        const loader = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['places', 'geometry'],
        })
        loader.load()
            .then((google) => {
                this.google = google
                this.googleMap = google.maps
                this.mapInstance = new google.maps.Map(this.el, this.options)
                this.mapInstance.addListener('idle', this.boundsChanged)
                this.geocoder = new google.maps.Geocoder()
                this.placesInstance = new google.maps.places.PlacesService(this.mapInstance)
                this.autocompleteInstance = new google.maps.places.AutocompleteService()
                this.currentMarker = null
                this.onEvents.init?.()

                // this.requestUserLocation()
            })
            .catch(err => {
                console.log(err)
            })
    }

    boundsChanged () {
        const { lat, lng } = this.mapInstance.center

        const [minBound] = this.radius
        this.onEvents.boundsChanged?.({
            lat: lat(),
            lng: lng(),
            radius: minBound,
        }, this.mapInstance, this.googleMap)
    }

    requestUserLocation () {
        const User = getUserMark(this.google)

        this.getUserLocation()
            .then((e) => {
                this.userLocationMark = new User(this.options.center)
                this.userLocationMark.setMap(this.mapInstance)
                this.setZoom(17)
                this.userLocationChange(e)
                this.moveMapToPlace(this.userLocationMark.getPosition())
                this.onEvents.allowUserLocation?.()
            })
            .catch(() => {
                this.onEvents.denyUserLocation?.()
            })
            .finally(() => {
                setTimeout(() => {
                    this.onEvents.requestUserLocation?.()
                }, 1000)
            })
    }

    getUserLocation () {
        if (this.agreeGeolocation) return
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                console.log(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(
                    (e) => {
                        this.agreeGeolocation = true
                        navigator.geolocation.watchPosition(this.userLocationChange, (err) => {
                            reject(err)
                        })
                        resolve(e)
                    },
                    (err) => {
                        reject(err)
                    }
                )
                return
            }
            reject(new Error('FAIL'))
        })
    }

    userLocationChange ({ coords: { latitude: lat, longitude: lng } }) {
        if (this.userLocationMark) {
            this.userLocationMark.setPosition({ lat, lng })
            this.onEvents.onUserLocationChanged?.(this.userLocationMark.getPosition())
        }
    }

    moveMapToPlace (center, radius) {
        const [minBound] = this.radius

        if (center) {
            this.mapInstance.fitBounds(
                new this.googleMap.Circle({ center, radius: radius / 2 || minBound / 2 }).getBounds()
            )
        }
    }

    setZoom (zoom) {
        if (zoom) {
            return this.mapInstance.setZoom(zoom)
        }
    }

    getLocationInformation (requests) {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({
                location: this.mapInstance.getCenter(),
                ...requests,
            }, (results, status) => {
                if (status === 'OK') {
                    resolve(results)
                    return
                }
                resolve([])
            })
        })
    }

    getPlaceDetail (placeId, requests) {
        return new Promise((resolve, reject) => {
            this.placesInstance.getDetails({
                placeId,
                ...requests,
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result)
                    return
                }
                resolve([])
            })
        })
    }

    getPlacePredictions (query, requests) {
        return new Promise((resolve, reject) => {
            this.autocompleteInstance.getPlacePredictions({
                input: query,
                bounds: this.mapInstance.getBounds(),
                ...requests,
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result)
                    return
                }
                resolve([])
            })
        })
    }

    textSearch (query, requests) {
        const [minBound] = this.radius

        return new Promise((resolve, reject) => {
            this.placesInstance.textSearch({
                location: this.mapInstance.getCenter(),
                radius: minBound,
                // bounds: this.mapInstance.getBounds(),
                ...requests,
                query,
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result)
                    return
                }
                resolve([])
            })
        })
    }

    nearbySearch (query, requests) {
        return new Promise((resolve, reject) => {
            this.placesInstance.nearbySearch({
                location: this.mapInstance.getCenter(),
                bounds: this.mapInstance.getBounds(),
                ...requests,
                query,
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result)
                    return
                }
                resolve([])
            })
        })
    }

    findPlaceFromQuery (query, requests) {
        return new Promise((resolve, reject) => {
            this.placesInstance.findPlaceFromQuery({
                fields: ['name', 'geometry', 'place_id', 'types'],
                ...requests,
                query,
            }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result)
                    return
                }
                resolve([])
            })
        })
    }

    generateMarker (data, options) {
        const marker = new google.maps.Marker({
            ...options,
        })
        marker.markerData = data
        marker.addListener('click', () => {
            this.onEvents.markerClicked?.(marker)
        })
        return marker
    }

    setFilterMarkers (payload, onDraw = true) {
        if (this.mapInstance && payload) {
            if (Array.isArray(payload)) {
                for (let i = 0, len = payload.length; i < len; i++) {
                    const marker = payload[i]
                    if (onDraw) {
                        marker.setMap(this.mapInstance)
                    }
                    filterMarkers.push(marker)
                }
                return
            }
            if (onDraw) {
                payload.setMap(this.mapInstance)
            }
            filterMarkers.push(payload)
        }
    }

    clearFilterMarkers () {
        while (filterMarkers.length) {
            let marker = filterMarkers.pop()
            marker.setMap(null)
            marker = null
        }
    }

    findFilterMarker (callback) {
        if (this.mapInstance) {
            return filterMarkers.find(callback)
        }
    }

    setQueryMarkers (payload, onDraw = true) {
        if (this.mapInstance && payload) {
            if (Array.isArray(payload)) {
                for (let i = 0, len = payload.length; i < len; i++) {
                    const marker = payload[i]
                    if (onDraw) {
                        marker.setMap(this.mapInstance)
                    }
                    queryMarkers.push(marker)
                }
                return
            }
            if (onDraw) {
                payload.setMap(this.mapInstance)
            }
            queryMarkers.push(payload)
        }
    }

    clearQueryMarkers () {
        while (queryMarkers.length) {
            let marker = queryMarkers.pop()
            marker.setMap(null)
            marker = null
        }
    }

    setActivateMarker (marker) {
        if (marker) {
            if (this.currentMarker) {
                this.onEvents.markerDeActivated?.(this.currentMarker)
            }
            this.currentMarker = marker
            this.onEvents.markerActivated?.(this.currentMarker)
        }
    }

    setPathStartMarker (marker) {
        if (marker) {
            this.clearPathStartMarker()
            pathStartMarker = marker
            pathStartMarker.setMap(this.mapInstance)
        }
    }

    clearPathStartMarker () {
        if (pathStartMarker) {
            pathStartMarker.setMap(null)
        }
    }

    setPathEndMarker (marker) {
        if (marker) {
            this.clearPathEndMarker()
            pathEndMarker = marker
            pathEndMarker.setMap(this.mapInstance)
        }
    }

    clearPathEndMarker () {
        if (pathEndMarker) {
            pathEndMarker.setMap(null)
        }
    }

    setActivatePath (coordinates) {
        if (coordinates) {
            this.clearActivatePath()
            currentPath = new this.googleMap.Polyline({
                path: coordinates,
                strokeColor: '#32F3AE',
                strokeWeight: 8,
            })
            currentPath.setMap(this.mapInstance)
        }
    }

    clearActivatePath () {
        if (currentPath) {
            currentPath.setMap(null)
        }
    }

    clearAllMapMarkers () {
        this.clearFilterMarkers()
        this.clearQueryMarkers()
        this.clearPathStartMarker()
        this.clearPathEndMarker()
        this.clearActivatePath()
    }

    calcLineDistance (l1, l2) {
        if (l1 && l2) {
            return this.googleMap.geometry.spherical.computeDistanceBetween(l1, l2)
        }
        return 0
    }

    on (name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
            this.onEvents[name] = callback
        }
    }

    get radius () {
        if (this.mapInstance) {
            const bounds = this.mapInstance.getBounds()
            if (bounds) {
                const ne = bounds.getNorthEast()
                const sw = bounds.getSouthWest()
                const l1 = new google.maps.LatLng(ne.lat(), sw.lng())
                const l2 = new google.maps.LatLng(sw.lat(), ne.lng())
                const width = this.googleMap.geometry.spherical.computeDistanceBetween(ne, l2)
                const height = this.googleMap.geometry.spherical.computeDistanceBetween(ne, l1)
                return [Math.min(width, height) / 2, Math.max(width, height) / 2]
            }
            return [0, 0]
        }
        return [0, 0]
    }
}
