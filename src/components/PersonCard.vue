<script setup>
defineProps({
    title: {
        type: String,
        default: null,
    },
    desc: {
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
    <div class="person-card">
        <div
            v-bg="src"
            class="person-card__image"
        />
        <p class="person-card__title">
            {{ title }}
        </p>
        <p class="person-card__desc">
            {{ desc }}
        </p>
    </div>
</template>

<style lang="scss">
.person-card {
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            .person-card {
                &__image {
                    &::after {
                        opacity: 1;
                    }
                }
            }
        }
    }

    &__image {
        @include aspect(375 / 280);

        position: relative;
        overflow: hidden;
        border-radius: 24px;
        margin-bottom: $padding;

        &::after {
            @include size(100%);

            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(44, 44, 44, 0.2);
            opacity: 0;
            transition: opacity .3s;
        }
    }

    &__title {
        @include typo-h2;

        margin-bottom: $padding;
    }

    &__desc {
        @include typo-h4;

        color: color('Dark-Gray');
    }
}
</style>
