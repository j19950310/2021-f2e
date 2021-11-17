<template>
    <ButtonMain
        :icon="icon"
        class="button-secondary"
    >
        <slot />
    </ButtonMain>
</template>
<script>
export default {
    props: {
        icon: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss">
    .button-secondary {
        // default
        color: color('Black');
        background-color: transparent;
        border: 2px solid color('Black');

        .icon {
            color: color('Black');
        }

        &:hover {
            color: color('White');
            background-color: color('Black');

            .icon {
                color: var(--primary, color('Primary'));
            }
        }
    }
</style>
