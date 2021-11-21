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
    rentBikes: {
        type: Number,
        default: null,
    },
    returnBikes: {
        type: Number,
        default: null,
    },
    content: {
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
    date: {
        type: String,
        default: null,
    },
})
defineEmits(['on-back', 'on-road'])

</script>

<template>
    <div class="bike-card">
        <div
            v-bg="'https://source.unsplash.com/random/1024x768'"
            class="bike-card__image"
        >
            <!-- <div
                class="bike-card__favorite"
            >
                <Icon
                    name="like-active"
                />
                <Icon
                    name="like-default"
                />
            </div> -->
        </div>
        <p class="bike-card__title">
            {{ title }}
        </p>
        <div
            v-if="from ||to "
            class="bike-card__address"
        >
            <p
                v-if="from"
                class="bike-card__from"
            >
                {{ from }}
            </p>
            <Icon
                v-if="to"
                name="arrow-right"
            />
            <p
                v-if="to"
                class="bike-card__to"
            >
                {{ to }}
            </p>
        </div>
        <p class="bike-card__desc">
            {{ desc }}
        </p>
        <div
            v-if="rentBikes || returnBikes"
            class="bike-card__info"
        >
            <div class="bike-card__count">
                <div
                    v-if="rentBikes"
                    class="bike-card__number"
                >
                    <span lang="en">{{ rentBikes }}</span>
                    <p>可租借</p>
                </div>
                <div
                    v-if="returnBikes"
                    class="bike-card__number"
                >
                    <span lang="en">{{ returnBikes }}</span>
                    <p>可退還</p>
                </div>
            </div>
            <div>{{ content }}</div>
        </div>
        <div class="bike-card__tags">
            <Tag
                v-for="tag in tags"
                :key="tag"
                :name="tag"
            />
        </div>
        <div class="bike-card__buttons">
            <ButtonSecondary @click="$emit('on-back')">
                <p>返回</p>
            </ButtonSecondary>
            <ButtonPrimary
                icon="enter"
                @click="$emit('on-road')"
            >
                <p>路線指引</p>
            </ButtonPrimary>
        </div>
        <p
            v-if="date"
            class="bike-card__update"
        >
            更新時間：{{ date }}
        </p>
    </div>
</template>

<style lang="scss">
.bike-card {
    &__image {
        @include aspect(200 / 350);

        position: relative;
        border-radius: 24px;
        margin-bottom: $padding;

        > * {
            position: absolute;
        }
    }

    &__favorite {
        position: absolute;
        top: 0;
        right: 0;
        padding: $padding * 2.5;
        cursor: pointer;
        color: var(--primary, color('Primary'));

        @include media-breakpoint-down(tablet) {
            padding: $padding;
        }

        .icon {
            @include size(1.5rem);
        }
    }

    &__title {
        @include typo-h2;

        margin-bottom: $padding;
    }

    &__address {
        @include typo-min;

        display: flex;
        align-items: flex-start;

        .icon {
            @include size(1rem);

            margin: $padding * 0.15 $padding;
        }
    }

    &__desc {
        @include typo-min;

        margin-top: $padding;
        color: color('Dark-Gray');
    }

    &__info {
        margin: $padding * 2.5 0;
        padding: $padding 0;
        border-top: 1px solid color('Light-Gray');
        @include media-breakpoint-down(tablet) {
            margin: $padding * 2 0;
            padding: $padding / 2 0;
        }
    }

    &__count {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > * {
            flex: 1 1 50%;

            & ~ * {
                display: flex;
                align-items: center;

                &::before {
                    @include size(1px, 1.75em);

                    content: '';
                    margin: 0 $padding * 2;
                    background-color: color('Light-Gray');
                }
            }
        }
    }

    &__number {
        display: flex;
        align-items: center;

        span {
            @include typo-h1;

            color: var(--primary, color('Primary'));
        }

        p {
            @include typo-min;

            margin-left: $padding;
        }
    }

    &__tags {
        display: flex;
        align-items: flex-start;
        margin-bottom: $padding * 2.5;
        padding-top: $padding / 2;
        border-top: 1px solid color('Light-Gray');

        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 2;
        }

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $padding * 2.5;
        @include media-breakpoint-down(desktop) {
            margin-bottom: $padding * 2;
        }

        > * {
            flex: 0 0 calc((100% - #{$padding} * 1.5) / 2);
            @include media-breakpoint-down(tablet) {
                min-width: auto;
            }
        }
    }

    &__update {
        @include typo-min;

        text-align: right;
        color: color('Gray');
    }
}
</style>
