<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const loadingBg = new URL('../../assets/bike.jpg', import.meta.url).href

const $store = useStore()

const enterLoading = ref(false)

const isLoading = computed(() => $store.state.bike.isLoading)

const enter = () => {
    enterLoading.value = true
    $store.commit('bike/SET_START')
}

</script>

<template>
    <div
        class="bike-wrapper"
        :style="{'--primary': '#32F3AE'}"
    >
        <router-view />
        <transition name="bike-loading">
            <div
                v-show="isLoading"
                v-bg="loadingBg"
                class="bike-wrapper__loading"
            >
                <div class="container">
                    <div class="bike-wrapper__header">
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
                    <div
                        class="bike-wrapper__button"
                        :class="{'-loading': enterLoading}"
                    >
                        <ButtonPrimary
                            :icon="enterLoading ? null : 'enter'"
                            @click="enter"
                        >
                            <transition
                                name="fade"
                                mode="out-in"
                            >
                                <p v-if="!enterLoading">
                                    開始旅程
                                </p>
                                <svg
                                    v-else
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 50 50"
                                >
                                    <path
                                        fill="#32F3AE"
                                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                                    >
                                        <animateTransform
                                            attributeType="xml"
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 25 25"
                                            to="360 25 25"
                                            dur="0.6s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                </svg>
                            </transition>
                        </ButtonPrimary>
                    </div>
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

        .container {
            @include size(100%);

            display: flex;
            flex-direction: column;
        }

        &-title-en {
            @include typo-display;

            text-transform: uppercase;
            margin-bottom: $padding;
        }

        &-title {
            @include typo-display-small;
        }
    }

    &__header {
        flex: 1 1 auto;
    }

    &__button {
        margin: 0 auto $padding * 16;

        .button-main {
            height: 52px;
        }

        &.-loading {
            pointer-events: none;
        }
    }
}
</style>
