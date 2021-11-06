<template>
    <div
        class="button-third"
    >
        <Icon
            v-if="icon"
            class="button-third__icon"
            :name="icon"
        />
        <slot />
    </div>
</template>
<script>
export default {
    name: 'ButtonThird',
    props: {
        icon: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss">
.button-third {
    @include typo-h4;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    background-color: transparent;
    border: 2px solid color('Black');
    border-radius: 80px;
    transition:
        border-color 0.2s ease-in-out,
        background-color 0.2s ease-in-out,
        color 0.2s ease-in-out;
    cursor: pointer;

    .icon {
        margin-right: 4px;
        font-size: 24px;
        color: color('Black');
        opacity: 1;
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
