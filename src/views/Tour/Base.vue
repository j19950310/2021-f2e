<script setup>
import { useStore } from 'vuex'
import { computed, inject, watch } from 'vue'

const $store = useStore()
const isPopUp = computed(() => $store.state.tour.popUp.isShow)
const openPopUp = () => $store.commit('tour/showPopUp')
const hidePopUp = () => $store.commit('tour/hidePopUp')
const scrollInstance = inject('scrollInstance')

const headSearchHandler = (e) => {
    // console.log(e)
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
        <Popup
            :is-active="isPopUp"
            transition="popup-fade-up"
            @on-close="hidePopUp"
        >
            <div class="tour-base__filter">
                <div class="container">
                    <div class="col-desktop-8">
                        <FormFilter
                            @back="hidePopUp"
                            @submit="hidePopUp"
                        />
                    </div>
                </div>
            </div>
        </Popup>
    </div>
</template>
<style lang="scss">
.tour-base {
    display: flex;
    padding-top: map-get($header-height, large);
    min-height: 100vh;
    flex-direction: column;
    @each $breakpoint, $top in $header-height {
        @include media-breakpoint-down($breakpoint) {
            padding-top: $top;
        }
    }

    &__slot {
        flex: 1 1 auto;
    }

    &__filter {
        display: flex;
        align-items: center;
        margin: 5% 0;
        width: 100%;
        pointer-events: none;
        @include media-breakpoint-down(tablet) {
            margin: $padding * 4 0;
        }

        .col-desktop-8 {
            margin: auto;
        }

        .form-filter {
            pointer-events: auto;
        }
    }
}
</style>
