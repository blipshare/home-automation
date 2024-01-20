import { onMounted, ref } from "vue";
import { useWeatherStore } from "@/store/weather_store";

export enum ForecastType {
  MOSTLY_SUNNY = "Mostly Sunny",
  PARTLY_SUNNY = "Partly Sunny",
  MOSTLY_CLOUDY = "Mostly Cloudy",
  SLIGHT_CHANCE_LIGHT_RAIN = <any>"Slight Chance Light Rain",
  LIGHT_RAIN = <any>"Light Rain",
  RAIN = <any>"Rain",
  CHANCE_LIGHT_SNOW = <any>"Chance Light Snow",
}

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
  precepProb: string;
  forecastType: ForecastType;
}

export function processWeather() {
  const store = useWeatherStore();
  const loading = ref(false);
  const error = ref("");
  const metadata = ref<Metadata>();
  const hourlyData = ref<HourlyData[]>();

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
          precepProb: period["probabilityOfPrecipitation"]["value"] + "%",
          forecastType: ForecastType[period["shortForecast"]] as ForecastType,
        });
      }
    }
    console.log("tempData");
    console.log(tempData);

    hourlyData.value = ref<HourlyData[]>(tempData).value;
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
