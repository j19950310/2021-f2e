import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

export default {
    created (el, { value, ...args }) {
        if (value) {
            disableBodyScroll(el, {
                reserveScrollBarGap: true,
            })
        }
    },
    updated (el, { value, ...args }) {
        if (value) {
            disableBodyScroll(el, {
                reserveScrollBarGap: true,
            })
            return
        }
        enableBodyScroll(el)
    },
    beforeUnmount (el) {
        enableBodyScroll(el)
    },
}
