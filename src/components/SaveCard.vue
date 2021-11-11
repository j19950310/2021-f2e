<script setup>
defineProps({
    title: {
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
    <div class="save-card">
        <div
            v-bg="'https://source.unsplash.com/random/1024x768'"
            class="save-card__image"
        />
        <div class="save-card__main">
            <p class="save-card__title">
                {{ title }}
            </p>
            <div class="save-card__tags">
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
.save-card {
    display: flex;
    align-items: flex-start;
    padding-bottom: $padding;
    border-bottom: 1px solid color('Light-Gray');

    &__image {
        @include aspect(1 / 1);

        margin-right: $padding;
        border-radius: 8px;
        flex: 0 0 64px;
    }

    &__main {
        padding: $padding * 1.5 0;
    }

    &__title {
        @include typo-h4;
        @include text-ellipsis;

        margin-bottom: $padding / 2;
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
