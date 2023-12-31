import { LaboratoryBlockSkeleton } from "@/components/Skeletons/LaboratoryBlockSkeleton";
import { getLaboratoryByUUIDService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { Laboratory } from "@/types/entities/laboratory-entities";
import { Suspense, useEffect, useState } from "react";
import { lazily } from "react-lazily";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const { StudentLaboratoryBlocks } = lazily(
  () => import("./components/StudentLaboratoryBlocks")
);

export const StudentsLaboratoryView = () => {
  // Url params
  const { laboratoryUUID, courseUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

  // Navigation state
  const navigate = useNavigate();

  // Page state
  const [laboratory, setLaboratory] = useState<Laboratory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLaboratoryData = async () => {
      const { success, message, laboratory } = await getLaboratoryByUUIDService(
        laboratoryUUID as string
      );
      if (!success) {
        toast.error(message);
        navigate(`/courses/${courseUUID}/laboratories`);
        return;
      }

      setLaboratory(laboratory);
      setLoading(false);
    };

    getLaboratoryData();
  }, []);

  if (loading) {
    return (
      <div className="col-span-3">
        {Array.from({ length: 3 }).map((_, index) => {
          return <LaboratoryBlockSkeleton key={`laboratory-block-${index}`} />;
        })}
      </div>
    );
  }

  if (!laboratory) return null;

  return (
    <main className="col-span-3">
      <Suspense
        fallback={
          <>
            {laboratory.blocks.map((block) => {
              return (
                <LaboratoryBlockSkeleton
                  key={`laboratory-block-${block.uuid}`}
                />
              );
            })}
          </>
        }
      >
        <StudentLaboratoryBlocks blocks={laboratory.blocks} />
      </Suspense>
    </main>
  );
};
