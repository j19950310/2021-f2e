<script setup>

</script>

<template>
    <div class="bike-card">
        <div
            v-bg="'https://source.unsplash.com/random/1024x768'"
            class="bike-card__image"
        >
            <div
                class="bike-card__favorite"
            >
                <Icon
                    name="like-active"
                />
                <!-- <Icon
                    v-else
                    name="like-default"
                /> -->
            </div>
        </div>
        <p class="bike-card__title">
            YouBike1.0 捷運市政府站(3號出口)
        </p>
        <div class="bike-card__address">
            <p class="bike-card__from">
                忠孝東路/松仁路(東南側)
            </p>
            <p class="bike-card__to">
                寧波西街
            </p>
        </div>
        <p class="bike-card__desc">
            週一~週日 11:30-22:00(供餐至21:00)
        </p>
        <div class="bike-card__info">
            <div class="bike-card__count">
                <div class="bike-card__number">
                    <span lang="en">9999</span>
                    <p>可租借</p>
                </div>
                <div class="bike-card__number">
                    <span lang="en">9999</span>
                    <p>可退還</p>
                </div>
            </div>
            <div>大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻…</div>
        </div>
        <div class="bike-card__tags">
            <Tag name="台北市" />
            <Tag name="台北市" />
        </div>
        <div class="bike-card__buttons">
            <ButtonSecondary>
                <p>返回</p>
            </ButtonSecondary>
            <ButtonPrimary icon="enter">
                <p>送出</p>
            </ButtonPrimary>
        </div>
        <p class="bike-card__update">
            更新時間：10:09:45
        </p>
    </div>
</template>

<style lang="scss">
.bike-card {
    &__image {
        @include aspect(200 / 350);

        position: relative;
        border-radius: 24px;
        margin-bottom: $padding;

        > * {
            position: absolute;
        }
    }

    &__favorite {
        position: absolute;
        top: 0;
        right: 0;
        padding: $padding * 2.5;
        cursor: pointer;
        color: var(--primary, color('Primary'));

        @include media-breakpoint-down(tablet) {
            padding: $padding;
        }

        .icon {
            @include size(1.5rem);
        }
    }

    &__title {
        @include typo-h2;

        margin-bottom: $padding;
    }

    &__address {
        @include typo-min;

        display: flex;
        align-items: center;
    }

    &__desc {
        @include typo-min;

        margin-top: $padding;
        color: color('Dark-Gray');
    }

    &__info {
        margin: $padding * 2.5 0;
        padding: $padding 0;
        border-top: 1px solid color('Light-Gray');
        border-bottom: 1px solid color('Light-Gray');
        @include media-breakpoint-down(tablet) {
            margin: $padding * 2 0;
            padding: $padding / 2 0;
        }
    }

    &__count {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > * {
            flex: 1 1 50%;

            & ~ * {
                display: flex;
                align-items: center;

                &::before {
                    @include size(1px, 1.75em);

                    content: '';
                    margin: 0 $padding * 2;
                    background-color: color('Light-Gray');
                }
            }
        }
    }

    &__number {
        display: flex;
        align-items: center;

        span {
            @include typo-h1;

            color: var(--primary, color('Primary'));
        }

        p {
            @include typo-min;

            margin-left: $padding;
        }
    }

    &__tags {
        display: flex;
        align-items: flex-start;
        margin-bottom: $padding * 2.5;
        @include media-breakpoint-down(tablet) {
            margin-bottom: $padding * 2;
        }

        > * {
            margin-right: $padding * 1.5;
        }
    }

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $padding * 2.5;
        @include media-breakpoint-down(desktop) {
            margin-bottom: $padding * 2;
        }

        > * {
            flex: 0 0 calc((100% - #{$padding} * 1.5) / 2);
            @include media-breakpoint-down(tablet) {
                min-width: auto;
            }
        }
    }

    &__update {
        @include typo-min;

        text-align: right;
        color: color('Gray');
    }
}
</style>
