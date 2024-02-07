export enum ForecastType {
  UNDEFINED = "undefined",
  MOSTLY_SUNNY = "Mostly Sunny",
  PARTLY_SUNNY = "Partly Sunny",
  PARTLY_CLOUDY = "Partly Cloudy",
  MOSTLY_CLOUDY = "Mostly Cloudy",
  SLIGHT_CHANCE_LIGHT_RAIN = "Slight Chance Light Rain",
  LIGHT_RAIN = "Light Rain",
  RAIN = "Rain",
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
  includeInMainView: boolean;
}

export interface DailyData {
  date: string;
  maxTemp: number;
  minTemp: number;
  tempUnit: string;
  precepProb: number;
  forecastType: ForecastType;
}
