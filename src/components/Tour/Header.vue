
<template>
    <header class="tour-header">
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
        <div class="tour-header__tool">
            <div class="tour-header__tool-item tour-header__tool-saved">
                <Icon name="like-default" /><span>收藏項目</span>
            </div>
            <div class="tour-header__tool-item tour-header__tool-info">
                <Icon name="info" /><span>使用說明</span>
            </div>
        </div>
    </header>
</template>
<style lang="scss">
    $class-name: '.tour-header';
    #{$class-name} {
        display: flex;
        padding: 20px;
        color: color('White');
        background-color: color('Black');
        @include typo-h4;

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

        &__tool {
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
        }
    }
</style>
