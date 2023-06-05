import { Component, OnInit } from '@angular/core';

import { ReportByPeriodService } from './services/reportByPeriodService/report-by-period.service';
import { GoalService } from './services/api/goal.service';
import { IChartByCategory } from './model/types/chart';
import { IReport } from './model/types/report';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public period: number = 5;
  public selectedYear: string = String(new Date().getFullYear());
  public chartByCategory: IChartByCategory = {
    data: [0],
    labels: [],
    goals: 0,
    differenceBetweenYears: {
      increased: false,
      isZero: false,
      value: 0,
    },
    category: 'created',

  }

  constructor(
    private goalService: GoalService,
    private reportByPeriodService: ReportByPeriodService
  ) { }

  ngOnInit(): void {
    this.updateGoalsBySelectedYear();
  }

  public updateSelectedYear(year: string): void {
    this.selectedYear = year;
    this.updateGoalsBySelectedYear();
  }

  private updateGoalsBySelectedYear(): void {
    this.goalService.getGoals(this.selectedYear).subscribe((data) => {
      const report: IReport = this.reportByPeriodService.buildReportForYearByCategory(
        data,
        this.selectedYear,
        this.chartByCategory.category
      );

      this.updateChartData(report);
    });
  }

  updateChartData(report: any): void {
    this.chartByCategory.data = Object.values(report.totalGoalsForCurrentYearExcludingAll);
    this.chartByCategory.labels = Object.keys(report.totalGoalsForCurrentYearExcludingAll);
    this.chartByCategory.goals = report.allCreatedGoalsForCurrentYear;
    this.chartByCategory.differenceBetweenYears = report.differenceBetweenYears;
  }
}
