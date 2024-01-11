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
const laboratoryCompletionRateChartOptions: ChartOptions<"doughnut"> = {
  plugins: {
    title: {
      display: true,
      text: "Laboratory completion rate"
    }
  },
  responsive: true
};

interface DoughnutLaboratoryCompletionRateChartProps {
  totalTestBlocks: number;
  successSubmissionsCountList: number[];
}

export const DoughnutLaboratoryCompletionRateChart = ({
  totalTestBlocks,
  successSubmissionsCountList
}: DoughnutLaboratoryCompletionRateChartProps) => {
  const studentsThatCompletedTheLaboratory = successSubmissionsCountList.filter(
    (completedTestBlocks) => completedTestBlocks === totalTestBlocks
  );

  // Generate the chart dataset from the data
  const chartData: ChartData<"doughnut", number[], string> = {
    labels: ["Fully completed", "Not completed"],
    datasets: [
      {
        label: "Number of students",
        data: [
          studentsThatCompletedTheLaboratory.length,
          successSubmissionsCountList.length -
            studentsThatCompletedTheLaboratory.length
        ],
        backgroundColor: ["#34d399", "#f87171"],
        borderColor: ["#10b981", "#ef4444"],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  return (
    <Doughnut data={chartData} options={laboratoryCompletionRateChartOptions} />
  );
};
