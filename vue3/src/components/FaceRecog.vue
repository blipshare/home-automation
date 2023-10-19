<template>        
    <div class="flex w-full justify-center mt-4">
        <video id="video" :width="450" :height="337" autoplay playsinline></video>
        <canvas id="photoTaken" class="hidden"></canvas>
    </div>
    <div class="flex p-6 justify-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <a id="loginPhoto" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" role="button" @click="startLogin">
                Login
            </a>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { processFaceRecog } from '../hooks/facialRecog';

    const {        
        startLogin
    } = processFaceRecog()
</script>