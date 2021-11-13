<script setup>
defineProps({
    title: {
        type: String,
        default: null,
    },
    src: {
        type: String,
        default: null,
    },
})
</script>

<template>
    <div class="desc-card">
        <div
            v-bg="src"
            class="desc-card__image"
        />
        <p
            v-if="title"
            class="desc-card__title"
        >
            {{ title }}
        </p>
    </div>
</template>

<style lang="scss">
.desc-card {
    &__image {
        @include aspect(240 / 420);

        border-radius: 24px;
        @include media-breakpoint-down(tablet) {
            @include aspect(1 / 1);
        }
    }

    &__title {
        @include typo-min;

        margin-top: $padding;
        color: color('Dark-Gray');
        @include media-breakpoint-down(tablet) {
            margin-top: $padding / 2;
        }
    }
}
</style>
