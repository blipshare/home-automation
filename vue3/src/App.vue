<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
const defaultLayout = "default";
const { currentRoute } = useRouter();
const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);
localStorage.setItem("selected-view", JSON.stringify("weather"));
</script>
