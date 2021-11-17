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
                v-bg="'https://source.unsplash.com/random/1024x768'"
                class="bike-list-card__image"
            />
            <div class="bike-list-card__content">
                <p class="bike-list-card__title">
                    YouBike1.0 捷運市政府站(3號出口)
                </p>
                <p class="bike-list-card__desc">
                    忠孝東路/松仁路(東南側)
                </p>
            </div>
            <div class="bike-list-card__button">
                <Icon name="right" />
            </div>
        </div>
        <div class="bike-list-card__tags">
            <Tag name="正常營運" />
            <Tag name="YouBike1.0" />
        </div>
    </div>
</template>

<style lang="scss">
.bike-list-card {
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            .bike-list-card {
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

    &__title {
        @include typo-h3;

        margin-bottom: $padding / 2;
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
