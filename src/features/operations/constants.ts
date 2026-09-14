import type { DprWeather } from "./types";

export const DPR_WEATHER_OPTIONS: { value: DprWeather; label: string }[] = [
  { value: "sunny", label: "Sunny" },
  { value: "cloudy", label: "Cloudy" },
  { value: "rainy", label: "Rainy" },
  { value: "hot", label: "Hot" },
  { value: "humid", label: "Humid" },
];

export const DPR_WRITE_ROLES = ["admin", "project_manager", "site_staff"];