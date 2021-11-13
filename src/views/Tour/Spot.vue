<script setup>
import Base from './Base.vue'
</script>
<template>
    <Base class="tour-index">
        <div class="container">
            <router-link :to="{name: 'TourSpotPopup', params: {spot: 'test'}}">
                <DefaultCard
                    title="關渡碼頭"
                    desc="關渡原名甘豆門，因背倚觀音山和大屯山，面向淡水河，成為一處地勢險要的港口，早年先民由關渡碼頭進入移居臺…"
                    src="https://source.unsplash.com/random/1024x768"
                    :tags="['景點', '台北市']"
                    @on-add-favorite="() => {}"
                />
            </router-link>
        </div>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <component :is="Component" />
            </transition>
        </router-view>
    </Base>
</template>
