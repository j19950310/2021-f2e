<template>
    <div class="search-default">
        <input
            v-bind="inputAttrs"
            :value="modelValue"
            type="text"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
            @keyup.enter="$emit('submit')"
        >
        <slot />
    </div>
</template>
<script>
export default {
    name: 'SearchDefault',
    props: {
        placeholder: {
            type: String,
            default: '請輸入...',
        },
        modelValue: {
            type: String,
            default: '',
        },
        inputAttrs: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'focus', 'blur', 'submit'],
}
</script>
<style lang="scss">
    .search-default {
        padding-right: 24px;
        background-color: color('White');
        border: 1px solid transparent;
        border-radius: 80px;
        @include typo-h3;

        input {
            @include typo-h3;

            display: block;
            padding: 16px 24px;
            width: 100%;
            background-color: transparent;
            caret-color: color('Primary');
            @include media-breakpoint-down(tablet) {
                padding: $padding * 1.5 $padding * 2;
            }

            &::placeholder {
                color: color('Dark-Gray');
                transition: opacity 0.3s;
            }

            &:focus {
                &::placeholder {
                    opacity: 70%;
                }
            }
        }
    }
</style>
