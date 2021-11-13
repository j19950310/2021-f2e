<script setup>
defineProps({
    isActive: {
        type: Boolean,
        default: true,
    },
})
defineEmits(['on-close'])
</script>

<template>
    <teleport to="#portalTarget">
        <transition
            name="fade"
            appear
        >
            <div
                v-show="isActive"
                class="popup"
            >
                <div
                    v-lock="isActive"
                    class="popup__main"
                    @click.self="$emit('on-close')"
                >
                    <slot />
                </div>
            </div>
        </transition>
    </teleport>
</template>

<style lang="scss">
.popup {
    @include size(100%);
    @include css-performance;

    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(color('Black_80%'), 0.8);
    backdrop-filter: blur(30px);
    z-index: 100;

    &__main {
        @include size(100%);

        position: relative;
        overflow: auto;
    }
}
</style>
