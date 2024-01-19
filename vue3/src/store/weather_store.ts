import { defineStore } from "pinia";

export const useWeatherStore = defineStore("weather", {
  state: () => ({
    hourlyData: "",
  }),
  getters: {
    //getHourlyData: (state) => JSON.parse(hourlyData),
  },
  actions: {
    async fetchHourlyData() {
      const response = await fetch(
        "https://robohome/weather/api/forecast/?type=hourly&lat=39.5&lon=39.5"
      );
      const data = await response.json();
      console.log(data);
    },
  },
});
