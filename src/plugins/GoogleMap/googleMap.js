import { Loader } from '@googlemaps/js-api-loader'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import getUserMark from './user'
const apiKey = import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
const mapId = import.meta.env.VITE_APP_GOOGLE_MAP_STYLE_ID

const queryMarkers = []
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
                const User = getUserMark(google)
                this.googleMap = google.maps
                this.mapInstance = new google.maps.Map(this.el, this.options)
                this.mapInstance.addListener('idle', this.boundsChanged)
                this.placesInstance = new google.maps.places.PlacesService(this.mapInstance)
                this.autocompleteInstance = new google.maps.places.AutocompleteService()
                this.markerCluster = new MarkerClusterer({ map: this.mapInstance })
                this.userLocationMark = new User(this.options.center)
                this.currentMarker = null

                if (navigator.geolocation) {
                    this.getUserLocation(() => {
                        this.userLocationMark.setMap(this.mapInstance)
                        this.setZoom(17)
                        this.onEvents.init?.()
                    }, () => {
                        this.onEvents.init?.()
                    })
                    navigator.geolocation.watchPosition(this.userLocationChange, (err) => {
                        console.log(err)
                    })
                } else {
                    this.onEvents.init?.()
                }
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

    getUserLocation (callback, errCallback) {
        if (this.agreeGeolocation) {
            callback?.()
            this.moveMapToPlace(this.userLocationMark.getPosition())
            return
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (e) => {
                    this.agreeGeolocation = true
                    callback?.()
                    this.userLocationChange(e)
                    this.moveMapToPlace(this.userLocationMark.getPosition())
                },
                (err) => {
                    console.log(err)
                    errCallback?.()
                }
            )
        }
    }

    userLocationChange ({ coords: { latitude: lat, longitude: lng } }) {
        if (this.userLocationMark) {
            this.userLocationMark.setPosition({ lat, lng })
            this.onEvents.onUserLocationChanged?.(this.userLocationMark.getPosition())
        }
    }

    searchQuery (value) {
        if (value) {
            return new Promise(resolve => {
                this.autocompleteInstance.getPlacePredictions({
                    input: value,
                    bounds: this.mapInstance.getBounds(),
                }, (e) => {
                    resolve(e || [])
                })
            })
        }
    }

    async searchPlace (query, options) {
        const [minBound] = this.radius
        return await Promise.all([
            new Promise(resolve => {
                this.placesInstance.textSearch({
                    location: this.mapInstance.getCenter(),
                    radius: minBound,
                    ...options,
                    query,
                }, (result) => resolve(result || []))
            }),
            new Promise(resolve => {
                this.placesInstance.nearbySearch({
                    location: this.mapInstance.getCenter(),
                    radius: minBound,
                    ...options,
                    query,
                }, (result) => resolve(result || []))
            }),
            new Promise(resolve => {
                this.placesInstance.findPlaceFromQuery({
                    fields: ['name', 'geometry', 'place_id', 'types'],
                    query,
                }, (result) => resolve(result || []))
            }),
        ]).then(results => results.flat())
    }

    searchPlaceDetail (placeId, options) {
        if (placeId) {
            return new Promise(resolve => {
                this.placesInstance.getDetails({
                    placeId,
                    ...options,
                }, (e) => {
                    resolve(e || [])
                })
            })
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

    setQueryMarker (options) {
        if (this.mapInstance) {
            queryMarkers.push(new google.maps.Marker({
                map: this.mapInstance,
                animation: google.maps.Animation.DROP,
                ...options,
            }))
        }
    }

    removeQueryMarker () {
        while (queryMarkers.length) {
            let marker = queryMarkers.pop()
            marker.setMap(null)
            marker = null
        }
    }

    setClusterMarker (markerData, options) {
        if (this.markerCluster) {
            const marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                ...options,
            })
            marker.markerData = markerData
            marker.addListener('click', () => {
                this.onEvents.markerClicked?.(marker)
                this.setActivateMarker(marker)
            })
            this.markerCluster.addMarker(marker, true)
        }
    }

    clearClusterMarker () {
        if (this.markerCluster) {
            this.markerCluster.clearMarkers(true)
        }
    }

    findClusterMarker (callback) {
        if (this.markerCluster) {
            return this.markerCluster.markers.find(callback)
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

    setZoom (zoom) {
        if (zoom) {
            return this.mapInstance.setZoom(zoom)
        }
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
