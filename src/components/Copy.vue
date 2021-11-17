<script setup>
const props = defineProps({
    text: {
        type: String,
        default: null,
    },
})
const emit = defineEmits(['on-copy'])
const isiOS = () => navigator.userAgent.match(/ipad|iphone/i)

const copy = () => {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.value = props.text || window.location.href

    if (isiOS()) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(textarea)
        selection.removeAllRanges()
        selection.addRange(range)
        textarea.setSelectionRange(0, 999999)
    } else textarea.select()

    document.execCommand('copy')
    document.body.removeChild(textarea)
    emit('on-copy')
}
</script>

<template>
    <div
        class="copy"
        @click="copy"
    >
        <Icon name="copy" />
    </div>
</template>

<style lang="scss">
.copy {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: $padding;
    justify-self: center;
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color: var(--primary, color('Primary'));
        }
    }
}
</style>
