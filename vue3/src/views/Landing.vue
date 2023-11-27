<template>
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
        <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
            <div class="flex items-center justify-center center">
                <span class="text-2xl font-semibold text-gray-700">
                    Home Automation</span>
            </div>            
            <FaceRecog />
        </div>
    </div>
</template>
<script setup lang="ts">
import FaceRecog from '@/components/FaceRecog.vue';
</script>