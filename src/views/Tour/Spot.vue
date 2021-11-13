<script setup>
import Base from './Base.vue'
</script>
<template>
    <Base class="tour-index">
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <component :is="Component" />
            </transition>
        </router-view>
    </Base>
</template>
