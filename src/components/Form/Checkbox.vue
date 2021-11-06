<template>
    <div class="form-checkbox">
        <input
            :id="id"
            type="checkbox"
            :name="name"
            :value="value"
            @input="$emit('update', $event.target.checked)"
        >
        <label
            :for="id"
        >{{ name }}</label>
        <Icon :name="'check-' + (value ? 'active' : 'default')" />
    </div>
</template>
<script>
export default {
    name: 'FornCheckbox',
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
        value: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update'],
}
</script>
<style lang="scss">
    .form-checkbox {
        position: relative;
        display: flex;
        align-items: center;
        padding: 2px;

        input {
            @include size(24px);

            margin: -2px 4px -2px 0;
            cursor: pointer;
        }

        label {
            cursor: pointer;
            user-select: none;
        }

        .icon {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 24px;
            pointer-events: none;
        }
    }
</style>
