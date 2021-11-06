<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('admin/init')
</script>

<template>
    <div class="app">
        <router-link to="/dev">
            DEV
        </router-link>
        <router-link to="/components">
            Component
        </router-link>
        <router-view />
    </div>
</template>

<style lang="scss">

</style>
