<template>
    <SearchDefault
        class="search-keywords"
        :class="className"
        :input-attrs="inputAttrs"
        @update:modelValue="$emit('update:modelValue', $event)"
        @submit="$emit('submit')"
        @focus="state = 'focus'"
        @blur="state = 'blur'"
    >
        <div
            class="search-keywords__clear"
            @click="$emit('update:modelValue', '')"
        >
            <Icon name="close-active" />
        </div>
    </SearchDefault>
</template>
<script>
export default {
    props: {
        inputAttrs: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'submit'],
    data () {
        return {
            state: '',
        }
    },
    computed: {
        className () {
            return {
                '-focus': this.state === 'focus',
            }
        },
    },
}
</script>
<style lang="scss">
    .search-keywords {
        position: relative;
        border-color: color('Black');

        input {
            padding-right: 20px;
        }

        input:placeholder-shown {
            & ~ .search-keywords__clear {
                opacity: 0%;
            }
        }

        &.-focus {
            border-color: color('Primary');
            box-shadow: inset 0 0 0 1px color('Primary');
        }

        &__clear {
            position: absolute;
            cursor: pointer;
            top: 0;
            bottom: 0;
            right: 5px;
            padding: 12.5px;
            font-size: 24px;
            opacity: 100%;
            transition: opacity 0.1s;

            .icon {
                transition: transform 0.2s ease-in-out;
            }

            &:hover {
                .icon {
                    transform: scale(1.05);
                }
            }

            &:active {
                .icon {
                    transform: scale(0.9);
                }
            }
        }
    }
</style>
