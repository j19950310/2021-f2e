<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const loadingBg = new URL('../../assets/bike.jpg', import.meta.url).href

const $store = useStore()

const isLoading = computed(() => $store.state.bike.isLoading)

</script>

<template>
    <div class="bike-wrapper">
        <router-view />
        <transition name="bike-loading">
            <div
                v-show="isLoading"
                v-bg="loadingBg"
                class="bike-wrapper__loading"
            >
                <div class="container">
                    <p
                        class="bike-wrapper__loading-title-en"
                        lang="en"
                    >
                        FORMOSA<br> BIKER’s Guide
                    </p>
                    <p class="bike-wrapper__loading-title">
                        台灣自行車懶人包
                    </p>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss">
.bike-wrapper {
    touch-action: none;
    overflow: hidden;
    user-select: none;

    &__loading {
        @include size(100%);

        position: fixed;
        top: 0;
        left: 0;
        padding-top: $padding * 7;
        color: color('White');
        z-index: 100;
        text-shadow: 0 1px 6px rgba(0, 0, 0, 25%);

        &-title-en {
            @include typo-display;

            text-transform: uppercase;
            margin-bottom: $padding;
        }

        &-title {
            @include typo-display-small;
        }
    }
}
</style>
