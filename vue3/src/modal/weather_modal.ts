export enum ForecastType {
  UNDEFINED = "undefined",
  SUNNY = "Sunny",
  MOSTLY_SUNNY = "Mostly Sunny",
  PARTLY_SUNNY = "Partly Sunny",
  PARTLY_CLOUDY = "Partly Cloudy",
  MOSTLY_CLOUDY = "Mostly Cloudy",
  SLIGHT_CHANCE_LIGHT_RAIN = "Slight Chance Light Rain",
  LIGHT_RAIN = "Light Rain",
  CHANCE_LIGHT_RAIN = "Chance Light Rain",
  LIGHT_RAIN_LIKELY = "Light Rain Likely",
  RAIN = "Rain",
  SCATTERED_RAIN_SHOWERS = "Scattered Rain Showers",
  CHANCE_RAIN_SHOWERS = "Chance Rain Showers",
  RAIN_AND_SNOW = "Rain And Snow",
  RAIN_AND_SNOW_LIKELY = "Rain And Snow Likely",
  CHANCE_RAIN_AND_SNOW = "Chance Rain And Snow",
  SLIGHT_CHANCE_RAIN_AND_SNOW = "Slight Chance Rain And Snow",
  CHANCE_LIGHT_SNOW = "Chance Light Snow",
  CLEAR = "Clear",
  MOSTLY_CLEAR = "Mostly Clear",
}

export interface HourlyData {
  rawStartTime: Date;
  rawEndTime: Date;
  startTime: string;
  endTime: string;
  dateStr: string;
  temp: number;
  tempUnit: string;
  isDayTime: boolean;
  precepProb: number;
  forecastType: ForecastType;
}

export interface DailyData {
  date: string;
  maxTemp: number;
  minTemp: number;
  tempUnit: string;
  precepProb: number;
  forecastType: ForecastType;
}
