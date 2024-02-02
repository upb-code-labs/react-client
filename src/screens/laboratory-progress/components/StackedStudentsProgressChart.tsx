import { Button } from "@/components/ui/button";
import { StudentProgress } from "@/types/entities/laboratory-entities";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { RefreshCcwIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";

import { submissionsChartsStatus } from "./LaboratoryProgressDashboard";

// Register the chart elements
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Chart options
const laboratoryStackedProgressChartOptions: ChartOptions<"bar"> = {
  // Make it horizontal
  indexAxis: "y",
  // Add a title to the chart
  plugins: {
    title: {
      display: true,
      text: "Laboratory progress"
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  // Show the data stacked
  scales: {
    x: {
      title: {
        display: true,
        text: "Number of submissions",
        padding: { top: 16 }
      },
      stacked: true
    },
    y: {
      title: {
        display: true,
        text: "Students",
        padding: { bottom: 16 }
      },
      stacked: true
    }
  }
};

interface StackedStudentsProgressChartProps {
  studentsProgress: StudentProgress[];
  submissionsGroupedByStatus: {
    [key in submissionsChartsStatus]: number[];
  };
}

export const StackedStudentsProgressChart = ({
  studentsProgress,
  submissionsGroupedByStatus
}: StackedStudentsProgressChartProps) => {
  const { laboratoryUUID } = useParams<{
    laboratoryUUID: string;
  }>();

  // Parse the data to generate the chart dataset
  const chartData: ChartData<"bar", number[], string> = {
    labels: studentsProgress.map(
      (studentProgress) => studentProgress.student_full_name
    ),
    datasets: [
      {
        label: "Success",
        data: submissionsGroupedByStatus["success"],
        backgroundColor: "#34d399",
        borderColor: "#10b981",
        borderWidth: 2
      },
      {
        label: "Failing",
        data: submissionsGroupedByStatus["failing"],
        backgroundColor: "#f87171",
        borderColor: "#ef4444",
        borderWidth: 2
      },
      {
        label: "Running",
        data: submissionsGroupedByStatus["running"],
        backgroundColor: "#818cf8",
        borderColor: "#6366f1",
        borderWidth: 2
      },
      {
        label: "Pending",
        data: submissionsGroupedByStatus["pending"],
        backgroundColor: "#d1d5db",
        borderColor: "#9ca3af",
        borderWidth: 2
      }
    ]
  };

  const chartHeight = Math.max(studentsProgress.length * 40, 450);

  const queryClient = useQueryClient();
  const handleUpdateCharts = () => {
    queryClient.invalidateQueries({
      exact: true,
      queryKey: ["laboratory-progress", laboratoryUUID]
    });
  };

  return (
    <div className="relative">
      <Bar
        options={laboratoryStackedProgressChartOptions}
        data={chartData}
        height={chartHeight}
      />
      <Button
        onClick={handleUpdateCharts}
        size={"icon"}
        variant={"outline"}
        className="absolute right-1 top-1"
      >
        <RefreshCcwIcon />
      </Button>
    </div>
  );
};
