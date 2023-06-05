import { IGoalExcludingAll } from './goals';

export interface IDifferenceInPercent {
  increased: boolean;
  isZero: boolean;
  value: number;
}

export interface IReport {
  totalGoalsForCurrentYearExcludingAll: IGoalExcludingAll,
  allCreatedGoalsForCurrentYear: number,
  differenceBetweenYears: IDifferenceInPercent;
}