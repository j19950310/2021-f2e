<template>
    <!-- 大類別篩選 -->
    <div
        class="button-category"
        :class="className"
    >
        <slot />
        <Icon
            class="button-category__icon"
            name="confirmed"
        />
    </div>
</template>
<script>
export default {
    name: 'ButtonCategory',
    inheritAttrs: false,
    props: {
        active: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        className () {
            return {
                '-active': this.active,
                '-default': !this.active,
            }
        },
    },
}
</script>
<style lang="scss">
.button-category {
    @include typo-h4;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    min-width: 88px;
    border: 2px solid #2c2c2c;
    border-radius: 40px;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    margin-bottom: 1rem;
    cursor: pointer;
    @include hover {
        background-color: color('Primary');
        border-color: color('Primary');

        .icon {
            color: color('Primary');
        }
    }

    &.-active {
        background-color: color('Primary');
        border-color: color('Primary');

        .icon {
            color: color('Primary');
        }
    }

    &.-default > .icon {
        margin: 0;
        width: 0;
        opacity: 0;
        transition: color 0.2s ease-in-out, width 0.2s linear 0.2s, opacity 0.2s, margin 0.2s linear 0.2s;
    }

    .icon {
        margin-left: 4px;
        font-size: 24px;
        color: color('White');
        opacity: 1;
        transition: color 0.2s ease-in-out, width 0.2s linear, opacity 0.2s 0.2s, margin 0.2s linear;
    }
}
</style>
