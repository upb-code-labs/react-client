import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register the chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Chart options
const AverageCompletedTestsChartOptions: ChartOptions<"doughnut"> = {
  plugins: {
    title: {
      display: true,
      text: "Average completed test blocks"
    }
  },
  responsive: true
};

interface AverageCompletedTestsDoughnutChartProps {
  totalTestBlocks: number;
  successSubmissionsCountList: number[];
}

export const AverageCompletedTestsDoughnutChart = ({
  totalTestBlocks,
  successSubmissionsCountList
}: AverageCompletedTestsDoughnutChartProps) => {
  const averageCompletedTests =
    successSubmissionsCountList.reduce((acc, curr) => acc + curr, 0) /
    successSubmissionsCountList.length;

  // Generate the chart dataset from the data
  const chartData: ChartData<"doughnut", number[], string> = {
    labels: ["Average completed test blocks", "Not completed"],
    datasets: [
      {
        label: "Number of test blocks",
        data: [averageCompletedTests, totalTestBlocks - averageCompletedTests],
        backgroundColor: ["#34d399", "#d1d5db"],
        borderColor: ["#10b981", "#9ca3af"],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  return (
    <Doughnut data={chartData} options={AverageCompletedTestsChartOptions} />
  );
};
