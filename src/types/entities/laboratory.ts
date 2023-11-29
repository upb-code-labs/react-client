export type MarkdownBlock = {
  uuid: string;
  content: string;
  index: number;
};

export type TestBlock = {
  uuid: string;
  languageUUID: string;
  testArchiveUUID: string;
  name: string;
  index: number;
};

export type LaboratoryBlock = MarkdownBlock | TestBlock;

export type LaboratoryBaseInfo = {
  uuid: string;
  name: string;
  openingDate: string;
  dueDate: string;
};

export type Laboratory = LaboratoryBaseInfo & {
  rubricUUID: string | null;
  blocks: LaboratoryBlock[];
};
