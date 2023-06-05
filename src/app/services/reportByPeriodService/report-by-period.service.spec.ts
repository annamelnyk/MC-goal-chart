import { TestBed } from '@angular/core/testing';

import { ReportByPeriodService } from './report-by-period.service';

describe('ProgressByPeriodService', () => {
  let service: ReportByPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportByPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
