<script setup>
import { useStore } from 'vuex'
import { computed, inject, watch } from 'vue'

const $store = useStore()
const isPopUp = computed(() => $store.state.tour.popUp.isShow)
const openPopUp = () => $store.commit('tour/showPopUp')
const hidePopUp = () => $store.commit('tour/hidePopUp')
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
$header-height: 84px;

.tour-base {
    display: flex;
    padding-top: $header-height;
    flex-direction: column;
    min-height: 100vh;

    &__slot {
        flex: 1 1 auto;
    }

    &__filter {
        @include size(100%);

        display: flex;
        align-items: center;
        pointer-events: none;

        .col-desktop-8 {
            margin: auto;
        }

        .form-filter {
            pointer-events: auto;
        }
    }
}
</style>
