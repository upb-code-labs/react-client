export type CreatedRubric = {
  uuid: string;
  name: string;
};

export type Criteria = {
  uuid: string;
  description: string;
  weight: number;
};

export type Objective = {
  uuid: string;
  description: string;
  criteria: Criteria[];
};

export type Rubric = CreatedRubric & {
  objectives: Objective[];
};
