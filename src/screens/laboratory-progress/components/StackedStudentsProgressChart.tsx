import { StudentProgress } from "@/types/entities/laboratory-entities";
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
import { Bar } from "react-chartjs-2";

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
        data: submissionsGroupedByStatus["pending"]
      }
    ]
  };

  return (
    <Bar options={laboratoryStackedProgressChartOptions} data={chartData} />
  );
};
