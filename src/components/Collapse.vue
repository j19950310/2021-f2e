<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

</script>

<template>
    <div
        v-blur="() => isOpen = false"
        class="collapse"
        :class="{'-active': isOpen}"
        @click="isOpen = !isOpen"
    >
        <div class="collapse__display">
            <slot name="display" />
        </div>
        <div class="collapse__main">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
.collapse {
    position: relative;
    min-width: 260px;
    @include media-breakpoint-down(tablet) {
        min-width: 200px;
    }

    &__display {
        @include typo-h3;

        padding: $padding * 1.5 $padding * 2;
        background-color: color('White');
        border-radius: 24px;
        transition: color .3s background-color .3s;
        cursor: pointer;

        .collapse.-active & {
            color: color('White');
            background-color: color('Black');
        }
    }

    &__main {
        @include typo-h4;

        position: absolute;
        top: -$padding;
        left: 50%;
        padding: $padding * 2 $padding * 1.5;
        min-width: 100%;
        background-color: color('White');
        border-radius: 24px;
        opacity: 0%;
        transition: opacity .3s;
        transform: translate(-50%, -100%);
        pointer-events: none;

        .collapse.-active & {
            opacity: 100%;
            pointer-events: auto;
        }
    }
}
</style>
