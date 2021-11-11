<script setup>
defineProps({
    name: {
        type: String,
        default: null,
    },
})
</script>

<template>
    <div class="tag">
        {{ name }}
    </div>
</template>

<style lang="scss">
.tag {
    @include typo-min;

    display: flex;
    align-items: center;

    &::before {
        @include size(8px);

        content: '';
        display: block;
        margin-right: $padding / 2;
        background-color: color('Primary');
        border-radius: 50%;
    }
}
</style>
