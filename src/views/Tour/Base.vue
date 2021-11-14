<script setup>
import { useStore } from 'vuex'
import { computed, inject, watch } from 'vue'

const store = useStore()
const isPopUp = computed(() => store.state.tour.popUp.isShow)
const openPopUp = () => store.commit('tour/showPopUp')
const hidePopUp = () => store.commit('tour/hidePopUp')
const scrollInstance = inject('scrollInstance')

const headSearchHandler = (e) => {
    console.log(e)
    if (e === 'filter') {
        openPopUp()
    } else {
        // TODO
    }
}
</script>
<template>
    <div class="tour-base">
        <TourHeader
            :is-search="$route.name !== 'Tour'"
            @search="headSearchHandler"
        />
        <div class="tour-base__slot">
            <slot />
        </div>
        <TourFooter />
        <div
            class="tour-base__pop-up"
            :class="{
                '-show': isPopUp,
                '-hide': !isPopUp,
            }"
            @click.self="hidePopUp"
        >
            <FormFilter
                @back="hidePopUp"
                @submit="hidePopUp"
            />
        </div>
    </div>
</template>
<style lang="scss">
$header-height: 84px;

.tour-base {
    display: flex;
    padding-top: $header-height;
    flex-direction: column;
    min-height: 100vh;

    &__slot {
        flex: 1 1 auto;
    }

    &__pop-up {
        @include css-performance;
        $duration: 0.4s;

        position: fixed;
        top: 0;
        left: 0;
        padding: 80px;
        width: 100%;
        height: 100%;
        background: rgba(44, 44, 44, 0.8);
        z-index: map-get($z-index, pop-up);
        transition: background-color $duration ease-in-out, backdrop-filter $duration/2 ease-in-out;
        backdrop-filter: blur(30px);

        .form-filter {
            overflow: auto;
            margin: 0 auto;
            width: 800px;
            max-height: 100%;
            transition: transform $duration ease-in-out;
            transform-origin: 50% 120%;
        }

        &.-hide {
            background: rgba(44, 44, 44, 0);
            pointer-events: none;
            backdrop-filter: blur(0);
            transition-duration: $duration/2;

            .form-filter {
                pointer-events: none;
                transform: scale(0) translateY(100%);
            }
        }
    }
}
</style>
