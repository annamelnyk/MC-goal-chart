export interface IGoalExcludingAll {
  focus_area: number;
  attendance: number;
  literacy: number;
  numeracy: number;
  culture: number;
  wellbeing: number;
  other: number;
}

export interface IGoal extends IGoalExcludingAll {
  all: number;
}

export interface IGoalsByCategory {
  created: IGoal | IGoal[];
  completed: IGoal | IGoal[];
  contextualised: IGoal | IGoal[];
  interacted: IGoal | IGoal[];
}

export interface IGoalsByCategoryTotalAmount {
  created: number;
  completed: number;
  contextualised: number;
  interacted: number;
}

export type GoalsPerYear = {
  [key: string]: IGoalsByCategoryTotalAmount
}
