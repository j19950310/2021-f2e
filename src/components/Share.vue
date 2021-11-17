<script setup>
const props = defineProps({
    socialType: {
        type: String,
        required: true,
    },
})

const LINK_MAP = Object.freeze({
    facebook: 'http://www.facebook.com/sharer.php?u=',
    // line: 'http://www.linkedin.com/shareArticle?mini=true&url=',
    twitter: 'https://twitter.com/share?url=',
})

const openShare = () => {
    const link = LINK_MAP[props.socialType]
    if (link) {
        window.open(link + encodeURIComponent(window.location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600')
    }
}
</script>

<template>
    <div class="share">
        <div
            class="share__link"
            @click="openShare"
        >
            <Icon :name="socialType" />
        </div>
    </div>
</template>

<style lang="scss">
.share {
    &__link {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: $padding;
        justify-self: center;
        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: var(--primary, color('Primary'));
            }
        }

        .icon {
            @include size(1.5rem);
        }
    }
}
</style>
