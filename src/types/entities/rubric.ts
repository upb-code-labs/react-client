export type CreatedRubric = {
  uuid: string;
  name: string;
};

type Criteria = {
  uuid: string;
  description: string;
  weight: number;
};

type Objective = {
  uuid: string;
  description: string;
  criteria: Criteria[];
};

export type Rubric = CreatedRubric & {
  objectives: Objective[];
};
