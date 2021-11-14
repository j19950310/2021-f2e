<script setup>
import Base from '@/views/Tour/Base.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'

</script>

<template>
    <Base>
        <div class="about">
            <div class="container">
                <div class="about__main">
                    <p class="about__title">
                        關於我們
                    </p>
                    <p class="about__desc">
                        十字元是一個備受迫害的地方族群，需要你的立即協助！！
                    </p>
                    <div class="about__cards">
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
                                v-for="num in 4"
                                :key="num"
                            >
                                <router-link
                                    :to="{name:'AboutPerson', params: {person: 'test'}}"
                                    data-cursor="swipe"
                                >
                                    <PersonCard
                                        title="Jay Wu"
                                        desc="Front End Developer"
                                        src="https://source.unsplash.com/random/1024x768"
                                    />
                                </router-link>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </Base>
</template>

<style lang="scss">
.about {
    &__main {
        padding: $padding * 15 0 $padding * 17;
        @include media-breakpoint-down(tablet) {
            padding: $padding * 5 0;
        }
    }

    &__title {
        @include typo-h1;

        margin-bottom: $padding;
    }

    &__desc {
        @include typo-h2;

        color: color('Dark-Gray');
        margin-bottom: $padding * 10;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 5;
        }
    }

    &__cards {
        .swiper {
            &-slide {
                flex: 0 0 calc((100% - #{$padding * 3 * 3}) / 4);
                @include media-breakpoint-down(desktop) {
                    flex: 0 0 calc((100% - #{$padding * 3}) / 1.5);
                }
                @include media-breakpoint-down(tablet) {
                    flex: 0 0 calc((100% - #{$padding}) / 1.5);
                }

                > * {
                    display: block;
                }
            }
        }
    }
}
</style>
