<template>
    <div class="pagination">
        <div
            class="pagination__prev pagination__link"
            :class="{'-disable': now === 1}"
        >
            <Icon name="left" />
            <router-link :to="{query: pageRouteQuery(now - 1)}" />
        </div>
        <div class="pagination__main">
            <div
                v-for="(item, index) in list"
                :key="index"
                class="pagination__link"
                :class="{
                    '-active': item === now,
                    '-head': index === 0 && list[1] > 2,
                    '-end': index + 1 === list.length && list[index - 1] < item - 1
                }"
            >
                <p>
                    {{ item }}
                    <span />
                </p>
                <router-link :to="{query: pageRouteQuery(item)}" />
            </div>
        </div>
        <div
            class="pagination__next pagination__link"
            :class="{'-disable': now === list[list.length - 1]}"
        >
            <Icon name="right" />
            <router-link :to="{query: pageRouteQuery(now + 1)}" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        max: {
            type: Number,
            default: 1,
        },
        now: {
            type: Number,
            default: 1,
        },
    },
    computed: {
        list () {
            const MAX = Math.max(this.max, 1)
            let indexList = [this.now - 1, this.now, this.now + 1]
            // min max
            indexList.push(1)
            indexList.push(MAX)
            // filter the same
            indexList = indexList.filter((v, i) => indexList.indexOf(v) === i)
            // clamp min max
            indexList = indexList.filter(v => v > 0 && v <= MAX)

            return indexList.sort((a, b) => a - b)
        },
    },
    mounted () {
    },
    methods: {
        pageRouteQuery (page) {
            return { ...this.$route.query, page }
        },
    },
}
</script>

<style lang="scss">
.pagination {
    $p: 8px;

    display: flex;
    justify-content: center;
    color: color('Black');

    &__main {
        display: flex;
        align-items: center;
    }

    &__link {
        @include typo('EN/D/H4_14_Semi-Bold');

        position: relative;
        display: flex;
        align-items: center;
        padding: 0 $p*1.5;
        transition: color 0.3s;
        cursor: pointer;
        @media (hover: hover) {
            &:hover {
                color: #333333;
            }
        }

        p {
            position: relative;
            z-index: 2;

            span {
                position: absolute;
                top: -4px;
                bottom: -4px;
                right: -8.5px;
                left: -8.5px;
                display: block;
                display: block;
                border-radius: 80px;
                z-index: -1;
                pointer-events: none;
            }
        }

        a {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            @include size(100%);
        }

        &::before,&::after {
            pointer-events: none;
        }

        &.-head {
            margin-right: $p*1.5;
            padding-right: 0;

            &::after {
                content: '...';
                display: block;
                padding-left: $p*1.5;
            }
        }

        &.-end {
            margin-left: $p*1.5;
            padding-left: 0;

            &::before {
                content: '...';
                display: block;
                padding-right: $p*1.5;
            }
        }

        &.-disable {
            pointer-events: none;
            color: color('Light-Gray');
        }

        &.-active {
            position: relative;

            span {
                background-color: color('Primary');
            }
        }
    }

    &__prev,&__next {
        .svg-icons {
            font-size: 24px;
        }
    }

    &__prev {
        margin-right: 1.25*$p;
        padding: 0 1.25*$p;
    }

    &__next {
        margin-left: 1.25*$p;
        padding: 0 1.25*$p;
    }
}
</style>
