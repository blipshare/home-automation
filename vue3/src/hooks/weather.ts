import { onMounted, ref } from "vue";
import { useWeatherStore } from "@/store/weather_store";

export function processWeather() {
  const store = useWeatherStore();
  const loading = ref(false);
  const error = ref("");

  function clearFields() {
    loading.value = false;
    error.value = "";
  }

  async function getHourlyData() {
    clearFields();
    await store
      .fetchHourlyData()
      .then(() => {
        console.log("value: " + store.hourlyData);
      })
      .catch((err) => {
        error.value = "Error getting hourly data..." + err.value;
        console.log(error.value);
      });

    loading.value = false;
  }

  onMounted(() => {
    getHourlyData();
  });

  return {
    loading,
    error
  };
}
