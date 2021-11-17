<script setup>

</script>

<template>
    <div
        class="week2-component"
        :style="{'--primary': '#32F3AE'}"
    >
        <div class="container">
            <BikeListCard />
        </div>
        <DragPopup>
            <BikeCard />
        </DragPopup>
    </div>
</template>

<style lang="scss">
.week2-component {

}
</style>
