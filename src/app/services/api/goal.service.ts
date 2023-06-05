import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { CLIENT_ID, CREDENTIALS } from '../../model/constants';
import { ICredentials, GoalsPerYearBody } from 'src/app/model/types/api';
import { GoalsPerYear } from 'src/app/model/types/goals';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private apiUrl: string =
    'https://api.staging-goalhub.mcloud.net.au/webservices/goalhub/2.0';
  private token: string = '';
  private clientID: string = CLIENT_ID;
  private credentials: ICredentials = CREDENTIALS;
  private year: string = '';
  public goals = [];

  constructor(private http: HttpClient) { }

  /**
   * User authentication 
   * @private
   * @method
   * @returns {Object} - response with token
  */
  private signIn(): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/signIn.json`, this.credentials)
      .pipe(
        map((data) => {
          this.token = data.token;
        })
      );
  }

  /**
   * Retrieving goals per particular year 
   * @private
   * @method
   * @returns @type {GoalsPerYear}
  */
  private retrieveGoals(): Observable<GoalsPerYear> {
    return this.http.post<GoalsPerYear>(
      `${this.apiUrl}/report/goal.json`,
      this.buildBodyForRetrievingGoals(),
      this.buildHeadersForRetrievingGoals(),
    );
  }

  /**
   * Request of goals per particular year with user authentication 
   * @public
   * @method
   * @param {String} - year
   * @returns @type {GoalsPerYear}
  */
  public getGoals(year: string) {
    this.year = year;

    if (!this.token) {
      return this.signIn().pipe(
        mergeMap(() =>
          this.retrieveGoals()
        )
      );
    } else {
      return this.retrieveGoals()
        .pipe(
          catchError(err => {
            if (err.status === 401) {
              this.token = '';

              return this.signIn().pipe(
                mergeMap(() =>
                  this.retrieveGoals()
                )
              );
            }

            return err;
          }),
        );
    }
  }

  /**
   * Creates Http headers for authenticated user 
   * @private
   * @method
   * @returns @type {HttpHeaders}
  */
  private buildHeadersForRetrievingGoals(): Object {
    return {
      headers: new HttpHeaders({
        'X-Access-Token': this.token,
        'X-Client-Id': this.clientID,
      }),
    };
  }

  /**
   * Creates body for retrieving goals request with specified year
   * @private
   * @method
   * @returns @type {GoalsPerYearBody}
  */
  private buildBodyForRetrievingGoals(): GoalsPerYearBody {
    return {
      cohorts: {
        goalhubs: ['1520'],
      },
      period: {
        type: 'year',
        value: this.year,
        interval: 'month',
      },
      goalType: 'completed',
    };
  }
}
