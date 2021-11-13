<script setup>
defineProps({
    isFavorite: {
        type: Boolean,
        default: false,
    },
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
    tags: {
        type: Array,
        default: null,
    },
})
defineEmits(['on-add-favorite'])
</script>

<template>
    <div class="default-card">
        <div
            v-bg="src"
            class="default-card__image"
        >
            <div
                class="default-card__favorite"
                @click.stop="$emit('on-add-favorite')"
            >
                <Icon
                    v-if="isFavorite"
                    name="like-active"
                />
                <Icon
                    v-else
                    name="like-default"
                />
            </div>
        </div>
        <div class="default-card__main">
            <p class="default-card__title">
                {{ title }}
            </p>
            <p class="default-card__desc">
                {{ desc }}
            </p>
            <div class="default-card__tags">
                <Tag
                    v-for="tag in tags"
                    :key="tag"
                    :name="tag"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.default-card {
    @include media-breakpoint-down(tablet) {
        display: flex;
        align-items: flex-start;
    }

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            .default-card {
                &__image {
                    &::after {
                        background-color: rgba(44, 44, 44, 0.2);
                    }
                }
            }
        }
    }

    &__image {
        @include aspect(240 / 385);

        position: relative;
        overflow: hidden;
        color: color('White');
        border-radius: 24px;
        margin-bottom: $padding;
        z-index: 1;
        @include media-breakpoint-down(tablet) {
            @include aspect(1 / 1);

            margin-right: $padding;
            border-radius: 8px;
            flex: 0 0 88px;
        }

        &::after {
            @include size(100%);

            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            transition: background-color .3s;
        }
    }

    &__favorite {
        position: absolute;
        top: 0;
        right: 0;
        padding: $padding * 2.5;
        cursor: pointer;
        @include media-breakpoint-down(tablet) {
            padding: $padding;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: color('Primary');
            }
        }

        .icon {
            @include size(1.5rem);
        }
    }

    &__title {
        @include typo-h2;
        @include text-ellipsis;

        margin-bottom: $padding / 2;
    }

    &__desc {
        @include typo-h4;
        @include text-ellipsis(2);

        margin-bottom: $padding;
        color: color('Dark-Gray');
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding / 2;
        }
    }

    &__tags {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;

        > * {
            margin-right: $padding * 1.5;
            flex-shrink: 0;
        }
    }
}
</style>
