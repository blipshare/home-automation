<template>
  <div class="flex items-center justify-center px-6">
    <div class="w-full p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center center">
        <span class="text-2xl font-semibold text-gray-700">
          Home Automation</span
        >
      </div>
      <Weather v-if="getSelectedView() === 'weather'" />
      <FaceRecog v-if="getSelectedView() === 'faceRecog'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import FaceRecog from "@/components/FaceRecog.vue";
import Weather from "./weather.vue";

// Looks for a local storage item and returns if present
const getSelectedView = function () {
  return JSON.parse(localStorage.getItem("selected-view") || "weather");
};

</script>
