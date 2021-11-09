<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('admin/init')
</script>

<template>
    <div class="app">
        <router-link
            class="dev-link"
            to="/dev"
        >
            DEV
        </router-link>
        <router-link
            class="dev-link"
            to="/components"
        >
            Component
        </router-link>
        <router-link
            class="dev-link"
            to="/tour"
        >
            旅遊景點
        </router-link>
        <router-link
            class="dev-link"
            to="/tour/no-result"
        >
            旅遊景點（搜不到)
        </router-link>
        <router-view />
    </div>
</template>

<style lang="scss">
    .dev-link {
        display: inline-block;
        margin-right: 10px;
        padding: 20px;
        border: 1px solid #cccccc;
    }
</style>
