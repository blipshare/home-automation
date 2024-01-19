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
      await fetch(
        "https://robohome/weather/api/forecast/?type=hourly&lat=39.5&lon=39.5"
      )
        .then(async (resp) => {
          console.log(resp);
          const data = await resp.json();
          console.log(data.data);
          console.log("dict: " + data["data"]);
          this.hourlyData = JSON.stringify(data.data);
        })
        .catch((err) => {
          throw err;
        });
    },
  },
});
