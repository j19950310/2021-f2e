<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
const $router = useRouter()

const isOpen = ref(true)
const isInfoOpen = ref(false)

const close = () => {
    isOpen.value = false
    setTimeout(() => {
        $router.push({ path: '/about' })
    }, 300) // 300ms popup transition-duration
}
</script>

<template>
    <div class="about-person">
        <Popup
            :is-active="isOpen"
            @on-close="close"
        >
            <div class="container">
                <div class="about-person__main">
                    <div
                        class="about-person__close"
                        @click="close"
                    >
                        <Icon name="close-default" />
                    </div>
                    <div class="about-person__header">
                        <div
                            v-bg="'https://source.unsplash.com/random/1024x768'"
                            class="about-person__image"
                        />
                        <div>
                            <p class="about-person__title">
                                Jay Wu
                            </p>
                            <p class="about-person__job">
                                Front End Developer/ Visual Designer/ UI Designer
                            </p>
                        </div>
                    </div>
                    <div class="about-person__control">
                        <div
                            v-blur="() => isInfoOpen = false"
                            class="about-person__info"
                        >
                            <ButtonThird
                                icon="share"
                                @click="isInfoOpen = !isInfoOpen"
                            >
                                <p>資訊</p>
                            </ButtonThird>
                            <div
                                class="about-person__info-main"
                                :class="{'-active': isInfoOpen}"
                            >
                                <a href="">
                                    <Icon name="linkedin" />
                                </a>
                                <a href="">
                                    <Icon name="linkedin" />
                                </a>
                                <a href="">
                                    <Icon name="linkedin" />
                                </a>
                            </div>
                        </div>
                        <ButtonThird icon="share">
                            <p>分享</p>
                        </ButtonThird>
                    </div>
                    <p class="about-person__desc">
                        反蜥爸由事禦處城將原？我近中科氣沒他沒省氓的蟻片比祈希營涂主難原用平從？的原…不丰到活本眾的從毀人了要櫻芒間妳，年三錯的要定，老一相義。間在洲士謝版的計將一同樣其在人相樂罐…和藝大會，分吧正氓的到戊個。
                    </p>
                    <div class="about-person__gallery">
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
                                v-for="num in 5"
                                :key="num"
                            >
                                <DescCard
                                    title="看及應啦業去墳正一字科施中起到應十患唾把秉縛指章也的只嗎我昀稱十"
                                    src="https://source.unsplash.com/random/1024x768"
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div class="about-person__back">
                        <ButtonSecondary @click="close">
                            返回
                        </ButtonSecondary>
                    </div>
                </div>
            </div>
        </Popup>
    </div>
</template>

<style lang="scss">
.about-person {
    &__main {
        position: relative;
        margin: 15% 0;
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
        display: flex;
        align-items: center;
        margin-bottom: $padding * 3;
    }

    &__image {
        @include aspect(1 / 1);

        flex: 0 0 160px;
        margin-right: $padding * 3;
        border-radius: 50%;
    }

    &__title {
        @include typo-h1;

        margin-bottom: $padding;
    }

    &__job {
        @include typo-h3;

        color: color('Dark-Gray');
    }

    &__control {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: $padding * 2;

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__info {
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
                @media (hover: hover) and (pointer: fine) {
                    &:hover {
                        color: color('Primary');
                    }
                }

                & ~ * {
                    margin-left: $padding * 3;
                }
            }
        }
    }

    &__desc {
        margin-bottom: $padding * 6;
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

    &__back {
        text-align: center;
    }
}
</style>
