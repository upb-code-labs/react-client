import { MarkdownBlock } from "@/types/entities/laboratory-entities";

import {
  EditLaboratoryAction,
  EditLaboratoryActionType
} from "./editLaboratoryTypes";
import { EditLaboratoryState } from "./useEditLaboratory";

export function editLaboratoryReducer(
  state: EditLaboratoryState,
  action: EditLaboratoryAction
) {
  switch (action.type) {
    case EditLaboratoryActionType.SET_LABORATORY_DATA:
      return {
        ...state,
        laboratory: action.payload.laboratory
      };

    case EditLaboratoryActionType.UPDATE_LABORATORY_DATA:
      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          name: action.payload.name,
          opening_date: action.payload.opening_date,
          due_date: action.payload.due_date,
          rubricUUID: action.payload.rubricUUID
        }
      };

    case EditLaboratoryActionType.ADD_MARKDOWN_BLOCK: {
      const newMarkdownBlock: MarkdownBlock = {
        uuid: action.payload.uuid,
        index: state.laboratory!.blocks.length,
        content: "",
        blockType: "markdown"
      };

      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: [...state.laboratory!.blocks, newMarkdownBlock]
        }
      };
    }

    case EditLaboratoryActionType.UPDATE_MARKDOWN_BLOCK:
      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: state.laboratory!.blocks.map((block) =>
            block.uuid === action.payload.uuid
              ? {
                  ...block,
                  content: action.payload.content
                }
              : block
          )
        }
      };

    case EditLaboratoryActionType.ADD_TEST_BLOCK: {
      const newTestBlock = {
        uuid: action.payload.uuid,
        index: state.laboratory!.blocks.length,
        blockType: "test",
        languageUUID: action.payload.languageUUID,
        testArchiveUUID: action.payload.testArchiveUUID,
        name: action.payload.name
      };

      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: [...state.laboratory!.blocks, newTestBlock]
        }
      };
    }

    case EditLaboratoryActionType.UPDATE_TEST_BLOCK:
      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: state.laboratory!.blocks.map((block) =>
            block.uuid === action.payload.uuid
              ? {
                  ...block,
                  languageUUID: action.payload.languageUUID,
                  name: action.payload.name
                }
              : block
          )
        }
      };

    case EditLaboratoryActionType.DELETE_BLOCK:
      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: state.laboratory!.blocks.filter(
            (block) => block.uuid !== action.payload.uuid
          )
        }
      };

    case EditLaboratoryActionType.SWAP_BLOCKS: {
      const { uuid1, uuid2 } = action.payload;
      const block1Index = state.laboratory!.blocks.findIndex(
        (block) => block.uuid === uuid1
      );
      const block2Index = state.laboratory!.blocks.findIndex(
        (block) => block.uuid === uuid2
      );

      const updatedBlocks = [...state.laboratory!.blocks];
      const tempBlock = updatedBlocks[block1Index];
      updatedBlocks[block1Index] = updatedBlocks[block2Index];
      updatedBlocks[block2Index] = tempBlock;

      return {
        ...state,
        laboratory: {
          ...state.laboratory!,
          blocks: updatedBlocks
        }
      };
    }

    default:
      return state;
  }
}
