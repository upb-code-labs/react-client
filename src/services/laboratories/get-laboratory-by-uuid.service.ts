import {
  Laboratory,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type getLaboratoryByUUIDResponse = GenericResponse & {
  laboratory: Laboratory | null;
};

export const getLaboratoryByUUIDService = async (
  laboratoryUUID: string
): Promise<getLaboratoryByUUIDResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/laboratories/${laboratoryUUID}`);

    // Parse data
    const laboratory: Laboratory = {
      uuid: data.uuid,
      name: data.name,
      opening_date: data.opening_date,
      due_date: data.due_date,
      rubricUUID: data.rubric_uuid,
      blocks: []
    };

    // Parse blocks
    const markdownBlocks: MarkdownBlock[] = data.markdown_blocks.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (block: any) => ({
        uuid: block.uuid,
        content: block.content,
        index: block.index,
        blockType: "markdown"
      })
    );
    laboratory.blocks.push(...markdownBlocks);

    const testBlocks: TestBlock[] = data.test_blocks.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (block: any) => ({
        uuid: block.uuid,
        languageUUID: block.language_uuid,
        testArchiveUUID: block.test_archive_uuid,
        submissionUUID: block.submission_uuid,
        name: block.name,
        index: block.index,
        blockType: "test"
      })
    );
    laboratory.blocks.push(...testBlocks);

    // Sort blocks by index and replace the index with the array index
    laboratory.blocks
      .sort((a, b) => a.index - b.index)
      .map((block, index) => ({
        ...block,
        index
      }));

    return {
      success: true,
      message: "Laboratory data has been fetched successfully",
      laboratory
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      laboratory: null
    };
  }
};
