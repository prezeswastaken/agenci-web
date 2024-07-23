<script setup lang="ts">
useHead({
    title: "Agenci",
});
</script>

<template>
    <UContainer
        class="flex flex-col gap-5 items-center min-h-screen font-serif text-gray-100 bg-gray-900"
    >
        <slot />
    </UContainer>
</template>

<style scoped></style>
