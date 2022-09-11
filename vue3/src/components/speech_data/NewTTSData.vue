<template>
  <div>
    <button
      @click="open = true"
      class="ml-2 px-4 py-1 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
    >
      New
    </button>

    <div
      :class="`modal ${
        !open && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        @click="clearFields()"
        class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
      ></div>

      <div
        class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="px-6 py-4 text-left modal-content">
          <!--Title-->
          <div class="flex items-center justify-between pb-3">
            <p class="text-2xl font-bold">New Message</p>
            <div class="z-50 cursor-pointer modal-close" @click="clearFields()">
              <svg
                class="text-black fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <!-- Enter text field -->
          <div class="relative mx-4 lg:mx-0">
            <label class="block">
              <p class="text-sm text-red-700">{{error}}</p>
            </label>
            <form class="mt-4" @submit.prevent="">
              <label class="block">
                <span class="text-sm text-gray-700">Enter your Message</span>
                <textarea
                  type="text"
                  class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  v-model="text"
                />
                <audio id="audio" type="audio/wav" class="mt-2" controls />
              </label>
            </form>
          </div>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
              @click="clearFields()"
              class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
            >
              Close
            </button>
            <button
              @click="sendData()"
              class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              :disabled=loading
            >
              {{ submitBtnText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { sendDataToServer } from '@/hooks/speech_data/createSpeechData';
  const {
    loading,
    error,
    open,
    name,
    text,
    submitBtnText,
    clearFields,
    sendData
  } = sendDataToServer();
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>