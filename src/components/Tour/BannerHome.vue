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
            <div class="tour-banner-home__info">
                <div class="tour-banner-home__display">
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
</template>
<style lang="scss">
    $class-name: '.tour-banner-home';
    #{$class-name} {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: #ffffff;

        &::before {
            content: '';
            display: block;
            padding-bottom: percentage(580/1440);
            width: 100%;
        }

        &__main {
            position: absolute;
            top: 0;
            left: 0;
            @include size(100%);
        }

        &__info {
            margin-right: auto;
            margin-left: auto;
            padding: 20px;
            padding-top: percentage(100px/1440px);
            width: 800px;
            max-width: 100%;
            text-align: center;
            color: color('White');
        }

        &__display {
            @include typo('EN/D/Display_72px_Bold');

            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
        }

        &__desc {
            @include typo('ZH/D/Display-Small_18px_Bold');

            padding-top: 4px;
            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
            margin-bottom: 24px;
        }
    }
</style>
