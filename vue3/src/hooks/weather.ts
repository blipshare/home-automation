import { onMounted, ref, defineProps } from "vue";
import { useWeatherStore } from "@/store/weather_store";
import {
  ForecastType,
  type HourlyData,
  type DailyData,
} from "@/modal/weather_modal";

export interface Metadata {
  location: string;
  generatedOn: string;
}

export function processWeather() {
  const store = useWeatherStore();
  const loading = ref(false);
  const error = ref("");
  const metadata = ref<Metadata>();
  const dailyData = ref<DailyData[]>();
  const today = ref<string>();
  const currentTime = ref<Date>();
  const currentTemp = ref<Number>();
  const currentForecast = ref<ForecastType>();
  const allData = ref<Record<string, HourlyData[]>>();

  function clearFields() {
    loading.value = false;
    error.value = "";
  }

  function getForecastType(type: string) {
    const idx = Object.values(ForecastType).findIndex((val) => val === type);
    let foundVal: ForecastType = ForecastType.UNDEFINED;
    if (idx >= 0) {
      foundVal = Object.keys(ForecastType)[idx] as ForecastType;
    }
    return foundVal;
  }

  function isPredictedForecast(
    predictedForecast: ForecastType,
    forecastType: ForecastType
  ) {
    let isPredicted = false;
    if (forecastType != null) {
      const foundIt = Object.values(ForecastType).findIndex(
        (val) => val === predictedForecast
      );

      isPredicted =
        foundIt >= 0 && Object.keys(ForecastType)[foundIt] == forecastType;
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

  function findMaxMin(date: string) {
    if (allData.value != null) {
      const day = Object.keys(allData.value).find((day) => day === date);
      console.log("minmax Idx: " + day);

      if (day != null) {
        const filteredData = allData.value[day];
        console.log("filteredData:");
        console.log(filteredData);
        const minTemp = filteredData.reduce(
          (a, b) => Math.min(a, b.temp),
          Number.MAX_VALUE
        );
        const maxTemp = filteredData.reduce((a, b) => Math.max(a, b.temp), -1);
        const maxPrecIdx = filteredData.reduce(
          (iMax, x, i, arr) => (x.precepProb > arr[iMax].precepProb ? i : iMax),
          0
        );
        const maxPrecData = filteredData[maxPrecIdx];
        console.log(minTemp);
        console.log(maxTemp);
        console.log(maxPrecData);

        return {
          minTemp: minTemp,
          maxTemp: maxTemp,
          maxPrec: maxPrecData.precepProb,
          forecastType: maxPrecData.forecastType,
        };
      }
    }
    return {
      minTemp: -1,
      maxTemp: -1,
      maxPrec: -1,
      ForecastType: ForecastType.UNDEFINED,
    };
  }

  function populateDailyData() {
    const tempData = [];
    if (allData.value != null) {
      for (const day of Object.keys(allData.value)) {
        console.log("day: " + day);
        if (day === today.value) {
          continue;
        }
        const dailyData = allData.value[day];
        const startData = dailyData[0];
        const maxMinData = findMaxMin(day);
        console.log("maxMin");
        console.log(maxMinData);

        tempData.push({
          date: day,
          maxTemp: maxMinData["maxTemp"],
          minTemp: maxMinData["minTemp"],
          tempUnit: startData.tempUnit,
          precepProb: maxMinData["maxPrec"],
          forecastType: maxMinData["forecastType"],
        });
      }

      console.log("daily data:");
      console.log(tempData);
    }
    dailyData.value = ref<DailyData[]>(tempData).value;
  }

  function setCurrentTemp() {
    let temp = -1;
    let forecastType = ForecastType.UNDEFINED;
    if (
      currentTime.value != null &&
      allData.value != null &&
      today.value != null
    ) {
      const currTime = currentTime.value.getTime();
      const forecasts = allData.value[today.value];
      // find the temp within the start and end of the current time
      const timeIdx = forecasts.findIndex(
        (forecast) =>
          forecast.rawStartTime.getTime() >= currTime &&
          forecast.rawEndTime.getTime() < currTime
      );

      console.log("Current Time:");
      console.log(currentTime.value);
      console.log("curr time:");
      console.log(currTime);
      console.log("curr time idx: " + timeIdx);
      if (timeIdx >= 0) {
        temp = forecasts[timeIdx].temp;
        forecastType = forecasts[timeIdx].forecastType;
      }
      console.log("temp: " + temp);
    }

    currentTemp.value = temp;
    currentForecast.value = forecastType;
  }

  async function parseData(data: string) {
    const json = await JSON.parse(data);

    // collect the metadata
    metadata.value = {
      location: "",
      generatedOn: json["generatedAt"],
    };

    // collect the detail info
    const tempData: Record<string, HourlyData[]> = {};
    const periods = json["periods"];

    for (let idx = 0; idx < periods.length; idx++) {
      const period = periods[idx];
      const startTime = new Date(period["startTime"]);
      const endTime = new Date(period["endTime"]);
      const dateStr = startTime.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      if (period != null && period.length != 0) {
        const hData = {
          rawStartTime: startTime,
          rawEndTime: endTime,
          startTime: startTime.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: endTime.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: dateStr,
          temp: Number(period["temperature"]),
          tempUnit: period["temperatureUnit"],
          isDayTime: Boolean(period["isDaytime"]),
          precepProb: Number(period["probabilityOfPrecipitation"]["value"]),
          forecastType: getForecastType(period["shortForecast"]),
        };
        if (dateStr in tempData) {
          tempData[dateStr].push(hData);
        } else {
          tempData[dateStr] = [hData];
        }
      }
    }

    allData.value = ref<Record<string, HourlyData[]>>(tempData).value;
    console.log("allData");
    console.log(allData.value);

    // populate daily data
    populateDailyData();
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
    currentTime.value = new Date();
    today.value = currentTime.value.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    getHourlyData().then(() => setCurrentTemp());
  });

  defineProps<{
    forecast: HourlyData;
  }>();

  return {
    loading,
    error,
    metadata,
    allData,
    dailyData,
    today,
    currentTemp,
    splitTime,
    isPredictedForecast,
  };
}
