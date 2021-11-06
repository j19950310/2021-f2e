<template>
    <div class="search-default">
        <input
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
    },
    emits: ['update:modelValue', 'focus', 'blur', 'submit'],
}
</script>
<style lang="scss">
    .search-default {
        padding: 16px 24px;
        background-color: color('White');
        border: 1px solid transparent;
        border-radius: 80px;
        @include typo-h3;

        input {
            display: block;
            width: 100%;
            caret-color: color('Primary');
            @include typo-h3;

            &::placeholder {
                color: color('Dark-Gray');
                transition: opacity 0.3s;
            }

            &:focus {
                &::placeholder {
                    opacity: 0.7;
                }
            }
        }
    }
</style>
