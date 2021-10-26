<template>
    <svg
        aria-hidden="true"
        class="icon"
    >
        <use :href="`#${name}`" />
    </svg>
</template>

<script setup>

defineProps({
    name: {
        type: String,
        required: true,
    },
})

</script>
