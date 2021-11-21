<template>
    <div class="search-default">
        <input
            v-bind="inputAttrs"
            :value="modelValue"
            type="text"
            :placeholder="placeholder"
            @input="input"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
            @keyup.enter="submit"
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
    data () {
        return {
            isComposing: false,
        }
    },
    methods: {
        input (e) {
            this.$emit('update:modelValue', e.target.value)
            this.isComposing = e.isComposing
        },
        submit () {
            if (this.isComposing) {
                this.isComposing = false
                return
            }
            this.$emit('submit')
        },
    },
}
</script>
<style lang="scss">
.search-default {
    @include typo-h3;

    display: flex;
    align-items: center;
    padding-right: 24px;
    background-color: color('White');
    border: 1px solid transparent;
    border-radius: 80px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 10%);

    input {
        @include typo-h3;

        padding: 16px 24px;
        width: 100%;
        background-color: transparent;
        flex: 1 1 auto;
        caret-color: var(--primary, color('Primary'));
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
