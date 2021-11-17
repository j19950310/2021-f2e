<template>
    <div
        class="button-min"
    >
        <slot />
        <Icon
            v-if="icon"
            class="button-min__icon"
            :name="icon"
        />
    </div>
</template>
<script>
export default {
    name: 'ButtonMin',
    props: {
        icon: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss">
.button-min {
    @include typo-min;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    background-color: transparent;
    border: 2px solid color('Black');
    border-radius: 40px;
    transition:
        border-color 0.2s ease-in-out,
        background-color 0.2s ease-in-out,
        color 0.2s ease-in-out;
    cursor: pointer;
    user-select: none;

    .icon {
        margin-left: 4px;
        font-size: 24px;
        color: color('Black');
        opacity: 100%;
        transition: color 0.2s ease-in-out, width 0.2s linear, opacity 0.2s 0.2s, margin 0.2s linear;
    }

    @include hover {
        color: color('White');
        background-color: color('Black');

        .icon {
            color: color('Primary');
        }
    }
}
</style>
