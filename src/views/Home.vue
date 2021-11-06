<script setup>
</script>

<template>
    <div class="page-index">
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <ButtonCategory>
                        ButtonCategory
                    </ButtonCategory>
                </div>
                <div class="col-3">
                    <ButtonCategory :active="true">
                        景點
                    </ButtonCategory>
                </div>
                <div class="col-3">
                    <Dropdown title="Dropdown">
                        Dropdown
                    </Dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.page-index {
    text-align: center;
    background-color: #eeeeee;
}
</style>
