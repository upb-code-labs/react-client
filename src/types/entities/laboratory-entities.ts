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
  testArchiveUUID: string;
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
