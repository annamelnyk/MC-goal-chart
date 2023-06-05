import { IDifferenceInPercent } from "./report";

export interface IChartByCategory {
  data: number[];
  labels: string[];
  goals: number;
  differenceBetweenYears: IDifferenceInPercent;
  category: string;
}

// Chart styles
type FontSize = string;
type Units = string;
type FontFamily = string;
type FontWeight = string;

export type ChartLabelFont = {
  size: FontSize,
  units: Units,
  family: FontFamily,
  weight: FontWeight,
}

export interface ChartLabelStyle {
  text: string;
  font: ChartLabelFont;
  color: string;
}