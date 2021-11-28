<template>
    <div
        class="card-bus-query"
        :class="{'-title': !isLink}"
        @click="$emit('click')"
    >
        <div class="card-bus-query__info">
            <div
                class="card-bus-query__info-label"
                v-text="name"
            />
            <div class="card-bus-query__info-route">
                {{ start }} <Icon name="round-trip" /> {{ end }}
            </div>
            <div
                v-if="stop && stop.estimateTime"
                class="card-bus-query__info-time"
            >
                到站時間 <span>{{ stop.estimateTime }}</span>
            </div>
        </div>
        <div
            v-if="isLink"
            class="card-bus-query__link"
            :data-uid="uid"
        >
            <Icon name="right" />
        </div>
    </div>
</template>
<script>
import { BusStopEstimatedTime } from '@/api/Bus'
export default {
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: '',
        },
        uid: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: '',
        },
        start: {
            type: String,
            default: '',
        },
        end: {
            type: String,
            default: '',
        },
        isLink: {
            type: Boolean,
            default: true,
        },
        stop: {
            type: BusStopEstimatedTime,
            default: undefined,
        },
    },
    mounted () {
    },
}
</script>
<style lang="scss">
    .card-bus-query {
        display: flex;
        align-items: center;
        padding: $padding * 1.5 0 $padding * 2;

        &.-title {
            padding-top: 0;
        }

        &__info {
            flex-grow: 1;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;

            &-label {
                @include typo-h4;

                padding: $padding * 0.5 $padding * 1.5;
                color: color('White');
                background-color: color('Black');
                border-radius: $padding;
                margin-bottom: $padding * 0.5;
            }

            &-route {
                @include typo-h3;
                @include text-ellipsis(1);

                .icon {
                    transform: translateY(0.3em);
                    font-size: 24px;
                    color: var(--primary);
                }

                .card-bus-query.-title & {
                    @include typo-h2;
                }
            }

            &-time {
                @include typo('ZH/Minimal_12px_Medium');

                color: color('Dark-Gray');

                span {
                    padding-left: 4px;
                    color: color('Dark-Gray');
                    @include typo('EN/D/H3_16px_Semi-Bold');
                }
            }
        }

        &__link {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 12px;
            background-color: color('Black');
            border-radius: 50%;
            flex: 0 0 40px;
            @include size(40px);

            transition: background-color 0.3s ease;

            .icon {
                font-size: 16px;
                color: color('White');
                transition: color 0.3s ease;
            }
        }
        @include hover {
            .card-bus-query__link {
                background-color: var(--primary);

                .icon {
                    color: color('Black');
                }
            }
        }
    }
</style>
