<template>
    <SearchDefault
        class="search-filter"
        :class="className"
        :placeholder="placeholder"
        @update:modelValue="$emit('update:modelValue', $event)"
        @submit="submit"
        @focus="setFocus"
        @blur="setBlur"
        @mousedown="setFocus"
    >
        <div
            class="search-filter__functions"
        >
            <!-- Search -->
            <div
                class="search-filter__functions-item"
                tabindex="0"
                @blur="setBlur"
                @focus="setFocus"
                @click="submit"
            >
                <Icon name="search" />
            </div>
            <!-- Filter -->
            <!-- TODO: filter -->
            <div
                class="search-filter__functions-item"
                tabindex="0"
                @blur="setBlur"
                @focus="setFocus"
                @click="$emit('click', 'filter')"
            >
                <Icon name="filter" />
            </div>
            <!-- Suffle -->
            <!-- TODO: Suffle -->
            <div
                class="search-filter__functions-item"
                tabindex="0"
                @blur="setBlur"
                @focus="setFocus"
                @click="$emit('click', 'shuffle')"
            >
                <Icon name="shuffle" />
            </div>
        </div>
    </SearchDefault>
</template>
<script>
export default {
    emits: ['update:modelValue', 'submit', 'click', 'focus', 'blur'],
    data () {
        return {
            state: '',
            warn: false,
        }
    },
    computed: {
        className () {
            return {
                '-focus': this.state === 'focus',
                '-warn': !!this.warn,
            }
        },
        placeholder () {
            return this.warn || '輸入關鍵字'
        },
    },
    methods: {
        setFocus () {
            this.state = 'focus'
            this.$emit('focus')
        },
        setBlur () {
            this.state = ''
            this.$emit('blur')
        },
        submit () {
            if (this.$attrs.modelValue) {
                this.$emit('submit')
            } else { // require input
                this.warn = '請先輸入關鍵字'
                setTimeout(() => {
                    this.warn = false
                }, 1000)
            }
        },
    },
}
</script>
<style lang="scss">
.search-filter {
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: 0 0 24px 0 #0000001a;

    input:placeholder-shown {
        & ~ .search-filter__clear {
            opacity: 0;
        }
    }

    &.-focus {
        border-color: color('Primary');
        box-shadow: inset 0 0 0 1px color('Primary');
    }

    &.-warn {
        border-color: color('Alert');
        box-shadow: inset 0 0 0 1px color('Alert');

        input {
            caret-color: color('Alert');

            &::placeholder {
                color: color('Alert');
            }
        }
    }

    &__functions {
        display: flex;
        margin: -10px 0;
        opacity: 1;
        transition: opacity 0.1s;
        flex-shrink: 0;

        &-item {
            $box-size: 40px;
            $icon-size: 24px;
            @include size($box-size);

            margin-left: 8px;
            padding: ($box-size - $icon-size) / 2;
            background-color: color('Black');
            border-radius: 80px;
            transition: background-color 0.3s;
            cursor: pointer;

            .icon {
                font-size: $icon-size;
                color: color('Primary');
                transition: transform 0.3s ease-in-out, color 0.3s;
            }

            &:hover {
                .icon {
                    transform: scale(1.1);
                }
            }

            // &:active {
            //     .icon {
            //         transform: scale(0.9);
            //     }
            // }

            &:active,&:focus {
                background-color: color('Primary');

                .icon {
                    color: color('Black');
                    transform: scale(1);
                }
            }
        }
    }
}
</style>
