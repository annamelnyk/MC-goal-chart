import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-doughnutlabel';

import { CHART_COLORS } from 'src/app/model/constants';
import { ChartLabelFont, ChartLabelStyle } from 'src/app/model/types/chart';
import { IDifferenceInPercent } from 'src/app/model/types/report';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnChanges {
  public chart: any;
  @Input() public chartData!: number[];
  @Input() public chartLabels!: string[];
  @Input() public goals!: number;
  @Input() public differenceBetweenYears!: IDifferenceInPercent;
  @Input() public category!: string;

  @ViewChild('chart') canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const ctx = <CanvasRenderingContext2D>(
      this.canvas.nativeElement.getContext('2d')
    );

    this.chart = new Chart(ctx, this.getInitialChartSettings());
  }

  ngOnChanges() {
    this.updateChart();
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.chartLabels;
      this.chart.data.datasets = this.createDataset();
      this.checkIfChartShowsEmpty();
      this.chart.update();
    }
  }

  private generateChartContent(): void {
    const labels = [];
    const goalsTitle = this.buildlabelInsideChart('GOALS', '25', '500',)
    const createdTitle = this.buildlabelInsideChart(this.category.toUpperCase(), '25', '500',)
    const amountOfCreatedGoals = this.buildlabelInsideChart(String(this.goals), '85', '700',);
    const differenceBetweenYears = this.buildPercentageDifferenceContent();

    labels.push(goalsTitle, createdTitle, amountOfCreatedGoals, differenceBetweenYears);
    this.chart.options.plugins.doughnutlabel.labels = labels;
  }

  private createDataset() {
    return [{
      backgroundColor: Object.values(CHART_COLORS),
      data: this.chartData,
    }];
  }

  private checkIfChartShowsEmpty(): void | undefined {
    this.chart.data.datasets.forEach((dataset: any) => {

      if (dataset.data.every((value: number) => value === 0)) {
        dataset.backgroundColor.push(CHART_COLORS.emptyChart);
        dataset.data.push(1);
        this.chart.data.labels.push('No details');

        this.checkIfChartShowsEmpty();

        return;
      }

      this.generateChartContent();
    });
  }

  private buildPercentageDifferenceContent(): ChartLabelStyle {
    const font: ChartLabelFont = {
      size: '30',
      units: 'px',
      family: "'Font Awesome 6 Free'",
      weight: '900',
    };
    const percent: string = '%';
    const arrowUp: string = '\uf176';
    const arrowDown: string = '\uf175';

    if (this.differenceBetweenYears.isZero) {
      return {
        text: `${this.differenceBetweenYears.value} ${percent}`,
        font,
        color: CHART_COLORS.font,
      }
    }

    if (this.differenceBetweenYears.increased) {
      return {
        text: `${arrowUp} ${this.differenceBetweenYears.value} ${percent}`,
        font,
        color: CHART_COLORS.arrowUp,
      }
    } else {
      return {
        text: `${arrowDown} ${this.differenceBetweenYears.value} ${percent}`,
        font,
        color: CHART_COLORS.red,
      }
    }
  }

  private buildlabelInsideChart(text: string, size: string, weight: string): ChartLabelStyle {
    return {
      text,
      font: {
        size,
        units: 'px',
        family: 'Raleway, sans-serif',
        weight,
      },
      color: CHART_COLORS.font,
    }
  }

  private getInitialChartSettings(): ChartConfiguration {
    return {
      type: 'doughnut',
      data: {
        labels: this.chartLabels,
        datasets: this.createDataset(),
      },
      options: {
        cutoutPercentage: 87,
        responsive: true,
        aspectRatio: 1.7,
        layout: {
          padding: {
            left: 50,
            right: 50,
            top: 50,
            bottom: 50,
          },
        },
        legend: {
          display: false,
        },
        animation: {
          animateRotate: true,
          duration: 800,
        },
        plugins: {
          datalabels: {
            display: false
          },
        },
      },
    }
  }
}
