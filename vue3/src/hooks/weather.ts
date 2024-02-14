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
  const hourlyData = ref<HourlyData[]>();
  const dailyData = ref<DailyData[]>();
  const currentTime = ref<String>();
  const currentTemp = ref<Number>();
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
    const filteredData = hourlyData.value?.filter(
      (data) => data.dateStr === date
    );

    if (filteredData != null) {
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
      for (const day of Object.keys(allData).filter(
        (key) => key != currentTime.value
      )) {
        console.log("day: " + day);
        const dailyData = allData.value[day];
        console.log("dailydata");
        console.log(dailyData);
        const startData = dailyData[0];
        const maxMinData = findMaxMin(day);

        tempData.push({
          date: day,
          maxTemp: maxMinData["maxTemp"],
          minTemp: maxMinData["minTemp"],
          tempUnit: startData.tempUnit,
          precepProb: maxMinData["maxPrec"],
          forecastType: maxMinData["forecastType"],
        });
        console.log("tempdata in pop:");
        console.log(tempData);
      }

      console.log("daily data:");
      console.log(tempData);
    }
    dailyData.value = ref<DailyData[]>(tempData).value;
  }
  function populateDailyDataOld(json: any) {
    const tempData = [];
    for (let idx = 17; idx < json.length - 24; idx += 24) {
      const dailyData = json.slice(idx, idx + 24);
      if (dailyData.length > 0) {
        const startData = dailyData[0];
        const endData = dailyData[dailyData.length - 1];
        console.log("startData");
        console.log(startData);
        console.log("endData");
        console.log(endData);
        const endTime = new Date(endData["endTime"]);
        const dateStr = endTime.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        });
        const maxMinData = findMaxMin(dateStr);
        tempData.push({
          date: dateStr,
          maxTemp: maxMinData["maxTemp"],
          minTemp: maxMinData["minTemp"],
          tempUnit: startData["temperatureUnit"],
          precepProb: maxMinData["maxPrec"],
          forecastType: maxMinData["forecastType"],
        });
      }
    }
    //console.log("dailyData");
    //console.log(tempData);

    dailyData.value = ref<DailyData[]>(tempData).value;
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
    const tempData2: Record<string, HourlyData[]> = {};
    const periods = json["periods"];

    for (let idx = 0; idx < periods.length; idx++) {
      const period = periods[idx];
      const startTime = new Date(period["startTime"]);
      const dateStr = startTime.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      if (period != null && period.length != 0) {
        const hData = {
          startTime: startTime.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(period["endTime"]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: dateStr,
          temp: Number(period["temperature"]),
          tempUnit: period["temperatureUnit"],
          isDayTime: period["isDayTime"],
          precepProb: Number(period["probabilityOfPrecipitation"]["value"]),
          forecastType: getForecastType(period["shortForecast"]),
        };
        if (dateStr in tempData2) {
          tempData2[dateStr].push(hData);
        } else {
          tempData2[dateStr] = [hData];
        }

        tempData.push({
          startTime: startTime.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(period["endTime"]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: dateStr,
          temp: Number(period["temperature"]),
          tempUnit: period["temperatureUnit"],
          isDayTime: period["isDayTime"],
          precepProb: Number(period["probabilityOfPrecipitation"]["value"]),
          forecastType: getForecastType(period["shortForecast"]),
        });
      }
    }

    // save the hourly data
    hourlyData.value = ref<HourlyData[]>(tempData).value;

    allData.value = ref<Record<string, HourlyData[]>>(tempData2).value;
    console.log("allData");
    console.log(allData.value);

    // populate daily data
    //populateDailyData(periods);
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
    currentTime.value = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    getHourlyData();
  });

  defineProps<{
    forecast: HourlyData;
  }>();

  return {
    loading,
    error,
    metadata,
    allData,
    hourlyData,
    dailyData,
    currentTime,
    currentTemp,
    splitTime,
    isPredictedForecast,
  };
}
