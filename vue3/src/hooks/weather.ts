import { onMounted, ref } from "vue";
import { useWeatherStore } from "@/store/weather_store";

export interface Metadata {
  location: string;
  generatedOn: string;
}

export interface HourlyData {
  date: string;
  temp: string;
}

export function processWeather() {
  const store = useWeatherStore();
  const loading = ref(false);
  const error = ref("");
  const metadata = ref<Metadata>();
  const hourlyData = ref<HourlyData[]>;

  function clearFields() {
    loading.value = false;
    error.value = "";
  }

  async function parseData(data: string) {
    const json = await JSON.parse(data);

    // collect the metadata
    metadata.value = {
      location: "",
      generatedOn: json["generatedAt"],
    };

    // collect the detail info
    const periods = json["periods"];
    console.log("periods: " + periods);
  }

  async function getHourlyData() {
    clearFields();
    await store
      .fetchHourlyData()
      .then(() => {
        console.log("value: " + store.hourlyData);
        parseData(store.hourlyData);
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
    error,
  };
}
