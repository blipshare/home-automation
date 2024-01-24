import { onMounted, ref, defineProps } from "vue";
import { useWeatherStore } from "@/store/weather_store";
import { ForecastType, type HourlyData } from "@/modal/weather_modal";

export interface Metadata {
  location: string;
  generatedOn: string;
}

export function processWeather() {
  const store = useWeatherStore();
  const loading = ref(false);
  const error = ref("");
  const metadata = ref<Metadata>();
  const hourlyData = ref<HourlyData[]>();
  const currentTime = ref<Date>();

  function clearFields() {
    loading.value = false;
    error.value = "";
  }

  function getForecastType(type: string) {
    const idx = Object.values(ForecastType).findIndex((val) => val === type);
    let foundVal: ForecastType = ForecastType.UNDEFINED;
    if (idx > 0) {
      foundVal = Object.keys(ForecastType)[idx] as ForecastType;
    }
    return foundVal;
  }

  function isPredictedForecast(
    predictedForecast: ForecastType,
    forecast: HourlyData
  ) {
    let isPredicted = false;
    if (forecast.forecastType != null) {
      const foundIt = Object.values(ForecastType).findIndex(
        (val) => val == predictedForecast
      );

      console.log("foundit: " + foundIt);
      isPredicted =
        foundIt >= 0 &&
        Object.keys(ForecastType)[foundIt] == forecast.forecastType;
    }
    return isPredicted;
  }

  function splitTime(time: string) {
    const regexp = /(\d+:\d+)\s(AM|PM)/;
    const data = time.match(regexp);
    if (data != null && data.length == 3) {
      return [data[1], data[2]];
    }

    return time;
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

    for (let idx = 0; idx < 5; idx++) {
      const period = periods[idx];
      const startTime = new Date(period["startTime"]);
      const shouldShowInMainView =
        startTime.getTime() - currentTime.value!.getTime() > 0;

      if (period != null && period.length != 0) {
        tempData.push({
          startTime: startTime.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(period["endTime"]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: period["temperature"],
          tempUnit: period["temperatureUnit"],
          isDayTime: period["isDayTime"],
          precepProb: period["probabilityOfPrecipitation"]["value"] + "%",
          forecastType: getForecastType(period["shortForecast"]),
          includeInMainView: shouldShowInMainView,
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
    // fake the current time for now
    currentTime.value = new Date("2024-01-07T03:00:00-05:00");
    getHourlyData();
  });

  defineProps<{
    forecast: HourlyData;
  }>();

  return {
    loading,
    error,
    metadata,
    hourlyData,
    splitTime,
    isPredictedForecast,
  };
}
