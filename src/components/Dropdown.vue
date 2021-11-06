<template>
    <div
        class="dropdown"
        :class="className"
    >
        <div
            class="dropdown__title"
            @click="active = !active"
        >
            {{ title }}
            <Icon name="down" />
        </div>
        <div
            ref="body"
            class="dropdown__content"
        >
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    inject: ['gsap'],
    props: {
        title: {
            type: String,
            default: '',
        },
        default: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            active: this.default,
        }
    },
    computed: {
        className () {
            return {
                '-active': this.active,
                '-default': !this.active,
            }
        },
    },
    watch: {
        active (value) {
            this.toggle(value)
        },
    },
    mounted () {
        this.toggle(this.active)
    },
    methods: {
        toggle (isActive) {
            if (isActive) {
                this.gsap.to(this.$refs.body, {
                    height: 'auto',
                })
            } else {
                this.gsap.to(this.$refs.body, {
                    height: 0,
                })
            }
        },
    },
}
</script>
<style lang="scss">
    $class-name : '.dropdown';
    #{$class-name} {
        position: relative;
        display: inline-block;
        width: 100%;

        &__title {
            display: block;
            cursor: pointer;
            @include typo-h2();

            border-bottom: 1px solid #2c2c2c;
            padding-bottom: 8px;
            transition: border-bottom-color 0.3s ease;

            @include hover {
                border-bottom-color: color('Primary');
            }

            #{$class-name}.-active & {
                border-bottom-width: 2px;
                border-bottom-color: color('Primary');

                .icon {
                    transform: rotate(180deg) translateY(-4px);
                }
            }

            .icon {
                margin-left: 16px;
                font-size: 24px;
                transform: rotate(0deg) translateY(4px);
                transition: transform 0.3s ease;
            }
        }

        &__content {
            overflow: hidden;
        }

        &:not(.-active) {
            #{$class-name}__content {
                height: 0;
            }
        }
    }
</style>
