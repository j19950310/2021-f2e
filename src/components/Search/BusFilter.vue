<template>
    <SearchDefault
        class="search-filter"
        :class="className"
        :placeholder="placeholder"
        @update:modelValue="$emit('update:modelValue', $event)"
        @submit="submit"
        @focus="setFocus"
        @blur="setBlur"
        @keyup.enter="submit"
    >
        <div
            class="search-filter__functions"
        >
            <!-- Search -->
            <div
                v-if="!active"
                class="search-filter__functions-item"
                tabindex="0"
                @blur="setBlur"
                @focus="setFocus"
                @click="submit"
            >
                <Icon name="search" />
            </div>
            <div
                v-else
                class="search-filter__functions-item"
                tabindex="0"
                @click="$emit('close')"
            >
                <Icon name="close-default" />
            </div>

            <!-- Filter -->
            <div
                class="search-filter__functions-item"
                tabindex="0"
                @blur="setBlur"
                @focus="setFocus"
                @click="$emit('click', 'filter')"
            >
                <Icon name="filter" />
            </div>
        </div>
        <slot />
    </SearchDefault>
</template>
<script>
import TourFilter from '@/components/Search/TourFilter.vue'
export default {
    extends: TourFilter,
    props: {
        active: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
