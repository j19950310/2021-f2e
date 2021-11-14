<script>
import Base from './Base.vue'
import gsap from 'gsap/dist/gsap'

export default {
    name: 'TourHome',
    components: {
        Base,
    },
    watch: {
        '$route' (to, from) {
            if (to.name === 'TourNoResult') {
                gsap.to(this.$refs.main, {
                    height: 0,
                    padding: 0,
                    opacity: 0,
                    duration: 0.5,
                })
            } else if (to.name === 'Tour') {
                gsap.to(this.$refs.main, {
                    height: 'auto',
                    padding: 80,
                    opacity: 1,
                    duration: 0.5,
                })
            }
        },
    },
}
</script>

<template>
    <Base class="tour-index">
        <router-view ref="child" />
        <TourBannerHome />
        <div
            ref="main"
            class="tour-index__main container"
        >
            <div class="row tour-index__title">
                <p><span>毫無頭緒？試試</span><span lang="en">Near Me!</span></p>
            </div>
            <div class="row tour-index__desc">
                不論是想讓腦袋休息片刻，或陷入選擇障礙，透過 Near Me「就近探索」來點驚喜吧！
            </div>
            <div class="row tour-index__shuffle">
                <ButtonPrimary icon="shuffle">
                    Near Me
                </ButtonPrimary>
            </div>
        </div>
    </Base>
</template>

<style lang="scss">
.tour-index {
    &__main {
        overflow: hidden;
        padding: 80px;
        text-align: center;
    }

    &__title {
        span {
            @include typo-h1;

            margin: 4px;
        }

        margin-bottom: 4px;
    }

    &__desc {
        @include typo-h3;

        justify-content: center;
    }

    &__shuffle {
        @include typo('EN/D/H3_16px_Semi-Bold');

        justify-content: center;
        padding-top: 32px;

        .button-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 1 160px;
        }
    }
}
</style>
