type BlockType = "markdown" | "test";

export type MarkdownBlock = {
  uuid: string;
  content: string;
  index: number;
  blockType: BlockType;
};

export type TestBlock = {
  uuid: string;
  languageUUID: string;
  name: string;
  index: number;
  blockType: BlockType;
  submissionUUID?: string; // Only for student
};

export type LaboratoryBlock = MarkdownBlock | TestBlock;

export type LaboratoryBaseInfo = {
  uuid: string;
  name: string;
  opening_date: string;
  due_date: string;
};

export type Laboratory = LaboratoryBaseInfo & {
  rubricUUID: string | null;
  blocks: LaboratoryBlock[];
};

export type LaboratoryProgressReport = {
  total_test_blocks: number;
  students_progress: StudentProgress[];
};

export type StudentProgress = {
  student_uuid: string;
  student_full_name: string;
  pending_submissions: number;
  running_submissions: number;
  failing_submissions: number;
  success_submissions: number;
};

export type laboratoryInformation = {
  uuid: string;
  rubric_uuid: string | null;
  name: string;
  opening_date: string;
  due_date: string;
};
