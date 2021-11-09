<template>
    <footer class="tour-footer">
        <div class="tour-footer__copyright">
            <span>©</span>
            <span>2021</span>
            <span>十字元</span>
            <span>All Rights Reserved.</span>
        </div>
        <div class="tour-footer__tool">
            <div class="tour-footer__tool-item">
                關於我們
            </div>
            <div class="tour-footer__tool-item">
                關於我們
            </div>
            <div class="tour-footer__tool-item">
                <Icon name="info" /><span>使用說明</span>
            </div>
        </div>
    </footer>
</template>
<style lang="scss">
    $class-name: '.tour-footer';
    #{$class-name} {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 40px;
        color: color('White');
        background-color: color('Black');

        &__copyright {
            display: flex;
            justify-content: end;

            span {
                margin-right: 4px;
            }
        }

        &__tool {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            flex: 0 0 auto;
            padding-right: 40px;
            $spacing: 16px;

            &-item {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px #{$spacing} 10px 0;
                cursor: pointer;

                & + & {
                    &::before {
                        content: '';
                        display: block;
                        @include size(1px, 12px);

                        margin-right: $spacing;
                        background-color: color('Dark-Gray');
                    }
                }

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
