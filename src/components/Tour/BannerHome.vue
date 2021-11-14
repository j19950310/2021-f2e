<script setup>
import bannerImgUrl from '@/assets/tourBannerHome.png'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const searchValue = ref('')
const openPopUp = () => store.commit('tour/showPopUp')
const hidePopUp = () => store.commit('tour/hidePopUp')
const headSearchHandler = (e) => {
    console.log(e)
    if (e === 'filter') {
        openPopUp()
    } else {
        // TODO
    }
}
const submit = () => {
    router.push({
        name: 'TourSpotSearch',
        query: {
            keyword: searchValue.value,
        },
    })
}
</script>
<template>
    <div
        v-bg="bannerImgUrl"
        class="tour-banner-home"
    >
        <div class="tour-banner-home__main">
            <div class="container">
                <div class="col-desktop-8">
                    <div class="tour-banner-home__info">
                        <div
                            class="tour-banner-home__display"
                            lang="en"
                        >
                            FORMOSA <br>Travel Guide
                        </div>
                        <div class="tour-banner-home__desc">
                            台灣觀光懶人包
                        </div>
                        <div class="tour-banner-home__search">
                            <SearchFilter
                                v-model="searchValue"
                                @submit="submit"
                                @click="headSearchHandler"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    $class-name: '.tour-banner-home';
    #{$class-name} {
        @include size(100%);
        @include aspect(580 / 1440);

        position: relative;
        overflow: hidden;
        background-color: color('White');
        @include media-breakpoint-down(desktop) {
            @include aspect(400 / 360);
        }

        &__main {
            @include size(100%);

            position: absolute;
            top: 0;
            left: 0;
            padding-top: $padding * 15;

            .col-desktop-8 {
                margin: auto;
            }
        }

        &__info {
            text-align: center;
            color: color('White');
        }

        &__display {
            @include typo-display;

            text-transform: uppercase;
            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
        }

        &__desc {
            @include typo-display-small;

            padding-top: 4px;
            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
            margin-bottom: 24px;
            @include media-breakpoint-down(tablet) {
                margin-bottom: $padding * 2;
            }
        }
    }
</style>
