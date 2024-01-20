import { onMounted, ref } from "vue";
import { useWeatherStore } from "@/store/weather_store";

export interface Metadata {
  location: string;
  generatedOn: string;
}

export interface HourlyData {
  startTime: string;
  endTime: string;
  temp: string;
  tempUnit: string;
  isDayTime: boolean;
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
    const tempData = [];
    const periods = json["periods"];
    console.log(periods.length);
    for (let idx = 0; idx < periods.length; idx++) {
      const period = periods[idx];
      console.log(period);
      if (period != null && period.length != 0) {
        tempData.push({
          startTime: new Date(period["startTime"]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(period["endTime"]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: period["temperature"],
          tempUnit: period["temperatureUnit"],
          isDayTime: Boolean(period["isDayTime"]),
        });
      }
    }
    console.log("tempData");
    console.log(tempData);
    /**
    for (const period in periods) {
      console.log("period: " + period);
      tempData.push({
        endTime: new Date(period["endTime"]).toLocaleDateString('en-US',{ hour: '2-digit', minute: '2-digit' });
      });
    }
    **/
    //for (const period in json["periods"]) {
    //  const tempData = periods[period]
    //}
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
