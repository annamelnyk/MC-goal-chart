import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() public period!: number;
  @Input() public selectedYear!: string;
  @Output() public onChangeYear: EventEmitter<string> = new EventEmitter();

  public years: string[] = [];

  ngOnInit(): void {
    this.years = this.getYearsForPeriod();
  }

  private getYearsForPeriod(): string[] {
    const years = [];
    let year: number = Number(this.selectedYear);

    for (let i = this.period; i > 0; i--) {
      years.push(String(year));
      year = year - 1;
    }

    return years.reverse();
  }

  public selectYear(year: string): void {
    this.onChangeYear.emit(year);
  }
}
