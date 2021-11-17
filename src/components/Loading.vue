<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
const loadingBg = new URL('../assets/loading.jpg', import.meta.url).href

const $store = useStore()

const loadingConfig = computed(() => $store.state.loadingConfig)
const isLoading = computed(() => $store.getters.isLoading)
const isFirstEnter = computed(() => $store.state.isFirstEnter)

const loadingDone = () => {
    setTimeout(() => {
        $store.commit('SET_FIRST_ENTER')
    }, loadingConfig.value.minTime)
}
</script>

<template>
    <transition
        name="loading"
        @leave="loadingDone"
    >
        <div
            v-show="isLoading"
            v-lock="isFirstEnter || isLoading"
            class="loading"
        >
            <div class="loading__main">
                <div
                    v-show="isFirstEnter"
                    v-bg="loadingBg"
                    class="loading__first"
                >
                    <p>LOADING...</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="scss">
.loading {
    @include size(100%);

    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;

    &__main {
        @include size(100%);

        position: absolute;
        top: 0;
        left: 0;
        background-color: color('White');
    }

    &__first {
        @include size(100%);

        display: flex;
        align-items: center;
        justify-content: center;
        background: color('Secondary');

        > p {
            @include typo-h2;

            color: color('White');
            text-shadow: 0 1px 6px rgb(0 0 0 / 25%);
        }
    }
}
</style>
