export default class {
    constructor (el, options) {
        this.options = {
            clear: true,
            autoRender: true,
            drawingMode: 'center',
            defaultResources: [],
            ...options,
        }
        this.reqRenders = []
        this.resources = []
        this.onEvents = {}
        this.render = this.render.bind(this)
        this.resize = this.resize.bind(this)

        if (el instanceof Element) {
            this.el = el
            const { width, height, dpr } = this.viewport
            this.canvas = document.createElement('canvas')
            this.canvas.width = width * dpr
            this.canvas.height = height * dpr
            this.ctx = this.canvas.getContext('2d')
        }
    }

    async init () {
        await Promise.allSettled([this.loadDefaultResources()])
        if (this.el) {
            this.el.appendChild(this.canvas)

            if (this.options.autoRender) {
                this.render()
            }

            window.addEventListener('resize', this.resize)
        }
    }

    async loadDefaultResources () {
        return await this.addResources(this.options.defaultResources)
    }

    async addResource (payload) {
        let { type, src, name, options } = payload

        if (!src.match(/^(http|https):\/\//)) {
            src = require(`@/assets/${src}`)
        }

        const resource = {
            type,
            name: name || src,
            resource: null,
        }
        if (type === 'image') {
            const data = await this.loadImage(src, options)
            resource.resource = data
        }

        return resource
    }

    async addResources (payload) {
        const promises = payload.map(resource => this.addResource(resource))

        return await Promise.allSettled(promises).then((results) => {
            results.forEach(({ status, value }) => {
                if (value) {
                    this.resources.push(value)
                }
            })
        })
    }

    getResource = (() => {
        const memo = {}
        return (string, type = 'name') => {
            if (memo[string]) return memo[string]
            const target = this.resources.find(resource => resource[type] === string)
            memo[string] = target
            return target
        }
    })()

    getResources (payload, type = 'name') {
        if (typeof payload === 'function') {
            return this.resources.filter(payload)
        }
        return this.resources.filter(resource => resource[type] === payload)
    }

    loadImage (url) {
        const image = new Image()
        image.src = url
        return new Promise((resolve) => {
            image.onload = () => {
                resolve(image)
            }
        })
    }

    render () {
        this.reqID = window.requestAnimationFrame(this.render)
        this.update()
    }

    update () {
        const { width, halfWidth, height, halfHeight, dpr } = this.viewport
        const { clear, drawingMode } = this.options

        if (clear) {
            this.ctx.clearRect(0, 0, width * dpr, height * dpr)
        }
        this.ctx.save()
        if (drawingMode === 'center') {
            this.ctx.translate(halfWidth * dpr, halfHeight * dpr)
        }
        this.ctx.scale(dpr, dpr)
        for (let i = 0; i < this.reqRenders.length; i++) {
            this.reqRenders[i](this.reqID)
        }
        this.ctx.restore()
    }

    resize () {
        const { width, height, dpr } = this.viewport
        this.canvas.width = width * dpr
        this.canvas.height = height * dpr
    }

    stop () {
        window.cancelAnimationFrame(this.reqID)
    }

    destroy () {
        this.stop()
        if (this.el) {
            this.el.removeChild(this.canvas)

            window.removeEventListener('resize', this.resize)
        }
    }

    on (name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
            this.onEvents[name] = callback
        }
    }

    get viewport () {
        const dpr = Math.min(window.devicePixelRatio, 1.5)
        const { width, height } = this.el.getBoundingClientRect()
        return {
            width,
            height,
            halfWidth: width / 2,
            halfHeight: height / 2,
            aspect: width / height,
            dpr,
        }
    }
}
