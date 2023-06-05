import { Injectable } from '@angular/core';

import { IGoal } from 'src/app/model/types/goals';
import { IDifferenceInPercent, IReport } from 'src/app/model/types/report';

@Injectable({
  providedIn: 'root',
})
export class ReportByPeriodService {
  private goals: any = null;
  private year: string = '';
  private category: string = 'created'

  /**
   * Creates the report about goals by category per particular year
   * @public
   * @method
   * @param {GoalsPerYear} goals - list of goals per year splitted by months with keys "YEAR-MONTH_NUMBER_1"
   * @param {String} year - specific year of goals
   * @param {String} category - specific category of goals
   * @returns @type {IReport}  
  */
  public buildReportForYearByCategory(goals: any, year: string, category: string): IReport {
    this.goals = goals;
    this.year = year;
    this.category = category;

    const previousYear: string = (Number(this.year) - 1).toString();
    const createdGoalsForCurrentYear: IGoal[] = this.extractGoalsByMonthByCategory(this.year);
    const createdGoalsForPreviousYear: IGoal[] = this.extractGoalsByMonthByCategory(previousYear);
    const totalGoalsForCurrentYear: IGoal = this.calculateTotalGoalsForYear(createdGoalsForCurrentYear);
    const allCreatedGoalsForPreviousYear: number = this.calculateAllGoalsForSelectedYear(createdGoalsForPreviousYear);
    const allCreatedGoalsForCurrentYear: number = this.calculateAllGoalsForSelectedYear(createdGoalsForCurrentYear);
    // remove property 'all'
    const { all: _, ...totalGoalsForCurrentYearExcludingAll } = totalGoalsForCurrentYear;
    const differenceBetweenYears: IDifferenceInPercent = this.compareAllGoalsForYear(
      allCreatedGoalsForPreviousYear,
      allCreatedGoalsForCurrentYear
    );
    const reportForYear: IReport = {
      totalGoalsForCurrentYearExcludingAll,
      allCreatedGoalsForCurrentYear,
      differenceBetweenYears
    };

    return reportForYear;
  }

  /** 
   * Extracts specific goals per particular year by needed category into single array 
   * @private
   * @method
   * @param {String} year - specific year of goals
   * @returns @type {IGoal[]}
  */
  private extractGoalsByMonthByCategory(year: string): IGoal[] {
    const createdGoalsForYear: IGoal[] = [];

    for (let key in this.goals) {
      if (key.includes(year)) {
        const goalDetailsForCurrentYear = this.goals[key];

        for (let innerKey in goalDetailsForCurrentYear) {
          if (innerKey === this.category) {
            createdGoalsForYear.push(goalDetailsForCurrentYear[innerKey]);
          }
        }
      }
    }

    return createdGoalsForYear;
  }

  /**
   *  Calculates totals of each mark (`all`, `attendance`, `literacy, etc.) of goals into single goal object 
   * @private
   * @method
   * @param @type {IGoal[]} array of specific goals per particular year by needed category
   * @returns @type {IGoal}
  */
  private calculateTotalGoalsForYear(goals: IGoal[]): IGoal {
    const totalsForYear: any = {};

    goals.forEach((goal: any) => {
      for (let key in goal) {
        if (totalsForYear[key]) {
          totalsForYear[key] += goal[key];
        } else {
          totalsForYear[key] = goal[key];
        }
      }
    });

    return totalsForYear;
  }

  /** 
   * Calculates total amount of goals marked as `all` per particular year by needed category 
   * @private
   * @method
   * @param @type {IGoal[]} array of specific goals per particular year by needed category
   * @returns {Number}
  */
  private calculateAllGoalsForSelectedYear(createdGoalsForYear: IGoal[]): number {
    return createdGoalsForYear.reduce(
      (acc: number, goal: IGoal) => (acc += goal.all),
      0
    );
  }

  /**
   * Calculates percentage difference beween amount of goals per particular year and goals 
   * per previous year and analize progress  
   * @private
   * @method
   * @param {Number} - amount of goals per particular year
   * @param {Number} - amount of goals per previous year
   * @returns @type {IDifferenceInPercent} 
  */
  private compareAllGoalsForYear(goalsForCurrentYear: number, goalsForPrevYear: number): IDifferenceInPercent {
    const difference: IDifferenceInPercent = {} as IDifferenceInPercent;

    if (goalsForCurrentYear > goalsForPrevYear) {

      const differenceInPercent = Math.abs((goalsForPrevYear / goalsForCurrentYear) * 100 - 100);
      const fixedDifference = Number(differenceInPercent.toFixed());

      difference.increased = false;
      difference.isZero = false;
      difference.value = fixedDifference;
    }

    if (goalsForCurrentYear < goalsForPrevYear) {

      const differenceInPercent = Math.abs((goalsForCurrentYear / goalsForPrevYear) * 100 - 100);
      const fixedDifference = Number(differenceInPercent.toFixed());

      difference.increased = true;
      difference.isZero = false;
      difference.value = fixedDifference;
    }

    if (goalsForCurrentYear === 0 && goalsForPrevYear === 0) {
      difference.increased = false;
      difference.isZero = true;
      difference.value = 0;
    }

    if (goalsForCurrentYear === 0 && goalsForPrevYear > 0) {
      difference.increased = true;
      difference.isZero = false;
      difference.value = 100;
    }

    if (goalsForCurrentYear > 0 && goalsForPrevYear === 0) {
      difference.increased = false;
      difference.isZero = false;
      difference.value = 100;
    }

    return difference;
  }
}
