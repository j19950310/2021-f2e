<script setup>
import { ref } from 'vue'
const searchValue = ref(null)
</script>

<template>
    <div
        class="bike"
        :style="{'--primary': '#32F3AE'}"
    >
        <div class="bike__main">
            <div class="bike__search">
                <SearchDefault v-model="searchValue">
                    <div class="search-filter__functions">
                        <div class="search-filter__functions-item">
                            <Icon name="search" />
                        </div>
                        <div class="search-filter__functions-item">
                            <Icon name="filter" />
                        </div>
                    </div>
                </SearchDefault>
                <DragPopup>
                    <router-view />
                </DragPopup>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.bike {
    @include size(100%, 100vh);

    position: relative;

    &__search {
        position: absolute;
        top: $padding * 3;
        left: $padding * 3;
        width: 400px;

        .search-default {
            margin-bottom: $padding * 2;
        }
    }
}
</style>
