
<template>
    <header
        class="tour-header"
        :class="{'-hide': isHeaderHide}"
    >
        <div class="tour-header__wrap">
            <div class="tour-header__home">
                <img
                    width="31"
                    height="20"
                    class="tour-header__logo"
                    src="@/assets/logo.png"
                    alt="十字元Logo"
                >
                台灣觀光懶人包
                <router-link to="/tour" />
            </div>
            <transition
                name="flip"
                mode="out-in"
            >
                <div
                    v-if="!isSearchBar && isSearch"
                    class="tour-header__search"
                >
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
                <div
                    v-else-if="isSearch"
                    class="tour-header__search-bar"
                >
                    <SearchFilter
                        v-model="searchValue"
                        @submit="submit"
                        @click="SearchFilterClickHandler"
                    />
                </div>
            </transition>
            <div class="tour-header__tool">
                <div
                    class="tour-header__tool-item tour-header__tool-saved"
                    @click="openSavePopUp"
                >
                    <Icon name="like-default" /><span>收藏項目</span>
                </div>
                <div class="tour-header__tool-item tour-header__tool-info">
                    <Icon name="info" /><span>使用說明</span>
                </div>
                <transition name="fade">
                    <div
                        v-if="!isHeaderHide && isSavedPopUp"
                        ref="savedPopUp"
                        class="tour-header__tool-pop-up"
                        tabindex="0"
                        @blur="isSavedPopUp = false"
                    >
                        <SaveCard
                            v-for="card in savedSpotPreview"
                            :key="card.id"
                            :title="card.Name"
                            :src="card.picture.src || defaultImage"
                            :tags="getClass(card)"
                        />
                        <ButtonThird>
                            查看全部
                            <router-link
                                :to="{
                                    name: 'TourSpotSaved'
                                }"
                            />
                        </ButtonThird>
                    </div>
                </transition>
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
            isClickSearch: false,
            isSearchBar: false,
            searchValue: '',
            scrollHide: false,
            isSavedPopUp: false,
            defaultImage,
        }
    },
    computed: {
        transitionName () {
            return this.isSearch ? 'tour-header-search' : 'tour-header-search-bar'
        },
        isHeaderHide () {
            return this.scrollInstance.direction === 1 && this.scrollInstance.scrollTop > 84
        },
        ...mapGetters({
            savedSpotPreview: 'tour/getSavedSpotPreview',
        }),
    },
    mounted () {

    },
    methods: {
        SearchFilterClickHandler (method) {
            this.$emit('search', method)
        },
        openSavePopUp () {
            this.isSavedPopUp = true
            this.$nextTick(() => {
                this.$refs.savedPopUp.focus()
            })
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
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    z-index: map-get($z-index, header);
    @include typo-h4;

    &__wrap {
        display: flex;
        padding: 20px;
        color: color('White');
        background-color: color('Black');
        transition: transform 0.3s ease-in-out;

        .-hide > & {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
    }

    &__home {
        position: relative;
        display: flex;
        padding: 12px 24px;
        cursor: pointer;
        flex: 0 0 auto;
        user-select: none;

        img {
            margin-right: 10px;
        }

        a {
            @include link;
        }
    }

    &__search {
        @include typo-h4;

        display: flex;
        align-items: center;
        justify-content: center;
        margin: -2px;
        transition: transform 0.3s ease;
        flex: 1 0 auto;
        transform-style: preserve-3d;

        &-item {
            display: flex;
            align-items: center;
            margin: 0 8px;
            padding: 10px;
            cursor: pointer;

            span {
                padding-bottom: 2px;
            }
        }

        .icon {
            margin-right: 4px;
            font-size: 24px;
            color: color('Primary');
        }
    }

    &__search-bar {
        display: flex;
        justify-content: center;
        margin: -6px 0;
        padding: 0 40px;
        transition: transform 0.3s ease;
        flex: 1 0 auto;
        transform-style: preserve-3d;
        transform: perspective(500px);

        .search-filter {
            flex: 0 1 480px;
        }
    }

    &__tool {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        flex: 0 0 auto;

        &-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 8px;
            cursor: pointer;

            span {
                padding-bottom: 2px;
            }
        }

        .icon {
            margin-right: 4px;
            font-size: 24px;
        }

        &-pop-up {
            position: fixed;
            top: 72px;
            right: 46px;
            padding: 24px;
            width: 240px;
            color: color('Black');
            background-color: color('White');
            border-radius: 24px;
            z-index: 2;
            box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);

            .save-card {
                padding-top: 8px;
            }

            .button-third {
                position: relative;
                margin-top: 24px;
                width: 100%;
                text-align: center;

                a {
                    @include link;
                }
            }
        }
    }
}
</style>
