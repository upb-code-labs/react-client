import { Laboratory } from "@/types/entities/laboratory";

export enum EditLaboratoryActionType {
  SET_LABORATORY_DATA = "SET_LABORATORY",
  UPDATE_LABORATORY_DATA = "SET_LABORATORY_DATA",

  ADD_MARKDOWN_BLOCK = "ADD_MARKDOWN_BLOCK",
  UPDATE_MARKDOWN_BLOCK = "UPDATE_MARKDOWN_BLOCK",
  ADD_TEST_BLOCK = "ADD_TEST_BLOCK",
  UPDATE_TEST_BLOCK = "UPDATE_TEST_BLOCK",
  DELETE_BLOCK = "DELETE_BLOCK",

  SWAP_BLOCKS = "SWAP_BLOCKS"
}

export type EditLaboratoryAction =
  | {
      type: EditLaboratoryActionType.SET_LABORATORY_DATA;
      payload: {
        laboratory: Laboratory;
      };
    }
  | {
      type: EditLaboratoryActionType.UPDATE_LABORATORY_DATA;
      payload: {
        name: string;
        opening_date: string;
        due_date: string;
        rubricUUID: string;
      };
    }
  | {
      type: EditLaboratoryActionType.ADD_MARKDOWN_BLOCK;
      payload: {
        uuid: string;
      };
    }
  | {
      type: EditLaboratoryActionType.UPDATE_MARKDOWN_BLOCK;
      payload: {
        uuid: string;
        content: string;
      };
    }
  | {
      type: EditLaboratoryActionType.ADD_TEST_BLOCK;
      payload: {
        uuid: string;
        languageUUID: string;
        testArchiveUUID: string;
        name: string;
      };
    }
  | {
      type: EditLaboratoryActionType.UPDATE_TEST_BLOCK;
      payload: {
        uuid: string;
        languageUUID: string;
        testArchiveUUID: string;
        name: string;
      };
    }
  | {
      type: EditLaboratoryActionType.DELETE_BLOCK;
      payload: {
        uuid: string;
      };
    }
  | {
      type: EditLaboratoryActionType.SWAP_BLOCKS;
      payload: {
        uuid1: string;
        uuid2: string;
      };
    };
