<template>
    <div
        class="button-category"
        :class="className"
        @click="onClick"
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
        focus: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['click'],
    computed: {
        className () {
            return {
                '-active': this.active,
                '-default': !this.active,
                '-focus': this.focus,
            }
        },
    },
    methods: {
        onClick () {
            this.$emit('click')
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
    white-space: nowrap;
    border: 2px solid #2c2c2c;
    border-radius: 40px;
    transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    cursor: pointer;
    user-select: none;
    @include hover {
        background-color: color('Primary');
        border-color: color('Primary');

        .icon {
            color: color('Primary');
        }
    }

    &.-focus {
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
        opacity: 0%;
        transition: color 0.15s ease-in-out, width 0.15s linear 0.15s, opacity 0.15s, margin 0.15s linear 0.15s;
    }

    .icon {
        margin-left: 4px;
        font-size: 24px;
        color: color('White');
        opacity: 100%;
        transition: color 0.15s ease-in-out, width 0.15s linear, opacity 0.15s 0.15s, margin 0.15s linear;
    }
}
</style>
