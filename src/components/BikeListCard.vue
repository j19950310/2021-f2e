<script setup>
defineProps({
    title: {
        type: String,
        default: null,
    },
    from: {
        type: String,
        default: null,
    },
    to: {
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
</script>

<template>
    <div class="bike-list-card">
        <div class="bike-list-card__main">
            <div
                v-bg="src"
                class="bike-list-card__image"
            />
            <div class="bike-list-card__content">
                <p class="bike-list-card__title">
                    {{ title }}
                </p>
                <div
                    v-if="from ||to "
                    class="bike-list-card__address"
                >
                    <p
                        v-if="from"
                        class="bike-list-card__from"
                    >
                        {{ from }}
                    </p>
                    <Icon
                        v-if="to"
                        name="arrow-right"
                    />
                    <p
                        v-if="to"
                        class="bike-list-card__to"
                    >
                        {{ to }}
                    </p>
                </div>
                <p class="bike-list-card__desc">
                    {{ desc }}
                </p>
            </div>
            <div class="bike-list-card__button">
                <Icon name="right" />
            </div>
        </div>
        <div class="bike-list-card__tags">
            <Tag
                v-for="tag in tags"
                :key="tag"
                :name="tag"
            />
        </div>
    </div>
</template>

<style lang="scss">
.bike-list-card {
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            .bike-list-card {
                &__title {
                    color: var(--primary, color('Primary'));
                }

                &__button {
                    color: color('Black');
                    background-color: var(--primary, color('Primary'));
                }
            }
        }
    }

    &__main {
        display: flex;
        align-items: flex-start;
        margin-bottom: $padding;
    }

    &__image {
        @include aspect(1 / 1);

        margin-right: $padding * 1.5;
        border-radius: 8px;
        flex: 0 0 64px;
    }

    &__content {
        flex: 1 1 auto;
    }

    &__title {
        @include typo-h3;

        margin-bottom: $padding / 2;
    }

    &__address {
        @include typo-min;

        display: flex;
        align-items: flex-start;
        color: color('Dark-Gray');

        .icon {
            @include size(1rem);

            margin: $padding * 0.15 $padding;
        }
    }

    &__desc {
        @include typo-min;

        color: color('Dark-Gray');
    }

    &__button {
        @include size(40px);

        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: $padding * 1.5;
        color: color('White');
        background-color: color('Black');
        border-radius: 50%;
        flex-shrink: 0;
        align-self: center;
        transition: background-color .3s;
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
