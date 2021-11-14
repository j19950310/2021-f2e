<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Swiper, SwiperSlide } from 'swiper/vue'
const $router = useRouter()
const $route = useRoute()
const $store = useStore()
//
const isOpen = ref(true)
const isShareOpen = ref(false)
const isCopy = ref(false)
const instance = getCurrentInstance() // works
let copyTimer
const post = computed(() => {
    const { params: { spot }, query: { category } } = $route
    return $store.getters['tour/getSingleSpotByQuery'](spot, category)
})
if (!post.value) {
    $router.push({
        name: 'Tour',
        query: $route.query,
    })
}

const close = () => {
    isOpen.value = false
    setTimeout(() => {
        // $router.push({ path: '/tour/spot' })
        $router.back()
    }, 300) // 300ms popup transition-duration
}
const handleCopy = () => {
    isCopy.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
        isCopy.value = false
    }, 1000)
}
</script>

<template>
    <div class="tour-spot-popup">
        <Popup
            :is-active="isOpen"
            @on-close="close"
        >
            <div class="container">
                <div class="tour-spot-popup__main">
                    <div
                        class="tour-spot-popup__close"
                        @click="close"
                    >
                        <Icon name="close-default" />
                    </div>
                    <div class="tour-spot-popup__header">
                        <p class="tour-spot-popup__title">
                            {{ post.name }}
                        </p>
                        <div class="tour-spot-popup__tags">
                            <Tag
                                v-for="name in post.class"
                                :key="name"
                                :name="name"
                            />
                        </div>
                        <div class="tour-spot-popup__info">
                            <p v-if="post.openTime">
                                開放時間：{{ post.openTime }}
                            </p>
                            <p v-if="post.phone">
                                {{ post.phone.label }}：{{ post.phone.value }}
                            </p>
                            <p v-if="post.address">
                                地址：{{ post.address }}
                            </p>
                        </div>
                        <div class="tour-spot-popup__info">
                            <p v-if="post.organizer">
                                主辦單位：{{ post.organizer }}
                            </p>
                            <p v-if="post.parkingInfo">
                                停車資訊：{{ post.parkingInfo }}
                            </p>
                            <p v-if="post.spec">
                                房型資訊：{{ post.spec }}
                            </p>
                            <p v-if="post.serverInfo">
                                服務資訊：{{ post.serverInfo }}
                            </p>
                        </div>
                    </div>
                    <div class="tour-spot-popup__content">
                        <div
                            v-if="post.picture.url"
                            v-bg="post.picture.url"
                            class="tour-spot-popup__image"
                        />
                        <div class="tour-spot-popup__control">
                            <div class="tour-spot-popup__control">
                                <ButtonThird icon="like-default">
                                    <p>收藏</p>
                                </ButtonThird>
                                <ButtonThird icon="info">
                                    <p>資訊</p>
                                </ButtonThird>
                                <div
                                    v-blur="() => isShareOpen = false"
                                    class="tour-spot-popup__shares"
                                >
                                    <ButtonThird
                                        icon="share"
                                        @click="isShareOpen = !isShareOpen"
                                    >
                                        <p>分享</p>
                                    </ButtonThird>
                                    <div
                                        class="tour-spot-popup__shares-main"
                                        :class="{'-active': isShareOpen}"
                                    >
                                        <Share social-type="facebook" />
                                        <Share social-type="line" />
                                        <Share social-type="twitter" />
                                        <Copy @on-copy="handleCopy" />
                                        <div
                                            class="tour-spot-popup__copy-done"
                                            :class="{'-active': isCopy}"
                                        >
                                            <div>
                                                <Icon name="check" />
                                            </div>
                                            <p>連結已複製！</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p
                            v-if="post.descriptionDetail"
                            class="tour-spot-popup__desc"
                        >
                            {{ post.descriptionDetail }}
                        </p>
                        <div
                            v-if="post.picture.length"
                            class="tour-spot-popup__gallery"
                        >
                            <Swiper
                                slides-per-view="auto"
                                :space-between="8"
                                :touch-start-prevent-default="false"
                                :breakpoints="{
                                    768: {
                                        spaceBetween: 24
                                    }
                                }"
                            >
                                <SwiperSlide
                                    v-for="(url, index) in post.picture.all"
                                    :key="url"
                                >
                                    <DescCard
                                        :title="post.picture.desc[index]||''"
                                        :src="url"
                                        data-cursor="swipe"
                                    />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div
                            v-if="post.Position"
                            class="tour-spot-popup__map"
                        >
                            <GoogleMap v-bind="post.Position" />
                        </div>
                        <div class="tour-spot-popup__buttons">
                            <ButtonSecondary icon="like-default">
                                收藏
                            </ButtonSecondary>
                            <ButtonSecondary @click="close">
                                返回
                            </ButtonSecondary>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    </div>
</template>

<style lang="scss">
.app.-TourSpotPopup {
    .popup {
        &__main {
            > * {
                pointer-events: none;
            }
        }
    }
}

.tour-spot-popup {
    &__main {
        position: relative;
        margin: 25% 0;
        padding: $padding * 5 $padding * 7;
        background-color: color('White');
        border-radius: 24px;
        pointer-events: auto;
        @include media-breakpoint-down(tablet) {
            margin: $padding * 4 0;
            padding: $padding * 2;
        }
    }

    &__close {
        @include size(40px);

        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 $padding auto;
        color: color('White');
        background-color: color('Black');
        border-radius: 50%;
        cursor: pointer;

        .icon {
            @include size(1.5rem);
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: color('Primary');
            }
        }
    }

    &__header {
        margin-bottom: $padding * 3;
        @include media-breakpoint-down(tablet) {
            display: flex;
            flex-direction: column;

            > * {
                &:nth-of-type(1) {
                    order: -1;
                }

                &:nth-of-type(2) {
                    order: 1;
                }

                &:nth-of-type(3) {
                    order: 0;
                }
            }
        }
    }

    &__title {
        @include typo-h1;

        margin-bottom: $padding * 2;
    }

    &__tags {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: $padding * 3;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 2;
        }

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__info {
        @include typo-h4;

        display: flex;
        padding: $padding * 3 0 $padding * 1.5;
        color: color('Dark-Gray');
        flex-wrap: wrap;
        border-top: 1px solid color('Light-Gray');
        border-bottom: 1px solid color('Light-Gray');
        @include media-breakpoint-down(tablet) {
            padding: $padding * 1.5 0 $padding * 0.5;
        }

        > * {
            display: flex;
            align-items: flex-start;
            margin-bottom: $padding * 1.5;
            @include media-breakpoint-down(tablet) {
                margin-bottom: $padding;
            }

            &:not(:last-of-type)::after {
                @include size(1px, 1em);

                content: '';
                margin: 0.25em $padding * 1.5 0;
                background-color: color('Light-Gray');
                @include media-breakpoint-down(tablet) {
                    display: none;
                }
            }
        }

        & ~ & {
            border-top: none;
        }
    }

    &__image {
        @include aspect(400 / 1100);

        border-radius: 24px;
        margin-bottom: $padding * 4;
        @include media-breakpoint-down(tablet) {
            @include aspect(170 / 290);

            margin-bottom: $padding * 2;
        }
    }

    &__control {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: $padding * 3;

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__shares {
        position: relative;
        @include media-breakpoint-down(tablet) {
            position: static;
        }

        &-main {
            position: absolute;
            top: -$padding * 1.5;
            left: 0;
            display: flex;
            align-items: center;
            padding: $padding * 2;
            background: color('White');
            border-radius: 24px;
            opacity: 0;
            box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
            transition: opacity .3s;
            transform: translate(0, -100%);
            pointer-events: none;
            @include media-breakpoint-down(tablet) {
                left: -$padding * 1.5;
                padding: $padding;
                border-radius: 16px;
            }

            &.-active {
                opacity: 1;
                pointer-events: auto;
            }

            > * {
                margin-right: $padding / 2;
            }
        }
    }

    &__copy-done {
        @include size(auto, 100%);
        @include typo-h4;

        position: absolute;
        top: 0;
        right: -$padding * 2;
        display: flex;
        align-items: center;
        padding: $padding * 2;
        background: color('White');
        border-radius: 24px;
        opacity: 0;
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
        transform: translate(100%, 0);
        pointer-events: none;
        transition: opacity .3s;
        user-select: none;
        @include media-breakpoint-down(tablet) {
            right: -$padding;
            padding: $padding;
            border-radius: 16px;
        }

        &.-active {
            opacity: 1;
        }

        > div {
            @include size(18px);

            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: $padding;
            background-color: color('Primary');
            border-radius: 50%;
        }
    }

    &__desc {
        margin-bottom: $padding * 6;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 4;
        }
    }

    &__gallery {
        margin-bottom: $padding * 6;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 4;
        }

        .swiper {
            &-slide {
                flex: 0 0 calc((100% - #{$padding} * 3 * 2) / 2.5);
                @include media-breakpoint-down(tablet) {
                    flex: 0 0 calc((100% - #{$padding}) / 1.5);
                }
            }
        }
    }

    &__map {
        @include aspect(420 / 1100);

        position: relative;
        margin-bottom: $padding * 3;
        @include media-breakpoint-down(tablet) {
            @include aspect(290 / 240);
        }

        > * {
            @include size(100%);

            position: absolute;
            top: 0;
            left: 0;
        }
    }

    &__buttons {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;

        > * {
            margin: 0 $padding * 3;
            @include media-breakpoint-down(tablet) {
                margin: 0 0 $padding * 2;
                width: 100%;
            }
        }
    }
}
</style>
