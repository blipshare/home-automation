export enum ForecastType {
  UNDEFINED = "undefined",
  SUNNY = "undefined",
  MOSTLY_SUNNY = "Mostly Sunny",
  PARTLY_SUNNY = "Partly Sunny",
  PARTLY_CLOUDY = "Partly Cloudy",
  MOSTLY_CLOUDY = "Mostly Cloudy",
  SLIGHT_CHANCE_LIGHT_RAIN = "Slight Chance Light Rain",
  LIGHT_RAIN = "Light Rain",
  CHANCE_LIGHT_RAIN = "Chance Light Rain",
  RAIN = "Rain",
  RAIN_AND_SNOW = "Rain And Snow",
  RAIN_AND_SNOW_LIKELY = "Rain And Snow Likely",
  CHANCE_LIGHT_SNOW = "Chance Light Snow",
  MOSTLY_CLEAR = "Mostly Clear",
}

export interface HourlyData {
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
