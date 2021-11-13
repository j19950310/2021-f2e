<template>
    <div class="tour-no-result">
        <div class="tour-no-result__main container">
            <div class="tour-no-result__title">
                哎呀！找不到你的搜尋結果 ...
            </div>
            <div class="tour-no-result__desc">
                小精靈環島了好幾圈仍未找到你的應許之地 😭 <br>
                請重新篩選搜尋條件，或試試 Near Me <span><Icon name="shuffle" /></span> 「就近探索」功能！
            </div>
        </div>
    </div>
</template>
<script>
import gsap from 'gsap/dist/gsap'
export default {
    name: 'TourNoResult',
    beforeRouteEnter (to, from, next) {
        if (from.name === 'Tour' && to.name === 'TourNoResult') {
            next((vm) => {
                gsap.fromTo(vm.$el, { height: 0 },
                    { overwrite: true, duration: 0.5, height: 'auto' })
            })
        } else {
            next()
        }
    },
}
</script>
<style lang="scss">
.tour-no-result {
    &__main {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    &__title {
        @include typo-h1;
    }

    &__desc {
        @include typo-h3;

        .icon {
            position: relative;
            font-size: 12px;
            color: color('Primary');
        }

        span {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            @include size(20px);

            &::before {
                content: '';
                position: absolute;
                @include size(20px);

                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: block;
                background-color: color('Black');
                border-radius: 50%;
                z-index: -1;
            }
        }
    }
}
</style>
