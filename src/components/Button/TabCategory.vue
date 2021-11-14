<template>
    <div
        class="button-tab-category"
        :class="className"
        @click="$emit('click')"
    >
        <div class="button-tab-category__main">
            <p
                class="button-tab-category__name"
                v-text="name"
            />
            <p
                class="button-tab-category__num"
                v-text="numberFormatted"
            />
        </div>
    </div>
</template>
<script>
function numberWithCommas (x) {
    if (typeof x === 'number') {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return x
}
export default {
    name: 'TabCategory',
    props: {
        name: {
            type: String,
            default: '',
        },
        number: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['click'],
    computed: {
        numberFormatted () {
            return numberWithCommas(this.number > 9999 ? '9,999+' : this.number)
        },
        className () {
            return { '-active': this.active }
        },
    },
    methods: {
    },
}
</script>
<style lang="scss">
    $class-name: '.button-tab-category';
    #{$class-name} {
        border-bottom: 4px solid #383838;
        cursor: pointer;
        transition: border-bottom 0.2s ease-in-out;

        &__main {
            display: flex;
            align-items: flex-start;
            justify-content: center;
        }

        &__name {
            @include typo-h2;
        }

        &__num {
            @include typo('EN/D/Minimal_12px_Semi-Bold');

            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;
            padding: 4px;
            min-width: 24px;
            min-height: 24px;
            color: color('White');
            background-color: color('Primary');
            border-radius: 80px;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

            #{$class-name}.-active & {
                color: color('Black');
                background-color: color('Primary');
            }
        }

        @include hover {
            border-bottom-color: color('Primary');
        }

        &.-active {
            border-bottom-color: color('Primary');
        }
    }
</style>
