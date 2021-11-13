<script setup>
import Base from '@/views/Tour/Base.vue'
</script>

<template>
    <Base>
        <div class="about">
            <div class="container">
                <div class="about__main">
                    <p class="about__title">
                        關於我們
                    </p>
                    <p class="about__desc">
                        十字元是一個備受迫害的地方族群，需要你的立即協助！！
                    </p>
                    <div class="about__cards">
                        <PersonCard
                            v-for="num in 4"
                            :key="num"
                            title="Jay Wu"
                            desc="Front End Developer"
                            src="https://source.unsplash.com/random/1024x768"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Base>
</template>

<style lang="scss">
.about {
    &__main {
        padding: $padding * 15 0 $padding * 17;
    }

    &__title {
        @include typo-h1;

        margin-bottom: $padding;
    }

    &__desc {
        @include typo-h2;

        color: color('Dark-Gray');
        margin-bottom: $padding * 10;
    }

    &__cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        @include media-breakpoint-down(tablet) {
            display: block;
        }

        > * {
            flex: 0 0 calc((100% - #{$padding * 3 * 3}) / 4);
            @include media-breakpoint-down(desktop) {
                flex: 0 0 calc((100% - #{$padding * 3}) / 2);
                margin-bottom: $padding * 3;
            }
        }
    }
}
</style>
