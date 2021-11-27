<template>
    <div
        class="card-bus-stop"
        :class="{
            '-start': index === 1,
            '-end': isEnd,
            '-active': active
        }"
        @click="$emit('click')"
    >
        <div class="card-bus-stop__state">
            <div class="card-bus-stop__state-circle" />
        </div>
        <div class="card-bus-stop__info">
            <div class="card-bus-stop__info-name">
                {{ name }}
            </div>
            <div class="card-bus-stop__info-time">
                到站時間 15:14
            </div>
        </div>
        <div class="card-bus-stop__tool">
            <div class="card-bus-stop__tool-item -forward">
                <Icon name="enter" />
                <a
                    target="_blank"
                    :href="link"
                />
            </div>
            <div class="card-bus-stop__tool-item -like">
                <Icon name="like-default" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        index: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            default: '',
        },
        isEnd: {
            type: Boolean,
            default: false,
        },
        position: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        link () {
            return `https://www.google.com.tw/maps/dir//${this.position.lat},${this.position.lng}`
        },
    },
    watch: {
        active (val) {
            if (val) {
                this.$el.scrollIntoView()
            }
        },
    },
}
</script>
<style lang="scss">
.card-bus-stop {
    display: flex;
    padding: $padding $padding * 3;
    background-color: var(--sub-color);
    transition: background-color 0.3s ease;
    cursor: pointer;

    --sub-color: #{color('White')};

    &__state {
        position: relative;
        margin: -$padding 0;
        width: $padding * 3;
        flex-shrink: 0;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 10px;
            left: 10px;
            display: block;
            background-color: #383838;
        }

        &-circle {
            position: absolute;
            top: 22px;
            left: 50%;
            background-color: #383838;
            border-radius: 50%;
            z-index: 1;
            transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
            transform: translate(-50%, -50%);
            @include size(10px);

            &::before {
                content: '';
                position: absolute;
                top: -2px;
                bottom: -2px;
                right: -2px;
                left: -2px;
                display: block;
                border: 2px solid;
                border-color: var(--sub-color);
                border-radius: 50%;
            }

            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                background-color: #383838;
                border-radius: 50%;
                transition: transform 0.3s ease, background-color 0.3s ease;
                @include size(100%);
            }
        }
    }

    &__info {
        flex-grow: 1;
        padding-left: $padding;
        color: color('Dark-Gray');
        transition: color 0.3s ease;

        .-active & {
            color: color('Black');
        }

        &-name {
            @include typo-h3;
        }

        &-time {
            @include typo-h4;
        }
    }

    &__tool {
        display: flex;
        flex: 0 0 auto;

        &-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: $padding;
            border-radius: 50%;
            flex: 0 0 40px;
            @include size(40px);

            a {
                @include link;
            }

            &.-forward {
                color: color('Black');
                background-color: color('White');
                border: 2px solid color('Black');
            }

            &.-like {
                color: color('White');
                background-color: color('Black');
                border: 2px solid color('Black');
            }

            .icon {
                font-size: 24px;
            }
        }
    }

    @include hover {
        --sub-color: var(--primary);

        .card-bus-stop__info {
            color: color('Black');
        }

        .card-bus-stop__state-circle {
            @include size(20px);

            background-color: color('White');

            &::after {
                background-color: var(--sub-color);
                transform: scale(0.6);
            }
        }
    }

    &.-active {
        --sub-color: var(--primary);

        .card-bus-stop__state-circle {
            @include size(20px);

            background-color: color('White');

            &::after {
                background-color: var(--sub-color);
                transform: scale(0.6);
            }
        }
    }

    &.-start {
        .card-bus-stop__state {
            &::before {
                top: 22px;
            }
        }
    }

    &.-end {
        .card-bus-stop__state {
            &::before {
                bottom: calc(100% - 22px);
            }
        }
    }
}
</style>
