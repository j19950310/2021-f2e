import { Vector2 } from 'three'
import gsap from 'gsap'
import Sketch from './sketch'

export default class extends Sketch {
    constructor (el, options) {
        super(el)
        if (el instanceof Element) {
            this.options = {
                mode: 'default',
                ...this.options,
                ...options,
            }
            this.params = {
                size: 24,
                scale: 1.15,
            }
            const { size } = this.params
            this.size = size
            this.mouse = new Vector2()
            this.lerpMouse = new Vector2()
            this.isHover = false
            this.mousemove = this.mousemove.bind(this)
        }
    }

    async init () {
        await super.init()

        this.draw()
        window.addEventListener('mousemove', this.mousemove)
    }

    mousemove ({ clientX, clientY }) {
        const { width, height } = this.viewport
        const x = (clientX / width) * 2 - 1
        const y = (clientY / height) * 2 - 1
        this.mouse.set(x, y)

        const pointEl = document.elementFromPoint(clientX, clientY)
        if (pointEl) {
            const { tagName, dataset } = pointEl
            if (dataset.cursor !== undefined || tagName === 'A' || tagName === 'BUTTON') {
                if (!this.isHover) {
                    this.hoverEffect()
                }
                return
            }
        }
        if (this.isHover) {
            this.blurEffect()
        }
    }

    draw () {
        this.reqRenders.push((t) => {
            const { width, height } = this.viewport
            const { x, y } = this.mouse
            const { x: lx, y: ly } = this.lerpMouse

            this.ctx.save()

            this.ctx.translate((x * width) / 2, (y * height) / 2)
            this.ctx.beginPath()
            this.ctx.arc(0, 0, 4, 0, 2 * Math.PI)
            this.ctx.fill()

            this.ctx.restore()

            this.ctx.save()

            this.ctx.translate((lx * width) / 2, (ly * height) / 2)
            this.ctx.beginPath()
            const diff = this.lerpMouse.distanceTo(this.mouse) + 1
            const angle = Math.atan2(ly - y, lx - x)
            this.ctx.rotate(angle)
            this.ctx.ellipse(0, 0, this.size * diff, this.size, 0, 0, 2 * Math.PI)
            this.ctx.stroke()

            this.ctx.restore()

            this.lerpMouse.lerpVectors(this.lerpMouse, this.mouse, 0.1)
        })
    }

    destroy () {
        super.destroy()

        window.removeEventListener('mousemove', this.mousemove)
    }

    hoverEffect () {
        if (!this.isHover) {
            const { size, scale } = this.params
            gsap.to(this, {
                size: size * scale,
            })
            this.isHover = true
        }
    }

    blurEffect () {
        if (this.isHover) {
            const { size } = this.params
            gsap.to(this, {
                size,
            })
            this.isHover = false
        }
    }
}
