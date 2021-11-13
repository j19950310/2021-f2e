<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
const $router = useRouter()

const isOpen = ref(true)

const close = () => {
    isOpen.value = false
    setTimeout(() => {
        $router.push({ path: '/tour/spot' })
    }, 300) // 300ms popup transition-duration
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
                            關渡碼頭
                        </p>
                        <div class="tour-spot-popup__tags">
                            <Tag
                                v-for="name in ['景點', '遊憩類', '台北市', '大安區', '非古蹟']"
                                :key="name"
                                :name="name"
                            />
                        </div>
                        <div class="tour-spot-popup__info">
                            <p>開放時間：全天候開放</p>
                            <p>連絡電話：886-2-27208889</p>
                            <p>地址：台北市新興區民生一路495號14樓</p>
                        </div>
                        <div class="tour-spot-popup__info">
                            <p>主辦單位：臺北市政府觀光傳播局</p>
                            <p>停車資訊：小客車35輛、機車0輛、大客車0輛</p>
                            <p>房型資訊：雙人房 $10,000、單人房 $10,000、單人房(無障礙客房) $7,500</p>
                            <p>服務資訊：餐廳、會議場所、無線網路、國民旅遊卡、停車場、無障礙、客房、自助洗衣 (收費)、上網電腦 、(免費)洗衣服務、郵電服務、貴重物品保管專櫃、接送服務、AED、外幣兌換、自行車友善旅宿 </p>
                        </div>
                    </div>
                    <div class="tour-spot-popup__content">
                        <div
                            v-bg="'https://source.unsplash.com/random/1024x768'"
                            class="tour-spot-popup__image"
                        />
                        <div class="tour-spot-popup__control">
                            <ButtonThird icon="like-default">
                                <p>收藏</p>
                            </ButtonThird>
                            <ButtonThird icon="info">
                                <p>資訊</p>
                            </ButtonThird>
                            <ButtonThird icon="share">
                                <p>分享</p>
                            </ButtonThird>
                        </div>
                        <p class="tour-spot-popup__desc">
                            關渡原名甘豆門，因背倚觀音山和大屯山，面向淡水河，成為一處地勢險要的港口，早年先民由關渡碼頭進入移居臺灣北部開墾，因此關渡的開發甚早，後因兩河(基隆河、淡水河)河口泥沙淤積，水運才逐漸沒落。關渡碼頭位於關渡自然公園及關渡宮旁，每當假日或夜晚均可見遊客駐足關渡碼頭週邊散步休息，亦有許多單車族由八里經關渡大橋前來，或由淡水前來，沿途風光明媚，是一處極佳的賞景地點。
                        </p>
                        <div class="tour-spot-popup__gallery">
                            <Swiper
                                slides-per-view="auto"
                                :space-between="24"
                                :touch-start-prevent-default="false"
                            >
                                <SwiperSlide
                                    v-for="num in 5"
                                    :key="num"
                                >
                                    <div
                                        v-bg="'https://source.unsplash.com/random/1024x768'"
                                        class="tour-spot-popup__gallery-image"
                                    />
                                </SwiperSlide>
                            </Swiper>
                            <p>關渡碼頭</p>
                        </div>
                        <div class="tour-spot-popup__map">
                            map
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

        > * {
            display: flex;
            align-items: flex-start;
            margin-bottom: $padding * 1.5;

            &:not(:last-of-type)::after {
                @include size(1px, 1em);

                content: '';
                margin: 0.25em $padding * 1.5 0;
                background-color: color('Light-Gray');
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
    }

    &__control {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: $padding * 3;

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__desc {
        margin-bottom: $padding * 6;
    }

    &__gallery {
        margin-bottom: $padding * 6;

        .swiper {
            &-slide {
                flex: 0 0 calc((100% - #{$padding} * 3 * 2) / 2.5);
            }
        }

        &-image {
            @include aspect(240 / 420);

            border-radius: 24px;
        }

        > p {
            @include typo-min;

            margin-top: $padding;
            color: color('Dark-Gray');
        }
    }

    &__map {
        @include aspect(420 / 1100);

        position: relative;
        margin-bottom: $padding * 3;

        > * {
            @include size(100%);

            position: absolute;
            top: 0;
            left: 0;
        }
    }

    &__buttons {
        display: flex;
        align-items: flex-start;
        justify-content: center;

        > * {
            margin: 0 $padding * 3;
        }
    }
}
</style>
