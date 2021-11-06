<template>
    <!-- 主要按鈕模板 -->
    <div
        class="button-main"
    >
        <slot />
        <Icon
            v-if="icon"
            class="button-main__icon"
            :name="icon"
        />
    </div>
</template>
<script>
export default {
    name: 'ButtonMain',
    props: {
        icon: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss">
.button-main {
    @include typo-h3;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 30px;
    min-width: 160px;
    border-radius: 40px;
    transition:
        border-color 0.2s ease-in-out,
        background-color 0.2s ease-in-out,
        color 0.2s ease-in-out;
    cursor: pointer;

    .icon {
        margin-left: 12px;
        font-size: 24px;
        opacity: 1;
        transition: color 0.2s ease-in-out, width 0.2s linear, opacity 0.2s 0.2s, margin 0.2s linear;
    }
}
</style>
