import {
  Laboratory,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type markdownBlockBackendResponse = {
  uuid: string;
  content: string;
  index: number;
};

type testBlockBackendResponse = {
  uuid: string;
  language_uuid: string;
  submission_uuid: string;
  name: string;
  index: number;
};

export async function getLaboratoryByUUIDService(
  laboratoryUUID: string
): Promise<Laboratory> {
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

    // Unify blocks in a single array
    const markdownBlocks: MarkdownBlock[] = data.markdown_blocks.map(
      (block: markdownBlockBackendResponse) => ({
        uuid: block.uuid,
        content: block.content,
        index: block.index,
        blockType: "markdown"
      })
    );
    laboratory.blocks.push(...markdownBlocks);

    const testBlocks: TestBlock[] = data.test_blocks.map(
      (block: testBlockBackendResponse) => ({
        uuid: block.uuid,
        languageUUID: block.language_uuid,
        submissionUUID: block.submission_uuid,
        name: block.name,
        index: block.index,
        blockType: "test"
      })
    );
    laboratory.blocks.push(...testBlocks);

    // Sort blocks by index and replace their index with their index in the array
    laboratory.blocks
      .sort((a, b) => a.index - b.index)
      .map((block, index) => ({
        ...block,
        index
      }));

    return laboratory;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error obtaining the laboratory";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
