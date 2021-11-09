<script setup>
import Base from './Base.vue'
</script>
<script>
import gsap from 'gsap/dist/gsap'
export default {
    name: 'TourHome',
    watch: {
        $route (to, from) {
            if (from.name === 'Tour' && to.name === 'TourNoResult') {
                this.$nextTick(() => {
                    gsap.fromTo(this.$refs.child.$el,
                        {
                            height: 0,
                            padding: 0,
                        },
                        {
                            duration: 0.5,
                            height: 'auto',
                            padding: '',
                        }
                    )
                })
            }
        },
    },
}
</script>
<template>
    <Base class="tour-index">
        <transition name="heigh">
            <router-view ref="child" />
        </transition>
        <TourBannerHome />
    </Base>
</template>
