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
}

export const StackedStudentsProgressChart = ({
  studentsProgress
}: StackedStudentsProgressChartProps) => {
  // Parse the data to generate the chart dataset
  const chartData: ChartData<"bar", number[], string> = {
    labels: studentsProgress.map(
      (studentProgress) => studentProgress.student_full_name
    ),
    datasets: [
      {
        label: "Success",
        data: studentsProgress.map(
          (studentProgress) => studentProgress.success_submissions
        ),
        backgroundColor: "#34d399"
      },
      {
        label: "Failing",
        data: studentsProgress.map(
          (studentProgress) => studentProgress.failing_submissions
        ),
        backgroundColor: "#f87171"
      },
      {
        label: "Running",
        data: studentsProgress.map(
          (studentProgress) => studentProgress.running_submissions
        ),
        backgroundColor: "#818cf8"
      },
      {
        label: "Pending",
        data: studentsProgress.map(
          (studentProgress) => studentProgress.pending_submissions
        )
      }
    ]
  };

  return (
    <Bar options={laboratoryStackedProgressChartOptions} data={chartData} />
  );
};
