export interface ICredentials {
  username: string;
  password: string;
}

export type GoalsPerYearBody = {
  cohorts: {
    goalhubs: ['1520'],
  };
  period: {
    type: 'year';
    value: string;
    interval: 'month';
  };
  goalType: 'completed';
};
