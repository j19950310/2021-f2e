<template>
    <header
        class="tour-header"
        :class="{
            '-hide': isHeaderHide,
        }"
    >
        <div class="tour-header__wrap">
            <div class="tour-header__home">
                <div class="tour-header__logo">
                    <img
                        src="@/assets/logo.png"
                        alt="十字元Logo"
                    >
                </div>
                <p>台灣觀光懶人包</p>
                <router-link to="/tour" />
            </div>
            <transition-group
                v-if="isSearch"
                class="tour-header__search"
                name="flip"
                tag="div"
            >
                <div
                    v-show="!isSearchBar"
                    key="search"
                    class="tour-header__search-main"
                >
                    <div>
                        <div
                            class="tour-header__search-item"
                            @click="isSearchBar = true"
                        >
                            <Icon name="search" /><span>搜尋</span>
                        </div>
                        <div
                            class="tour-header__search-item"
                            @click="$emit('search','filter')"
                        >
                            <Icon name="filter" /><span>篩選</span>
                        </div>
                        <div
                            class="tour-header__search-item"
                            @click="$emit('search','shuffle')"
                        >
                            <Icon name="shuffle" /><span>探索</span>
                        </div>
                    </div>
                </div>
                <div
                    v-show="isSearchBar"
                    key="searchBar"
                    class="tour-header__search-bar"
                >
                    <div>
                        <SearchFilter
                            v-model="searchValue"
                            @submit="submit"
                            @click="searchFilterClickHandler"
                            @focus="isSearchFocus = true"
                            @blur="isSearchFocus = false"
                        />
                    </div>
                </div>
            </transition-group>
            <div class="tour-header__tool">
                <div
                    v-blur="() => isSavedPopUp = false"
                    class="tour-header__tool-item tour-header__tool-saved"
                    :class="{'-active': isSavedPopUp}"
                    @click="isSavedPopUp = !isSavedPopUp"
                >
                    <Icon
                        v-show="!isSavedPopUp"
                        name="like-default"
                    />
                    <Icon
                        v-show="isSavedPopUp"
                        name="like-active"
                    />
                    <span>收藏項目</span>
                    <div class="tour-header__tool-pop-up -saved">
                        <p v-if="!savedSpotPreview.length">
                            尚無收藏項目
                        </p>
                        <router-link
                            v-for="card in savedSpotPreview"
                            v-else
                            :key="card.id"
                            class="tour-header__tool-pop-up-item"
                            :to="{
                                name: 'TourSpotSavedPopup',
                                query: {
                                    category: card.category,
                                },
                                params: {
                                    spot: card.id,
                                },
                            }"
                        >
                            <SaveCard

                                :title="card.Name"
                                :src="card.picture.src || defaultImage"
                                :tags="getClass(card)"
                            />
                        </router-link>
                        <ButtonThird>
                            查看全部
                            <router-link
                                :to="{
                                    name: 'TourSpotSaved',
                                }"
                            />
                        </ButtonThird>
                    </div>
                </div>
                <!-- <div class="tour-header__tool-item tour-header__tool-info">
                    <Icon name="info" /><span>使用說明</span>
                </div> -->
            </div>
        </div>
    </header>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultImage from '@/assets/default.png'
export default {
    name: 'TourHeader',
    inject: ['scrollInstance'],
    props: {
        isSearch: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['search'],
    data () {
        return {
            defaultImage,
            isSearchBar: false,
            isSavedPopUp: false,
            isSearchFocus: false,
            searchValue: '',
        }
    },
    computed: {
        ...mapGetters({
            savedSpotPreview: 'tour/getSavedSpotPreview',
        }),
        transitionName () {
            return this.isSearch ? 'tour-header-search' : 'tour-header-search-bar'
        },
        isHeaderHide () {
            const { direction, scrollTop } = this.scrollInstance
            return !this.isSearchFocus && !this.isSavedPopUp && (scrollTop && direction > 0)
        },
    },
    methods: {
        searchFilterClickHandler (method) {
            this.$emit('search', method)
        },
        submit () {
            this.$router.push({
                name: 'TourSpotSearch',
                query: {
                    keyword: this.searchValue,
                },
            })
        },
        getClass (spot) { // TODO
            const { Class, Class1, Class2, Class3 } = spot
            return [Class, Class1, Class2, Class3].filter(Boolean)
        },
    },
}
</script>

<style lang="scss">
$class-name: '.tour-header';
#{$class-name} {
    @include typo-h4;

    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: map-get($z-index, header);

    &.-hide {
        pointer-events: none;
    }

    &__wrap {
        display: flex;
        padding: $padding * 4 $padding * 5;
        color: color('White');
        background-color: color('Black');
        transition: transform 0.3s ease-in-out;
        @include media-breakpoint-down(tablet) {
            padding: $padding * 2.5;
        }

        .-hide > & {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
    }

    &__home {
        position: relative;
        display: flex;
        align-items: center;
        user-select: none;

        a {
            @include link;
        }
    }

    &__logo {
        margin-right: 10px;
        width: 30px;

        img {
            width: 100%;
        }
    }

    &__search {
        @include typo-h4;

        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        @include media-breakpoint-down(tablet) {
            display: none;
        }

        .icon {
            @include size(1.5rem);

            margin-right: $padding / 2;
            color: color('Primary');
        }

        &-main {
            > * {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        &-item {
            display: flex;
            align-items: center;
            margin: 0 $padding * 1.5;
            cursor: pointer;

            span {
                padding-bottom: 2px;
            }
        }

        &-bar {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
        }
    }

    &__tool {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;

        &-item {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &.-active {
                span {
                    &::before {
                        opacity: 1;
                    }
                }
            }

            span {
                position: relative;
                padding-bottom: $padding / 2;

                &::before {
                    @include size(100%, 2px);

                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background-color: color('Primary');
                    opacity: 0;
                }
            }
        }

        .icon {
            @include size(1.5rem);

            margin-right: 4px;
        }

        &-pop-up {
            position: absolute;
            bottom: 0;
            right: 0;
            overflow: auto;
            padding: $padding * 3;
            width: 240px;
            max-height: 485px;
            color: color('Black');
            background-color: color('White');
            border-radius: 24px;
            opacity: 0;
            box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
            transition: opacity .3s;
            transform: translate(0, 100%) translate(0, $padding * 2);

            &.-saved {
                .tour-header__tool-saved.-active & {
                    opacity: 1;
                }

                .save-card {
                    & ~ * {
                        margin-top: $padding * 2;
                    }
                }

                .button-third {
                    position: relative;
                    margin-top: $padding * 2;
                    width: 100%;
                    text-align: center;

                    a {
                        @include link;
                    }
                }

                > a {
                    display: block;
                }

                > p {
                    text-align: center;
                    color: color('Dark-Gray');
                }
            }

            &-item {
                display: block;
                padding-top: 8px;
            }
        }
    }
}
</style>
