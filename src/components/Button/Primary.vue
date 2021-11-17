<template>
    <ButtonMain
        :icon="icon"
        class="button-primary"
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
    .button-primary {
        // default
        color: color('White');
        background-color: color('Black');

        .icon {
            color: var(--primary, color('Primary'));
        }

        @include hover {
            color: color('Black');
            background-color: var(--primary, color('Primary'));

            .icon {
                color: color('Black');
            }
        }
    }
</style>
