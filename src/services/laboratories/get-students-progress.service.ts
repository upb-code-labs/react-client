import { LaboratoryProgressReport } from "@/types/entities/laboratory-entities";

import { HttpRequester } from "../axios";

export async function getStudentsProgressInLaboratory(
  laboratoryUUID: string
): Promise<LaboratoryProgressReport> {
  const { axios } = HttpRequester.getInstance();

  const { data } = await axios.get(`/laboratories/${laboratoryUUID}/progress`);
  return data;
}
