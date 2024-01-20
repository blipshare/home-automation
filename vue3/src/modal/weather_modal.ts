export enum ForecastType {
  UNDEFINED = "undefined",
  MOSTLY_SUNNY = "Mostly Sunny",
  PARTLY_SUNNY = "Partly Sunny",
  MOSTLY_CLOUDY = "Mostly Cloudy",
  SLIGHT_CHANCE_LIGHT_RAIN = <any>"Slight Chance Light Rain",
  LIGHT_RAIN = <any>"Light Rain",
  RAIN = <any>"Rain",
  CHANCE_LIGHT_SNOW = <any>"Chance Light Snow",
}

export interface HourlyData {
  startTime: string;
  endTime: string;
  temp: string;
  tempUnit: string;
  isDayTime: boolean;
  precepProb: string;
  forecastType: ForecastType;
  includeInMainView: boolean;
}
