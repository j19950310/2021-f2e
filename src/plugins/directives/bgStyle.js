export default {
    created (el, binding) {
        const { contain, transparent } = binding.modifiers
        const color = transparent ? '' : '#f8f8f8'
        const value = binding.value
        const size = contain ? 'contain' : 'cover'

        if (value) {
            el.setAttribute('data-background', '')
            el.style.background = `${color} url('${value}') no-repeat center / ${size}`
        }
    },
}
